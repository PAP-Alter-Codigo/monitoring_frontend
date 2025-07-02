import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import Search from './pages/Search/Search';
import ArticleForm from './pages/ArticleForm/ArticleForm';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/search" element={<Search />} />
        <Route path="/article-form" element={<ArticleForm />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;