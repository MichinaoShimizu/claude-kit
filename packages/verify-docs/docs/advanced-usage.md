# 文書構造検証器のCLIリファレンス

## 文書構造の検査

[文書構造検証器](structure.md#文書構造検証器)を実行する。

```bash
node scripts/document-structure-verifier.mjs
```

## PR差分の検査

基準ブランチから変更したパスに関係する違反だけを失敗として返す。リンク解決などは
リポジトリ全体を解析するため、変更していない文書へのリンク切れも、変更で起きた場合は
検出する。Gitで文書を移動した場合は、移動元・移動先の両方を変更パスとして扱うため、
移動元を参照したままの文書も検出できる。

```bash
node scripts/document-structure-verifier.mjs --changed-base=origin/main
```

## 文書構造スナップショットのJSON出力

[文書構造抽出器](structure.md#文書構造抽出器)は、文書重複解消スキル／文書簡潔化スキルで対象文書を調べるときに、CommonMarkの見出し階層と段落を
JSON出力できる。意味的な重複や冗長性は判定しない。

```bash
node scripts/document-structure-extractor.mjs --root=. README.md docs/guide.md
```

各指定文書について、DocumentStructureSnapshot（文書構造スナップショット）として見出し階層・段落・位置・バイト数を返す。出力項目の使い方は各スキルの手順を参照。

## 既存のサイズ超過の例外記録

既存文書に違反があるリポジトリでは、最初に次を実行する。

```bash
node scripts/document-structure-verifier.mjs --init-size-exceptions
```

## 文書構造検証レポートのJSON出力

```bash
node scripts/document-structure-verifier.mjs --json
```
