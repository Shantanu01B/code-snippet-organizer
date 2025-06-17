import React, { useState } from 'react';
import SnippetCard from '../components/SnippetCard';
import SnippetDetailsModal from '../components/SnippetDetailsModal';

export default function SnippetList({
  snippets,
  refreshSnippets,
  search,
  selectedTag,
  selectedLang,
  sortBy,
}) {
  const [selectedSnippet, setSelectedSnippet] = useState(null);

  // Only show non-deleted snippets
  let filtered = snippets.filter(s => !s.deletedAt);

  // Apply search filter
  if (search) {
    const searchLower = search.toLowerCase();
    filtered = filtered.filter(s =>
      s.title.toLowerCase().includes(searchLower) ||
      s.description.toLowerCase().includes(searchLower) ||
      s.code.toLowerCase().includes(searchLower)
    );
  }

  // Apply tag filter
  if (selectedTag) {
    filtered = filtered.filter(s => s.tags.includes(selectedTag));
  }

  // Apply language filter
  if (selectedLang) {
    filtered = filtered.filter(s => s.language === selectedLang);
  }

  // Sorting
  filtered = [...filtered]; // shallow copy before sorting
  if (sortBy === 'date') {
    filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  } else if (sortBy === 'language') {
    filtered.sort((a, b) => a.language.localeCompare(b.language));
  } else if (sortBy === 'favorites') {
    filtered.sort((a, b) => (b.isFavorite === true) - (a.isFavorite === true));
  }

  return (
    <div className="p-4 md:p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
          Your Snippets
          {filtered.length > 0 && (
            <span className="ml-2 text-sm font-normal text-gray-500 dark:text-gray-400">
              ({filtered.length} {filtered.length === 1 ? 'item' : 'items'})
            </span>
          )}
        </h2>
        
        {filtered.length > 0 && (
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Sorted by: {sortBy === 'date' ? 'Date' : sortBy === 'language' ? 'Language' : 'Favorites'}
          </div>
        )}
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-12">
          <svg className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-white">No snippets found</h3>
          <p className="mt-1 text-gray-500 dark:text-gray-400">
            {search || selectedTag || selectedLang 
              ? "Try adjusting your search or filters" 
              : "Create your first snippet to get started"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(s => (
            <SnippetCard
              key={s.id}
              snippet={s}
              onUpdate={refreshSnippets}
              search={search}
              onClick={() => setSelectedSnippet(s)}
            />
          ))}
        </div>
      )}

      {selectedSnippet && (
        <SnippetDetailsModal
          snippet={selectedSnippet}
          onClose={() => setSelectedSnippet(null)}
          search={search}
          onUpdate={refreshSnippets}
        />
      )}
    </div>
  );
}