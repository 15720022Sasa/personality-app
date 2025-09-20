// src/pages/Result.jsx
import React, { useEffect, useState } from "react";
import "../Result.css";  // الملف اللي هنكتب فيه الاستايلات
import { motion } from "framer-motion";

// 🔹 استبدلي الباث بالصور عندك
import INTJ from "../avatars/INTJ.svg";
import ENTP from "../avatars/ENTP.svg";
import ISFJ from "../avatars/ISFJ.svg";
import INFJ from "../avatars/INFJ.svg";
import ESTJ from "../avatars/ESTJ.svg";
import ESFP from "../avatars/ESFP.svg";
import ISTP from "../avatars/ISTP.svg";
import INFP from "../avatars/INFP.svg";
import ENTJ from "../avatars/ENTJ.svg";
import ENFP from "../avatars/ENFP.svg";
import ISFP from "../avatars/ISFP.svg";
import ISTJ from "../avatars/ISTJ.svg";
import ESTP from "../avatars/ESTP.svg";
import ESFJ from "../avatars/ESFJ.svg";
import INTP from "../avatars/INTP.svg";
import ENFJ from "../avatars/ENFJ.svg";

// 🔹 ماب الشخصيات مع الصور
const avatarMap = {
  INTJ, ENTP, ISFJ, INFJ, ESTJ, ESFP, ISTP, INFP,
  ENTJ, ENFP, ISFP, ISTJ, ESTP, ESFJ, INTP, ENFJ,
};

function Result() {
  const [result, setResult] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem("personalityResult");
    if (stored) setResult(JSON.parse(stored));
  }, []);

  if (!result) {
    return <div className="result-page"><p>⚠️ No result found</p></div>;
  }

  return (
    <div className="result-page">
      <div className="result-card">
        {/* 🔹 صورة الشخصية مع حركة */}
        {result.personality && avatarMap[result.personality] && (
          <motion.img
            src={avatarMap[result.personality]}
            alt={result.personality}
            className="avatar"
            initial={{ scale: 0 }}
            animate={{ scale: 1, rotate: 360 }}
            transition={{ duration: 1.5 }}
            whileHover={{ scale: 1.1, rotate: 0 }}
          />
        )}

        <div className="header">
          <h2 className="name">{result.name}</h2>
          <span className="type">({result.personality})</span>
        </div>
        <p className="description">{result.description}</p>

        <div className="attributes">
          {result.traits && result.traits.length > 0 && (
            <div className="attr-block">
              <h4>Strengths</h4>
              <div className="attr-list">
                {result.traits.map((t, i) => (
                  <span key={i} className="attr-item">{t}</span>
                ))}
              </div>
            </div>
          )}

          {result.weaknesses && result.weaknesses.length > 0 && (
            <div className="attr-block">
              <h4>Weaknesses</h4>
              <div className="attr-list">
                {result.weaknesses.map((w, i) => (
                  <span key={i} className="attr-item">{w}</span>
                ))}
              </div>
            </div>
          )}

          {result.careers && result.careers.length > 0 && (
            <div className="attr-block">
              <h4>Suggested Careers</h4>
              <div className="attr-list">
                {result.careers.map((c, i) => (
                  <span key={i} className="attr-item">{c}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Result;
