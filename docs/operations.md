# 導入・検査・CI の運用オブジェクト

[README.md](../README.md)から参照される。導入先で直接使う導入器、自己検査、CI
テンプレートを定義する。

[![ci](https://github.com/MichinaoShimizu/verify-docs/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/MichinaoShimizu/verify-docs/actions/workflows/ci.yml?query=branch%3Amain)

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

## このリポジトリのCIで確認する結果

このリポジトリでは pull request と `main` への push で、次の結果を確認する。
導入先の文書を検証するワークフローとは別に、配布物自身の構成と導入経路を確認する。
上の badge は `main` の `ci` ワークフロー全体の最新結果である。表は、各ジョブの
成功時に確認できる項目を対応付ける。

| 実行契機 | 結果 | ジョブ | 確認すること |
| --- | --- | --- | --- |
| pull request・`main` への push | :white_check_mark: | `verify-docs-root-check` | リポジトリの Markdown について、リンク・孤立文書・サイズ・重複の検査が通過する。 |
| pull request・`main` への push | :white_check_mark: | `verify-docs-self-check` | ソースの `SKILL.md` から `docs/` をたどれる。アーカイブから配布用スキルを生成でき、ローカル導入・再導入・競合拒否・Claude/Kiro向け互換リンクが成立する。 |
| `main` への push | :white_check_mark: | `remote-install-smoke` | `main` の raw `install.sh` と同じrefのアーカイブを公開URLから取得し、導入先で必要な `references/` を生成できる。`docs/` 全体と `evals/` は導入しない。 |

`remote-install-smoke` はマージ後の `main` だけを取得する。したがって、公開URL経由での導入確認はレビュー済みコードだけを実行する。通常の導入も `main` を取得する。

pull request の `ci` 完了後には、同じ PR 内の bot コメントを作成または更新する。コメントは対象 commit、各ジョブの結果、上表に対応する保証範囲、実行結果へのリンクを表で示す。`remote-install-smoke` は PR では :fast_forward: と表示し、`main` マージ後の Actions summary で結果を確認する。報告用 workflow は完了済み CI の結果だけを GitHub API で読み、PR のコードを checkout・実行しない。

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
