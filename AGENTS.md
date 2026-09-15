# AGENTS.md

本リポジトリで作業する生成AIエージェント向けの参照先一覧。
理由や手順は記載せず、参照先の指示に限定する。

## 必須要件

本リポジトリの公開物である verify-docs の skill・実行ファイル・文書・fixture・
自己検査はルートに置く。

- ドキュメントの分割・移動は移動とポインタ化のみ。要約・言い換えによる
  内容変更は禁止。

## セッションの開始

- Git リポジトリで新規タスクを開始する場合は、共有 checkout ではなく新規 worktree を使用する。
- 新規タスク用 worktree は `bash scripts/start-worktree.sh <task-name>` で作成する。
- 同コマンドが報告した `origin/main` の SHA と、作成した worktree の HEAD が一致することを確認してから作業する。
- 他の worktree、共有 checkout、または他セッションが持つ未コミット変更を変更しない。
- 共有 checkout の `main` に対する `reset`、`checkout`、`merge` は、利用者が明示的に依頼した場合だけ行う。
- タスク専用 worktree は、変更の統合または不要化を確認した後、対象 worktree がクリーンであることを確認して削除する。進行中・レビュー待ち・未マージの変更がある worktree は削除しない。

## PR作成

- PR本文・Issue本文などの複数行テキストを、シェルのコマンド引数へ直接埋め込まない。
- 本文は`--body-file`で渡す。Markdownのバッククォート、`$()`、引用符をシェル展開させない。
- PRの作成・更新直後に`gh pr view --json body`で本文を読み返し、意図しない展開や検査ログの混入がないことを確認する。

## 参照先

| 話題                                             | 行き先                                          |
| ------------------------------------------------ | ------------------------------------------------ |
| verify-docs の使い方                            | [README.md](README.md)                          |
| ドキュメント構造の検査（参照切れ・サイズ超過・重複） | [docs/structure.md](docs/structure.md) |
| 文書の分割・移動・正本化・ポインタ化            | [docs/progressive-disclosure.md](docs/progressive-disclosure.md) |
| CI の中身                                        | [.github/workflows/ci.yml](.github/workflows/ci.yml) |
