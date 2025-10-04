import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import FormField from "@/components/molecules/FormField";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import employeeService from "@/services/api/employeeService";

const Profile = () => {
const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("personal");
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name_c: "",
    email_c: "",
    phone_c: "",
    address_c: "",
    emergency_contact_name_c: "",
    emergency_contact_relationship_c: "",
    emergency_contact_phone_c: ""
  });

const loadData = async () => {
    try {
      setError("");
      setLoading(true);
      const data = await employeeService.getCurrentEmployee();
      setEmployee(data);
      setFormData({
        name_c: data.name_c,
        email_c: data.email_c,
        phone_c: data.phone_c,
        address_c: data.address_c,
        emergency_contact_name_c: data.emergency_contact_name_c,
        emergency_contact_relationship_c: data.emergency_contact_relationship_c,
        emergency_contact_phone_c: data.emergency_contact_phone_c
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSave = async () => {
    try {
      await employeeService.update(employee.Id, formData);
      setEmployee({ ...employee, ...formData });
      setIsEditing(false);
      toast.success("Profile updated successfully!");
    } catch (err) {
      toast.error("Failed to update profile");
    }
  };

  const handleCancel = () => {
    setFormData({
      name: employee.name,
      email: employee.email,
      phone: employee.phone,
      address: employee.address,
      emergencyContact: employee.emergencyContact
    });
    setIsEditing(false);
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadData} />;

  const tabs = [
    { id: "personal", label: "Personal Info", icon: "User" },
    { id: "contact", label: "Contact Info", icon: "Phone" },
    { id: "emergency", label: "Emergency Contact", icon: "AlertCircle" }
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Profile</h1>
          <p className="text-secondary">View and manage your personal information</p>
        </div>
        {!isEditing ? (
          <Button onClick={() => setIsEditing(true)} className="mt-4 sm:mt-0">
            <ApperIcon name="Edit2" className="w-5 h-5 mr-2" />
            Edit Profile
          </Button>
        ) : (
          <div className="flex space-x-3 mt-4 sm:mt-0">
            <Button onClick={handleSave}>
              <ApperIcon name="Check" className="w-5 h-5 mr-2" />
              Save Changes
            </Button>
            <Button variant="secondary" onClick={handleCancel}>
              Cancel
            </Button>
          </div>
        )}
      </div>

      {/* Profile Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="p-6 mb-8">
          <div className="flex items-center space-x-6">
<div className="w-24 h-24 bg-gradient-to-br from-primary to-primary-dark rounded-full flex items-center justify-center text-white text-3xl font-bold">
              {employee.name_c.split(" ").map(n => n[0]).join("")}
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900">{employee.name_c}</h2>
              <p className="text-secondary mt-1">{employee.role_c}</p>
              <div className="flex items-center space-x-4 mt-3">
                <div className="flex items-center space-x-2 text-sm text-secondary">
                  <ApperIcon name="Briefcase" className="w-4 h-4" />
                  <span>{employee.department_c}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-secondary">
                  <ApperIcon name="Calendar" className="w-4 h-4" />
                  <span>Joined {new Date(employee.join_date_c).toLocaleDateString("en-US", { month: "short", year: "numeric" })}</span>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <Card className="p-6">
          <div className="border-b border-gray-200 mb-6">
            <div className="flex space-x-8">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 pb-4 border-b-2 transition-colors duration-200 ${
                    activeTab === tab.id
                      ? "border-primary text-primary"
                      : "border-transparent text-secondary hover:text-gray-900"
                  }`}
                >
                  <ApperIcon name={tab.icon} className="w-5 h-5" />
                  <span className="font-medium">{tab.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Personal Info Tab */}
          {activeTab === "personal" && (
            <div className="space-y-6">
              <FormField
                label="Full Name"
value={formData.name_c}
                onChange={(e) => setFormData({ ...formData, name_c: e.target.value })}
                disabled={!isEditing}
              />
              <FormField
                label="Email Address"
                type="email"
                value={formData.email_c}
                onChange={(e) => setFormData({ ...formData, email_c: e.target.value })}
                disabled={!isEditing}
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Department
                  </label>
                  <div className="px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-md text-sm text-gray-900">
{employee.department_c}
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Role
                  </label>
                  <div className="px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-md text-sm text-gray-900">
                    {employee.role_c}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Contact Info Tab */}
          {activeTab === "contact" && (
            <div className="space-y-6">
              <FormField
                label="Phone Number"
                type="tel"
value={formData.phone_c}
                onChange={(e) => setFormData({ ...formData, phone_c: e.target.value })}
                disabled={!isEditing}
              />
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Address
                </label>
                <textarea
                  value={formData.address_c}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  disabled={!isEditing}
                  rows={3}
                  className="w-full px-4 py-2.5 text-sm text-gray-900 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary resize-none disabled:bg-gray-50 disabled:cursor-not-allowed"
                />
              </div>
            </div>
          )}

          {/* Emergency Contact Tab */}
          {activeTab === "emergency" && (
            <div className="space-y-6">
              <FormField
                label="Emergency Contact Name"
value={formData.emergency_contact_name_c}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    emergency_contact_name_c: e.target.value
                  })
                }
                disabled={!isEditing}
              />
              <FormField
                label="Relationship"
                value={formData.emergency_contact_relationship_c}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    emergency_contact_relationship_c: e.target.value
                  })
                }
                disabled={!isEditing}
              />
              <FormField
                label="Emergency Contact Phone"
                type="tel"
                value={formData.emergency_contact_phone_c}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    emergency_contact_phone_c: e.target.value
                  })
                }
                disabled={!isEditing}
              />
            </div>
          )}
        </Card>
      </motion.div>
    </div>
  );
};

export default Profile;