# verify-docs

生成AIエージェントが読むCLAUDE.md・AGENTS.md・README・docs・
`.agents/skills/`などの文書群を、「必要な時にだけ必要な文書が読まれる」構造に
保つためのパッケージ。入口文書は話題と参照先だけを持つルーティングテーブル
として扱う。

## 構成

- **チェッカー**（`scripts/verify-docs.mjs`）
  - 参照切れと孤立文書
  - 文書のサイズ超過
  - AST抽出した段落本文の重複（強調などの書式差は無視）
- **verify-docsスキル**（`.agents/skills/verify-docs/SKILL.md`）
  - チェッカーが検出したリンク切れ・孤立文書・サイズ超過・同一段落の重複を直すための手順
  - 内容は書き換えず、適切な文書への移動と入口からのポインタ化で文書構造を整える
- **dedupe-docsスキル**（`.agents/skills/dedupe-docs/SKILL.md`）
  - 文字列では一致しないが、同じ主張・手順・判断基準を別の言葉で繰り返している箇所を見つける
  - 正本を一つに決め、他方をポインタ化する。文脈や対象読者が異なる場合は統合しない
- **tighten-docsスキル**（`.agents/skills/tighten-docs/SKILL.md`）
  - 意味・数値・条件・手順を変えずに、不要な導入や重複語などの冗長な言い回しだけを削る
  - 文書の分割や重複解消は行わず、文章そのものを簡潔にする

## 3スキルの使い分け

| 困っていること | 使うスキル | 行うこと | 行わないこと |
| --- | --- | --- | --- |
| リンク切れ、孤立文書、長すぎる文書、完全に同じ段落を直したい | `verify-docs` | 文書の置き場所と参照関係を整える | 内容の要約・言い換え・文章の推敲 |
| READMEと手順書に、言い回しは違うが同じ説明がある | `dedupe-docs` | 意味的な重複を判断し、正本へ集約して他方を案内にする | 判断が曖昧な説明の強制統合 |
| 内容は正しいが、文章を短く読みやすくしたい | `tighten-docs` | 意味を保った冗長表現の削減 | 文書の分割、重複の集約、意味の変更 |

## 導入

対象リポジトリのルートで次の一行を実行する。

```bash
curl -fsSL https://raw.githubusercontent.com/MichinaoShimizu/claude-kit/main/verify-docs/install.sh | bash
```

GitHub Actionsのワークフローは自動追加しない。CIへの組み込みは
[導入と運用](docs/adoption.md#ciへの組み込み)を参照。

インストール後の構成は次のとおり。設定ファイルは必要な場合だけ作成する。

```text
your-repo/
├── scripts/verify-docs.mjs
├── scripts/markdown-structure.mjs
├── scripts/extract-doc-blocks.mjs
├── scripts/vendor/commonmark.cjs
├── scripts/vendor/commonmark-LICENSE.txt
├── .agents/skills/verify-docs/
├── .agents/skills/dedupe-docs/
└── .agents/skills/tighten-docs/
```

既定値のまま開始し、対象リポジトリと異なる項目だけ
`verify-docs.config.json`で上書きする。

Markdown構文解析にはCommonMark.js 0.31.2を同梱しているため、導入先で
追加のnpmインストールは不要。ライセンスは
`scripts/vendor/commonmark-LICENSE.txt`を参照。

## 実行方法

### 文書構造の検査

```bash
node scripts/verify-docs.mjs
```

### 段落の構造・位置・サイズを一覧化

dedupe-docs / tighten-docs で対象文書を調べるときは、次のコマンドでCommonMarkの
見出し階層と段落をJSON出力できる。意味的な重複や冗長性は判定しない。

```bash
node scripts/extract-doc-blocks.mjs --root=. README.md docs/guide.md
```

段落ごとに見出し階層、ソース位置、本文、元ソースのバイト数を返す。見出しごとの
`headingPath`・`bytes`・`paragraphCount`・`endLine` は、チェックリストの対象節と
TODOの分割候補を特定するために使える。`bytes` と `paragraphCount` は子見出しを
含む集計であり、親子の値は重複するため合算しない。
詳しい使い方は各スキルの手順を参照。

既存文書に違反があるリポジトリでは、最初に次を実行する。

```bash
node scripts/verify-docs.mjs --init-todo
```

通常の検査は、標準出力に最大5件の末端節とTODOの対象節を、JSON出力に
`summary.documents`（文書数・構造集計）、`summary.violations`（種別ごとの件数）、
`summary.largestSections`、`summary.todo` を含める。違反には行・列・見出し階層、
重複箇所、サイズ超過時の大きな節も含める。チェックリストの実行結果や完了レコードを作るときは、
この出力を根拠として使う。

```bash
node scripts/verify-docs.mjs --json
```

### 3スキルの連続実行

3つのスキルは独立しており、自動的には連続実行されない。Claude Code・Codex・
Kiroで個別に呼び出す場合は次の記法を使う。

| エージェント | 個別呼び出し記法 |
| --- | --- |
| Claude Code | `/verify-docs`・`/dedupe-docs`・`/tighten-docs` |
| Kiro | `/verify-docs`・`/dedupe-docs`・`/tighten-docs` |
| Codex | `$verify-docs`・`$dedupe-docs`・`$tighten-docs` |

3つを順番に実行する場合は、どのエージェントでも次の共通依頼を使う。

> verify-docs・dedupe-docs・tighten-docsを順番に全部実行して

エージェントがスキルを実行すると、対象文書・判断理由・スキル別の実行結果を
`.verify-docs/dist/checklist.md`に記録する。3スキルを連続実行した回だけ、同ファイルに
統合した完了レコードも記録する。チェッカーコマンド単独では
チェックリストを作成しない。

## 詳細

- [既存リポジトリへの導入、CI、TODOの運用](docs/adoption.md)
- [エージェント間の互換構成](.agents/skills/verify-docs/references/agent-compatibility.md)
- [設定項目](.agents/skills/verify-docs/references/config.md)
- [TODOファイルの記述形式](.agents/skills/verify-docs/references/todo.md)
- [検出事項の是正手順](.agents/skills/verify-docs/SKILL.md)
- [この一式の改修作法](CONTRIBUTING.md)

エージェントやフックへの依存はない。CIとpush前検証へチェッカーを組み込んで
運用する。
