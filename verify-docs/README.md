# verify-docs

生成AIエージェント（Claude Code など）が読む CLAUDE.md・AGENTS.md・README・
docs ディレクトリ・`.claude/skills/` のような階層的な文書群を、
**「必要な時にだけ必要な文書が読まれる」構造に是正し、その構造を機械検査で
維持し続ける**ための一式。CLAUDE.md・AGENTS.md はルーティングテーブルに
徹する（話題と行き先の対応表のみを持ち、理由・手順は持たない）ことを前提とする。

導入により文書管理の構造を継続的に維持できる。構成要素は2つで、
**チェッカー（機械的に判定できる範囲）とプレイブック（判断を要する範囲）を
分離して管理する**。

1. **チェッカー**（`scripts/verify-docs.mjs`）—— 以下3点を検査する
   - 参照切れ・孤立文書（参照整合性）
   - 文書のサイズ超過（読む量の予算）
   - 複数の文書に同一説明がそのまま重複していないか（コピー後の片側修正で
     矛盾した説明が残留する事故を防止する）
2. **プレイブック**（`.claude/skills/verify-docs/SKILL.md`）—— 検出事項の
   是正手順（太った文書の分割方法、重複の解消方法、TODO の記述方法）。
   言い回しが異なる言い換えによる重複（チェッカーでは検出できない）は、
   同梱の [dedupe-docs スキル](.claude/skills/dedupe-docs/SKILL.md) を
   参照する

エージェント・フックへの依存は無い。検査スクリプトを CI と push 前検証に
組み込むことで機能する。

**遵守事項（是正対象は構造のみとし、内容は変更しない）の詳細は
[SKILL.md「守ること」](.claude/skills/verify-docs/SKILL.md#守ること)を
参照する。**

## 導入

このディレクトリ（`verify-docs/` 一式）の中身を、対象リポジトリの**直下**に
コピーする（`verify-docs/` という入れ子構造は作らず、中身をそのまま展開する）。

```
your-repo/
├── scripts/verify-docs.mjs               ← このディレクトリの scripts/ をコピー
├── .claude/skills/verify-docs/           ← このディレクトリの .claude/ をコピー（SKILL.md と references/）
├── .claude/skills/dedupe-docs/           ← 同上（言い換えによる重複の是正。任意だが同梱を推奨）
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

**本ツールの効果が最も大きいのは、新規に書く文書ではなく既存文書に対してである。**
一方で、既存の大規模文書を導入初日に全て分割することは現実的ではない。

そのため導入は2段階で行う。

**1. 現状の違反を一括で申告する。**

```bash
node scripts/verify-docs.mjs --init-todo
```

サイズ上限を超えている文書を全て抽出し `verify-docs.todo.json` に書き出す
（[TODO の管理方法](#todo-の管理方法)を参照）。これにより検査は一旦通過する
状態になる —— **超過を見逃す処置ではなく、認めた上で一覧に出し続ける処置**
である。

**2. CI に組み込む。** 以降、新規に書く文書・追記する文書は上限を遵守する。
TODO に記載された文書は任意のタイミングで分割し、是正後にエントリを削除する。
分割手順は [SKILL.md](.claude/skills/verify-docs/SKILL.md) の
「太った文書を見つける」を参照する。

**この2段階を経ない場合、既存リポジトリへの導入は「初日に大量の文書を
その場で全て分割する」か「検査を無効化する」の二択となり、いずれも
継続しない。** 段階的に負債を解消する方式により、導入コストと維持機構を
両立させる。

**重複はサイズ超過と異なり TODO 化の対象としない。** 導入時点で既存文書間の
重複が検出された場合、その場でいずれか一方に統合してポインタに置換するか、
意図した重複であれば `<!-- verify-docs:allow-duplicate -->` を付与する
（[SKILL.md](.claude/skills/verify-docs/SKILL.md) の「3. 重複を見つける」を
参照）。サイズ超過と異なり「後で是正する」を許容すると、矛盾した説明が
残留し続ける。

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

`paths` は対象リポジトリの CI 構成に合わせて調整する。**文書のみの変更でも
必ず実行すること。** ビルド・依存関係検査と同一ジョブに束ね「文書のみの
変更だから」と省略すると、その変更が誰にも検証されない状態になる。

push 前にローカルでも検証したい場合は、既存の検証コマンド列（lint・
typecheck・test など）に `node scripts/verify-docs.mjs` を1本追加する。

## TODO の管理方法

**`verify-docs.todo.json`（本ツールが読み込む、運用上の TODO）。**
記述方法・運用ルール（削減する方向にのみ運用する、重複はここには
記載できない、等）は
[references/config.md「`verify-docs.todo.json`」](.claude/skills/verify-docs/references/config.md#verify-docstodojson)
を参照する（正本は config.md 側とし、本ファイルでは再掲しない）。

これを「後で是正する一覧」として際限なく積み増すと、本ツール導入の意義が
失われる（肥大化検知の仕組み自体が、肥大化した負債リストを許容する仕組みに
転じる）。**目安として、`verify-docs.todo.json` が導入直後より増加していれば、
それは退行である。**

## この一式を開発する

`verify-docs.mjs` 自体・`SKILL.md`・`references/config.md` を改修する側の
作法（ドッグフーディング・変更時の同期対象・対象外とする範囲）は
[CONTRIBUTING.md](CONTRIBUTING.md) を参照する。
