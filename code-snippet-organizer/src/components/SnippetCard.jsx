import React, { useState } from 'react';
import AddSnippet from './AddSnippet';
import { getSnippets, updateSnippets } from '../utils/storage';
import { toast } from 'react-hot-toast';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark, oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { highlightText } from '../utils/highlight';

export default function SnippetCard({ snippet, onUpdate, search, onClick, isTrashView }) {
  const [editing, setEditing] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const isDark = document.documentElement.classList.contains('dark');

  // Toggle favorite status
  const handleToggleFavorite = (e) => {
    e.stopPropagation();
    const snippets = getSnippets();
    const updatedSnippets = snippets.map(s =>
      s.id === snippet.id ? { ...s, isFavorite: !s.isFavorite } : s
    );
    updateSnippets(updatedSnippets);
    onUpdate && onUpdate();
    toast.success(!snippet.isFavorite ? 'Added to favorites' : 'Removed from favorites');
  };

  // Soft delete snippet
  const handleDelete = (e) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to move this snippet to Trash?')) {
      const snippets = getSnippets();
      const updatedSnippets = snippets.map(s =>
        s.id === snippet.id ? { ...s, deletedAt: new Date().toISOString() } : s
      );
      updateSnippets(updatedSnippets);
      onUpdate && onUpdate();
      toast.success('Snippet moved to Trash');
    }
  };

  // Highlight code if searching, otherwise use Prism
  const codePreview = search ? (
    <pre
      className="rounded bg-gray-100 dark:bg-gray-800/80 p-3 overflow-x-auto transition-all"
      style={{ fontFamily: 'monospace', fontSize: '0.95em', maxHeight: 200 }}
      dangerouslySetInnerHTML={{ __html: highlightText(snippet.code, search) }}
    />
  ) : (
    <SyntaxHighlighter
      language={snippet.language?.toLowerCase() || 'javascript'}
      style={isDark ? oneDark : oneLight}
      customStyle={{
        borderRadius: '0.5rem',
        fontSize: '0.95em',
        maxHeight: 200,
        overflowX: 'auto',
        background: isDark ? 'rgba(31, 41, 55, 0.8)' : 'rgba(243, 244, 246, 0.8)',
        margin: 0
      }}
    >
      {snippet.code}
    </SyntaxHighlighter>
  );

  return (
    <>
      <div
        className={`border border-gray-200 dark:border-gray-600 p-4 mb-4 bg-white dark:bg-gray-800 rounded-lg cursor-pointer transition-all 
          ${isHovered ? 'shadow-md dark:shadow-gray-900/50 transform hover:-translate-y-0.5' : 'shadow-sm'}`}
        onClick={onClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        tabIndex={0}
        role="button"
        onKeyDown={e => { if (e.key === 'Enter') onClick(); }}
      >
        <div className="flex justify-between items-center">
          <h3 className="font-bold text-lg text-gray-800 dark:text-white truncate max-w-[80%]">
            {snippet.title}
          </h3>
          {!isTrashView && (
            <button
              onClick={handleToggleFavorite}
              aria-label={snippet.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
              className={`p-1 rounded-full transition-colors ${snippet.isFavorite ? 'text-yellow-400' : 'text-gray-400 hover:text-yellow-400'}`}
            >
              {snippet.isFavorite ? (
                <span className="text-2xl">★</span>
              ) : (
                <span className="text-2xl">☆</span>
              )}
            </button>
          )}
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          {snippet.language || 'Plain text'}
        </p>
        <div className="mt-3 rounded-lg overflow-hidden">
          {codePreview}
        </div>
        <div className="mt-3 flex flex-wrap gap-2 min-h-8">
          {snippet.tags?.length > 0 ? (
            snippet.tags.map(tag => (
              <span
                key={tag}
                className="bg-green-100 dark:bg-green-900/60 text-green-800 dark:text-green-200 rounded-full px-3 py-1 text-xs font-medium"
              >
                {tag}
              </span>
            ))
          ) : (
            <span className="text-xs text-gray-400 dark:text-gray-500 italic">No tags</span>
          )}
        </div>
        {!isTrashView && (
          <div className="flex gap-2 mt-3">
            <button
              className="px-3 py-1.5 bg-yellow-400 hover:bg-yellow-500 text-gray-800 rounded-md text-sm font-medium transition-colors"
              onClick={e => { e.stopPropagation(); setEditing(true); }}
            >
              Edit
            </button>
            <button
              className="px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white rounded-md text-sm font-medium transition-colors"
              onClick={handleDelete}
            >
              Delete
            </button>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {editing && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <AddSnippet
              editSnippet={snippet}
              onClose={() => setEditing(false)}
              onSave={() => {
                setEditing(false);
                onUpdate && onUpdate();
                toast.success('Snippet updated');
              }}
            />
          </div>
        </div>
      )}
    </>
  );
}