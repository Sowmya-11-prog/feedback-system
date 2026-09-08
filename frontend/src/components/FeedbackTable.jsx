import React from "react";
import RatingStars from "./RatingStars";

const FeedbackTable = ({ feedbackList }) => {
  if (!feedbackList.length) {
    return <div className="empty-state">No feedback matches the current filters.</div>;
  }

  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Student Name</th>
            <th>Department</th>
            <th>Teacher Name</th>
            <th>Feedback</th>
            <th>Rating</th>
          </tr>
        </thead>
        <tbody>
          {feedbackList.map((f) => (
            <tr key={f._id}>
              <td>{f.studentName}</td>
              <td>{f.department}</td>
              <td>{f.teacherName}</td>
              <td>{f.feedback}</td>
              <td>
                <RatingStars rating={f.rating} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default FeedbackTable;
