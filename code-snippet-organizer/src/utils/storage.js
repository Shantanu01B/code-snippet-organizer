const SNIPPETS_KEY = 'snippets'

export function getSnippets() {
    return JSON.parse(localStorage.getItem(SNIPPETS_KEY) || '[]')
}

export function saveSnippet(snippet) {
    const snippets = getSnippets()
    snippets.push(snippet)
    localStorage.setItem(SNIPPETS_KEY, JSON.stringify(snippets))
}

export function updateSnippets(snippets) {
    localStorage.setItem(SNIPPETS_KEY, JSON.stringify(snippets))
}