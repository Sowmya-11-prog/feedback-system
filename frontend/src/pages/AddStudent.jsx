import React, { useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import StudentForm from "../components/StudentForm";
import api from "../services/api";

const AddStudent = () => {
  const [status, setStatus] = useState(null);

  const handleSubmit = async (form) => {
    setStatus(null);
    try {
      await api.post("/students", form);
      setStatus({ type: "success", message: "Student added successfully" });
    } catch (err) {
      setStatus({
        type: "error",
        message: err.response?.data?.message || "Failed to add student",
      });
      throw err;
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
              <h1>Add Student</h1>
              <p>Register a new student so they can be tracked in the system.</p>
            </div>
          </div>

          <div className="panel" style={{ maxWidth: 520 }}>
            {status && (
              <div className={`alert ${status.type === "success" ? "alert-success" : "alert-error"}`}>
                {status.message}
              </div>
            )}
            <StudentForm onSubmit={handleSubmit} submitLabel="Add Student" />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AddStudent;
