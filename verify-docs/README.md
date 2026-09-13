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
  - 検出事項の是正手順
- **dedupe-docsスキル**（`.agents/skills/dedupe-docs/SKILL.md`）
  - 言い換えによる重複の是正
- **tighten-docsスキル**（`.agents/skills/tighten-docs/SKILL.md`）
  - 意味を変えない冗長な言い回しの削減

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
重複箇所、サイズ超過時の大きな節も含める。チェックリストや総評を作るときは、
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

エージェントがスキルを実行すると、対象文書・判断理由・総評を
`.verify-docs/dist/checklist.md`に記録する。チェッカーコマンド単独では
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
