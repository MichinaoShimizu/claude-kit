---
name: tighten-docs
description: >
  意味を変えずに削れる冗長な言い回しを削減する際に参照する。verify-docs は
  文書のサイズ超過という結果を検出するが、どう削るか（冗長性の判定・
  簡潔化）は判定しない——この判断を人・エージェントが行う際に本スキルを
  使う。「文書を簡潔にしたい」「冗長な言い回しを削ってほしい」「もっと
  短くできないか」「文章を引き締めて」が該当する。文書の分割・重複解消
  （構造の是正）は対象外——それは verify-docs・dedupe-docs スキルの担当。
  該当する言い方が出たら、明示的に「tighten」と言われていなくても必ず
  本スキルを参照すること。
---

# tighten-docs —— 意味を変えない文書簡潔化

verify-docs の検査はサイズ超過という結果のみを見る。冗長かどうかの判定・
削り方は検査対象外であり、本スキルが人・エージェントの判断で埋める。

## 前提

対象リポジトリに verify-docs 一式（`scripts/verify-docs.mjs` と
`.agents/skills/verify-docs/`）が導入済みであること。検査対象・チェックリスト
規約は流用する。verify-docs 自体の規約は
[verify-docs/SKILL.md](../verify-docs/SKILL.md) を参照する。

## 守ること

意味は変えない。数値・条件・手順の順序・免責文言は一字一句変更しない。
判断基準は「削っても次に何をすべきか・何が言いたいかが変わらないか」。
構造の是正（分割・重複解消）は
[verify-docs スキル](../verify-docs/SKILL.md)・
[dedupe-docs スキル](../dedupe-docs/SKILL.md)の担当であり、本スキルの
対象外。同じ変更に混在させず別コミットにする。

## 手順

### 1. チェックリスト作成

作り方は
[verify-docs/references/checklist.md](../verify-docs/references/checklist.md)
を参照する。

チェックリストに載せた対象文書は、共通抽出コマンドで段落の見出し階層・元位置・
本文・バイト数を一覧化し、確認する箇所を整理する。

```bash
node scripts/extract-doc-blocks.mjs --root=. README.md docs/guide.md
```

対象が多い場合は、チェックリストのパスを複数指定する。段落の `bytes` はMarkdown
記法を含む元ソース範囲のサイズである。抽出結果は候補の棚卸しに限り、冗長性や
安全に削除できるかを判定しない。必ず原文と「守ること」を確認して判断する。

### 2. 冗長表現削減

典型パターンの一覧は
[references/patterns.md](references/patterns.md) を参照する。該当パターンの
有無を1件ずつ確認する。

### 3. サイズ変化記録

[checklist.md「サイズ変更時の記録」](../verify-docs/references/checklist.md#サイズ変更時の記録)
の様式（圧縮前後サイズ・圧縮率）に従う。

### 4. 是正後再検査

```bash
node scripts/verify-docs.mjs
```

書き換えに伴うリンク切れ・断片リンク切れが発生していないか確認する。

## 完了条件

以下を全て満たした時点で完了とする。

- チェックリストの全項目にチェックが入っている
- `node scripts/verify-docs.mjs` が「文書構造: すべて通過」で終わっている
- 作業完了を報告する際は、チェックリストファイルのパスと総評
  （[verify-docs/references/checklist-summary.md](../verify-docs/references/checklist-summary.md)
  参照）を人に伝える

## 対象外とする範囲

- **文章の巧拙・語彙選択の良し悪しの評価。** 主観的な判断には踏み込まず、
  「意味を変えずに削れるか」のみを判断する
- **構造の是正（分割・重複解消）。** verify-docs・dedupe-docs スキルの担当
- **意味を変える書き換え。** 要約・言い換えで内容が変わるものは
  verify-docs の「守ること」に反する
