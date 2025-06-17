import React from 'react';

export default function SnippetHistoryModal({ versions, onRestore, onClose }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto p-6 relative">
        <button
          onClick={onClose}
          aria-label="Close history"
          className="absolute top-3 right-3 text-gray-700 dark:text-gray-300 hover:text-red-500 text-2xl font-bold"
        >
          &times;
        </button>
        <h2 className="text-xl font-bold mb-4">Version History</h2>
        {versions.length === 0 ? (
          <p className="text-gray-500">No previous versions.</p>
        ) : (
          <div className="space-y-6">
            {versions.map((ver, idx) => (
              <div key={idx} className="border rounded p-4 bg-gray-50 dark:bg-gray-800">
                <div className="flex justify-between items-center mb-2">
                  <div>
                    <span className="font-semibold">{ver.title}</span>
                    <span className="ml-2 text-xs text-gray-400">
                      {ver.language}
                    </span>
                  </div>
                  <span className="text-xs text-gray-500">
                    Saved: {ver.savedAt ? new Date(ver.savedAt).toLocaleString() : 'Unknown'}
                  </span>
                </div>
                <pre className="overflow-x-auto bg-gray-200 dark:bg-gray-900 p-2 rounded text-xs mb-2">
                  {ver.code}
                </pre>
                <div className="flex gap-2">
                  <button
                    className="px-3 py-1 rounded bg-blue-600 text-white hover:bg-blue-700 text-xs"
                    onClick={() => onRestore(ver)}
                  >
                    Restore This Version
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
