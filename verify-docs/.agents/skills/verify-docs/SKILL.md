---
name: verify-docs
description: >
  CLAUDE.md・README・docs・.agents/skills のような階層的な文書群を、
  「必要な時にだけ必要な文書が読まれる」構造に是正・維持する際に参照する。
  検査対象は3点: 参照切れ・孤立文書（参照整合性）、文書のサイズ超過
  （読む量の予算）、複数の文書に同じ説明がそのまま重複していないか（コピーして
  片方だけ直した結果、矛盾した説明が残る事故を防ぐ）。
  「CLAUDE.md が長すぎる」「毎回関係ない決め事まで読まれてトークンを消費する」
  「ドキュメントが肥大化してきた」「同じ説明がREADMEとdocsに重複して記載されている」
  「この文書は分割すべきか」「verify-docs を実行してほしい」が該当する。
  ユーザーが「verify-docs」と明示しなくても、CLAUDE.md・README・docs・
  SKILL.md 群の構造（参照切れ・肥大化・重複）に触れる作業では必ず本スキルを
  参照すること。
---

# verify-docs —— 必要な時にだけ必要な文書を読ませる

生成AIエージェントはセッション開始時に CLAUDE.md・AGENTS.md・README を読み、
作業中に関連する docs や `.agents/skills/*/SKILL.md` を参照する。この設計が
崩れると、関係ない決め事まで毎回トークンを消費する。崩れ方は3種類。

1. **入口の肥大化。** CLAUDE.md・AGENTS.md・README に不要な詳細が残ると、
   毎回それを読むことになる
2. **個々の文書の肥大化。** 話題ごとの区切りがあっても、1文書の中身が
   増え続ければ読む量が膨張する
3. **同一説明の重複。** コピー後に片方だけ更新すると矛盾した説明が残る
   （文書分割時にも起きやすい）

## 守ること

**分割・重複解消は「移動」と「ポインタ化」のみ。要約・言い換え・簡略化に
よる内容変更は禁止。** 是正するのは構造（記載場所）であり内容ではない。
数値・条件・手順の順序・免責文言は一字一句変更しない。「ついでに整える」を
混ぜると、意味の変化に誰も気づけなくなる。

内容そのものの見直し（陳腐化・冗長・不明瞭）は本スキルの対象外。別作業として
分離する（構造是正と内容是正を同じ変更に混ぜると、どちらで意味が変わったか
追跡できなくなる）。

## チェッカーとプレイブックの分離

チェッカー・プレイブックそれぞれの役割は
[README.md「できること」](../../../README.md#できること)
を参照する。
本スキル（プレイブック側）を実行する際は、同一の回でチェッカーの判定
（機械的に真偽が出る範囲）とプレイブックの判断（意味的な重複の判定など）
を兼務させない（審査対象と審査基準が同一の判断軸を持つと精度が落ちる）。

## 使用前提

`scripts/verify-docs.mjs` を対象リポジトリに配置する（本スキル一式を
まるごとコピーすれば含まれる）。設定は `verify-docs.config.json`
（無ければ既定値。[references/config.md](references/config.md)を参照。
入力制約は[references/config-validation.md](references/config-validation.md)を参照）。
複数エージェントで入口文書とスキルを共用する構成は
[references/agent-compatibility.md](references/agent-compatibility.md) を参照する。

**実行する前に、必ず対象文書（またはこの回で確認する観点）の一覧を
チェックリストとして先に作る。**「簡単な確認だから」「1回実行するだけ
だから」は省略の理由にならない。作り方は
[references/checklist.md](references/checklist.md) を参照する。

```bash
node scripts/verify-docs.mjs
```

本スクリプトは破綻箇所を通知するのみで、是正は本スキルの役目。出力された
違反は事前に作ったチェックリストへ反映し、1件是正するごとにチェックを
入れ日付・判断理由を書き添える。全項目が済んだら再実行し、新規の違反が
無いか確認する。実行結果と完了レコードの様式は
[references/checklist-summary.md](references/checklist-summary.md) を参照する。

## 手順

各手順を順に実施する。是正方法の詳細は
[references/remediation.md](references/remediation.md)を参照する。
準一致重複・意図した重複の扱いは
[references/duplicate-handling.md](references/duplicate-handling.md)、
TODOの記述形式は [references/todo.md](references/todo.md)を参照する。

### 1. 入口軽量化

[詳細](references/remediation.md#1-入口軽量化)を参照する。

### 2. 肥大化文書の特定

[詳細](references/remediation.md#2-肥大化文書の特定)を参照する。

### 3. 重複特定

[詳細](references/remediation.md#3-重複特定)を参照する。

### 4. 分割不可時の TODO 記載

[詳細](references/remediation.md#4-分割不可時の-todo-記載)を参照する。

### 5. CI 組み込み

[詳細](references/remediation.md#5-ci-組み込み)を参照する。

### 6. 維持

[詳細](references/remediation.md#6-維持)を参照する。

## 完了条件

以下を全て満たした時点で、その回の是正作業は完了とする。

- `node scripts/verify-docs.mjs` の実行結果が「文書構造: すべて通過」
  である（`verify-docs.todo.json` に理由付きで明示的に残した超過は
  例外として許容する）
- 検査結果に複数件出力された違反は、チェックリストの全項目にチェックが
  入っている
- 自分のチェックリストセクションに `### 実行結果` を記載し、作業完了を報告する際は
  チェックリストファイルのパス（`.verify-docs/dist/checklist.md`）と実行結果を人に伝える

## 対象外とする範囲

- **文章の品質・正確性は検査対象外とする。** 検査対象は構造（参照・孤立・
  サイズ・重複）のみである
- **何を記載すべきかの判断は行わない。** 「この決め事は MUST か、道案内で
  足りるか」「どちらの表現が簡潔か」の判断は、人または対象リポジトリの
  原則に照らして行う
