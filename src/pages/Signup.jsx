import React, { useState } from "react";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:8055/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, first_name: name }),
      });
      const data = await res.json();

      if (data?.data?.id) {
        setSuccess("تم إنشاء الحساب بنجاح! يمكنك تسجيل الدخول الآن.");
        setError("");
      } else {
        setError("لم يتم إنشاء الحساب. تحقق من البيانات.");
      }
    } catch (err) {
      setError("مشكلة في الاتصال بالسيرفر");
    }
  };

  return (
    <div className="auth-container">
      <h2>إنشاء حساب جديد</h2>
      <form onSubmit={handleSignup}>
        <input
          type="text"
          placeholder="الاسم"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
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
        <button type="submit">تسجيل</button>
        {success && <p className="success">{success}</p>}
        {error && <p className="error">{error}</p>}
      </form>
    </div>
  );
}
