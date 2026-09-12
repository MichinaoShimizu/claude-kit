#!/usr/bin/env node
/**
 * verify-docs —— 文書構造を検査する。
 *
 * 生成AIエージェントに読ませる CLAUDE.md / README.md / docs/ / .claude/skills/ のような
 * 階層的な文書群は、「必要な時にだけ必要な文書が読まれる」ように作っても、放っておくと
 * 3 つの壊れ方をする。
 *
 *   1. 参照が黙って切れる —— ファイルを動かす・消すと、リンクが死ぬ。誰も見ていないと
 *      気づかないまま古いパスを指し続ける。
 *   2. 1 文書が際限なく太る —— 「この話題のときに開く」という区切りを作っても、
 *      その1文書の中身が増え続けると、開いた瞬間に読む量が膨らんでいく。
 *   3. 同じ説明が複数の文書に重複する —— コピーしてから直すと、片方だけ更新されて
 *      矛盾した2つの説明が残る。太った文書を分割するときにも起きやすい。
 *
 * このスクリプトは3つとも検査する。チェッカー（このスクリプト）と、プレイブック
 * （見つかったものをどう直すか）は分けてある。プレイブックの手順は
 * `.claude/skills/verify-docs/SKILL.md`。
 *
 *   node scripts/verify-docs.mjs
 *
 * 見ているもの:
 *   - マークダウンリンクの飛び先が実在するか（外部 URL は見ない）
 *   - 断片（`#見出し`）が、その文書の見出しに実在するか
 *   - 本文にバッククォートで書いたリポジトリ内のパスが実在するか
 *   - entryPoints・スキルの SKILL.md 以外の文書が、どこかから参照されているか
 *     （孤立していないか）
 *   - スキルの補助文書（references/ など）が、自分の SKILL.md から参照されているか
 *   - 各文書のバイト数が、決めた上限を超えていないか（TODO ファイルに書いた例外は除く）
 *   - 同じ段落（一定の長さ以上）が複数の文書にそのまま重複していないか
 *   - （既定オフ）句読点・敬体/常体だけが違う、ほぼ同じ段落が複数の文書に
 *     ないか（`checkNearDuplicates`。誤検知が増えやすいのでオプトイン）
 *
 * 検査対象の集め方:
 *   `excludePaths` に列挙したディレクトリを除き、リポジトリ全体の `*.md` を対象と
 *   する。`entryPoints`・`docsDir`・`skillsDir` は「その文書に何を期待するか」
 *   （孤立チェックの免除・SKILL.md との紐付けなど）を決めるだけで、検査対象への
 *   出し入れには使わない。**特定のディレクトリだけを見る方式（旧仕様）は、そこに
 *   置き忘れた文書が黙って検査から漏れる事故を招くため採用しない。**
 *
 * 設定（すべて省略可。既定値は DEFAULTS を見る）:
 *   verify-docs.config.json をリポジトリ直下に置くと読む。
 *
 *     {
 *       "entryPoints": ["README.md", "CLAUDE.md", "AGENTS.md"],
 *       "docsDir": "docs",
 *       "skillsDir": ".claude/skills",
 *       "pathRoots": ["src/", "docs/", "scripts/", ".claude/", ".github/"],
 *       "excludePaths": ["node_modules/", ".git/", "vendor/", "dist/", "build/", ".verify-docs/"],
 *       "maxDocBytes": 30000,
 *       "minDuplicateChars": 60,
 *       "checkDuplicates": true,
 *       "checkNearDuplicates": false,
 *       "todoFile": "verify-docs.todo.json"
 *     }
 *
 * TODO ファイル（既定 verify-docs.todo.json）:
 *   既存リポジトリに後から入れると、すでに上限を超えている文書が見つかることがある。
 *   全部その場で分割できるとは限らないので、超過を **黙って見逃す代わりに、
 *   TODO ファイルに書いて明示的に「わかっていて残している」形にする。**
 *
 *     [
 *       { "path": "docs/deploy.md", "reason": "既存の肥大化ドキュメント。分割待ち" }
 *     ]
 *
 *   TODO に載っている文書は、超過していても検査は落とさない（かわりに一覧に出す）。
 *   ただし **すでに上限内に収まっている文書が TODO に残っていたら、それは検査を落とす**
 *   （直したのに消し忘れた借金は、借金のふりをして居座らせない）。
 *
 * 意図した重複を許すとき:
 *   免責文言・定型の注意書きなど、**わざと**複数の文書に同じ文を置きたいことがある。
 *   その段落の直前の行に `<!-- verify-docs:allow-duplicate -->` を置くと、
 *   その段落だけ重複検査から外れる。
 *
 * options:
 *   --root=<dir>    検査するリポジトリの根（既定: カレント）
 *   --config=<file> 設定ファイルの場所（既定: <root>/verify-docs.config.json）
 *   --json          結果を JSON で出す
 *   --init-todo     いま上限を超えている文書を全部 TODO ファイルに書き出して終わる
 *                   （検査は走らせない）。既存リポジトリに導入する最初の1回に使う。
 *                   すでにファイルがあれば上書きせず失敗する（手で消してから）
 */

