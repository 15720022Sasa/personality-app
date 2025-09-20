import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../auth.css";

export default function AuthForm() {
  const navigate = useNavigate();
  const [mode, setMode] = useState("signup"); // signup | login
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [age, setAge] = useState("");
  const [error, setError] = useState("");

  const DIRECTUS_URL = "http://localhost:8055"; // عدّلي لو البورت مختلف

  function getAgeGroup(ageNum) {
    const ageN = parseInt(ageNum, 10);
    if (ageN >= 18 && ageN <= 24) return "18-24";
    if (ageN >= 25 && ageN <= 34) return "25-34";
    if (ageN >= 35 && ageN <= 44) return "35-44";
    if (ageN >= 45 && ageN <= 54) return "45-54";
    if (ageN >= 55) return "55+";
    return "unknown";
  }

  // 🟢 التسجيل
  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    try {
      // نحسب age group من الرقم
      const ageGroup = getAgeGroup(age);

      const res = await fetch(`${DIRECTUS_URL}/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password,
          name: email.split("@")[0],
          age_group: ageGroup, // الآن نرسل جروب مش الرقم
        }),
      });

      const data = await res.json();
      if (!res.ok) return setError(data.errors?.[0]?.message || "Signup failed");

      console.log("✅ Registered:", data);

      // نخزن العمر الحقيقي (الرقم) لاستخدامه في endpoint
      localStorage.setItem("userAge", age);

      alert("🎉 Registration successful! Please login.");
      setMode("login");
    } catch (err) {
      console.error(err);
      setError("⚠️ Server error, check if Directus is running.");
    }
  };

  // 🟢 تسجيل الدخول
  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await fetch(`${DIRECTUS_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) return setError(data.errors?.[0]?.message || "Login failed");

      const token = data.data.access_token;

      // استرجاع بيانات اليوزر
      const userRes = await fetch(`${DIRECTUS_URL}/users/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const userData = await userRes.json();

      localStorage.setItem("userId", userData.data.id);
      localStorage.setItem("token", token);

      // نخزن العمر كقيمة رقمية إذا أمكن
      if (userData?.data?.age_group) {
        const ag = userData.data.age_group;
        const num = parseInt(ag, 10);
        if (!isNaN(num)) {
          localStorage.setItem("userAge", String(num));
          console.log("User age (from Directus numeric):", num);
        } else {
          // لو اللي مخزن هو جروب مثل "18-24" ناخد أول رقم منه
          const match = String(ag).match(/\d+/);
          if (match) {
            localStorage.setItem("userAge", match[0]);
            console.log("User age (from Directus group fallback):", match[0]);
          }
        }
      } else if (localStorage.getItem("userAge")) {
        console.log("User age (fallback):", localStorage.getItem("userAge"));
      }

      console.log("✅ Logged in:", userData);
      navigate("/waiting");
    } catch (err) {
      console.error(err);
      setError("⚠️ Server error, check if Directus is running.");
    }
  };

  return (
    <section className="auth-section">
      <h1 className="auth-title">
        {mode === "signup" ? "Sign Up" : "Login"}
      </h1>

      <form
        onSubmit={mode === "signup" ? handleSignup : handleLogin}
        className="auth-form"
      >
        <input
          type="email"
          placeholder="Email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {mode === "signup" && (
          <input
            type="number"
            placeholder="Age"
            required
            value={age}
            onChange={(e) => setAge(e.target.value)}
          />
        )}

        <button type="submit" className="btn-auth">
          Continue
        </button>

        {error && <p className="error-text">{error}</p>}
      </form>

      <p className="switch-auth">
        {mode === "signup" ? (
          <>
            Already have an account?{" "}
            <button
              type="button"
              className="link-btn"
              onClick={() => setMode("login")}
            >
              Login
            </button>
          </>
        ) : (
          <>
            Don’t have an account?{" "}
            <button
              type="button"
              className="link-btn"
              onClick={() => setMode("signup")}
            >
              Sign Up
            </button>
          </>
        )}
      </p>
    </section>
  );
}
