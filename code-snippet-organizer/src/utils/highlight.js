// src/utils/highlight.js
export function highlightText(text, search) {
    if (!search) return text;
    // Escape special regex characters in search
    const escaped = search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(${escaped})`, 'gi');
    // Wrap matches in <mark>
    return text.split(regex).map((part, i) =>
        regex.test(part) ?
        `<mark class="bg-yellow-300 dark:bg-yellow-600 rounded px-1">${part}</mark>` :
        part
    ).join('');
}