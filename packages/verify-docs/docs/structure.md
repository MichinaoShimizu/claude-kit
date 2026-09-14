# 構造解析と機械検査

[README.md](../README.md)から参照される。CommonMark ASTを使った構造解析、
文書構造検証器、文書構造抽出器、JSON出力、既存リポジトリ導入時の文書サイズ例外の初期化を扱う。

## オブジェクトの定義

### 文書構造検証器

| 項目 | 値 |
| --- | --- |
| 和名 | 文書構造検証器 |
| 英名 | DocumentStructureVerifier |
| ファイル名 | `scripts/document-structure-verifier.mjs` |

Markdown文書の参照整合性・文書サイズ・段落重複を検査する。

### 文書構造抽出器

| 項目 | 値 |
| --- | --- |
| 和名 | 文書構造抽出器 |
| 英名 | DocumentStructureExtractor |
| ファイル名 | `scripts/document-structure-extractor.mjs` |

Markdown文書の見出し・段落・位置・バイト数を抽出する。

## CommonMark AST解析

Markdownは正規表現ではなく、同梱の CommonMark.js で AST（構文木）に解析する。
見出し階層、段落、リンク・画像の宛先、ソース位置を構文に沿って取得するため、
コード領域やコメント内のリンク風テキストを誤検出しない。

| 構成要素 | 提供すること |
| --- | --- |
| AST解析（`scripts/markdown-structure.mjs`） | 見出し階層、段落、リンク・画像の宛先、ソース位置を取り出す。 |
| 文書構造検証器 | 参照切れ、孤立文書、**ファイル単位**のサイズ超過、AST抽出した同一段落の重複を検出する。違反箇所の行・列・見出し階層、文書・違反種別の集計、分割検討用の大きい葉セクションも出力する。 |
| 文書構造抽出器 | DocumentStructureSnapshot（文書構造スナップショット）として、文書の見出し・段落・位置・バイト数をJSONで出力する。dedupe-docsとtighten-docsが、対象を漏れなく確認するための共通入力になる。 |

## スキルの契約テスト

`dedupe-docs`・`tighten-docs`の意味判断そのものはCIで自動判定しない。代わりに
自己検査ではfixtureを使い、共通の文書構造検証器の通過、正本へのポインタ化、必須情報の保持、
サイズ変化と実行結果のMaintenance Reportへの記録を契約として検証する。意味的な重複や文章品質の
最終判断は、人またはエージェントのレビューで継続して評価する。

意味判断を比較するための小さな評価fixtureは[スキル判断の評価セット](../evals/README.md)を
参照する。これはCIのpass/failには使わず、スキル・モデル・評価方法を変更するときに使う。

## 機械可読出力と文書サイズ例外の初期化

`node scripts/document-structure-verifier.mjs --json` は、文書数・構造集計・違反種別ごとの件数・
大きい葉セクション・文書サイズ例外を機械可読な形式で出力する。スキル別の実行結果は、
この出力を根拠として記録する。

`node scripts/document-structure-verifier.mjs --init-size-exceptions` は、既存のサイズ超過文書を理由と
分割候補の節情報付きで`document-size-exceptions.json`へ記録する。すべてを導入初日に
分割できない既存リポジトリでも、超過を明示して段階的に是正できる。
