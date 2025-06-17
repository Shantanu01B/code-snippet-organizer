import React, { useState, useEffect, useCallback } from 'react';
import Editor from '@monaco-editor/react';
import { getSnippets, updateSnippets } from '../utils/storage';
import { toast } from 'react-hot-toast';

const supportedLanguages = [
  'javascript', 'typescript', 'python', 'java', 'c', 'cpp', 'csharp', 'ruby',
  'go', 'php', 'swift', 'kotlin', 'rust', 'scala', 'shell', 'json', 'html', 'css', 'markdown',
];

export default function AddSnippet({ onClose, onSave, editSnippet }) {
  const draftKey = editSnippet ? `snippet-draft-${editSnippet.id}` : 'snippet-draft-new';

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [tags, setTags] = useState([]);
  const [code, setCode] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [showRestorePrompt, setShowRestorePrompt] = useState(false);
  const [tagSuggestions, setTagSuggestions] = useState([]);

  // Gather all tags from all snippets for suggestions
  const allTags = Array.from(
    new Set(getSnippets().flatMap(s => s.tags || []))
  );

  useEffect(() => {
    const draft = localStorage.getItem(draftKey);
    if (draft) {
      setShowRestorePrompt(true);
    } else if (editSnippet) {
      setTitle(editSnippet.title);
      setDescription(editSnippet.description);
      setLanguage(editSnippet.language);
      setTags(editSnippet.tags);
      setCode(editSnippet.code);
    }
  }, [draftKey, editSnippet]);

  const restoreDraft = () => {
    const draft = JSON.parse(localStorage.getItem(draftKey));
    if (draft) {
      setTitle(draft.title || '');
      setDescription(draft.description || '');
      setLanguage(draft.language || 'javascript');
      setTags(draft.tags || []);
      setCode(draft.code || '');
    }
    setShowRestorePrompt(false);
    toast.success('Draft restored');
  };

  const discardDraft = () => {
    localStorage.removeItem(draftKey);
    setShowRestorePrompt(false);
    if (editSnippet) {
      setTitle(editSnippet.title);
      setDescription(editSnippet.description);
      setLanguage(editSnippet.language);
      setTags(editSnippet.tags);
      setCode(editSnippet.code);
    } else {
      setTitle('');
      setDescription('');
      setLanguage('javascript');
      setTags([]);
      setCode('');
    }
  };

  useEffect(() => {
    const draft = { title, description, language, tags, code };
    localStorage.setItem(draftKey, JSON.stringify(draft));
  }, [title, description, language, tags, code, draftKey]);

  // Tag input with suggestions
  useEffect(() => {
    if (tagInput) {
      setTagSuggestions(
        allTags.filter(
          tag =>
            tag.toLowerCase().includes(tagInput.toLowerCase()) &&
            !tags.includes(tag)
        )
      );
    } else {
      setTagSuggestions([]);
    }
  }, [tagInput, allTags, tags]);

  const handleTagInputKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const newTag = tagInput.trim();
      if (newTag && !tags.includes(newTag)) {
        setTags([...tags, newTag]);
      }
      setTagInput('');
      setTagSuggestions([]);
    }
    if (e.key === 'Backspace' && !tagInput && tags.length) {
      setTags(tags.slice(0, -1));
    }
  };

  const handleTagSuggestionClick = (suggestion) => {
    if (!tags.includes(suggestion)) {
      setTags([...tags, suggestion]);
    }
    setTagInput('');
    setTagSuggestions([]);
  };

  const removeTag = (tagToRemove) => {
    setTags(tags.filter(t => t !== tagToRemove));
  };

  const handleSave = useCallback(() => {
    if (!title.trim()) {
      toast.error('Title is required');
      return;
    }
    if (!code.trim()) {
      toast.error('Code cannot be empty');
      return;
    }
    const snippets = getSnippets();
    if (editSnippet) {
      const updatedSnippets = snippets.map(s => {
        if (s.id === editSnippet.id) {
          const { versions = [], ...prev } = s;
          const prevVersion = {
            ...prev,
            savedAt: s.updatedAt || s.createdAt,
          };
          return {
            ...s,
            title: title.trim(),
            description: description.trim(),
            language,
            tags,
            code,
            updatedAt: new Date().toISOString(),
            versions: [prevVersion, ...(s.versions || [])],
          };
        }
        return s;
      });
      updateSnippets(updatedSnippets);
      toast.success('Snippet updated');
    } else {
      const newSnippet = {
        id: Date.now().toString(),
        title: title.trim(),
        description: description.trim(),
        language,
        tags,
        code,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isFavorite: false,
        deletedAt: null,
        versions: [],
      };
      updateSnippets([newSnippet, ...snippets]);
      toast.success('Snippet added');
    }
    localStorage.removeItem(draftKey);
    onSave && onSave();
    onClose && onClose();
  }, [title, description, language, tags, code, editSnippet, onSave, onClose, draftKey]);

  useEffect(() => {
    function handleKeyDown(e) {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
        e.preventDefault();
        handleSave();
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleSave]);

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl w-full max-w-4xl mx-4 sm:mx-8 max-h-[90vh] overflow-y-auto border border-gray-200 dark:border-gray-700">
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-gray-900 p-6 pb-4 border-b border-gray-200 dark:border-gray-700 z-10">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                {editSnippet ? 'Edit Snippet' : 'Add New Snippet'}
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {editSnippet ? 'Update your code snippet' : 'Create a new reusable code snippet'}
              </p>
            </div>
            <button
              onClick={() => {
                localStorage.removeItem(draftKey);
                onClose && onClose();
              }}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
              aria-label="Close"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="p-6 pt-4">
          {showRestorePrompt && (
            <div className="bg-yellow-50 dark:bg-yellow-900/30 p-4 rounded-lg mb-6 border border-yellow-200 dark:border-yellow-800/50 text-yellow-800 dark:text-yellow-200 shadow-sm">
              <div className="flex items-start">
                <svg className="w-5 h-5 mt-0.5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <div>
                  <h3 className="font-medium mb-2">Unsaved draft detected</h3>
                  <p className="text-sm mb-3">You have a previously saved draft for this snippet. Would you like to restore it?</p>
                  <div className="flex gap-3">
                    <button
                      onClick={restoreDraft}
                      className="px-4 py-2 text-sm rounded-md bg-yellow-500 hover:bg-yellow-600 text-white transition-colors shadow-sm"
                    >
                      Restore Draft
                    </button>
                    <button
                      onClick={discardDraft}
                      className="px-4 py-2 text-sm rounded-md bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 transition-colors"
                    >
                      Discard Draft
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" htmlFor="title">
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  id="title"
                  type="text"
                  className="w-full rounded-lg border border-gray-300 dark:border-gray-700 px-4 py-2.5 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-500 dark:focus:border-blue-500 transition-all"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="My awesome snippet"
                  autoFocus
                />
              </div>

              {/* Language */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" htmlFor="language">
                  Language
                </label>
                <select
                  id="language"
                  className="w-full rounded-lg border border-gray-300 dark:border-gray-700 px-4 py-2.5 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-500 dark:focus:border-blue-500 transition-all appearance-none"
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                >
                  {supportedLanguages.map((lang) => (
                    <option key={lang} value={lang}>
                      {lang.charAt(0).toUpperCase() + lang.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" htmlFor="description">
                Description
              </label>
              <textarea
                id="description"
                className="w-full rounded-lg border border-gray-300 dark:border-gray-700 px-4 py-2.5 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-500 dark:focus:border-blue-500 transition-all min-h-[80px]"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="What does this snippet do?"
                rows={3}
              />
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" htmlFor="tags">
                Tags
              </label>
              <div className="flex flex-wrap gap-2 mb-2">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-200"
                  >
                    {tag}
                    <button
                      type="button"
                      aria-label={`Remove tag ${tag}`}
                      onClick={() => removeTag(tag)}
                      className="ml-1.5 text-blue-600 dark:text-blue-300 hover:text-blue-800 dark:hover:text-blue-100 transition-colors"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
              <div className="relative">
                <input
                  id="tags"
                  type="text"
                  className="w-full rounded-lg border border-gray-300 dark:border-gray-700 px-4 py-2.5 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-500 dark:focus:border-blue-500 transition-all"
                  placeholder="Add tags (press Enter or comma)"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleTagInputKeyDown}
                  autoComplete="off"
                />
                {tagSuggestions.length > 0 && (
                  <ul className="absolute left-0 right-0 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-20 max-h-48 overflow-y-auto">
                    {tagSuggestions.map((suggestion) => (
                      <li
                        key={suggestion}
                        className="px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-sm"
                        onClick={() => handleTagSuggestionClick(suggestion)}
                      >
                        {suggestion}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            {/* Code Editor */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Code <span className="text-red-500">*</span>
                </label>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {language.toUpperCase()}
                </span>
              </div>
              <div className="border border-gray-300 dark:border-gray-700 rounded-lg overflow-hidden shadow-sm h-96">
                <Editor
                  height="100%"
                  defaultLanguage={language}
                  language={language}
                  value={code}
                  onChange={(value) => setCode(value || '')}
                  options={{
                    minimap: { enabled: false },
                    fontSize: 14,
                    automaticLayout: true,
                    wordWrap: 'on',
                    tabSize: 2,
                    scrollBeyondLastLine: false,
                    padding: { top: 12, bottom: 12 },
                    renderWhitespace: 'selection',
                  }}
                  theme={document.documentElement.classList.contains('dark') ? 'vs-dark' : 'light'}
                  onMount={(editor) => {
                    editor.focus();
                  }}
                />
              </div>
            </div>
          </div>

          {/* Footer with action buttons */}
          <div className="mt-8 pt-4 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-3">
            <button
              onClick={() => {
                localStorage.removeItem(draftKey);
                onClose && onClose();
              }}
              className="px-6 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors shadow-sm"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-6 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors shadow-sm flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              {editSnippet ? 'Update Snippet' : 'Save Snippet'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}