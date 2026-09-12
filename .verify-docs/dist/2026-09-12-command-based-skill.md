# 作業チェックリスト: SKILL.mdをコマンドベースに書き直す

- [x] `node scripts/verify-docs.mjs`（ルート設定） — 2026-09-12 / 「文書構造: すべて通過」（文書3件、TODO例外0件）
- [x] `verify-docs/ci-selfcheck.sh`（自己検査） — 2026-09-12 / テスト17件全pass
- [x] SKILL.md肥大化への対処（追記） — 2026-09-12 / dedupe-docs/SKILL.mdのチェックリスト作成手順を
      `dedupe-docs/references/checklist.md`に切り出し、verify-docs/SKILL.mdのポインタも同ファイルへ変更。
      verify-docs/SKILL.md 11,549B→11,269B、dedupe-docs/SKILL.md 9,932B→6,530B（新規checklist.md 3,881Bへ移動）

## 総評

- 検査対象: 3ファイル（ルート）＋自己検査対象一式（verify-docs.mjs出力）
- 検出した違反: 0件
- 効果: verify-docs/SKILL.md・dedupe-docs/SKILL.mdの合計サイズを
  21,481B → 17,799B に削減（17.1%減）。チェックリスト作成手順(mkdir/cat
  コマンド・記入例)を独立した参照文書`references/checklist.md`(3,881B)に
  切り出したことによる
