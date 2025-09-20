import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Waiting() {
  const navigate = useNavigate();
  const [count, setCount] = useState(5);
  const userAge = localStorage.getItem("userAge");

  useEffect(() => {
    const timer = setInterval(() => {
      setCount((prev) => prev - 1);
    }, 1000);

    if (count <= 0) {
      clearInterval(timer);
      navigate(`/questions`);
    }

    return () => clearInterval(timer);
  }, [count, navigate]);

  return (
    <section className="auth-section">
      <h1 className="auth-title">Please Wait</h1>
      <p>{`0:0${count}`}</p>
    </section>
  );
}
