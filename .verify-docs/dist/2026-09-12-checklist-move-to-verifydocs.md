# 作業チェックリスト: checklist.mdをverify-docs/references/へ移動

開始: 2026-09-12T12:53:02+0000

- [x] `node scripts/verify-docs.mjs`（ルート設定） — 2026-09-12 / 「文書構造: すべて通過」（文書3件、TODO例外0件）
- [x] `verify-docs/ci-selfcheck.sh`（自己検査） — 2026-09-12 / テスト17件全pass
- [x] checklist.mdの移動 — 2026-09-12 / dedupe-docs/references/checklist.md を
      verify-docs/references/checklist.md へ移動（git mv、移動とポインタ化のみ、内容変更なし）。
      dedupe-docs は任意導入（verify-docs/README.md「導入」参照）なのに対し、
      verify-docs 自体が必須で参照するため依存の向きが逆だった不備を修正
- [x] 相対リンクの修正 — 2026-09-12 / checklist.md内の自己参照(config.mdへのリンク・
      SKILL.mdへの相対パス)、verify-docs/SKILL.md・dedupe-docs/SKILL.mdの参照先、
      config.md「作業チェックリストの保管先」節の記述を新しい配置に合わせて更新

## 総評

- 検査対象: 3ファイル（ルート）＋自己検査対象一式（verify-docs.mjs出力）
- 検出した違反: 0件
- 作業にかかった時間: 12:53 〜 12:53（所要1分未満）

### 全体のサイズ変化

| ファイル | 圧縮前 | 圧縮後 | 差分 | 圧縮率 |
| --- | ---: | ---: | ---: | ---: |
| verify-docs/SKILL.md | 11,269B | 11,242B | -27B | 0.2%減 |
| dedupe-docs/SKILL.md | 6,530B | 6,557B | +27B | 0.4%増 |
| config.md | 11,216B | 10,944B | -272B | 2.4%減 |
| **合計** | **29,015B** | **28,743B** | **-272B** | **0.9%減** |

### 常時読み込み→オンデマンド化

該当なし（今回はファイルの移動とポインタ修正のみで、常時読み込み/
オンデマンドの区分自体に変化はない。移動先も引き続き `references/` 配下の
オンデマンド文書）
