import React, { useState } from "react";
import StudentForm from "./StudentForm";

const StudentTable = ({ students, onUpdate, onDelete }) => {
  const [editingStudent, setEditingStudent] = useState(null);
  const [deletingStudent, setDeletingStudent] = useState(null);

  const handleUpdate = async (form) => {
    await onUpdate(editingStudent._id, form);
    setEditingStudent(null);
  };

  const confirmDelete = async () => {
    await onDelete(deletingStudent._id);
    setDeletingStudent(null);
  };

  if (!students.length) {
    return <div className="empty-state">No students found. Try a different search, or add a new student.</div>;
  }

  return (
    <>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Branch</th>
              <th>Phone Number</th>
              <th>Email</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {students.map((s) => (
              <tr key={s._id}>
                <td>{s.studentName}</td>
                <td>{s.department}</td>
                <td>{s.phoneNumber}</td>
                <td>{s.email}</td>
                <td>
                  <div className="action-icons">
                    <button className="icon-btn edit" onClick={() => setEditingStudent(s)}>
                      Edit
                    </button>
                    <button className="icon-btn delete" onClick={() => setDeletingStudent(s)}>
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editingStudent && (
        <div className="modal-backdrop" onClick={() => setEditingStudent(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>Edit Student</h3>
            <StudentForm
              initialData={editingStudent}
              onSubmit={handleUpdate}
              onCancel={() => setEditingStudent(null)}
              submitLabel="Update"
            />
          </div>
        </div>
      )}

      {deletingStudent && (
        <div className="modal-backdrop" onClick={() => setDeletingStudent(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>Delete Student</h3>
            <p>
              Are you sure you want to delete <strong>{deletingStudent.studentName}</strong>?
            </p>
            <div className="modal-actions">
              <button className="btn btn-secondary" onClick={() => setDeletingStudent(null)}>
                Cancel
              </button>
              <button className="btn btn-danger" onClick={confirmDelete}>
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default StudentTable;
