import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import Search from './pages/Search/Search';
import ArticleForm from './pages/ArticleForm/ArticleForm';
import HomePage from './pages/Home/HomePage';
import AdminPage from './pages/AdminPage/AdminPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Ruta Pública */}
        <Route path="/" element={<LoginPage />} />

        {/* Rutas Protegidas (Requieren Sesión) */}
        <Route path="/dashboard" element={<HomePage />} />
        <Route path="/search" element={<Search />} />
        <Route path="/search/*" element={<Search />} />
        <Route path="/article-form" element={<ArticleForm />} />
        <Route path="/admin-page" element={<AdminPage />} />

        {/* Redirección por defecto para cualquier ruta no encontrada */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
