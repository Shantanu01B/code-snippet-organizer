import React, { useState, useEffect } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import SnippetList from './pages/SnippetList';
import TrashList from './pages/Trash';
import AddSnippet from './components/AddSnippet';
import { getSnippets, updateSnippets } from './utils/storage';
import Login from './components/Login';
import Signup from './components/Signup';

export default function App() {
  // Authentication state
  const [user, setUser] = useState(localStorage.getItem("username") || "");
  const [showSignup, setShowSignup] = useState(false);

  // Snippet app state
  const [snippets, setSnippets] = useState([]);
  const [showAdd, setShowAdd] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedTag, setSelectedTag] = useState(null);
  const [selectedLang, setSelectedLang] = useState(null);
  const [sortBy, setSortBy] = useState('date');
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('darkMode') === 'true');
  const [viewTrash, setViewTrash] = useState(false);

  useEffect(() => {
    setSnippets(getSnippets());
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', darkMode);
  }, [darkMode]);

  const refreshSnippets = () => {
    setSnippets(getSnippets());
  };

  // Export all snippets as JSON
  const handleExportSnippets = () => {
    const allSnippets = getSnippets();
    const blob = new Blob([JSON.stringify(allSnippets, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'snippets_backup.json';
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Snippets exported!');
  };

  // Import snippets from JSON file
  const handleImportSnippets = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function(event) {
      try {
        const imported = JSON.parse(event.target.result);
        if (!Array.isArray(imported)) throw new Error("Invalid format");
        updateSnippets(imported);
        refreshSnippets();
        toast.success('Snippets imported successfully!');
      } catch (err) {
        toast.error('Failed to import: ' + err.message);
      }
    };
    reader.readAsText(file);
    e.target.value = null;
  };

  // Authentication handlers
  const handleLogin = (username) => setUser(username);
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    setUser("");
  };

  // Show login/signup if not authenticated
  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900">
        {showSignup ? (
          <>
            <Signup onSignup={() => setShowSignup(false)} />
            <button className="mt-2 text-blue-600" onClick={() => setShowSignup(false)}>
              Already have an account? Login
            </button>
          </>
        ) : (
          <>
            <Login onLogin={handleLogin} />
            <button className="mt-2 text-blue-600" onClick={() => setShowSignup(true)}>
              Don't have an account? Sign up
            </button>
          </>
        )}
      </div>
    );
  }

  // Main Snippet Organizer UI (shown only if logged in)
  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />
      <div className="flex flex-col min-h-screen bg-white text-black dark:bg-gray-900 dark:text-white transition-colors">
        <Navbar
          onAddClick={() => setShowAdd(true)}
          search={search}
          setSearch={setSearch}
          sortBy={sortBy}
          setSortBy={setSortBy}
          darkMode={darkMode}
          setDarkMode={setDarkMode}
          onExportSnippets={handleExportSnippets}
          onImportSnippets={handleImportSnippets}
          viewTrash={viewTrash}
          setViewTrash={setViewTrash}
          // Add logout button to Navbar
          user={user}
          onLogout={handleLogout}
        />
        <div className="flex flex-1">
          {!viewTrash && (
            <Sidebar
              snippets={snippets.filter(s => !s.deletedAt)}
              selectedTag={selectedTag}
              setSelectedTag={setSelectedTag}
              selectedLang={selectedLang}
              setSelectedLang={setSelectedLang}
            />
          )}
          <main className="flex-1 p-4 bg-gray-50 dark:bg-gray-900 transition-colors">
            {viewTrash ? (
              <TrashList snippets={snippets.filter(s => s.deletedAt)} refreshSnippets={refreshSnippets} />
            ) : (
              <SnippetList
                snippets={snippets.filter(s => !s.deletedAt)}
                refreshSnippets={refreshSnippets}
                search={search}
                selectedTag={selectedTag}
                selectedLang={selectedLang}
                sortBy={sortBy}
              />
            )}
          </main>
        </div>
        {showAdd && !viewTrash && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 p-6 rounded shadow-lg w-full max-w-lg">
              <AddSnippet onClose={() => setShowAdd(false)} onSave={refreshSnippets} />
            </div>
          </div>
        )}
      </div>
    </>
  );
}
