# verify-docs

生成AIエージェントが読むCLAUDE.md・AGENTS.md・README・docs・
`.agents/skills/`などの文書群を、「必要な時にだけ必要な文書が読まれる」構造に
保つためのパッケージ。入口文書は話題と参照先だけを持つルーティングテーブル
として扱う。

## 構成

- **チェッカー**（`scripts/verify-docs.mjs`）
  - 参照切れと孤立文書
  - 文書のサイズ超過
  - 同一説明の重複
- **verify-docsスキル**（`.agents/skills/verify-docs/SKILL.md`）
  - 検出事項の是正手順
- **dedupe-docsスキル**（`.agents/skills/dedupe-docs/SKILL.md`）
  - 言い換えによる重複の是正
- **tighten-docsスキル**（`.agents/skills/tighten-docs/SKILL.md`）
  - 意味を変えない冗長な言い回しの削減

## 導入

このディレクトリの中身を、対象リポジトリの直下へコピーする。
`verify-docs/`という入れ子は作らない。

```text
your-repo/
├── scripts/verify-docs.mjs
├── .agents/skills/verify-docs/
├── .agents/skills/dedupe-docs/
├── .agents/skills/tighten-docs/
├── .claude/skills -> ../.agents/skills
├── .kiro/skills -> ../.agents/skills
└── verify-docs.config.json               # 必要な場合のみ
```

既定値のまま開始し、対象リポジトリと異なる項目だけ
`verify-docs.config.json`で上書きする。

## 実行方法

### 文書構造の検査

```bash
node scripts/verify-docs.mjs
```

既存文書に違反があるリポジトリでは、最初に次を実行する。

```bash
node scripts/verify-docs.mjs --init-todo
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

## 詳細

- [既存リポジトリへの導入、CI、TODOの運用](docs/adoption.md)
- [エージェント間の互換構成](.agents/skills/verify-docs/references/agent-compatibility.md)
- [設定項目](.agents/skills/verify-docs/references/config.md)
- [TODOファイルの記述形式](.agents/skills/verify-docs/references/todo.md)
- [検出事項の是正手順](.agents/skills/verify-docs/SKILL.md)
- [この一式の改修作法](CONTRIBUTING.md)

エージェントやフックへの依存はない。CIとpush前検証へチェッカーを組み込んで
運用する。
