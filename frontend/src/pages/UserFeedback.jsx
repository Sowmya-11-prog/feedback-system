import React, { useState } from "react";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";

const DEPARTMENTS = ["CSE", "ECE", "EEE", "Civil", "Mechanical", "IT", "AI & DS", "Other"];
const RATING_LABELS = { 5: "Excellent", 4: "Very Good", 3: "Good", 2: "Average", 1: "Poor" };

const emptyForm = { department: "", teacherName: "", feedback: "", rating: 0 };

const UserFeedback = () => {
  const { user } = useAuth();
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState(null); // { type: "success" | "error", message }
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const validate = () => {
    const next = {};
    if (!form.department) next.department = "Please select a department";
    if (!form.teacherName.trim()) next.teacherName = "Teacher name is required";
    if (!form.feedback.trim()) next.feedback = "Feedback cannot be empty";
    if (!form.rating) next.rating = "Please select a rating";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus(null);
    if (!validate()) return;

    setSubmitting(true);
    try {
      await api.post("/feedback", {
        studentName: user.name,
        department: form.department,
        teacherName: form.teacherName,
        feedback: form.feedback,
        rating: form.rating,
      });
      setStatus({ type: "success", message: "Feedback submitted successfully" });
      setForm(emptyForm);
    } catch (err) {
      setStatus({
        type: "error",
        message: err.response?.data?.message || "Failed to submit feedback. Please try again.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="app-shell">
      <Navbar />
      <div className="body-area">
        <main className="main-content" style={{ maxWidth: 640, margin: "0 auto", width: "100%" }}>
          <div className="page-header">
            <div>
              <h1>Share your feedback</h1>
              <p>Your response is recorded against your name and department for follow-up.</p>
            </div>
          </div>

          <div className="panel">
            {status && (
              <div className={`alert ${status.type === "success" ? "alert-success" : "alert-error"}`}>
                {status.message}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Student Name</label>
                <input className="form-control" value={user?.name || ""} disabled />
              </div>

              <div className="form-group">
                <label htmlFor="department">Department Name</label>
                <select
                  id="department"
                  className="form-control"
                  value={form.department}
                  onChange={(e) => handleChange("department", e.target.value)}
                >
                  <option value="">Select department</option>
                  {DEPARTMENTS.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
                {errors.department && <div className="form-hint">{errors.department}</div>}
              </div>

              <div className="form-group">
                <label htmlFor="teacherName">Teacher Name</label>
                <input
                  id="teacherName"
                  className="form-control"
                  placeholder="e.g. Mr. Kumar"
                  value={form.teacherName}
                  onChange={(e) => handleChange("teacherName", e.target.value)}
                />
                {errors.teacherName && <div className="form-hint">{errors.teacherName}</div>}
              </div>

              <div className="form-group">
                <label htmlFor="feedback">Feedback</label>
                <textarea
                  id="feedback"
                  className="form-control"
                  rows={4}
                  placeholder="Enter your feedback about the teacher"
                  value={form.feedback}
                  onChange={(e) => handleChange("feedback", e.target.value)}
                />
                {errors.feedback && <div className="form-hint">{errors.feedback}</div>}
              </div>

              <div className="form-group">
                <label>Ranking</label>
                <div className="rating-picker">
                  {[5, 4, 3, 2, 1].map((r) => (
                    <button
                      type="button"
                      key={r}
                      className={form.rating === r ? "selected" : ""}
                      onClick={() => handleChange("rating", r)}
                    >
                      {r} - {RATING_LABELS[r]}
                    </button>
                  ))}
                </div>
                {errors.rating && <div className="form-hint">{errors.rating}</div>}
              </div>

              <button type="submit" className="btn btn-primary" disabled={submitting}>
                {submitting ? "Submitting..." : "Submit"}
              </button>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
};

export default UserFeedback;
