# Contributing

本リポジトリへの貢献手順。ルールの詳細（MUST・トピック別の参照先）は
[CLAUDE.md](CLAUDE.md) を参照する。

## 新規パッケージの追加

CLAUDE.md の MUST 3項目（1パッケージ = 1フォルダ、README.md の一覧表に
1行追加、自己検査があれば `ci-selfcheck.sh` を配置）に従う。詳細:
[README.md「1パッケージ = 1フォルダ」](README.md#1パッケージ-1フォルダ)・
[README.md「本リポジトリ自身の CI」](README.md#本リポジトリ自身の-ci)。

## 既存パッケージの改修

対象パッケージの README・CONTRIBUTING（あれば）にパッケージ固有の改修
手順が書いてある（例: [verify-docs/CONTRIBUTING.md](verify-docs/CONTRIBUTING.md)）。
まずそちらを参照する。

## ドキュメントの分割・移動

CLAUDE.md の MUST のとおり、分割・移動は移動とポインタ化のみ。要約・
言い換えによる内容変更を伴う場合は構造是正とは別コミットにする。

## PR 提出前

- 変更したパッケージに `ci-selfcheck.sh` があれば実行する。
- リポジトリ直下の README.md・CLAUDE.md を変更した場合は
  `node verify-docs/scripts/verify-docs.mjs` を実行する。
- [.github/workflows/ci.yml](.github/workflows/ci.yml) が PR 時に上記と
  同等の検査を自動実行する。
