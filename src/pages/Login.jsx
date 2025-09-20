import React, { useState } from "react";

export default function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:8055/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (data?.data?.access_token) {
        localStorage.setItem("access_token", data.data.access_token);
        onLogin(data.data.access_token); // بعد النجاح يدخل المستخدم
      } else {
        setError("خطأ في البريد أو كلمة المرور");
      }
    } catch (err) {
      setError("مشكلة في الاتصال بالسيرفر");
    }
  };

  return (
    <div className="auth-container">
      <h2>تسجيل الدخول</h2>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="البريد الإلكتروني"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="كلمة المرور"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">دخول</button>
        {error && <p className="error">{error}</p>}
      </form>
    </div>
  );
}
