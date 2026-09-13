import { createRequire } from 'node:module';

const commonmark = createRequire(import.meta.url)('./vendor/commonmark.cjs');

function maskFrontMatter(source) {
  return source.replace(/^---[ \t]*\r?\n[\s\S]*?^(?:---|\.\.\.)[ \t]*(?:\r?\n|$)/m, (block) =>
    block.replace(/[^\r\n]/g, ' '),
  );
}

export function parseMarkdown(source) {
  return new commonmark.Parser().parse(maskFrontMatter(source));
}

export function markdownText(node) {
  let text = '';
  for (let child = node.firstChild; child; child = child.next) {
    if (child.type === 'text' || child.type === 'code') text += child.literal ?? '';
    else if (child.type === 'softbreak' || child.type === 'linebreak') text += ' ';
    else if (child.type !== 'html_inline' && child.firstChild) text += markdownText(child);
  }
  return text;
}

export function markdownInlineSignature(node) {
  const signature = [];
  const stack = [node];
  while (stack.length) {
    const current = stack.pop();
    if (current.type === 'code') signature.push(['code', current.literal ?? '']);
    else if (current.type === 'link' || current.type === 'image') {
      signature.push([current.type, current.destination ?? '', current.title ?? '']);
    }
    const children = [];
    for (let child = current.firstChild; child; child = child.next) children.push(child);
    stack.push(...children.reverse());
  }
  return JSON.stringify(signature);
}

export function sourcePosition(node) {
  const [[startLine, startColumn], [endLine, endColumn]] = node.sourcepos;
  return {
    start: { line: startLine, column: startColumn },
    end: { line: endLine, column: endColumn },
  };
}

export function extractProseBlocks(
  source,
  { includeSignatures = false, tree = parseMarkdown(source) } = {},
) {
  const lineStarts = [0];
  for (let index = 0; index < source.length; index++) {
    if (source[index] === '\n') lineStarts.push(index + 1);
  }

  const headings = [];
  const outline = [];
  const blocks = [];
  const walker = tree.walker();
  let event;
  while ((event = walker.next())) {
    const node = event.node;
    if (!event.entering) continue;

    if (node.type === 'heading') {
      const text = markdownText(node).replace(/\s+/g, ' ').trim();
      while (headings.length && headings.at(-1).level >= node.level) headings.pop();
      const activeHeading = { level: node.level, text };
      headings.push(activeHeading);
      const heading = {
        level: node.level,
        text,
        headingPath: headings.map(({ text: heading }) => heading),
        sourcepos: sourcePosition(node),
        paragraphCount: 0,
      };
      activeHeading.outline = heading;
      outline.push(heading);
      continue;
    }

    if (node.type !== 'paragraph') continue;
    const text = markdownText(node).replace(/\s+/g, ' ').trim();
    if (!text) continue;

    const position = sourcePosition(node);
    const startOffset = lineStarts[position.start.line - 1];
    const nextLineStart = lineStarts[position.end.line];
    const endOffset = nextLineStart === undefined ? source.length : nextLineStart - 1;
    const sourceText = source.slice(startOffset, endOffset);
    const block = {
      type: 'paragraph',
      headingPath: headings.map(({ text: heading }) => heading),
      sourcepos: position,
      bytes: Buffer.byteLength(sourceText, 'utf8'),
      text,
      source: sourceText,
    };
    if (includeSignatures) block.signature = markdownInlineSignature(node);
    blocks.push(block);
    // Paragraph counts include descendants, and Markdown heading depth is at most six.
    for (const heading of headings) heading.outline.paragraphCount++;
  }

  for (let index = 0; index < outline.length; index++) {
    const heading = outline[index];
    let nextSection = index + 1;
    while (nextSection < outline.length && outline[nextSection].level > heading.level) nextSection++;
    const endLine = outline[nextSection]?.sourcepos.start.line ?? Number.POSITIVE_INFINITY;
    const startOffset = lineStarts[heading.sourcepos.start.line - 1];
    const endOffset = Number.isFinite(endLine) ? lineStarts[endLine - 1] : source.length;
    heading.bytes = Buffer.byteLength(source.slice(startOffset, endOffset), 'utf8');
    heading.endLine = Number.isFinite(endLine)
      ? endLine - 1
      : source.split(/\r?\n/).length;
  }

  return {
    bytes: Buffer.byteLength(source, 'utf8'),
    headings: outline,
    blocks,
  };
}
