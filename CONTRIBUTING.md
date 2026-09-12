# Contributing

本リポジトリへの貢献手順。ルールの詳細（MUST・トピック別の参照先）は
[CLAUDE.md](CLAUDE.md) を参照する。

## 新規パッケージを追加する

1. [README.md「1パッケージ = 1フォルダ」](README.md#1パッケージ-1フォルダ)
   に従い、パッケージが必要とする構成要素（スキル本体・専用サブエージェント・
   付属スクリプト・README など）を1ディレクトリ内に全てまとめる。
2. [README.md](README.md) のパッケージ一覧表に1行追加する。
3. パッケージが自己検査を持つ場合は、フォルダ直下に実行可能な
   `ci-selfcheck.sh` を配置する。CI 側の設定は不要（詳細は
   [README.md「本リポジトリ自身の CI」](README.md#本リポジトリ自身の-ci)）。

## 既存パッケージを改修する

対象パッケージ内の README・CONTRIBUTING（存在する場合）に、そのパッケージ
固有の改修手順が記載されている（例:
[verify-docs/CONTRIBUTING.md](verify-docs/CONTRIBUTING.md)）。まずそちらを
参照する。

## ドキュメントの分割・移動

CLAUDE.md の MUST のとおり、分割・移動は「移動」と「ポインタ化」のみで
行う。要約・言い換えによる内容変更を伴う場合は、構造のみの是正コミットとは
分けて別コミットにする。

## PR を出す前に

- 変更したパッケージに `ci-selfcheck.sh` があれば実行する。
- リポジトリ直下の README.md・CLAUDE.md を変更した場合は
  `node verify-docs/scripts/verify-docs.mjs` を実行する。
- [.github/workflows/ci.yml](.github/workflows/ci.yml) が PR 時に上記と
  同等の検査を自動実行する。
