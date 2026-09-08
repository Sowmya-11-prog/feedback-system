import React, { useEffect, useState, useCallback } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import SearchBar from "../components/SearchBar";
import StudentTable from "../components/StudentTable";
import api from "../services/api";

const StudentManagement = () => {
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [toast, setToast] = useState(null);

  const fetchStudents = useCallback(async (query) => {
    setLoading(true);
    setError("");
    try {
      const { data } = await api.get("/students", { params: query ? { search: query } : {} });
      setStudents(data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load students");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const delay = setTimeout(() => fetchStudents(search), 350);
    return () => clearTimeout(delay);
  }, [search, fetchStudents]);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 2500);
  };

  const handleUpdate = async (id, form) => {
    try {
      await api.put(`/students/${id}`, form);
      showToast("Student details updated successfully");
      fetchStudents(search);
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to update student", "error");
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/students/${id}`);
      showToast("Student deleted successfully");
      fetchStudents(search);
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to delete student", "error");
    }
  };

  return (
    <div className="app-shell">
      <Navbar />
      <div className="body-area">
        <Sidebar />
        <main className="main-content">
          <div className="page-header">
            <div>
              <h1>Student Management</h1>
              <p>Search, edit, or remove student records.</p>
            </div>
          </div>

          {toast && <div className={`toast toast-${toast.type}`}>{toast.message}</div>}

          <div className="toolbar">
            <SearchBar value={search} onChange={setSearch} placeholder="Search student details..." />
          </div>

          {error && <div className="alert alert-error">{error}</div>}
          {loading ? (
            <p className="loading-text">Loading students...</p>
          ) : (
            <StudentTable students={students} onUpdate={handleUpdate} onDelete={handleDelete} />
          )}
        </main>
      </div>
    </div>
  );
};

export default StudentManagement;
