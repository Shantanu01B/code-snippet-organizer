import React, { useMemo, useState } from 'react';

export default function Sidebar({
  snippets,
  selectedTag,
  setSelectedTag,
  selectedLang,
  setSelectedLang,
}) {
  const [open, setOpen] = useState(false);

  const tags = useMemo(() => {
    const tagSet = new Set();
    snippets.forEach(snippet => snippet.tags.forEach(tag => tagSet.add(tag)));
    return Array.from(tagSet).sort();
  }, [snippets]);

  const languages = useMemo(() => {
    const langSet = new Set();
    snippets.forEach(snippet => langSet.add(snippet.language));
    return Array.from(langSet).sort();
  }, [snippets]);

  return (
    <>
      {/* Mobile toggle button */}
      <button
        className="md:hidden fixed z-30 bottom-6 right-6 p-3 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-full shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75"
        onClick={() => setOpen(!open)}
        aria-label="Toggle Sidebar"
      >
        {open ? (
          <svg className="w-6 h-6 transform rotate-90 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-6 h-6 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        )}
      </button>

      {/* Overlay for mobile */}
      {open && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden transition-opacity duration-300 ease-in-out"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar - Updated for proper scrolling below navbar */}
      <aside className={`
        fixed md:sticky z-20
        top-16 md:top-[height-of-your-navbar] /* Replace [height-of-your-navbar] with your actual navbar height (e.g., top-16 for 4rem) */
        h-[calc(100vh-4rem)] /* Adjust based on your navbar height */
        w-72 md:w-64
        bg-gradient-to-b from-white to-gray-50 dark:from-gray-800 dark:to-gray-900
        shadow-xl md:shadow-md
        transform ${open ? 'translate-x-0 shadow-2xl' : '-translate-x-full'} md:translate-x-0
        transition-all duration-300 ease-in-out
        overflow-y-auto
        border-r border-gray-200 dark:border-gray-700
      `}>
        <div className="p-5 md:p-4">
          <h2 className="text-xl font-bold mb-6 text-gray-800 dark:text-white flex items-center">
            <svg className="w-5 h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            Filters
          </h2>
          
          {/* Tags Section */}
          <div className="mb-8">
            <h3 className="font-semibold mb-3 text-gray-700 dark:text-gray-300 flex items-center text-sm uppercase tracking-wider">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
              Tags
            </h3>
            <ul className="space-y-2">
              <li
                className={`px-3 py-2 rounded-lg cursor-pointer transition-colors duration-200 ${
                  !selectedTag 
                    ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-200 font-medium shadow-inner' 
                    : 'hover:bg-gray-100 dark:hover:bg-gray-700/70 text-gray-700 dark:text-gray-300'
                }`}
                onClick={() => setSelectedTag(null)}
              >
                All Tags
              </li>
              {tags.map(tag => (
                <li
                  key={tag}
                  className={`px-3 py-2 rounded-lg cursor-pointer transition-colors duration-200 ${
                    selectedTag === tag 
                      ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-200 font-medium shadow-inner' 
                      : 'hover:bg-gray-100 dark:hover:bg-gray-700/70 text-gray-700 dark:text-gray-300'
                  }`}
                  onClick={() => setSelectedTag(tag)}
                >
                  {tag}
                </li>
              ))}
            </ul>
          </div>

          {/* Languages Section */}
          <div className="mb-4">
            <h3 className="font-semibold mb-3 text-gray-700 dark:text-gray-300 flex items-center text-sm uppercase tracking-wider">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
              </svg>
              Languages
            </h3>
            <ul className="space-y-2">
              <li
                className={`px-3 py-2 rounded-lg cursor-pointer transition-colors duration-200 ${
                  !selectedLang 
                    ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-200 font-medium shadow-inner' 
                    : 'hover:bg-gray-100 dark:hover:bg-gray-700/70 text-gray-700 dark:text-gray-300'
                }`}
                onClick={() => setSelectedLang(null)}
              >
                All Languages
              </li>
              {languages.map(lang => (
                <li
                  key={lang}
                  className={`px-3 py-2 rounded-lg cursor-pointer transition-colors duration-200 ${
                    selectedLang === lang 
                      ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-200 font-medium shadow-inner' 
                      : 'hover:bg-gray-100 dark:hover:bg-gray-700/70 text-gray-700 dark:text-gray-300'
                  }`}
                  onClick={() => setSelectedLang(lang)}
                >
                  {lang}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </aside>
    </>
  );
}