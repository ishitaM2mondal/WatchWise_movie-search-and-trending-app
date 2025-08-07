# 🎬 WatchWise

A modern and responsive React-based web application to search and explore trending movies using [The Movie Database (TMDB) API](https://www.themoviedb.org/). The app integrates [Appwrite](https://appwrite.io/) for backend API and database functionalities like search count tracking and user data management.

## 🚀 Features

- 🔍 **Exact Movie Search** — Find specific movies by title (no fuzzy matches).
- 🔥 **Trending Movies Section** — View the latest popular titles from TMDB.
- 🖼️ **Fallback Image** — Automatically shows a placeholder if poster is missing.
- 📈 **Search Count Tracking** — Updates search metadata using Appwrite.
- ⚡ **Debounced Search** — Avoids unnecessary API calls while typing.
- 📱 **Responsive Design** — Works smoothly on all screen sizes.

## 🧰 Tech Stack

- **Frontend**: React, HTML5, CSS3, JavaScript
- **API**: [TMDB API](https://developers.themoviedb.org/)
- **Backend**: [Appwrite](https://appwrite.io/)
- **Dev Tools**: Vite, VS Code

## 🏁 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/your-username/movie-explorer.git
cd movie-explorer

### **2. Dependency**

```bash
npm install


###**3. Setup Environment Variables**
Create a .env file in the root directory with the following variables:

- **VITE_TMDB_API_KEY**= your_tmdb_bearer_token
- **VITE_APPWRITE_ENDPOINT**= https://cloud.appwrite.io/v1
- **VITE_APPWRITE_PROJECT**= your_project_id
- **VITE_APPWRITE_DATABASE_ID**= your_database_id
- **VITE_APPWRITE_COLLECTION_ID**= your_collection_id


### **4. Start the Development Server**

```bash
npm run dev

