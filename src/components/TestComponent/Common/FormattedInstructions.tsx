import React from "react";

type FormattedInstructionsProps = {
  instructions?: string;
  className?: string;
};

// Render instructions with preserved line breaks and two-column rules formatting.
// It detects rows like "TRUE\tif ..." and splits into a label and description.
const FormattedInstructions: React.FC<FormattedInstructionsProps> = ({
  instructions,
  className,
}) => {
  if (!instructions || typeof instructions !== "string") {
    return null;
  }

  // Normalize line endings and trim leading/trailing blank lines
  const lines = instructions
    .replace(/\r\n/g, "\n")
    .split("\n")
    .map((l) => l.trimEnd());

  // Inline formatter: supports [b]...[/b] for bold, [i]...[/i] for italic, [h]...[/h] for larger bold text,
  // [bi]...[/bi] for bold+italic, and nested tags like [b][i]...[/i][/b]
  const renderInline = (text: string) => {
    if (!text) return text;
    
    let globalKeyCounter = 0;
    
    // Recursive function to parse and apply formatting
    const parseFormatting = (str: string, depth: number = 0): Array<string | React.ReactNode> => {
      if (depth > 10) return [str]; // Prevent infinite recursion
      
      const parts: Array<string | React.ReactNode> = [];
      // Match [b]...[/b], [i]...[/i], [h]...[/h], and [bi]...[/bi] tags
      // Also handles nested tags
      const regex = /\[([bih]+)\]([\s\S]*?)\[\/\1\]/g;
      let lastIndex = 0;
      let match: RegExpExecArray | null;
      
      while ((match = regex.exec(str)) !== null) {
        if (match.index > lastIndex) {
          // Add plain text before the tag
          const beforeText = str.slice(lastIndex, match.index);
          parts.push(...parseFormatting(beforeText, depth + 1));
        }
        
        const tags = match[1]; // 'b', 'i', 'h', 'bi', 'ib', etc.
        const content = match[2];
        
        // Recursively parse content inside tags (handles nested formatting)
        const parsedContent = parseFormatting(content, depth + 1);
        
        // Generate unique key
        const uniqueKey = `fmt-${depth}-${globalKeyCounter++}`;
        
        // Apply formatting based on tags
        let element: React.ReactNode = parsedContent;
        if (tags.includes('h')) {
          element = <strong key={`${uniqueKey}-h`} className="text-lg font-bold">{parsedContent}</strong>;
        } else {
          // Apply bold and italic - order matters for nesting
          if (tags.includes('b') || tags.includes('bi')) {
            element = <strong key={`${uniqueKey}-b`}>{element}</strong>;
          }
          if (tags.includes('i') || tags.includes('bi')) {
            element = <em key={`${uniqueKey}-i`}>{element}</em>;
          }
        }
        
        parts.push(element);
        lastIndex = regex.lastIndex;
      }
      
      if (lastIndex < str.length) {
        parts.push(...parseFormatting(str.slice(lastIndex), depth + 1));
      }
      
      return parts.length ? parts : [str];
    };
    
    const result = parseFormatting(text);
    return result.length === 1 && typeof result[0] === 'string' ? result[0] : result;
  };

  // Build blocks: a top free-text block and then key-value rows if detected
  const rows: Array<{ label: string; text: string } | { text: string }> = [];

  const pushRow = (label: string | null, text: string) => {
    if (label) {
      rows.push({ label, text });
    } else if (text.trim() !== "") {
      rows.push({ text });
    }
  };

  lines.forEach((raw) => {
    const line = raw.trim();
    if (!line) return;

    // Try to split on tabs first; if no tabs, split on 2+ spaces once
    let label: string | null = null;
    let text = "";

    if (line.includes("\t")) {
      const [l, ...rest] = line.split(/\t+/);
      if (rest.length) {
        label = l.trim();
        text = rest.join(" ").trim();
      }
    }

    if (!label) {
      const match = line.match(/^(\S[\S ]*?)[ ]{2,}(.*)$/);
      if (match) {
        label = match[1].trim();
        text = (match[2] || "").trim();
      }
    }

    if (label) {
      pushRow(label, text);
    } else {
      pushRow(null, line);
    }
  });

  // Separate the leading free-text (no label) paragraphs from labeled rows
  const firstLabeledIndex = rows.findIndex((r: any) => r.label);
  const preface = firstLabeledIndex === -1 ? rows : rows.slice(0, firstLabeledIndex);
  const labeled = firstLabeledIndex === -1 ? [] : (rows.slice(firstLabeledIndex) as Array<{label: string; text: string}>);

  return (
    <div className={className}>
      {preface.length > 0 && (
        <div className="whitespace-pre-line text-gray-700 text-sm mb-2">
          {preface.map((p, idx) => (
            <p key={idx} className={idx > 0 ? "mt-1" : undefined}>
              {"text" in p ? renderInline(p.text) : ""}
            </p>
          ))}
        </div>
      )}

      {labeled.length > 0 && (
        <div className="grid grid-cols-1 gap-1 sm:grid-cols-[140px_minmax(0,1fr)] text-sm">
          {labeled.map((r, idx) => (
            <React.Fragment key={`${r.label}-${idx}`}>
              <div className="font-bold uppercase tracking-wide text-gray-900">
                {renderInline(r.label)}
              </div>
              <div className="text-gray-700">{renderInline(r.text)}</div>
            </React.Fragment>
          ))}
        </div>
      )}
    </div>
  );
};

export default FormattedInstructions;


