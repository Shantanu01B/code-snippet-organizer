import React, { useRef, useState } from 'react';

export default function Navbar({
  onAddClick,
  search,
  setSearch,
  sortBy,
  setSortBy,
  darkMode,
  setDarkMode,
  onExportSnippets,
  onImportSnippets,
  viewTrash,
  setViewTrash,
  user,
  onLogout,
}) {
  const fileInputRef = useRef();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="bg-blue-600 text-white p-3 dark:bg-gray-800 sticky top-0 z-10 shadow-lg">
      <div className="max-w-7xl mx-auto">
        {/* Desktop Layout */}
        <div className="hidden md:flex items-center justify-between gap-4">
          {/* Left - Brand */}
          <h1 className="text-2xl font-bold whitespace-nowrap min-w-[200px]">
            Code Snippet Organizer
          </h1>

          {/* Middle - Controls */}
          <div className="flex items-center gap-3 flex-grow max-w-3xl mx-4">
            {/* Snippets/Trash Tabs */}
            <div className="flex border border-blue-400 rounded-md p-0.5 bg-blue-500/10">
              <button
                onClick={() => setViewTrash(false)}
                className={`px-4 py-1 rounded-md text-sm transition-colors ${
                  !viewTrash ? 'bg-blue-500 text-white' : 'hover:bg-blue-700/50'
                }`}
              >
                Snippets
              </button>
              <button
                onClick={() => setViewTrash(true)}
                className={`px-4 py-1 rounded-md text-sm transition-colors ${
                  viewTrash ? 'bg-blue-500 text-white' : 'hover:bg-blue-700/50'
                }`}
              >
                Trash
              </button>
            </div>

            {/* Search */}
            <div className="relative flex-grow">
              <input
                type="text"
                placeholder="Search snippets..."
                className="w-full px-4 py-1.5 rounded-md text-gray-800 text-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
                value={search}
                onChange={e => setSearch(e.target.value)}
                disabled={viewTrash}
              />
            </div>

            {/* Sort */}
            <select
              className="px-3 py-1.5 rounded-md text-gray-800 text-sm focus:ring-2 focus:ring-blue-400 focus:outline-none min-w-[120px]"
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              disabled={viewTrash}
            >
              <option value="date">By Date</option>
              <option value="language">By Language</option>
              <option value="favorites">By Favorites</option>
            </select>
          </div>

          {/* Right - Actions */}
          <div className="flex items-center gap-2 min-w-[300px] justify-end">
            <button
              onClick={() => setDarkMode(dm => !dm)}
              className="p-1.5 rounded-md hover:bg-blue-700/50 dark:hover:bg-gray-700/50"
              aria-label="Toggle Dark Mode"
            >
              {darkMode ? '☀️' : '🌙'}
            </button>

            <button
              onClick={onExportSnippets}
              className="px-4 py-1.5 bg-blue-500 hover:bg-blue-400 rounded-md text-sm font-medium transition-colors"
              disabled={viewTrash}
            >
              Export
            </button>

            <button
              onClick={() => fileInputRef.current.click()}
              className="px-4 py-1.5 bg-blue-500 hover:bg-blue-400 rounded-md text-sm font-medium transition-colors"
              disabled={viewTrash}
            >
              Import
            </button>

            <button
              onClick={onAddClick}
              className="px-4 py-1.5 bg-white text-blue-600 hover:bg-blue-100 rounded-md text-sm font-semibold transition-colors"
              disabled={viewTrash}
            >
              + Add
            </button>

            {user && (
              <div className="flex items-center gap-2 ml-2">
                <span className="text-sm font-medium">
                  {user}
                </span>
                <button
                  onClick={onLogout}
                  className="px-3 py-1.5 bg-red-600 hover:bg-red-500 rounded-md text-sm transition-colors"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Layout */}
        <div className="md:hidden">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold whitespace-nowrap">
              Code Snippet Organizer
            </h1>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setDarkMode(dm => !dm)}
                className="p-1.5 rounded-md hover:bg-blue-700/50 dark:hover:bg-gray-700/50"
                aria-label="Toggle Dark Mode"
              >
                {darkMode ? '☀️' : '🌙'}
              </button>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-1.5 rounded-md hover:bg-blue-700/50 dark:hover:bg-gray-700/50"
                aria-label="Toggle Menu"
              >
                {mobileMenuOpen ? '✕' : '☰'}
              </button>
            </div>
          </div>

          {mobileMenuOpen && (
            <div className="mt-3 space-y-3">
              <div className="flex border border-blue-400 rounded-md p-0.5 bg-blue-500/10">
                <button
                  onClick={() => {
                    setViewTrash(false);
                    setMobileMenuOpen(false);
                  }}
                  className={`px-3 py-1.5 rounded-md text-sm transition-colors flex-1 text-center ${
                    !viewTrash ? 'bg-blue-500 text-white' : 'hover:bg-blue-700/50'
                  }`}
                >
                  Snippets
                </button>
                <button
                  onClick={() => {
                    setViewTrash(true);
                    setMobileMenuOpen(false);
                  }}
                  className={`px-3 py-1.5 rounded-md text-sm transition-colors flex-1 text-center ${
                    viewTrash ? 'bg-blue-500 text-white' : 'hover:bg-blue-700/50'
                  }`}
                >
                  Trash
                </button>
              </div>

              <input
                type="text"
                placeholder="Search..."
                className="w-full px-3 py-1.5 rounded-md text-gray-800 text-sm"
                value={search}
                onChange={e => setSearch(e.target.value)}
                disabled={viewTrash}
              />

              <select
                className="w-full px-2 py-1.5 rounded-md text-gray-800 text-sm"
                value={sortBy}
                onChange={e => setSortBy(e.target.value)}
                disabled={viewTrash}
              >
                <option value="date">By Date</option>
                <option value="language">By Language</option>
                <option value="favorites">By Favorites</option>
              </select>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    onExportSnippets();
                    setMobileMenuOpen(false);
                  }}
                  className="px-3 py-1.5 bg-blue-500 hover:bg-blue-400 rounded-md text-sm font-medium transition-colors"
                  disabled={viewTrash}
                >
                  Export
                </button>

                <button
                  onClick={() => {
                    fileInputRef.current.click();
                    setMobileMenuOpen(false);
                  }}
                  className="px-3 py-1.5 bg-blue-500 hover:bg-blue-400 rounded-md text-sm font-medium transition-colors"
                  disabled={viewTrash}
                >
                  Import
                </button>

                <button
                  onClick={() => {
                    onAddClick();
                    setMobileMenuOpen(false);
                  }}
                  className="px-3 py-1.5 bg-white text-blue-600 hover:bg-blue-100 rounded-md text-sm font-semibold transition-colors col-span-2"
                  disabled={viewTrash}
                >
                  + Add New
                </button>
              </div>

              {user && (
                <div className="flex items-center gap-2 pt-2">
                  <span className="text-sm font-medium flex-1">
                    {user}
                  </span>
                  <button
                    onClick={() => {
                      onLogout();
                      setMobileMenuOpen(false);
                    }}
                    className="px-3 py-1.5 bg-red-600 hover:bg-red-500 rounded-md text-sm transition-colors"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="application/json"
            style={{ display: 'none' }}
            onChange={onImportSnippets}
          />
        </div>
      </div>
    </nav>
  );
}