import React from 'react';
import { getSnippets, updateSnippets } from '../utils/storage';
import { toast } from 'react-hot-toast';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark, oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';

export default function TrashList({ snippets, refreshSnippets }) {
  const isDark = document.documentElement.classList.contains('dark');

  const handleRestore = (id) => {
    const allSnippets = getSnippets().map(s =>
      s.id === id ? { ...s, deletedAt: null } : s
    );
    updateSnippets(allSnippets);
    refreshSnippets();
    toast.success('Snippet restored successfully', {
      icon: '♻️',
      style: {
        background: isDark ? '#1e293b' : '#ecfdf5',
        color: isDark ? '#fff' : '#065f46',
      }
    });
  };

  const handlePermanentDelete = (id) => {
    if (!window.confirm('Are you sure you want to permanently delete this snippet? This action cannot be undone.')) return;

    const allSnippets = getSnippets().filter(s => s.id !== id);
    updateSnippets(allSnippets);
    refreshSnippets();
    toast.success('Snippet permanently deleted', {
      icon: '🗑️',
      style: {
        background: isDark ? '#1e293b' : '#fee2e2',
        color: isDark ? '#fff' : '#b91c1c',
      }
    });
  };

  if (snippets.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <svg className="w-16 h-16 text-gray-400 dark:text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
        <p className="text-gray-500 dark:text-gray-400 text-lg">Your trash is empty</p>
        <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">Deleted snippets will appear here</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold flex items-center">
          <svg className="w-6 h-6 mr-2 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
          Trash Bin
        </h2>
        <span className="text-sm bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-200 px-3 py-1 rounded-full">
          {snippets.length} {snippets.length === 1 ? 'item' : 'items'}
        </span>
      </div>

      <div className="grid gap-4">
        {snippets.map(snippet => (
          <div 
            key={snippet.id} 
            className="border border-red-200 dark:border-red-900/50 p-4 rounded-lg bg-gradient-to-br from-red-50/50 to-red-100/30 dark:from-red-900/20 dark:to-red-900/30 shadow-sm hover:shadow-md transition-shadow duration-200"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-bold text-lg text-gray-800 dark:text-gray-100">{snippet.title}</h3>
                <span className="inline-block px-2 py-0.5 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full mt-1">
                  {snippet.language}
                </span>
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                Deleted: {new Date(snippet.deletedAt).toLocaleString()}
              </div>
            </div>

            <div className="mt-3 relative group">
              <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-gray-900 to-transparent opacity-90 group-hover:opacity-0 transition-opacity duration-300 pointer-events-none rounded-b-lg z-10" />
              <SyntaxHighlighter
                language={snippet.language?.toLowerCase() || 'javascript'}
                style={isDark ? oneDark : oneLight}
                customStyle={{
                  borderRadius: '0.5rem',
                  fontSize: '0.9em',
                  maxHeight: 300,
                  overflowX: 'auto',
                  background: 'inherit',
                  margin: 0,
                  padding: '1rem',
                  opacity: 0.9,
                }}
                showLineNumbers
              >
                {snippet.code}
              </SyntaxHighlighter>
            </div>

            {snippet.tags.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-1">
                {snippet.tags.map(tag => (
                  <span 
                    key={tag} 
                    className="px-2 py-0.5 text-xs bg-gray-200/50 dark:bg-gray-700/50 text-gray-700 dark:text-gray-300 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            <div className="flex justify-end gap-3 mt-4">
              <button
                className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-md text-sm font-medium transition-colors duration-200 flex items-center"
                onClick={() => handleRestore(snippet.id)}
              >
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Restore
              </button>
              <button
                className="px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white rounded-md text-sm font-medium transition-colors duration-200 flex items-center"
                onClick={() => handlePermanentDelete(snippet.id)}
              >
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Delete Permanently
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}