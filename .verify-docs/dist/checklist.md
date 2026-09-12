# verify-docs-checklist: 見出し名詞形統一(全文書適用)

- [x] CLAUDE.md — 「どの話題のときにどこを見るか」→「話題別の参照先」
- [x] verify-docs/README.md — 「この一式を開発する」→「この一式の開発」、
      本文中の見出し言及2箇所も更新
- [x] verify-docs/CONTRIBUTING.md — H1「この一式を改修する際の作法」→
      「この一式の改修作法」
- [x] CONTRIBUTING.md — 「新規パッケージを追加する」→「新規パッケージの追加」、
      「既存パッケージを改修する」→「既存パッケージの改修」、
      「PR を出す前に」→「PR 提出前」
- [x] verify-docs/.claude/skills/verify-docs/SKILL.md — 手順1〜6・
      「チェッカーとプレイブックを分離する」を名詞形に統一
- [x] verify-docs/.claude/skills/dedupe-docs/SKILL.md — 手順1〜4を名詞形に統一、
      アンカーリンク2箇所を修正
- [x] verify-docs/.claude/skills/verify-docs/references/config.md —
      「意図した重複を許可する」→「意図した重複の許可」、本文言及1箇所も更新
- [x] verify-docs/.claude/skills/verify-docs/references/checklist.md —
      3見出しを名詞形に統一
- [x] verify-docs/.claude/skills/verify-docs/references/checklist-summary.md —
      H1を checklist.md と揃えて統一
- [x] 再検査 — node scripts/verify-docs.mjs「文書構造: すべて通過」、
      ci-selfcheck.sh 17テスト全pass（リンク切れ・断片リンク切れ無し）

## 総評

- 検査対象: 3ファイル（ルート）＋自己検査対象一式（verify-docs.mjs出力）
- 検出した違反: 0件

### 全体のサイズ変化

| ファイル | 圧縮前 | 圧縮後 | 差分 | 圧縮率 |
| --- | ---: | ---: | ---: | ---: |
| CLAUDE.md | 1,478B | 1,457B | -21B | 1.4%減 |
| verify-docs/README.md | 7,074B | 7,056B | -18B | 0.3%減 |
| verify-docs/CONTRIBUTING.md | 2,967B | 2,955B | -12B | 0.4%減 |
| CONTRIBUTING.md | 1,430B | 1,412B | -18B | 1.3%減 |
| verify-docs/SKILL.md | 9,359B | 9,296B | -63B | 0.7%減 |
| dedupe-docs/SKILL.md | 6,010B | 5,911B | -99B | 1.6%減 |
| config.md | 9,816B | 9,801B | -15B | 0.2%減 |
| checklist.md | 5,170B | 5,152B | -18B | 0.3%減 |
| checklist-summary.md | 2,979B | 2,976B | -3B | 0.1%減 |
| **合計** | **46,283B** | **46,016B** | **-267B** | **0.6%減** |

見出しの動詞終わりを名詞形・体言止めに統一し、省略できる助詞を省いて
複合名詞化した。ポインタ先の見出し名言及・アンカーリンクも全て追従修正。

### 常時読み込み→オンデマンド化

該当なし（全て文言の圧縮のみ）

---

**作業完了。** チェックリストは `.verify-docs/dist/checklist.md` に記録した（上記の内容）。
