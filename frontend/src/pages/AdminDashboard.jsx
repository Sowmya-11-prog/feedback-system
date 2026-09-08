import React, { useEffect, useState } from "react";
import { Bar, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import DashboardCard from "../components/DashboardCard";
import api from "../services/api";

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend);

const GOLD = "#C9A15A";
const NAVY = "#1F3A5F";

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await api.get("/dashboard/stats");
        setStats(data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load dashboard stats");
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="app-shell">
      <Navbar />
      <div className="body-area">
        <Sidebar />
        <main className="main-content">
          <div className="page-header">
            <div>
              <h1>Dashboard</h1>
              <p>An overview of student feedback across departments and teachers.</p>
            </div>
          </div>

          {loading && <p className="loading-text">Loading dashboard...</p>}
          {error && <div className="alert alert-error">{error}</div>}

          {stats && (
            <>
              <div className="card-grid">
                <DashboardCard label="Total Students" value={stats.totalStudents} />
                <DashboardCard label="Total Feedback" value={stats.totalFeedback} />
                <DashboardCard label="Average Rating" value={stats.averageRating} />
                <DashboardCard label="Total Departments" value={stats.totalDepartments} />
                <DashboardCard label="Total Teachers" value={stats.totalTeachers} />
              </div>

              <div className="card-grid">
                <DashboardCard label="5-Star Feedback" value={stats.fiveStar} />
                <DashboardCard label="4-Star Feedback" value={stats.fourStar} />
                <DashboardCard label="3-Star Feedback" value={stats.threeStar} />
                <DashboardCard label="2-Star Feedback" value={stats.twoStar} />
                <DashboardCard label="1-Star Feedback" value={stats.oneStar} />
              </div>

              <div className="chart-grid">
                <div className="panel">
                  <h3>Rating Distribution</h3>
                  <Doughnut
                    data={{
                      labels: ["5 Star", "4 Star", "3 Star", "2 Star", "1 Star"],
                      datasets: [
                        {
                          data: [stats.fiveStar, stats.fourStar, stats.threeStar, stats.twoStar, stats.oneStar],
                          backgroundColor: ["#1F3A5F", "#3E6690", "#C9A15A", "#D9BE8B", "#B3432B"],
                          borderWidth: 0,
                        },
                      ],
                    }}
                  />
                </div>

                <div className="panel">
                  <h3>Feedback by Department</h3>
                  <Bar
                    data={{
                      labels: stats.departmentBreakdown.map((d) => d.department),
                      datasets: [
                        {
                          label: "Feedback entries",
                          data: stats.departmentBreakdown.map((d) => d.count),
                          backgroundColor: NAVY,
                          borderRadius: 4,
                        },
                      ],
                    }}
                    options={{ plugins: { legend: { display: false } } }}
                  />
                </div>

                <div className="panel">
                  <h3>Average Rating by Teacher</h3>
                  <Bar
                    data={{
                      labels: stats.teacherBreakdown.map((t) => t.teacherName),
                      datasets: [
                        {
                          label: "Average rating",
                          data: stats.teacherBreakdown.map((t) => t.avgRating),
                          backgroundColor: GOLD,
                          borderRadius: 4,
                        },
                      ],
                    }}
                    options={{
                      scales: { y: { min: 0, max: 5 } },
                      plugins: { legend: { display: false } },
                    }}
                  />
                </div>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
