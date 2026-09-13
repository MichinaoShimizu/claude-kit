# AGENTS.md

本リポジトリで作業する生成AIエージェント向けの参照先一覧。
理由や手順は記載せず、参照先の指示に限定する。

## 必須要件

- 1パッケージ = 1フォルダ。新規パッケージ（skill・agent）の構成要素は
  全て同一フォルダ内に格納する。一部を他所へ切り出すのは禁止。
- 新規パッケージ追加時は [README.md](README.md) の一覧表に1行追加する。
- 自己検査を持つパッケージは、フォルダ直下に実行可能な `ci-selfcheck.sh`
  を配置する。
- ClaudeまたはKiro固有の場所にスキルやカスタムエージェントを追加した場合は、
  `node agent-layout/scripts/sync-agent-layout.mjs --write`で補正する
  （詳細: [agent-layout/README.md](agent-layout/README.md)）。
- ドキュメントの分割・移動は移動とポインタ化のみ。要約・言い換えによる
  内容変更は禁止。

## セッションの開始

- Git リポジトリで新規タスクを開始する場合は、共有 checkout ではなく新規 worktree を使用する。
- 作業を始める前に `git fetch origin main` を実行し、現在の HEAD と `origin/main` の差分を確認する。
- タスク用 worktree は最新の `origin/main` を起点にする。
- 他の worktree、共有 checkout、または他セッションが持つ未コミット変更を変更しない。
- 共有 checkout の `main` に対する `reset`、`checkout`、`merge` は、利用者が明示的に依頼した場合だけ行う。
- タスク専用 worktree は、変更の統合または不要化を確認した後、対象 worktree がクリーンであることを確認して削除する。進行中・レビュー待ち・未マージの変更がある worktree は削除しない。

## 参照先

| 話題                                             | 行き先                                          |
| ------------------------------------------------ | ------------------------------------------------ |
| パッケージ一覧・使い方                          | [README.md](README.md)                          |
| ドキュメント構造の検査（参照切れ・サイズ超過・重複） | [verify-docs/README.md](verify-docs/README.md) |
| CI の中身                                        | [.github/workflows/ci.yml](.github/workflows/ci.yml) |
| スキル・カスタムエージェントの互換構成          | [agent-layout/README.md](agent-layout/README.md)    |
