import React, { useEffect, useState, useCallback, useMemo } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import SearchBar from "../components/SearchBar";
import FeedbackTable from "../components/FeedbackTable";
import api from "../services/api";

const RATINGS = [5, 4, 3, 2, 1];

const FeedbackManagement = () => {
  const [feedbackList, setFeedbackList] = useState([]);
  const [search, setSearch] = useState("");
  const [ratingFilter, setRatingFilter] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("");
  const [teacherFilter, setTeacherFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchFeedback = useCallback(async (params) => {
    setLoading(true);
    setError("");
    try {
      const { data } = await api.get("/feedback", { params });
      setFeedbackList(data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load feedback");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const params = {};
    if (search) params.search = search;
    if (ratingFilter) params.rating = ratingFilter;
    if (departmentFilter) params.department = departmentFilter;
    if (teacherFilter) params.teacherName = teacherFilter;

    const delay = setTimeout(() => fetchFeedback(params), 300);
    return () => clearTimeout(delay);
  }, [search, ratingFilter, departmentFilter, teacherFilter, fetchFeedback]);

  // Summary counts always reflect the full feedback set (fetched once on mount, unfiltered)
  const [allFeedback, setAllFeedback] = useState([]);
  useEffect(() => {
    api.get("/feedback").then(({ data }) => setAllFeedback(data)).catch(() => {});
  }, []);

  const summary = useMemo(() => {
    const counts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    allFeedback.forEach((f) => {
      counts[f.rating] = (counts[f.rating] || 0) + 1;
    });
    return counts;
  }, [allFeedback]);

  const maxCount = Math.max(1, ...Object.values(summary));

  const departments = useMemo(
    () => [...new Set(allFeedback.map((f) => f.department))].sort(),
    [allFeedback]
  );
  const teachers = useMemo(
    () => [...new Set(allFeedback.map((f) => f.teacherName))].sort(),
    [allFeedback]
  );

  return (
    <div className="app-shell">
      <Navbar />
      <div className="body-area">
        <Sidebar />
        <main className="main-content">
          <div className="page-header">
            <div>
              <h1>Feedback Management</h1>
              <p>Review ratings and drill into feedback by department, teacher, or rating.</p>
            </div>
          </div>

          <div className="panel">
            <h3>Rating Summary</h3>
            <div className="rating-summary-list">
              {RATINGS.map((r) => (
                <div className="rating-summary-row" key={r}>
                  <span style={{ width: 60 }}>{r} Stars</span>
                  <div className="bar-track">
                    <div
                      className="bar-fill"
                      style={{ width: `${(summary[r] / maxCount) * 100}%` }}
                    />
                  </div>
                  <span style={{ width: 90, textAlign: "right" }}>{summary[r]} Students</span>
                </div>
              ))}
            </div>
          </div>

          <div className="toolbar">
            <SearchBar
              value={search}
              onChange={setSearch}
              placeholder="Search by student, department, or teacher..."
            />
            <select
              className="filter-select"
              value={ratingFilter}
              onChange={(e) => setRatingFilter(e.target.value)}
            >
              <option value="">All Ratings</option>
              {RATINGS.map((r) => (
                <option key={r} value={r}>
                  {r} Stars
                </option>
              ))}
            </select>
            <select
              className="filter-select"
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
            >
              <option value="">All Departments</option>
              {departments.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
            <select
              className="filter-select"
              value={teacherFilter}
              onChange={(e) => setTeacherFilter(e.target.value)}
            >
              <option value="">All Teachers</option>
              {teachers.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          {error && <div className="alert alert-error">{error}</div>}
          {loading ? (
            <p className="loading-text">Loading feedback...</p>
          ) : (
            <FeedbackTable feedbackList={feedbackList} />
          )}
        </main>
      </div>
    </div>
  );
};

export default FeedbackManagement;
