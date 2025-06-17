# 📁 Code Snippet Organizer

A modern and user-friendly web application built using **React** to help developers create, tag, search, and manage reusable code snippets across multiple programming languages.



---

## 🚀 Features

### ✅ Core Functionality
- Create, edit, delete code snippets
- Add title, description, tags, and language
- Monaco/CodeMirror syntax-highlighted editor
- Copy-to-clipboard functionality

### 🔍 Search & Filter
- Full-text search (title, description, code)
- Filter snippets by tag and language
- Highlighted search results

### 🏷️ Tagging System
- Add/remove multiple tags per snippet
- Tag suggestions and quick filters

### 🗃️ Snippet Management
- Detail view & list view
- Soft delete (Trash), and permanent delete
- Sort by date, favorites, or language
- Favorite/categorize snippets

### 🛠 Editor Enhancements
- Syntax highlighting, line numbers, auto-indent
- Auto-save drafts & recovery

### 🌐 Advanced (Optional)
- Authentication 
- Public sharing of snippets
- Import/Export (JSON)
- Version history for snippets
- Analytics and usage tracking

### 💡 UI/UX
- Responsive and mobile-friendly
- Dark mode toggle
- Keyboard shortcuts (e.g., `Ctrl+S` to save)

---

## 🧰 Tech Stack

| Layer       | Technology           |
|-------------|----------------------|
| Frontend    | React (Hooks, JSX)   |
| Code Editor | Monaco Editor  |
| Styling     | CSS Modules / Tailwind / Styled Components |
| Storage     | LocalStorage  |

---

## 🛠 Setup Instructions

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/code-snippet-organizer.git
cd code-snippet-organizer


2. Install Dependencies
npm install

3. Start the Development Server
npm run dev
Open your browser and visit http://localhost:5173

💾 Usage
Click on “Add Snippet” to create a new code block
Fill in the title, description, select language, and add tags
Code with syntax highlighting using Monaco 
Use the search bar to find snippets by text, tags, or language
Edit, delete, or mark snippets as favorites
Trash deleted snippets and restore anytime


