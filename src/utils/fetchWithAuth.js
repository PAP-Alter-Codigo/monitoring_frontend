export async function fetchWithAuth(path, options = {}) {
  try {
    const res = await fetch(path, {
      ...options,
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    // Si el backend responde 401 (No autorizado) o 403 (Prohibido)
    if (res.status === 401 || res.status === 403) {
      console.warn("Sesión expirada o no iniciada. Redirigiendo a Login...");
      if (window.location.pathname !== '/') {
        window.location.href = '/';
      }
    }

    return res;
  } catch (error) {
    console.error("Error de red en fetchWithAuth:", error);
    throw error;
  }
}
