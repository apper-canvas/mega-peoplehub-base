import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { format } from "date-fns";
import StatCard from "@/components/molecules/StatCard";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import leaveService from "@/services/api/leaveService";
import attendanceService from "@/services/api/attendanceService";

const Dashboard = () => {
  const navigate = useNavigate();
  const [leaveBalance, setLeaveBalance] = useState(null);
  const [recentLeaves, setRecentLeaves] = useState([]);
  const [recentAttendance, setRecentAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadData = async () => {
    try {
      setError("");
      setLoading(true);

      const [balance, leaves, attendance] = await Promise.all([
        leaveService.getBalance("1"),
        leaveService.getAll(),
        attendanceService.getByEmployeeId("1")
      ]);

      setLeaveBalance(balance);
      setRecentLeaves(leaves.slice(0, 3));
      setRecentAttendance(attendance.slice(0, 5));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadData} />;

const totalLeave = leaveBalance ? leaveBalance.annual_c + leaveBalance.sick_c + leaveBalance.casual_c : 0;
  const usedLeave = leaveBalance ? leaveBalance.used_annual_c + leaveBalance.used_sick_c + leaveBalance.used_casual_c : 0;
  const remainingLeave = totalLeave - usedLeave;
  const pendingRequests = recentLeaves.filter(l => l.status === "Pending").length;

  const getStatusBadge = (status) => {
    const variants = {
      Approved: "success",
      Pending: "warning",
      Rejected: "error",
      Present: "success",
      Late: "warning",
      Absent: "error"
    };
    return <Badge variant={variants[status]}>{status}</Badge>;
  };

  const announcements = [
    {
      id: 1,
      title: "Company Holiday - Martin Luther King Jr. Day",
      date: "2024-01-15",
      type: "Holiday"
    },
    {
      id: 2,
      title: "Q1 2024 Performance Reviews Starting",
      date: "2024-02-01",
      type: "Important"
    },
    {
      id: 3,
      title: "New Health Insurance Plans Available",
      date: "2024-01-20",
      type: "Benefits"
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome back, John!
        </h1>
        <p className="text-secondary">
          Here's what's happening with your HR information today
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          icon="Calendar"
          title="Leave Balance"
          value={remainingLeave}
          subtitle={`Out of ${totalLeave} days`}
          color="primary"
          borderColor="primary"
        />
        <StatCard
          icon="Clock"
          title="Pending Requests"
          value={pendingRequests}
          subtitle="Awaiting approval"
          color="warning"
          borderColor="warning"
        />
        <StatCard
          icon="CheckCircle"
          title="This Month"
          value="20/22"
          subtitle="Days present"
          color="success"
          borderColor="success"
        />
        <StatCard
          icon="TrendingUp"
          title="Work Hours"
          value="168h"
          subtitle="This month"
          color="info"
          borderColor="info"
        />
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="mb-8"
      >
        <Card className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button
              variant="secondary"
              className="flex flex-col items-center space-y-2 h-auto py-4"
              onClick={() => navigate("/leave")}
            >
              <ApperIcon name="Calendar" className="w-6 h-6" />
              <span>Request Leave</span>
            </Button>
            <Button
              variant="secondary"
              className="flex flex-col items-center space-y-2 h-auto py-4"
              onClick={() => navigate("/profile")}
            >
              <ApperIcon name="User" className="w-6 h-6" />
              <span>Update Profile</span>
            </Button>
            <Button
              variant="secondary"
              className="flex flex-col items-center space-y-2 h-auto py-4"
              onClick={() => navigate("/documents")}
            >
              <ApperIcon name="FileText" className="w-6 h-6" />
              <span>View Documents</span>
            </Button>
            <Button
              variant="secondary"
              className="flex flex-col items-center space-y-2 h-auto py-4"
              onClick={() => navigate("/directory")}
            >
              <ApperIcon name="Users" className="w-6 h-6" />
              <span>Employee Directory</span>
            </Button>
          </div>
        </Card>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Leave Requests */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Recent Leave Requests</h2>
              <Button variant="ghost" size="sm" onClick={() => navigate("/leave")}>
                View All
              </Button>
            </div>
            <div className="space-y-4">
              {recentLeaves.map((leave) => (
                <div key={leave.Id} className="flex items-start justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <ApperIcon name="Calendar" className="w-4 h-4 text-gray-400" />
                      <span className="font-medium text-gray-900">{leave.leaveType}</span>
                    </div>
                    <p className="text-sm text-secondary mb-1">
                      {format(new Date(leave.startDate), "MMM d")} - {format(new Date(leave.endDate), "MMM d, yyyy")}
                    </p>
                    <p className="text-sm text-gray-500">{leave.days} day{leave.days > 1 ? "s" : ""}</p>
                  </div>
                  <div>{getStatusBadge(leave.status)}</div>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Recent Attendance */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Recent Attendance</h2>
              <Button variant="ghost" size="sm" onClick={() => navigate("/attendance")}>
                View All
              </Button>
            </div>
            <div className="space-y-4">
              {recentAttendance.map((record) => (
                <div key={record.Id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <ApperIcon name="Clock" className="w-4 h-4 text-gray-400" />
                      <span className="font-medium text-gray-900">
                        {format(new Date(record.date), "EEEE, MMM d")}
                      </span>
                    </div>
                    {record.checkIn && (
                      <p className="text-sm text-secondary">
                        {record.checkIn} - {record.checkOut} ({record.workHours}h)
                      </p>
                    )}
                  </div>
                  <div>{getStatusBadge(record.status)}</div>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Announcements */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.4 }}
        className="mt-6"
      >
        <Card className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Company Announcements</h2>
          <div className="space-y-4">
            {announcements.map((announcement) => (
              <div key={announcement.id} className="flex items-start space-x-4 p-4 border border-gray-200 rounded-lg hover:border-primary transition-colors duration-200">
                <div className="flex-shrink-0 w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <ApperIcon name="Megaphone" className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <h3 className="font-medium text-gray-900">{announcement.title}</h3>
                    <Badge variant="info" className="text-xs">{announcement.type}</Badge>
                  </div>
                  <p className="text-sm text-secondary">
                    {format(new Date(announcement.date), "MMMM d, yyyy")}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default Dashboard;