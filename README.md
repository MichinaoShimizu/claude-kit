# claude-kit

Claude Code・Codex・Kiro などの生成AIエージェント向けパッケージ集。

## パッケージ

| パッケージ | 何をするか |
| --- | --- |
| [verify-docs](verify-docs/) | Markdown文書群の検査・改善パッケージ。チェッカーと構造抽出CLIに加え、`verify-docs`・`dedupe-docs`・`tighten-docs`の3つのスキルを同梱する。CommonMark ASTを基盤に、参照整合性・文書構造・サイズ・重複を検査し、文書構造の是正、意味的重複の解消、意味を保った簡潔化を支援する。 |
| [agent-layout](agent-layout/) | スキルとカスタムエージェントをClaude Code・Codex・Kiro向けに補正・同期する |

## ガイド

- [verify-docsの導入手順](verify-docs/README.md)
- [Claude Code・Codex・Kiroでスキルを共用する構成](verify-docs/.agents/skills/verify-docs/references/agent-compatibility.md)

## 開発者向け

- [共通の作業指示](AGENTS.md)
- [パッケージの追加・改修手順](CONTRIBUTING.md)
