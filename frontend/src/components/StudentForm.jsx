import React, { useState, useEffect } from "react";

const DEPARTMENTS = ["CSE", "ECE", "EEE", "Civil", "Mechanical", "IT", "AI & DS", "Other"];
const YEARS = ["1st Year", "2nd Year", "3rd Year", "4th Year"];

const emptyForm = {
  studentName: "",
  department: "",
  yearOfStudy: "",
  rollNumber: "",
  email: "",
  phoneNumber: "",
};

const StudentForm = ({ initialData, onSubmit, onCancel, submitLabel }) => {
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      setForm({
        studentName: initialData.studentName || "",
        department: initialData.department || "",
        yearOfStudy: initialData.yearOfStudy || "",
        rollNumber: initialData.rollNumber || "",
        email: initialData.email || "",
        phoneNumber: initialData.phoneNumber || "",
      });
    }
  }, [initialData]);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const validate = () => {
    const next = {};
    if (!form.studentName.trim()) next.studentName = "Student name is required";
    if (!form.department) next.department = "Department is required";
    if (!form.yearOfStudy) next.yearOfStudy = "Year of study is required";
    if (!form.rollNumber.trim()) next.rollNumber = "Roll number is required";
    if (!form.email.trim()) {
      next.email = "Email is required";
    } else if (!/^\S+@\S+\.\S+$/.test(form.email)) {
      next.email = "Enter a valid email address";
    }
    if (!/^[0-9]{10}$/.test(form.phoneNumber)) {
      next.phoneNumber = "Enter a valid 10-digit phone number";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      await onSubmit(form);
      if (!initialData) setForm(emptyForm);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="studentName">Student Name</label>
        <input
          id="studentName"
          className="form-control"
          value={form.studentName}
          onChange={(e) => handleChange("studentName", e.target.value)}
        />
        {errors.studentName && <div className="form-hint">{errors.studentName}</div>}
      </div>

      <div className="form-group">
        <label htmlFor="department">Department</label>
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
        <label htmlFor="yearOfStudy">Year of Study</label>
        <select
          id="yearOfStudy"
          className="form-control"
          value={form.yearOfStudy}
          onChange={(e) => handleChange("yearOfStudy", e.target.value)}
        >
          <option value="">Select year</option>
          {YEARS.map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>
        {errors.yearOfStudy && <div className="form-hint">{errors.yearOfStudy}</div>}
      </div>

      <div className="form-group">
        <label htmlFor="rollNumber">Roll Number</label>
        <input
          id="rollNumber"
          className="form-control"
          value={form.rollNumber}
          onChange={(e) => handleChange("rollNumber", e.target.value)}
        />
        {errors.rollNumber && <div className="form-hint">{errors.rollNumber}</div>}
      </div>

      <div className="form-group">
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          className="form-control"
          value={form.email}
          onChange={(e) => handleChange("email", e.target.value)}
        />
        {errors.email && <div className="form-hint">{errors.email}</div>}
      </div>

      <div className="form-group">
        <label htmlFor="phoneNumber">Phone Number</label>
        <input
          id="phoneNumber"
          className="form-control"
          placeholder="10-digit number"
          value={form.phoneNumber}
          onChange={(e) => handleChange("phoneNumber", e.target.value)}
        />
        {errors.phoneNumber && <div className="form-hint">{errors.phoneNumber}</div>}
      </div>

      <div className={onCancel ? "modal-actions" : ""}>
        {onCancel && (
          <button type="button" className="btn btn-secondary" onClick={onCancel}>
            Cancel
          </button>
        )}
        <button type="submit" className="btn btn-primary" disabled={submitting}>
          {submitting ? "Saving..." : submitLabel || "Submit"}
        </button>
      </div>
    </form>
  );
};

export default StudentForm;
