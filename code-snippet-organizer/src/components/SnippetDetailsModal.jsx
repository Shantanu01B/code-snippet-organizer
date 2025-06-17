import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark, oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { toast } from 'react-hot-toast';
import { highlightText } from '../utils/highlight';
import SnippetHistoryModal from './SnippetHistoryModal';
import { getSnippets, updateSnippets } from '../utils/storage';

export default function SnippetDetailsModal({ snippet, onClose, search, onUpdate }) {
  const [showHistory, setShowHistory] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    const onKeyDown = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [onClose]);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = 'auto'; };
  }, []);

  const isDark = document.documentElement.classList.contains('dark');
  const highlightedCode = highlightText(snippet.code, search);

  const handleCopy = () => {
    navigator.clipboard.writeText(snippet.code)
      .then(() => {
        toast.success('Code copied to clipboard!');
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
      })
      .catch(() => toast.error('Failed to copy code.'));
  };

  const handleRestoreVersion = (version) => {
    const snippets = getSnippets();
    const updatedSnippets = snippets.map(s =>
      s.id === snippet.id
        ? {
            ...s,
            ...version,
            updatedAt: new Date().toISOString(),
            versions: [
              {
                title: s.title,
                description: s.description,
                language: s.language,
                tags: s.tags,
                code: s.code,
                savedAt: s.updatedAt || s.createdAt,
              },
              ...(s.versions || []).filter(v => v !== version),
            ],
          }
        : s
    );
    updateSnippets(updatedSnippets);
    toast.success('Version restored!');
    setShowHistory(false);
    onUpdate && onUpdate();
    onClose && onClose();
  };

  return createPortal(
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
      tabIndex={-1}
    >
      <div
        className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 pb-0 flex justify-between items-start">
          <div className="pr-4">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-1">
              {snippet.title}
            </h2>
            {snippet.description && (
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                {snippet.description}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 text-2xl font-bold transition-colors"
          >
            &times;
          </button>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 px-6 pt-4 pb-2">
          <span className="bg-blue-100 dark:bg-blue-900/60 text-blue-800 dark:text-blue-200 rounded-full px-3 py-1 text-xs font-medium">
            {snippet.language || 'Plain text'}
          </span>
          {snippet.tags?.map(tag => (
            <span
              key={tag}
              className="bg-green-100 dark:bg-green-900/60 text-green-800 dark:text-green-200 rounded-full px-3 py-1 text-xs font-medium"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Code Block */}
        <div className="flex-1 overflow-auto px-6 py-4">
          <div className="relative rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
            <SyntaxHighlighter
              language={snippet.language?.toLowerCase() || 'javascript'}
              style={isDark ? oneDark : oneLight}
              customStyle={{
                margin: 0,
                fontSize: '0.95em',
                maxHeight: '50vh',
                overflowX: 'auto',
                background: isDark ? 'rgba(31, 41, 55, 0.8)' : 'rgba(249, 250, 251, 0.8)',
              }}
            >
              {snippet.code}
            </SyntaxHighlighter>
            {search && (
              <pre
                className="absolute inset-0 pointer-events-none whitespace-pre-wrap break-words z-10"
                style={{
                  color: 'transparent',
                  background: 'transparent',
                  fontSize: '0.95em',
                  fontFamily: 'inherit',
                  margin: 0,
                  padding: '1em',
                  overflow: 'hidden',
                }}
                aria-hidden="true"
                dangerouslySetInnerHTML={{ __html: highlightedCode }}
              />
            )}
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="p-4 bg-gray-50 dark:bg-gray-700/50 border-t border-gray-200 dark:border-gray-700 flex flex-wrap gap-3 justify-end">
          <button
            onClick={handleCopy}
            className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-all ${
              isCopied
                ? 'bg-green-500 text-white'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            {isCopied ? (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Copied!
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                  <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
                </svg>
                Copy Code
              </>
            )}
          </button>
          <button
            onClick={() => setShowHistory(true)}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-600 dark:hover:bg-gray-500 text-gray-800 dark:text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
            </svg>
            History
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600/50 text-gray-800 dark:text-white rounded-lg text-sm font-medium transition-colors"
          >
            Close
          </button>
        </div>

        {showHistory && (
          <SnippetHistoryModal
            versions={snippet.versions || []}
            onRestore={handleRestoreVersion}
            onClose={() => setShowHistory(false)}
          />
        )}
      </div>
    </div>,
    document.body
  );
}