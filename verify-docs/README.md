# verify-docs

生成AIエージェント（Claude Code など）が読む CLAUDE.md・AGENTS.md・README・
docs ディレクトリ・`.claude/skills/` のような階層的な文書群を、「必要な時に
だけ必要な文書が読まれる」構造に是正し、機械検査で維持し続けるための一式。
CLAUDE.md・AGENTS.md はルーティングテーブルに徹する（話題と行き先の対応表
のみを持ち、理由・手順は持たない）ことを前提とする。

## チェッカー・プレイブック

構成要素は2つ。チェッカー（機械的に判定できる範囲）とプレイブック
（判断を要する範囲）を分離して管理する。

1. **チェッカー**（`scripts/verify-docs.mjs`）—— 以下3点を検査する
   - 参照切れ・孤立文書（参照整合性）
   - 文書のサイズ超過（読む量の予算）
   - 複数の文書に同一説明がそのまま重複していないか（コピー後の片側修正で
     矛盾した説明が残留する事故を防止する）
2. **プレイブック**（`.claude/skills/verify-docs/SKILL.md`）—— 検出事項の
   是正手順（太った文書の分割方法、重複の解消方法、TODO の記述方法）。
   言い回しが異なる言い換えによる重複（チェッカーでは検出できない）は
   同梱の [dedupe-docs スキル](.claude/skills/dedupe-docs/SKILL.md)、
   意味を変えない冗長な言い回しの削減は同梱の
   [tighten-docs スキル](.claude/skills/tighten-docs/SKILL.md) を参照する

verify-docs・dedupe-docs・tighten-docsは独立したスキルであり、いずれかを
実行しても他は自動実行されない（dedupe-docs・tighten-docsはverify-docsの
導入を前提とするが、その逆に「verify-docs実行時に他2つも走る」という
連携は無い）。3つまとめて実行したい場合は、エージェントに次のように頼む。

> verify-docs・dedupe-docs・tighten-docsを順番に全部実行して

エージェント・フックへの依存は無い。検査スクリプトを CI と push 前検証に
組み込むことで機能する。遵守事項（是正対象は構造のみとし、内容は変更しない）
の詳細は
[SKILL.md「守ること」](.claude/skills/verify-docs/SKILL.md#守ること)を
参照する。

## 導入

このディレクトリ（`verify-docs/` 一式）の中身を、対象リポジトリの**直下**に
コピーする（`verify-docs/` という入れ子構造は作らず、中身をそのまま展開する）。

```
your-repo/
├── scripts/verify-docs.mjs               ← このディレクトリの scripts/ をコピー
├── .claude/skills/verify-docs/           ← このディレクトリの .claude/ をコピー（SKILL.md と references/）
├── .claude/skills/dedupe-docs/           ← 同上（言い換えによる重複の是正。任意だが同梱を推奨）
├── .claude/skills/tighten-docs/          ← 同上（冗長な言い回しの削減。任意だが同梱を推奨）
└── verify-docs.config.json               ← 必要な場合のみ作成する（無くても動作する）
```

設定項目名と意味の正本は
[references/config.md](.claude/skills/verify-docs/references/config.md)
の表であり、本ファイルでは個々のキー名を列挙しない。既定値のまま運用を
開始し、対象リポジトリの構成と異なる項目（`docsDir` の場所が違う、監視
対象から外したいディレクトリがある、など）のみ `verify-docs.config.json`
で上書きする。

## 運用

### 新規リポジトリの場合

検査をそのまま実行する。既定条件では違反が発生しないため、そのまま通過する。

```bash
node scripts/verify-docs.mjs
```

### 既存の肥大化したリポジトリの場合（主要な適用対象）

本ツールの効果が最も大きいのは既存文書に対してである。一方、既存の
大規模文書を導入初日に全て分割するのは現実的でないため、導入は2段階で
行う。

**1. 現状の違反を一括で申告する。**

```bash
node scripts/verify-docs.mjs --init-todo
```

サイズ上限を超えている文書を全て抽出し `verify-docs.todo.json` に書き出す
（[TODO の管理方法](#todo-の管理方法)を参照）。超過を見逃すのではなく、
認めた上で一覧に出し続ける処置であり、これにより検査は一旦通過する。

**2. CI に組み込む。** 以降、新規に書く文書・追記する文書は上限を遵守する。
TODO に記載された文書は任意のタイミングで分割し、是正後にエントリを削除する。
分割手順は [SKILL.md](.claude/skills/verify-docs/SKILL.md)
「2. 肥大化文書の特定」を参照する。

この2段階を経ない場合、導入は「初日に全て分割する」か「検査を無効化する」の
二択となり、いずれも継続しない。

重複はサイズ超過と異なり TODO 化の対象としない。導入時点で重複が検出された
場合は、その場でいずれか一方に統合してポインタに置換するか、意図した重複
であれば `<!-- verify-docs:allow-duplicate -->` を付与する
（[SKILL.md](.claude/skills/verify-docs/SKILL.md)「3. 重複特定」）。
サイズ超過と異なり「後で是正する」を許容すると矛盾した説明が残り続ける。

## CI への組み込み

GitHub Actions の構成例（`.github/workflows/verify-docs.yml`。本リポジトリの
[.github/workflows/verify-docs.yml](.github/workflows/verify-docs.yml) をそのまま利用可能）。

```yaml
name: verify-docs
on:
  pull_request:
    paths:
      - '**/*.md'
      - 'verify-docs.config.json'
      - 'verify-docs.todo.json'
      - 'scripts/verify-docs.mjs'

jobs:
  check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: node scripts/verify-docs.mjs
```

`paths` は対象リポジトリの CI 構成に合わせて調整する。文書のみの変更でも
必ず実行する（ビルド・依存関係検査と同一ジョブに束ね省略すると、その変更が
誰にも検証されない状態になる）。

push 前にローカルでも検証したい場合は、既存の検証コマンド列（lint・
typecheck・test など）に `node scripts/verify-docs.mjs` を1本追加する。

## TODO の管理方法

**`verify-docs.todo.json`（本ツールが読み込む、運用上の TODO）。**
記述方法・運用ルール（削減する方向にのみ運用する、重複はここには
記載できない、等）は
[references/todo.md](.claude/skills/verify-docs/references/todo.md)
を参照する（正本は todo.md 側とし、本ファイルでは再掲しない）。

これを「後で是正する一覧」として際限なく積み増すと導入の意義が失われる
（肥大化検知の仕組み自体が負債リストを許容する仕組みに転じる）。目安として、
`verify-docs.todo.json` が導入直後より増加していれば退行である。

## この一式の開発

`verify-docs.mjs` 自体・`SKILL.md`・`references/config.md` を改修する側の
作法（ドッグフーディング・変更時の同期対象・対象外とする範囲）は
[CONTRIBUTING.md](CONTRIBUTING.md) を参照する。
