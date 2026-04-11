"use client";
import React, { useState, useRef, useEffect } from "react";

interface Highlight {
  id: string;
  text: string;
  color: string;
  paragraphKey: string;
  charIndex: number; // Unique position in the text
}

interface TextHighlighterProps {
  content: any[];
  onHighlightChange?: (highlights: Highlight[]) => void;
}

const TextHighlighter: React.FC<TextHighlighterProps> = ({
  content,
  onHighlightChange,
}) => {
  const [highlights, setHighlights] = useState<Highlight[]>([]);
  const [selectedColor] = useState<string>("bg-yellow-200");
  const [showToolbar, setShowToolbar] = useState(false);
  const [toolbarPosition, setToolbarPosition] = useState({ x: 0, y: 0 });
  const [selectedText, setSelectedText] = useState("");
  const [pendingSelection, setPendingSelection] = useState<{
    paragraphKey: string;
    startChar: number;
    endChar: number;
  } | null>(null);
  const [isClient, setIsClient] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (onHighlightChange) {
      onHighlightChange(highlights);
    }
  }, [highlights, onHighlightChange]);

  const handleTextSelection = () => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) {
      setShowToolbar(false);
      setPendingSelection(null);
      return;
    }

    const selectedText = selection.toString().trim();
    if (selectedText.length === 0) {
      setShowToolbar(false);
      setPendingSelection(null);
      return;
    }

    const range = selection.getRangeAt(0);

    // Find paragraph key by looking at data attributes
    let paragraphKey: string | null = null;
    let startNode: Node | null = range.startContainer;

    while (startNode && startNode !== contentRef.current) {
      if (startNode.nodeType === Node.ELEMENT_NODE) {
        const el = startNode as HTMLElement;
        const key = el.getAttribute("data-para-key");
        if (key) {
          paragraphKey = key;
          break;
        }
      }
      startNode = startNode.parentNode;
    }

    if (!paragraphKey) {
      setShowToolbar(false);
      setPendingSelection(null);
      return;
    }

    // Find all character spans in this paragraph
    const paraElement = contentRef.current?.querySelector(
      `[data-para-key="${paragraphKey}"]`
    );
    if (!paraElement) {
      setShowToolbar(false);
      setPendingSelection(null);
      return;
    }

    // Get all char spans
    const charSpans = Array.from(
      paraElement.querySelectorAll("[data-char-index]")
    );

    // Find start and end character indices
    let startChar = -1;
    let endChar = -1;

    charSpans.forEach((span) => {
      const spanNode = span.firstChild;
      if (!spanNode) return;

      if (range.intersectsNode(span)) {
        const charIndex = parseInt(
          span.getAttribute("data-char-index") || "-1",
          10
        );

        if (startChar === -1) {
          startChar = charIndex;
        }
        endChar = charIndex + 1;
      }
    });

    if (startChar === -1 || endChar === -1) {
      setShowToolbar(false);
      setPendingSelection(null);
      return;
    }

    setPendingSelection({
      paragraphKey,
      startChar,
      endChar,
    });

    setSelectedText(selectedText);

    const rect = range.getBoundingClientRect();
    const toolbarWidth = 300;
    const toolbarHeight = 50;

    let x = rect.left + rect.width / 2;
    let y = rect.top - toolbarHeight - 10;

    if (x < toolbarWidth / 2) {
      x = toolbarWidth / 2;
    } else if (x > window.innerWidth - toolbarWidth / 2) {
      x = window.innerWidth - toolbarWidth / 2;
    }

    if (y < 10) {
      y = rect.bottom + 10;
    }

    setToolbarPosition({ x, y });
    setShowToolbar(true);
  };

  const addHighlight = () => {
    if (!pendingSelection) return;

    const { paragraphKey, startChar, endChar } = pendingSelection;

    // Add highlights for each character in the range
    const newHighlights: Highlight[] = [];

    for (let i = startChar; i < endChar; i++) {
      // Check if this character is already highlighted
      const alreadyHighlighted = highlights.some(
        (h) => h.paragraphKey === paragraphKey && h.charIndex === i
      );

      if (!alreadyHighlighted) {
        newHighlights.push({
          id: `highlight-${Date.now()}-${i}-${Math.random()
            .toString(36)
            .substr(2, 9)}`,
          text: selectedText,
          color: selectedColor,
          paragraphKey,
          charIndex: i,
        });
      }
    }

    if (newHighlights.length > 0) {
      setHighlights((prev) => [...prev, ...newHighlights]);
    }

    setShowToolbar(false);
    setPendingSelection(null);

    const selection = window.getSelection();
    if (selection) {
      selection.removeAllRanges();
    }
  };

  const removeHighlight = (paragraphKey: string, startCharIndex: number) => {
    // Find all highlights that are part of the same continuous highlight group
    const highlightsInPara = highlights.filter(
      (h) => h.paragraphKey === paragraphKey
    );

    // Find the continuous group containing this character
    const toRemove = new Set<number>();
    const visited = new Set<number>();

    const findConnectedHighlights = (charIndex: number) => {
      if (visited.has(charIndex)) return;
      visited.add(charIndex);

      const highlight = highlightsInPara.find((h) => h.charIndex === charIndex);
      if (!highlight) return;

      toRemove.add(charIndex);

      // Check adjacent characters
      findConnectedHighlights(charIndex - 1);
      findConnectedHighlights(charIndex + 1);
    };

    findConnectedHighlights(startCharIndex);

    // Remove all highlights in the connected group
    setHighlights((prev) =>
      prev.filter(
        (h) => !(h.paragraphKey === paragraphKey && toRemove.has(h.charIndex))
      )
    );
  };

  const clearAllHighlights = () => {
    setHighlights([]);
  };

  const isCharHighlighted = (
    paragraphKey: string,
    charIndex: number
  ): boolean => {
    return highlights.some(
      (h) => h.paragraphKey === paragraphKey && h.charIndex === charIndex
    );
  };

  const renderTextWithHighlights = (text: string, paragraphKey: string) => {
    return text.split("").map((char, index) => {
      const isHighlighted = isCharHighlighted(paragraphKey, index);

      return (
        <span
          key={`${paragraphKey}-${index}`}
          data-char-index={index}
          className={
            isHighlighted ? `${selectedColor} cursor-pointer group` : ""
          }
          onClick={() => {
            if (isHighlighted) {
              removeHighlight(paragraphKey, index);
            }
          }}
          title={isHighlighted ? "Click to remove highlight" : undefined}
        >
          {char}
        </span>
      );
    });
  };

  const renderContent = () => {
    return content.map((p, paragraphIndex) => {
      if (typeof p === "object") {
        return Object.entries(p).map(([key, value]) => {
          const paragraphText = value as string;
          const paragraphKey = `${paragraphIndex}-${key}`;

          return (
            <p key={paragraphKey} className="relative mb-4">
              <span className="font-bold">{key}.</span>{" "}
              <span data-para-key={paragraphKey}>
                {isClient
                  ? renderTextWithHighlights(paragraphText, paragraphKey)
                  : paragraphText}
              </span>
            </p>
          );
        });
      } else {
        const paragraphText = p as string;
        const paragraphKey = `${paragraphIndex}`;

        return (
          <p key={paragraphIndex} className="relative mb-4">
            <span data-para-key={paragraphKey}>
              {isClient
                ? renderTextWithHighlights(paragraphText, paragraphKey)
                : paragraphText}
            </span>
          </p>
        );
      }
    });
  };

  return (
    <div className="relative">
      {!isClient && (
        <div className="prose max-w-none space-y-4">
          {content.map((p, paragraphIndex) => {
            if (typeof p === "object") {
              return Object.entries(p).map(([key, value]) => (
                <p key={`${paragraphIndex}-${key}`} className="relative">
                  <span className="font-bold">{key}.</span> {value as string}
                </p>
              ));
            } else {
              return (
                <p key={paragraphIndex} className="relative">
                  {p as string}
                </p>
              );
            }
          })}
        </div>
      )}

      {isClient && (
        <>
          {showToolbar && (
            <div
              className="fixed z-50 bg-white border border-gray-300 rounded-lg shadow-xl p-3 flex items-center gap-3 animate-in fade-in duration-200"
              style={{
                left: `${toolbarPosition.x}px`,
                top: `${toolbarPosition.y}px`,
                transform: "translateX(-50%)",
              }}
            >
              <button
                type="button"
                onClick={addHighlight}
                className="px-4 py-2 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600 transition-colors duration-200 font-medium flex items-center gap-2"
              >
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z"
                    clipRule="evenodd"
                  />
                </svg>
                Highlight
              </button>
              {/* <span
                className="text-sm text-gray-600 max-w-[150px] truncate"
                title={selectedText}
              >
                {selectedText}
              </span> */}
              <button
                type="button"
                onClick={() => {
                  setShowToolbar(false);
                  setPendingSelection(null);
                }}
                className="px-3 py-2 bg-gray-500 text-white text-sm rounded-lg hover:bg-gray-600 transition-colors duration-200"
                title="Cancel (Esc)"
              >
                ×
              </button>
            </div>
          )}

          <div
            ref={contentRef}
            className="prose max-w-none space-y-4 select-text"
            onMouseUp={handleTextSelection}
          >
            {renderContent()}
          </div>

          {highlights.length > 0 && (
            <div className="mt-4 flex justify-end">
              <button
                type="button"
                onClick={clearAllHighlights}
                className="px-4 py-2 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600 transition-colors duration-200"
              >
                Clear All Highlights ({highlights.length})
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default TextHighlighter;
