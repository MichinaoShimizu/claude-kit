# 導入・検査・CI の運用オブジェクト

[README.md](../README.md)から参照される。導入先で直接使う導入器、自己検査、CI
テンプレートを定義する。

## 文書検証パッケージ導入器

| 項目 | 値 |
| --- | --- |
| 和名 | 文書検証パッケージ導入器 |
| 英名 | VerifyDocsInstaller |
| ファイル名 | `install.sh` |

verify-docs パッケージ一式を導入先のリポジトリへ配置する。

## 文書検証パッケージ自己検査

| 項目 | 値 |
| --- | --- |
| 和名 | 文書検証パッケージ自己検査 |
| 英名 | VerifyDocsSelfCheck |
| ファイル名 | `ci-selfcheck.sh` |

パッケージ自身の検証器・抽出器・スキル契約・評価・導入器を検査する。

## 文書構造検証ワークフロー

| 項目 | 値 |
| --- | --- |
| 和名 | 文書構造検証ワークフロー |
| 英名 | DocumentStructureVerificationWorkflow |
| ファイル名 | `.github/workflows/verify-docs.yml` |

導入先の pull request で文書構造検証器を実行する GitHub Actions テンプレートである。
