# verify-docs-checklist: 2026-09-12T22:22:27+0900

- [x] `node scripts/verify-docs.mjs`（ルート設定） — 「文書構造: すべて通過」（文書3件、TODO例外0件）
- [x] `verify-docs/ci-selfcheck.sh`（自己検査） — テスト17件全pass
- [x] ds-ai-coding-skillsを参考にした簡潔化(全10文書) — CLAUDE.md/README.md/CONTRIBUTING.md/
      verify-docs README・CONTRIBUTING/verify-docs SKILL.md/dedupe-docs SKILL.md/
      config.md/checklist.md/checklist-summary.md。冗長な理由説明・強調記号を削り、
      箇条書き中心の文体に統一。移動とポインタ化ではなく文言の圧縮のため、構造是正とは
      別コミットとして扱う

## 総評

- 検査対象: 3ファイル（ルート）＋自己検査対象一式（verify-docs.mjs出力）
- 検出した違反: 0件

### 全体のサイズ変化

| ファイル | 圧縮前 | 圧縮後 | 差分 | 圧縮率 |
| --- | ---: | ---: | ---: | ---: |
| CLAUDE.md | 1,622B | 1,478B | -144B | 8.9%減 |
| README.md | 3,009B | 2,571B | -438B | 14.6%減 |
| CONTRIBUTING.md | 1,606B | 1,430B | -176B | 11.0%減 |
| verify-docs/README.md | 7,312B | 6,820B | -492B | 6.7%減 |
| verify-docs/CONTRIBUTING.md | 3,457B | 2,967B | -490B | 14.2%減 |
| verify-docs/SKILL.md | 11,621B | 9,275B | -2,346B | 20.2%減 |
| dedupe-docs/SKILL.md | 6,557B | 6,010B | -547B | 8.3%減 |
| config.md | 10,944B | 9,816B | -1,128B | 10.3%減 |
| checklist.md | 6,306B | 5,170B | -1,136B | 18.0%減 |
| checklist-summary.md | 3,076B | 2,979B | -97B | 3.2%減 |
| **合計** | **55,510B** | **48,516B** | **-6,994B** | **12.6%減** |

### 常時読み込み→オンデマンド化

該当なし（今回は文言の圧縮のみで、常時読み込み/オンデマンドの区分に
変化はない）

---

**作業完了。** チェックリストは `.verify-docs/dist/checklist.md` に記録した（上記の内容）。
