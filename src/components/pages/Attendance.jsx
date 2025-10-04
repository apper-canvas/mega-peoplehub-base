import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, startOfWeek, endOfWeek } from "date-fns";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import attendanceService from "@/services/api/attendanceService";

const Attendance = () => {
  const [attendance, setAttendance] = useState([]);
  const [monthSummary, setMonthSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date());

  const loadData = async () => {
    try {
      setError("");
      setLoading(true);

      const [records, summary] = await Promise.all([
        attendanceService.getByEmployeeId("1"),
        attendanceService.getMonthSummary("1", selectedDate.getFullYear(), selectedDate.getMonth())
      ]);

      setAttendance(records);
      setMonthSummary(summary);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [selectedDate]);

  const getAttendanceForDate = (date) => {
    return attendance.find(a => isSameDay(new Date(a.date), date));
  };

  const getStatusColor = (status) => {
    const colors = {
      Present: "bg-success/10 text-success border-success/20",
      Late: "bg-warning/10 text-warning border-warning/20",
      Absent: "bg-error/10 text-error border-error/20"
    };
    return colors[status] || "bg-gray-100 text-gray-400 border-gray-200";
  };

  const monthStart = startOfMonth(selectedDate);
  const monthEnd = endOfMonth(selectedDate);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);
  const days = eachDayOfInterval({ start: startDate, end: endDate });

  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadData} />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Attendance Tracker</h1>
        <p className="text-secondary">View your attendance history and work hours</p>
      </div>

      {/* Month Summary */}
      {monthSummary && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-8"
        >
          <Card className="p-4 md:p-6 border-l-4 border-l-success">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-secondary">Present Days</span>
              <ApperIcon name="CheckCircle" className="w-5 h-5 text-success" />
            </div>
            <div className="text-2xl md:text-3xl font-bold text-gray-900">
              {monthSummary.presentDays}
            </div>
          </Card>

          <Card className="p-4 md:p-6 border-l-4 border-l-warning">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-secondary">Late Days</span>
              <ApperIcon name="Clock" className="w-5 h-5 text-warning" />
            </div>
            <div className="text-2xl md:text-3xl font-bold text-gray-900">
              {monthSummary.lateDays}
            </div>
          </Card>

          <Card className="p-4 md:p-6 border-l-4 border-l-error">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-secondary">Absent Days</span>
              <ApperIcon name="XCircle" className="w-5 h-5 text-error" />
            </div>
            <div className="text-2xl md:text-3xl font-bold text-gray-900">
              {monthSummary.absentDays}
            </div>
          </Card>

          <Card className="p-4 md:p-6 border-l-4 border-l-primary">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-secondary">Total Hours</span>
              <ApperIcon name="TrendingUp" className="w-5 h-5 text-primary" />
            </div>
            <div className="text-2xl md:text-3xl font-bold text-gray-900">
              {monthSummary.totalHours}h
            </div>
          </Card>
        </motion.div>
      )}

      {/* Calendar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <Card className="p-4 md:p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              {format(selectedDate, "MMMM yyyy")}
            </h2>
            <div className="flex space-x-2">
              <button
                onClick={() => setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() - 1))}
                className="p-2 hover:bg-gray-100 rounded-md transition-colors duration-200"
              >
                <ApperIcon name="ChevronLeft" className="w-5 h-5 text-gray-600" />
              </button>
              <button
                onClick={() => setSelectedDate(new Date())}
                className="px-4 py-2 text-sm font-medium text-primary hover:bg-primary/10 rounded-md transition-colors duration-200"
              >
                Today
              </button>
              <button
                onClick={() => setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1))}
                className="p-2 hover:bg-gray-100 rounded-md transition-colors duration-200"
              >
                <ApperIcon name="ChevronRight" className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-2 md:gap-4">
            {weekDays.map(day => (
              <div key={day} className="text-center text-sm font-semibold text-gray-900 py-2">
                {day}
              </div>
            ))}

            {days.map((day, index) => {
              const attendanceRecord = getAttendanceForDate(day);
              const isCurrentMonth = day.getMonth() === selectedDate.getMonth();
              const isToday = isSameDay(day, new Date());

              return (
                <div
                  key={index}
                  className={`aspect-square p-2 border rounded-lg transition-all duration-200 ${
                    isCurrentMonth ? "border-gray-200 bg-white" : "border-gray-100 bg-gray-50"
                  } ${isToday ? "ring-2 ring-primary" : ""}`}
                >
                  <div className="h-full flex flex-col">
                    <span className={`text-sm font-medium mb-1 ${
                      isCurrentMonth ? "text-gray-900" : "text-gray-400"
                    }`}>
                      {format(day, "d")}
                    </span>
                    {attendanceRecord && isCurrentMonth && (
                      <div className={`flex-1 flex items-center justify-center rounded px-1 py-0.5 border ${getStatusColor(attendanceRecord.status)}`}>
                        <span className="text-xs font-medium">{attendanceRecord.status}</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-center space-x-6 mt-6 pt-6 border-t border-gray-200">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-success/10 border border-success/20 rounded"></div>
              <span className="text-sm text-secondary">Present</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-warning/10 border border-warning/20 rounded"></div>
              <span className="text-sm text-secondary">Late</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-error/10 border border-error/20 rounded"></div>
              <span className="text-sm text-secondary">Absent</span>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Recent Attendance Details */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
        className="mt-8"
      >
        <Card className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Recent Attendance Details</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">Date</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">Check In</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">Check Out</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">Work Hours</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">Status</th>
                </tr>
              </thead>
              <tbody>
                {attendance.slice(0, 10).map((record) => (
                  <tr key={record.Id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors duration-150">
                    <td className="py-4 px-4 text-sm text-gray-900">
                      {format(new Date(record.date), "EEE, MMM d, yyyy")}
                    </td>
                    <td className="py-4 px-4 text-sm text-secondary">
                      {record.checkIn || "-"}
                    </td>
                    <td className="py-4 px-4 text-sm text-secondary">
                      {record.checkOut || "-"}
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-900">
                      {record.workHours}h
                    </td>
                    <td className="py-4 px-4">
                      <Badge variant={
                        record.status === "Present" ? "success" :
                        record.status === "Late" ? "warning" : "error"
                      }>
                        {record.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default Attendance;