import { existsSync, readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';

const args = process.argv.slice(2);
const flag = (name) => args.includes(`--${name}`);
const option = (name, fallback) => {
  const hit = args.find((a) => a.startsWith(`--${name}=`));
  return hit === undefined ? fallback : hit.slice(name.length + 3);
};

const ROOT = resolve(process.cwd(), option('root', '.'));
const AS_JSON = flag('json');

const DEFAULTS = {
  entryPoints: ['README.md', 'CLAUDE.md', 'AGENTS.md'],
  docsDir: 'docs',
  skillsDir: '.claude/skills',
  pathRoots: ['src/', 'docs/', 'scripts/', '.claude/', '.github/'],
  excludePaths: ['node_modules/', '.git/', 'vendor/', 'dist/', 'build/', '.verify-docs/'],
  maxDocBytes: 30000,
  minDuplicateChars: 60,
  checkDuplicates: true,
  checkNearDuplicates: false,
  todoFile: 'verify-docs.todo.json',
};

function loadConfig() {
  const path = option('config', join(ROOT, 'verify-docs.config.json'));
  if (!existsSync(path)) return DEFAULTS;
  const user = JSON.parse(readFileSync(path, 'utf8'));
  return { ...DEFAULTS, ...user };
}

const config = loadConfig();

function loadTodo() {
  const path = join(ROOT, config.todoFile);
  if (!existsSync(path)) return new Map();
  const list = JSON.parse(readFileSync(path, 'utf8'));
  return new Map(list.map((entry) => [entry.path, entry]));
}

const todo = loadTodo();

/** 実体のない書き方。手順の説明で使うので、パスとしては見ない。 */
const PLACEHOLDER = /[<>*…]|\.\.\./;

const failures = [];
const fail = (kind, from, target, reason) => failures.push({ kind, from, target, reason });

/* ---------- 対象の文書を集める ---------- */

/* entryPoints・docsDir・skillsDir に置き忘れると検査から漏れてしまうため（本ツール
 * 自体がこれで CONTRIBUTING.md の重複を見逃した）、リポジトリ全体の *.md を対象に
 * 走査する。`excludePaths` に列挙したディレクトリ配下のみ除外する（既定は
 * node_modules・.git・vendor・dist・build）。 */

const isExcluded = (relDir) =>
  config.excludePaths.some((prefix) => `${relDir}/`.startsWith(prefix));

function walk(dir, hits = []) {
  if (!existsSync(dir)) return hits;
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    const rel = relative(ROOT, full);
    if (statSync(full).isDirectory()) {
      if (isExcluded(rel)) continue;
      walk(full, hits);
    } else if (name.endsWith('.md')) {
      hits.push(rel);
    }
  }
  return hits;
}

const documents = [...new Set(walk(ROOT))].sort();

/* ---------- --init-todo: 既存リポジトリへの導入 ---------- */

