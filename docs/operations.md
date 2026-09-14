# 導入・検査・CI の運用オブジェクト

[README.md](../README.md)から参照される。導入先で直接使う導入器、自己検査、CI
テンプレートを定義する。

## 文書検証パッケージ導入器

| 項目 | 値 |
| --- | --- |
| 和名 | 文書検証パッケージ導入器 |
| 英名 | VerifyDocsInstaller |
| ファイル名 | `install.sh` |
| リポジトリ内パス | `install.sh` |
| 配布先パス | なし（導入時に取得して実行する） |

verify-docs パッケージ一式を導入先のリポジトリへ配置する。

## 文書検証パッケージ自己検査

| 項目 | 値 |
| --- | --- |
| 和名 | 文書検証パッケージ自己検査 |
| 英名 | VerifyDocsSelfCheck |
| ファイル名 | `ci-selfcheck.sh` |
| リポジトリ内パス | `ci-selfcheck.sh` |
| 配布先パス | なし（パッケージ開発時だけ実行する） |

パッケージ自身の検証器・抽出器・スキル契約・評価・導入器を検査する。

## CI の検査観点

このリポジトリの CI は、導入先の文書を検証するワークフローとは別に、配布物自身の構成と導入経路を検査する。

| 実行契機 | ジョブ | 検査観点 |
| --- | --- | --- |
| pull request・`main` への push | `verify-docs-root-check` | リポジトリの Markdown におけるリンク、孤立文書、サイズ、重複段落。 |
| pull request・`main` への push | `verify-docs-self-check` | `SKILL.md` から `docs/` への参照、配布用 `references/` の生成、導入・再導入・競合拒否、Claude/Kiro 向け互換リンク。 |
| `main` への push | `remote-install-smoke` | 公開済み `main` の raw `install.sh` とアーカイブからの導入、導入先の `references/`、`docs/` と `evals/` を導入しないこと、導入済み CLI の実行。 |

pull request の `ci` 完了後には、同じ PR 内の bot コメントを更新する。報告用 workflow は完了済み CI の情報だけを GitHub API で読み、PR のコードを checkout・実行しない。

このCIは実ホストでスキルを起動すること、利用者の文書内容が正しいこと、Node.js 23以上の各版で動くことまでは確認しない。前者はホストごとの手動確認、後者は対象リポジトリ側の検証、Node.js 23以上は対応版ごとの追加検証が必要である。

## 文書構造検証ワークフロー

| 項目 | 値 |
| --- | --- |
| 和名 | 文書構造検証ワークフロー |
| 英名 | DocumentStructureVerificationWorkflow |
| ファイル名 | `verify-docs.yml` |
| リポジトリ内パス | `.github/workflows/verify-docs.yml` |
| 配布先パス | `.github/workflows/verify-docs.yml` |

導入先の pull request で文書構造検証器を実行する GitHub Actions テンプレートである。
導入器はこのテンプレートをコピーしないため、導入先で必要な場合は手動で配置する。
