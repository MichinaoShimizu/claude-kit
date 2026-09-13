# claude-kit

Claude Code・Codex・Kiro などの生成AIエージェント向けパッケージ集。
対象リポジトリへフォルダ単位で組み込んで使う。

| パッケージ | 何をするか |
| --- | --- |
| [verify-docs](verify-docs/) | CommonMark ASTで文書構造を解析する検査・改善セット。リンク・参照・ファイルサイズ・同一段落を検査し、意味上の重複解消・文章の簡潔化も支援する |
| [agent-layout](agent-layout/) | スキルとカスタムエージェントをClaude Code・Codex・Kiro向けに補正・同期する |

## 使い方

- [verify-docsの導入手順](verify-docs/README.md)
- [共通の作業指示](AGENTS.md)
- [Claude Code・Codex・Kiroでスキルを共用する構成](verify-docs/.agents/skills/verify-docs/references/agent-compatibility.md)
- [パッケージの追加・改修手順](CONTRIBUTING.md)

Claude Codeは[CLAUDE.md](CLAUDE.md)を介して、正本である
[AGENTS.md](AGENTS.md)を読み込む。
