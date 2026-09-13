# Contributing

本リポジトリへの貢献手順。ルールの詳細（MUST・トピック別の参照先）は
[AGENTS.md](AGENTS.md) を参照する。

## 新規パッケージの追加

[AGENTS.md「MUST」](AGENTS.md#must)を参照する。

## 既存パッケージの改修

対象パッケージの README・CONTRIBUTING（あれば）にパッケージ固有の改修
手順が書いてある（例: [verify-docs/CONTRIBUTING.md](verify-docs/CONTRIBUTING.md)）。
まずそちらを参照する。

## ドキュメントの分割・移動

[AGENTS.md「MUST」](AGENTS.md#must)を参照する。要約・言い換えによる内容変更を
伴う場合は構造是正とは別コミットにする。

## PR 提出前

- 変更したパッケージに `ci-selfcheck.sh` があれば実行する。
- リポジトリ直下の README.md・AGENTS.md・CLAUDE.md を変更した場合は
  `node verify-docs/scripts/verify-docs.mjs` を実行する。
- [.github/workflows/ci.yml](.github/workflows/ci.yml) が PR 時に上記と
  同等の検査を自動実行する。
