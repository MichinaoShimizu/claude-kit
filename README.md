# claude-kit

Claude Code・Codex・Kiro などの生成AIエージェント向けパッケージ集。

## パッケージ

| パッケージ | 何をするか |
| --- | --- |
| [verify-docs](verify-docs/) | CommonMark ASTで文書構造を解析する検査・改善セット。リンク・参照・ファイルサイズ・同一段落を検査し、意味上の重複解消・文章の簡潔化も支援する |
| [agent-layout](agent-layout/) | スキルとカスタムエージェントをClaude Code・Codex・Kiro向けに補正・同期する |

## ガイド

- [verify-docsの導入手順](verify-docs/README.md)
- [Claude Code・Codex・Kiroでスキルを共用する構成](verify-docs/.agents/skills/verify-docs/references/agent-compatibility.md)

## 開発者向け

- [共通の作業指示](AGENTS.md)
- [パッケージの追加・改修手順](CONTRIBUTING.md)
