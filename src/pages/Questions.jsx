import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../QuestionsPage.css";

function QuestionsPage() {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const userAge = localStorage.getItem("userAge");

    if (!userAge) {
      setError("⚠️ No age found. Please register or login again.");
      return;
    }

    setLoading(true);

    fetch(`http://localhost:5000/questions-by-age?age=${userAge}`)
      .then((res) => {
        if (!res.ok) throw new Error("❌ Failed to fetch questions");
        return res.json();
      })
      .then((data) => {
        let fetched = Array.isArray(data.questions) ? data.questions : [];
        setQuestions(fetched);
        setLoading(false);
      })
      .catch(() => {
        setError("⚠️ Failed to load questions. Please try again.");
        setLoading(false);
      });
  }, []);

  // 🟢 تخزين الإجابة مع الشخصية
  const handleAnswerChange = (questionId, option) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: { answer: option.text, personality: option.personality },
    }));
  };

  // 🟢 إرسال الإجابات للسيرفر
  const handleSubmit = () => {
    const userAge = localStorage.getItem("userAge");
    if (!userAge) {
      setError("⚠️ No age found. Please register or login again.");
      return;
    }

    const answersArray = Object.values(answers);

    fetch("http://localhost:5000/analyze-answers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ age: userAge, answers: answersArray }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("📩 Server Result:", data);

        // 🟢 نخزن النتيجة في localStorage ونروح لصفحة النتيجة
        localStorage.setItem("personalityResult", JSON.stringify(data.result));
        navigate("/result");
      })
      .catch(() => {
        setError("⚠️ Failed to analyze answers.");
      });
  };

  return (
    <div className="questions-page">
      <h2 className="page-title">Your Questions</h2>

      {loading && <p className="loading">Loading...</p>}
      {error && <p className="error-text">{error}</p>}

      {!loading && !error && (
        <div className="questions-grid">
          {questions.length > 0 ? (
            questions.map((q, index) => (
              <div key={q.id || index} className="question-card">
                <p className="question-text">{q.question_text}</p>

                <div className="options">
                  {q.options?.map((opt, i) => (
                    <button
                      key={i}
                      className={`option-btn ${
                        answers[q.id || index]?.answer === opt.text
                          ? "active"
                          : ""
                      }`}
                      onClick={() => handleAnswerChange(q.id || index, opt)}
                    >
                      {opt.text}
                    </button>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <p>No questions available.</p>
          )}
        </div>
      )}

      {questions.length > 0 && !loading && (
        <button className="submit-btn" onClick={handleSubmit}>
          Submit Answers
        </button>
      )}
    </div>
  );
}

export default QuestionsPage;
