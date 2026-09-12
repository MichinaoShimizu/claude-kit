# 作業チェックリスト: SKILL.mdをコマンドベースに書き直す

- [x] `node scripts/verify-docs.mjs`（ルート設定） — 2026-09-12 / 「文書構造: すべて通過」（文書3件、TODO例外0件）
- [x] `verify-docs/ci-selfcheck.sh`（自己検査） — 2026-09-12 / テスト17件全pass
- [x] SKILL.md肥大化への対処（追記） — 2026-09-12 / dedupe-docs/SKILL.mdのチェックリスト作成手順を
      `dedupe-docs/references/checklist.md`に切り出し、verify-docs/SKILL.mdのポインタも同ファイルへ変更。
      verify-docs/SKILL.md 11,549B→11,269B、dedupe-docs/SKILL.md 9,932B→6,530B
