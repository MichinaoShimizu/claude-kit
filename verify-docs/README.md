# verify-docs

生成AIエージェントと人が保守する Markdown 文書群の検査・改善パッケージ。
CommonMark ASTを基盤に、参照整合性、文書と節の構造情報、ファイルサイズ、
機械的な重複を扱い、意味的な重複の解消と意味を変えない簡潔化も支援する。

## できること

| 困っていること | 使うもの | 行うこと | 行わないこと |
| --- | --- | --- | --- |
| リンク切れ、孤立文書、サイズ超過、完全に同じ段落を検出したい | [チェッカー](#文書構造を検査する) | CommonMark ASTで文書を解析し、構造違反を機械的に検出する | 意味の近さや文章の良し悪しの判断 |
| 検出した構造違反を直したい | [`verify-docs` スキル](.agents/skills/verify-docs/SKILL.md) | 文書の置き場所と参照関係を整える | 内容の要約・言い換え・文章の推敲 |
| 言い回しは違うが同じ説明が複数ある | [`dedupe-docs` スキル](.agents/skills/dedupe-docs/SKILL.md) | 意味的な重複を判断し、正本へ集約して他方を案内にする | 文脈や対象読者が異なる説明の強制統合 |
| 内容は正しいが、文章を短く読みやすくしたい | [`tighten-docs` スキル](.agents/skills/tighten-docs/SKILL.md) | 意味を保った冗長表現を削る | 文書の分割、重複の集約、意味の変更 |
| 文書の構造を材料に確認・記録したい | [構造抽出CLI](#ast情報をjsonで取得する) | 見出し・段落・位置・バイト数をJSONで出力する | 意味的な重複や冗長性の自動判定 |

CommonMark ASTによる構造解析、検査の出力、TODO初期化の技術的な詳細は
[構造解析と機械検査](docs/structure.md)を参照する。

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

### 文書構造を検査する

```bash
node scripts/verify-docs.mjs
```

### AST情報をJSONで取得する

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

### 既存のサイズ超過をTODOに記録する

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

### スキルを実行する

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
- [CommonMark ASTによる構造解析と機械検査](docs/structure.md)
- [エージェント間の互換構成](.agents/skills/verify-docs/references/agent-compatibility.md)
- [設定項目](.agents/skills/verify-docs/references/config.md)
- [TODOファイルの記述形式](.agents/skills/verify-docs/references/todo.md)
- [検出事項の是正手順](.agents/skills/verify-docs/SKILL.md)
- [この一式の改修作法](CONTRIBUTING.md)

エージェントやフックへの依存はない。CIとpush前検証へチェッカーを組み込んで
運用する。
