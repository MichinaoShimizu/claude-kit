# 作業チェックリスト: TODO一掃・maxDocBytes変更

このファイルは `.verify-docs/` 配下（検査対象から除外）の作業ログである。
削除せず履歴として残す。

## 対象・作業項目

- [x] TODO.md削除とCONTRIBUTING.mdの参照修正 — 2026-09-12 / session_01R9x7xEUNA7HFHf7kJQghJL
  - verify-docs/TODO.md削除
  - README.md「TODOの管理方法」からTODO.mdの項目を削除
  - CONTRIBUTING.mdの「まずTODO.mdに記載する」ルールと死んだ参照（存在しない「重複検査の項」）を削除
- [x] DEFAULTS.maxDocBytesを30000→20000に変更 — 2026-09-12 / session_01R9x7xEUNA7HFHf7kJQghJL
  - verify-docs.mjsのDEFAULTS・JSDoc設定例、config.mdの設定例JSONを同期
  - 既存文書は全て20000バイト未満のため実害なし（最大は config.md 11,216B）
- [x] 変更後にverify-docs.mjs・ci-selfcheck.shを再実行 — 2026-09-12 / session_01R9x7xEUNA7HFHf7kJQghJL
  - `node scripts/verify-docs.mjs` → 「文書構造: すべて通過」
  - `ci-selfcheck.sh` → テスト17件全pass

## 検討して見送った項目

- `verify-docs.todo.json`（運用上のTODO・サイズ超過の例外リスト機構）自体の廃止 → 見送り。
  既存の肥大化リポジトリへの段階導入という主要ユースケースを支える仕組みのため維持する。
