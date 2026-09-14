# claude-kit

Claude Code・Codex・Kiro などの生成AIエージェント向けパッケージ集。

このリポジトリでは、利用者に公開する単位をパッケージと呼ぶ。各パッケージは
`packages/<package-name>/` にあり、用途に応じてスキル、カスタムエージェント、
実行ファイル、文書、自己検査を含む。エージェントが読み込む`.agents/`は、
パッケージを導入した先での配置規約であり、公開物の一覧ではない。

## パッケージ

- [verify-docs](packages/verify-docs/)
- [agent-layout](packages/agent-layout/)

## ガイド

- [verify-docsの導入手順](packages/verify-docs/README.md)
- [Claude Code・Codex・Kiroでスキルを共用する構成](packages/verify-docs/.agents/skills/verify-docs/references/agent-compatibility.md)

## 開発者向け

- [共通の作業指示](AGENTS.md)
- [パッケージの追加・改修手順](CONTRIBUTING.md)
