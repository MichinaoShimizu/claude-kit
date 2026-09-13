# claude-kit

Claude Code・Codex・Kiro などの生成AIエージェント向けパッケージ集。
対象リポジトリへフォルダ単位で組み込んで使う。

| パッケージ | 何をするか |
| --- | --- |
| [verify-docs](verify-docs/) | 階層的な文書群の参照整合性・サイズ・重複を検査する |

## 使い方

使用するパッケージの中身を対象リポジトリの直下へコピーする。導入手順と
CIへの組み込み方は、各パッケージのREADMEを参照する。

- [verify-docsの導入手順](verify-docs/README.md)
- [共通の作業指示](AGENTS.md)
- [Claude Code・Codex・Kiroでスキルを共用する構成](verify-docs/.agents/skills/verify-docs/references/agent-compatibility.md)
- [パッケージの追加・改修手順](CONTRIBUTING.md)

Claude Codeは[CLAUDE.md](CLAUDE.md)を介して、正本である
[AGENTS.md](AGENTS.md)を読み込む。

## 1パッケージ = 1フォルダ

1パッケージ = 1フォルダ。スキル本体・専用サブエージェント・付属スクリプト・
READMEなど、必要な構成要素を同じフォルダに格納する。利用側はフォルダ単位で
移設できる。

## 本リポジトリ自身の CI

本リポジトリでは、各パッケージとリポジトリ直下にverify-docsを適用する。
自己検査の追加方法とCIの構成は[CONTRIBUTING.md](CONTRIBUTING.md)を参照する。