if (flag('init-todo')) {
  const todoPath = join(ROOT, config.todoFile);
  if (existsSync(todoPath)) {
    console.error(`${config.todoFile} はすでにある。上書きしない。手で消してからやり直す。`);
    process.exit(1);
  }

  const overSize = documents
    .map((doc) => ({
      path: doc,
      bytes: Buffer.byteLength(readFileSync(join(ROOT, doc), 'utf8'), 'utf8'),
    }))
    .filter(({ bytes }) => bytes > config.maxDocBytes)
    .map(({ path, bytes }) => ({
      path,
      reason: `導入時点ですでに上限超過（${bytes} バイト）。分割するかここに理由を書き直す`,
    }));

  writeFileSync(todoPath, JSON.stringify(overSize, null, 2) + '\n');
  console.log(
    `${config.todoFile} を作った（${overSize.length} 件）。\n` +
      '理由を書き直し、以後は新しく足す・書き足す文書から上限を守ること。' +
      'リストは減らす方向にだけ動かす。',
  );
  process.exit(0);
}

/* ---------- 見出しから断片を作る（GitHub と同じ規則） ---------- */

const slug = (heading) =>
  heading
    .trim()
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s_-]/gu, '')
    .trim()
    .replace(/\s+/g, '-');

/** コードブロックの中は本文ではないので、見出しもリンクも拾わない。重複検査にも使う。 */
function stripFences(text) {
  let inFence = false;
  return text
    .split('\n')
    .map((line) => {
      if (/^\s*```/.test(line)) {
        inFence = !inFence;
        return '';
      }
      return inFence ? '' : line;
    })
    .join('\n');
}

const bodies = new Map();
const fragments = new Map();

for (const doc of documents) {
  const body = stripFences(readFileSync(join(ROOT, doc), 'utf8'));
  bodies.set(doc, body);
  const ids = new Set();
  for (const [, heading] of body.matchAll(/^#{1,6}\s+(.+)$/gm)) ids.add(slug(heading));
  fragments.set(doc, ids);
}

/* ---------- 1. マークダウンリンクと断片 ---------- */

const referenced = new Set();
const referencedBy = new Map();

function noteReference(target, from) {
  const normalized = target.replace(/\/$/, '');
  if (!documents.includes(normalized)) return;
  referenced.add(normalized);
  if (!referencedBy.has(normalized)) referencedBy.set(normalized, new Set());
  referencedBy.get(normalized).add(from);
}

for (const doc of documents) {
  const from = dirname(join(ROOT, doc));

  for (const [, target] of bodies.get(doc).matchAll(/\[[^\]]*\]\(([^)\s]+)\)/g)) {
    if (/^(https?:|mailto:|tel:)/.test(target)) continue;

    const [path, fragment] = target.split('#');

    if (path === '') {
      if (fragment && !fragments.get(doc).has(fragment.toLowerCase())) {
        fail('fragment', doc, target, `この文書に見出し「${fragment}」がない`);
      }
      continue;
    }

    const full = resolve(from, path);
    if (!existsSync(full)) {
      fail('link', doc, target, '飛び先のファイルがない');
      continue;
    }
    noteReference(relative(ROOT, full), doc);

    if (!fragment) continue;
    const targetDoc = relative(ROOT, full);
    if (!fragments.has(targetDoc)) continue;
    if (!fragments.get(targetDoc).has(fragment.toLowerCase())) {
      fail('fragment', doc, target, `${targetDoc} に見出し「${fragment}」がない`);
    }
  }
}

/* ---------- 2. バッククォートで書いたパス ---------- */

for (const doc of documents) {
  for (const [, token] of bodies.get(doc).matchAll(/`([^`\n]+)`/g)) {
    const path = token.trim().replace(/[、。）)]+$/, '');
    if (!config.pathRoots.some((root) => path.startsWith(root))) continue;
    if (PLACEHOLDER.test(path)) continue;

    if (!existsSync(join(ROOT, path.replace(/\/$/, '')))) {
      fail('path', doc, path, 'この場所にファイルもディレクトリもない');
      continue;
    }
    noteReference(path, doc);
  }
}

/* ---------- 3. 孤立した文書 ---------- */

const skillDoc = (doc) => {
  const prefix = `${config.skillsDir}/`;
  if (!doc.startsWith(prefix)) return null;
  const rest = doc.slice(prefix.length);
  const slash = rest.indexOf('/');
  if (slash === -1) return null;
  return [rest.slice(0, slash), rest.slice(slash + 1)];
};

for (const doc of documents) {
  if (config.entryPoints.includes(doc)) continue;

  const skill = skillDoc(doc);
  if (skill) {
    const [name, rest] = skill;
    if (rest === 'SKILL.md') continue;
    const owner = `${config.skillsDir}/${name}/SKILL.md`;
    if (referencedBy.get(doc)?.has(owner)) continue;
    fail('orphan', doc, doc, `${owner} から参照されていない（SKILL.md の目次に載せる）`);
    continue;
  }

  if (doc.startsWith(`${config.skillsDir.split('/')[0]}/`) && doc !== config.skillsDir) {
    // .claude/ 配下の SKILL.md 以外の設定ファイルなどは対象外
    if (!doc.startsWith(config.docsDir)) continue;
  }
  if (referenced.has(doc)) continue;
  fail('orphan', doc, doc, 'どの文書からも参照されていない（README か関連する文書から指す）');
}

/* ---------- 4. 文書のサイズ ---------- */

for (const doc of documents) {
  const bytes = Buffer.byteLength(readFileSync(join(ROOT, doc), 'utf8'), 'utf8');
  const exempt = todo.get(doc);

  if (bytes > config.maxDocBytes && !exempt) {
    fail(
      'size',
      doc,
      doc,
      `${bytes} バイト（上限 ${config.maxDocBytes}）。話題ごとに分けて互いにリンクするか、` +
        `${config.todoFile} に理由つきで書いて明示的に借金にする`,
    );
  }

  if (exempt && bytes <= config.maxDocBytes) {
    fail(
      'stale-todo',
      config.todoFile,
      doc,
      `もう上限内に収まっている（${bytes} バイト）。${config.todoFile} から消す`,
    );
  }
}

for (const path of todo.keys()) {
  if (!documents.includes(path)) {
    fail('stale-todo', config.todoFile, path, 'この文書がもう無い。エントリを消す');
  }
}

/* ---------- 5. 文書間の重複 ---------- */

/* コピーしてから片方だけ直すと、矛盾した2つの説明が残る。同じ段落（正規化した
 * 空白を除いて完全一致）が複数の文書に出てきたら、1か所にまとめてリンクするよう促す。
 * 短い共通の言い回しまで拾うと誤検知だらけになるので、`minDuplicateChars` 未満の
 * 段落・見出し・表の行は見ない。 */

const ALLOW_MARKER = '<!-- verify-docs:allow-duplicate -->';

/** 見出し・表・意図した重複（allow-duplicate）を除いた、比較対象の段落だけを集める。 */
function collectParagraphs() {
  const hits = [];
  for (const doc of documents) {
    const blocks = bodies.get(doc).split(/\n\s*\n/);
    for (let i = 0; i < blocks.length; i++) {
      const raw = blocks[i].trim();
      if (raw === '') continue;
      if (raw.startsWith('#') || raw.startsWith('|')) continue;

      const previous = blocks[i - 1]?.trim();
      if (previous === ALLOW_MARKER) continue;

      const normalized = raw.replace(/\s+/g, ' ').trim();
      if (normalized.length < config.minDuplicateChars) continue;

      hits.push({ doc, normalized });
    }
  }
  return hits;
}

const paragraphs = config.checkDuplicates || config.checkNearDuplicates ? collectParagraphs() : [];

if (config.checkDuplicates) {
  const paragraphLocations = new Map();
  for (const { doc, normalized } of paragraphs) {
    if (!paragraphLocations.has(normalized)) paragraphLocations.set(normalized, new Set());
    paragraphLocations.get(normalized).add(doc);
  }

  for (const [paragraph, docs] of paragraphLocations) {
    if (docs.size < 2) continue;
    const [first, ...rest] = [...docs].sort();
    const snippet = paragraph.length > 50 ? `${paragraph.slice(0, 50)}…` : paragraph;
    fail(
      'duplicate',
      first,
      rest.join(', '),
      `同じ説明が重複している（「${snippet}」）。1か所にまとめて他方からリンクする。` +
        `意図した重複なら段落の前に ${ALLOW_MARKER} を置く`,
    );
  }
}

/* ---------- 5b. 準一致重複（句読点・敬体/常体レベルの表記ゆれ） ---------- */

/* 完全一致より緩めると誤検知が増えるので、既定オフ（config.checkNearDuplicates）。
 * 吸収するのは「句読点の全角/半角」と「代表的な敬体/常体の語尾」だけで、
 * 意味的な類似判定（embedding など）はしない。完全一致で既に拾える組は
 * 二重報告しない（texts.size >= 2 のときだけ「表記ゆれで一致した」とみなす）。 */

const STYLE_ENDINGS = [
  [/ではありません/g, 'ではない'],
  [/ございます/g, 'ある'],
  [/でした/g, 'だった'],
  [/でしょう/g, 'だろう'],
  [/ましょう/g, 'よう'],
  [/ません/g, 'ない'],
  [/します/g, 'する'],
  [/です/g, 'だ'],
  [/ます/g, 'る'],
];

function fuzzyNormalize(text) {
  let s = text;
  for (const [pattern, replacement] of STYLE_ENDINGS) s = s.replace(pattern, replacement);
  return s
    .replace(/[，,]/g, '、')
    .replace(/[．.]/g, '。')
    .replace(/[！!]/g, '!')
    .replace(/[？?]/g, '?')
    .replace(/\s+/g, '');
}

if (config.checkNearDuplicates) {
  const fuzzyGroups = new Map();
  for (const { doc, normalized } of paragraphs) {
    const fuzzy = fuzzyNormalize(normalized);
    if (fuzzy.length < config.minDuplicateChars) continue;

    if (!fuzzyGroups.has(fuzzy)) fuzzyGroups.set(fuzzy, { texts: new Set(), docs: new Map() });
    const group = fuzzyGroups.get(fuzzy);
    group.texts.add(normalized);
    if (!group.docs.has(doc)) group.docs.set(doc, normalized);
  }

  for (const [fuzzy, group] of fuzzyGroups) {
    if (group.docs.size < 2) continue;
    if (group.texts.size < 2) continue; // 完全一致（5.）で既に報告済み

    const [first, ...rest] = [...group.docs.keys()].sort();
    const snippet = fuzzy.length > 50 ? `${fuzzy.slice(0, 50)}…` : fuzzy;
    fail(
      'near-duplicate',
      first,
      rest.join(', '),
      `句読点・敬体/常体だけが違う、ほぼ同じ説明が複数の文書にある（正規化後: 「${snippet}」）。` +
        `1か所にまとめて他方からリンクするか、意図した表記差なら段落の前に ${ALLOW_MARKER} を置く`,
    );
  }
}

/* ---------- 報告 ---------- */

const summary = {
  documents: documents.length,
  todoEntries: todo.size,
  failures,
};

if (AS_JSON) {
  console.log(JSON.stringify(summary, null, 2));
} else {
  const label = {
    link: 'リンク切れ',
    fragment: '断片',
    path: 'パス参照',
    orphan: '孤立',
    size: 'サイズ超過',
    duplicate: '重複',
    'near-duplicate': '準一致重複',
    'stale-todo': 'TODO の掃除',
  };
  console.log(`文書 ${documents.length} 件（TODO 例外 ${todo.size} 件）を検査`);
  if (failures.length > 0) {
    console.error(`\n文書構造の検査に失敗（${failures.length}件）:`);
    for (const f of failures) {
      console.error(`  - [${label[f.kind]}] ${f.from} → ${f.target} — ${f.reason}`);
    }
  } else {
    console.log('\n文書構造: すべて通過');
  }
}

process.exit(failures.length > 0 ? 1 : 0);
