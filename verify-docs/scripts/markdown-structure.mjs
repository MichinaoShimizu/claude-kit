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

export function sourcePosition(node) {
  const [[startLine, startColumn], [endLine, endColumn]] = node.sourcepos;
  return {
    start: { line: startLine, column: startColumn },
    end: { line: endLine, column: endColumn },
  };
}

export function extractProseBlocks(source) {
  const tree = parseMarkdown(source);
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
      headings.push({ level: node.level, text });
      outline.push({ level: node.level, text, sourcepos: sourcePosition(node) });
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
    blocks.push({
      type: 'paragraph',
      headingPath: headings.map(({ text: heading }) => heading),
      sourcepos: position,
      bytes: Buffer.byteLength(sourceText, 'utf8'),
      text,
      source: sourceText,
    });
  }

  return {
    bytes: Buffer.byteLength(source, 'utf8'),
    headings: outline,
    blocks,
  };
}
