import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import Search from './pages/Search/Search';
import ArticleForm from './pages/ArticleForm/ArticleForm';
import HomePage from './pages/Home/HomePage';
import AdminPage from './pages/AdminPage/AdminPage';
import { ProtectedRoute } from './components/ProtectedRoute'; // <-- Importar aquí

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Ruta Pública (Acceso libre) */}
        <Route path="/" element={<LoginPage />} />

        {/* Rutas Protegidas (Solo accesibles con sesión) */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<HomePage />} />
          <Route path="/search" element={<Search />} />
          <Route path="/search/*" element={<Search />} />
          <Route path="/article-form" element={<ArticleForm />} />
          <Route path="/admin-page" element={<AdminPage />} />
        </Route>

        {/* Redirección por defecto */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
