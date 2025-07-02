function LoginPage() {
  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";

  const handleLogin = () => {
    window.location.href = `${apiUrl}/auth/google`;
  };

  return (
    <div>
      <h2>Login Page</h2>
      <button onClick={handleLogin}>Login with Google</button>
    </div>
  );
}

export default LoginPage;
