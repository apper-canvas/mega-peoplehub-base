import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { format, differenceInDays } from "date-fns";
import { toast } from "react-toastify";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import FormField from "@/components/molecules/FormField";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import leaveService from "@/services/api/leaveService";

const Leave = () => {
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [leaveBalance, setLeaveBalance] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    leaveType: "Annual",
    startDate: "",
    endDate: "",
    reason: ""
  });

  const loadData = async () => {
    try {
      setError("");
      setLoading(true);

      const [requests, balance] = await Promise.all([
        leaveService.getAll(),
        leaveService.getBalance("1")
      ]);

      setLeaveRequests(requests.sort((a, b) => new Date(b.submittedDate) - new Date(a.submittedDate)));
      setLeaveBalance(balance);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.startDate || !formData.endDate || !formData.reason.trim()) {
      toast.error("Please fill in all required fields");
      return;
    }

    const days = differenceInDays(new Date(formData.endDate), new Date(formData.startDate)) + 1;
    
    if (days <= 0) {
      toast.error("End date must be after start date");
      return;
    }

    try {
      const newLeave = await leaveService.create({
        employeeId: "1",
        ...formData,
        days
      });

      setLeaveRequests([newLeave, ...leaveRequests]);
      setShowForm(false);
      setFormData({
        leaveType: "Annual",
        startDate: "",
        endDate: "",
        reason: ""
      });
      toast.success("Leave request submitted successfully!");
    } catch (err) {
      toast.error("Failed to submit leave request");
    }
  };

  const handleCancel = async (id) => {
    if (!window.confirm("Are you sure you want to cancel this leave request?")) {
      return;
    }

    try {
      await leaveService.delete(id);
      setLeaveRequests(leaveRequests.filter(l => l.Id !== id));
      toast.success("Leave request cancelled successfully!");
    } catch (err) {
      toast.error("Failed to cancel leave request");
    }
  };

  const getStatusBadge = (status) => {
    const variants = {
      Approved: "success",
      Pending: "warning",
      Rejected: "error"
    };
    return <Badge variant={variants[status]}>{status}</Badge>;
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadData} />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Leave Management</h1>
          <p className="text-secondary">Request and manage your time off</p>
        </div>
        <Button
          onClick={() => setShowForm(!showForm)}
          className="mt-4 sm:mt-0"
        >
          <ApperIcon name="Plus" className="w-5 h-5 mr-2" />
          Request Leave
        </Button>
      </div>

      {/* Leave Balance */}
      {leaveBalance && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
        >
          <Card className="p-6 border-l-4 border-l-primary">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-secondary">Annual Leave</span>
              <ApperIcon name="Calendar" className="w-5 h-5 text-primary" />
            </div>
            <div className="space-y-2">
              <div className="flex items-baseline space-x-2">
                <span className="text-3xl font-bold text-gray-900">
                  {leaveBalance.annual - leaveBalance.used.annual}
                </span>
                <span className="text-sm text-secondary">/ {leaveBalance.annual} days</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-primary h-2 rounded-full"
                  style={{ width: `${((leaveBalance.annual - leaveBalance.used.annual) / leaveBalance.annual) * 100}%` }}
                />
              </div>
            </div>
          </Card>

          <Card className="p-6 border-l-4 border-l-success">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-secondary">Sick Leave</span>
              <ApperIcon name="Heart" className="w-5 h-5 text-success" />
            </div>
            <div className="space-y-2">
              <div className="flex items-baseline space-x-2">
                <span className="text-3xl font-bold text-gray-900">
                  {leaveBalance.sick - leaveBalance.used.sick}
                </span>
                <span className="text-sm text-secondary">/ {leaveBalance.sick} days</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-success h-2 rounded-full"
                  style={{ width: `${((leaveBalance.sick - leaveBalance.used.sick) / leaveBalance.sick) * 100}%` }}
                />
              </div>
            </div>
          </Card>

          <Card className="p-6 border-l-4 border-l-info">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-secondary">Casual Leave</span>
              <ApperIcon name="Coffee" className="w-5 h-5 text-info" />
            </div>
            <div className="space-y-2">
              <div className="flex items-baseline space-x-2">
                <span className="text-3xl font-bold text-gray-900">
                  {leaveBalance.casual - leaveBalance.used.casual}
                </span>
                <span className="text-sm text-secondary">/ {leaveBalance.casual} days</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-info h-2 rounded-full"
                  style={{ width: `${((leaveBalance.casual - leaveBalance.used.casual) / leaveBalance.casual) * 100}%` }}
                />
              </div>
            </div>
          </Card>
        </motion.div>
      )}

      {/* Leave Request Form */}
      {showForm && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-8"
        >
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">New Leave Request</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Leave Type
                  </label>
                  <select
                    value={formData.leaveType}
                    onChange={(e) => setFormData({ ...formData, leaveType: e.target.value })}
                    className="w-full px-4 py-2.5 text-sm text-gray-900 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                  >
                    <option value="Annual">Annual Leave</option>
                    <option value="Sick">Sick Leave</option>
                    <option value="Casual">Casual Leave</option>
                  </select>
                </div>

                <FormField
                  label="Start Date"
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  required
                />

                <FormField
                  label="End Date"
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  required
                />

                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Duration
                  </label>
                  <div className="px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-md text-sm text-gray-900">
                    {formData.startDate && formData.endDate
                      ? `${differenceInDays(new Date(formData.endDate), new Date(formData.startDate)) + 1} day(s)`
                      : "Select dates"}
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Reason
                </label>
                <textarea
                  value={formData.reason}
                  onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-2.5 text-sm text-gray-900 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary resize-none"
                  placeholder="Please provide a reason for your leave request..."
                  required
                />
              </div>

              <div className="flex space-x-4">
                <Button type="submit">Submit Request</Button>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => {
                    setShowForm(false);
                    setFormData({
                      leaveType: "Annual",
                      startDate: "",
                      endDate: "",
                      reason: ""
                    });
                  }}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </Card>
        </motion.div>
      )}

      {/* Leave History */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Leave History</h2>
        {leaveRequests.length === 0 ? (
          <Empty
            icon="Calendar"
            title="No leave requests yet"
            message="Ready to take some time off? Submit your first leave request above."
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">Type</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">Start Date</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">End Date</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">Days</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">Status</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">Submitted</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody>
                {leaveRequests.map((leave) => (
                  <tr key={leave.Id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors duration-150">
                    <td className="py-4 px-4 text-sm text-gray-900">{leave.leaveType}</td>
                    <td className="py-4 px-4 text-sm text-secondary">
                      {format(new Date(leave.startDate), "MMM d, yyyy")}
                    </td>
                    <td className="py-4 px-4 text-sm text-secondary">
                      {format(new Date(leave.endDate), "MMM d, yyyy")}
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-900">{leave.days}</td>
                    <td className="py-4 px-4">{getStatusBadge(leave.status)}</td>
                    <td className="py-4 px-4 text-sm text-secondary">
                      {format(new Date(leave.submittedDate), "MMM d, yyyy")}
                    </td>
                    <td className="py-4 px-4 text-right">
                      {leave.status === "Pending" && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleCancel(leave.Id)}
                          className="text-error hover:bg-error/10"
                        >
                          <ApperIcon name="X" className="w-4 h-4 mr-1" />
                          Cancel
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
};

export default Leave;