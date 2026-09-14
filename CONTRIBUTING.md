# Contributing

本リポジトリへの貢献手順。ルールの詳細（MUST・トピック別の参照先）は
[AGENTS.md](AGENTS.md) を参照する。

## 新規パッケージの追加

[AGENTS.md「必須要件」](AGENTS.md#必須要件)を参照する。

## 既存パッケージの改修

対象パッケージの README・CONTRIBUTING（あれば）には、パッケージ固有の
改修手順を定める（例: [packages/verify-docs/CONTRIBUTING.md](packages/verify-docs/CONTRIBUTING.md)）。
先にそちらを参照する。

## ドキュメントの分割・移動

[AGENTS.md「必須要件」](AGENTS.md#必須要件)を参照する。要約・言い換えによる内容変更を
伴う場合は構造是正とは別コミットにする。

## 提出前の確認

- Node.js 22.23.2を使う。`.nvmrc` を使える環境では `nvm use` を実行する。
- 変更したパッケージに `ci-selfcheck.sh` があれば実行する。
- リポジトリ直下の README.md・AGENTS.md・CLAUDE.md を変更した場合は
  `node packages/verify-docs/scripts/document-structure-verifier.mjs` を実行する。
- [.github/workflows/ci.yml](.github/workflows/ci.yml) が PR 時に上記と
  同等の検査を自動実行する。
