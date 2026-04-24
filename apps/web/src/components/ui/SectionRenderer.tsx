'use client';
import type { SectionBlock } from '@aws-prep/content';
import { theme, baseFont, mono, slate900 } from '@/lib/theme';

interface SectionRendererProps {
  blocks: SectionBlock[];
  dark: boolean;
}

// Inline markdown: **bold**, *italic*, `code`, [text](url)
function renderInline(text: string, t: ReturnType<typeof theme>): React.ReactNode[] {
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`|\[[^\]]+\]\([^)]+\))/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i} style={{ color: t.text, fontWeight: 700 }}>{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith('*') && part.endsWith('*')) {
      return <em key={i}>{part.slice(1, -1)}</em>;
    }
    if (part.startsWith('`') && part.endsWith('`')) {
      return (
        <code key={i} style={{
          fontFamily: mono, fontSize: '0.88em', padding: '1px 5px', borderRadius: 4,
          background: t.bg2, color: t.accent,
        }}>
          {part.slice(1, -1)}
        </code>
      );
    }
    const linkMatch = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (linkMatch) {
      const [, label, href] = linkMatch;
      // Skip anchor-only links (TOC self-links)
      if (href.startsWith('#')) return <span key={i} style={{ color: t.textMuted }}>{label}</span>;
      return <a key={i} href={href} target="_blank" rel="noopener noreferrer" style={{ color: t.accent, textDecoration: 'underline' }}>{label}</a>;
    }
    return part;
  });
}

function isTocList(items: string[]): boolean {
  return items.length > 0 && items.every(item => /^\[.*\]\(#.*\)$/.test(item.trim()));
}

export function SectionRenderer({ blocks, dark }: SectionRendererProps) {
  const t = theme(dark);

  return (
    <div>
      {blocks.map((block, idx) => {
        switch (block.type) {
          case 'heading': {
            const isH2 = block.level === 2;
            return (
              <div
                key={idx}
                id={`block-${idx}`}
                style={{
                  fontSize: isH2 ? 18 : 15,
                  fontWeight: isH2 ? 700 : 600,
                  margin: isH2 ? '28px 0 8px' : '20px 0 6px',
                  letterSpacing: isH2 ? -0.3 : -0.1,
                  color: t.text,
                  fontFamily: baseFont,
                }}
              >
                {renderInline(block.text, t)}
              </div>
            );
          }

          case 'paragraph':
            return (
              <p key={idx} style={{
                fontSize: 14, lineHeight: 1.7, color: t.textMuted,
                margin: '0 0 12px', fontFamily: baseFont,
              }}>
                {renderInline(block.text, t)}
              </p>
            );

          case 'code':
            return (
              <pre key={idx} style={{
                margin: '10px 0 14px', padding: '14px 16px', borderRadius: 12,
                background: dark ? '#0B1120' : slate900, color: '#E2E8F0',
                fontFamily: mono, fontSize: 12, lineHeight: 1.6,
                overflow: 'auto', border: `1px solid ${t.border}`,
                whiteSpace: 'pre-wrap', wordBreak: 'break-word',
              }}>
                {block.text}
              </pre>
            );

          case 'list': {
            if (isTocList(block.items)) return null;
            const Tag = block.ordered ? 'ol' : 'ul';
            return (
              <Tag key={idx} style={{
                margin: '4px 0 12px', paddingLeft: 20,
                fontSize: 14, lineHeight: 1.7, color: t.textMuted,
                fontFamily: baseFont,
              }}>
                {block.items.map((item, j) => (
                  <li key={j} style={{ marginBottom: 3 }}>
                    {renderInline(item, t)}
                  </li>
                ))}
              </Tag>
            );
          }

          case 'blockquote':
            return (
              <div key={idx} style={{
                margin: '10px 0 14px', padding: '12px 14px 12px 16px',
                borderLeft: `4px solid ${t.accent}`,
                background: t.accentSoft, borderRadius: '0 10px 10px 0',
                fontSize: 14, lineHeight: 1.65, color: t.text,
                fontFamily: baseFont,
              }}>
                {renderInline(block.text, t)}
              </div>
            );

          default:
            return null;
        }
      })}
    </div>
  );
}
