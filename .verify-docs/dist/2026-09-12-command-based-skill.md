# 作業チェックリスト: SKILL.mdをコマンドベースに書き直す

- [x] `node scripts/verify-docs.mjs`（ルート設定） — 2026-09-12 / 「文書構造: すべて通過」（文書3件、TODO例外0件）
- [x] `verify-docs/ci-selfcheck.sh`（自己検査） — 2026-09-12 / テスト17件全pass
- [x] SKILL.md肥大化への対処（追記） — 2026-09-12 / dedupe-docs/SKILL.mdのチェックリスト作成手順を
      `dedupe-docs/references/checklist.md`に切り出し、verify-docs/SKILL.mdのポインタも同ファイルへ変更。
      verify-docs/SKILL.md 11,549B→11,269B、dedupe-docs/SKILL.md 9,932B→6,530B（新規checklist.md 3,881Bへ移動）

## 総評

- 検査対象: 3ファイル（ルート）＋自己検査対象一式（verify-docs.mjs出力）
- 検出した違反: 0件

### 全体のサイズ変化

| ファイル | 圧縮前 | 圧縮後 | 差分 | 圧縮率 |
| --- | ---: | ---: | ---: | ---: |
| verify-docs/SKILL.md | 11,549B | 11,269B | -280B | 2.4%減 |
| dedupe-docs/SKILL.md | 9,932B | 6,530B | -3,402B | 34.3%減 |
| **合計** | **21,481B** | **17,799B** | **-3,682B** | **17.1%減** |

### 常時読み込み→オンデマンド化

| 移動元（常時読み込み） | 移動先（オンデマンド） | 移動したサイズ |
| --- | --- | ---: |
| verify-docs/SKILL.md・dedupe-docs/SKILL.md | dedupe-docs/references/checklist.md | 3,881B |

チェックリスト作成手順(mkdir/catコマンド・記入例)を独立した参照文書
`references/checklist.md`に切り出したことで、スキル起動のたびに常時
読み込まれていた内容の一部（3,881B）を、必要時のみ読まれるオンデマンド
読み込みに変更できた。
