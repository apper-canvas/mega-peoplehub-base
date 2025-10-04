import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import SearchBar from "@/components/molecules/SearchBar";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import employeeService from "@/services/api/employeeService";

const Directory = () => {
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("All");
  const [viewMode, setViewMode] = useState("grid");

  const loadData = async () => {
    try {
      setError("");
      setLoading(true);
      const data = await employeeService.getAll();
      setEmployees(data);
      setFilteredEmployees(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
let filtered = employees;

    if (selectedDepartment !== "All") {
      filtered = filtered.filter(emp => emp.department_c === selectedDepartment);
    }

    if (searchTerm) {
      filtered = filtered.filter(emp =>
        emp.name_c.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.role_c.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredEmployees(filtered);
  }, [searchTerm, selectedDepartment, employees]);

const departments = ["All", ...new Set(employees.map(emp => emp.department_c))];

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadData} />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Employee Directory</h1>
          <p className="text-secondary">Find and connect with your colleagues</p>
        </div>
        <div className="flex items-center space-x-2 mt-4 sm:mt-0">
          <Button
            variant={viewMode === "grid" ? "primary" : "ghost"}
            size="sm"
            onClick={() => setViewMode("grid")}
          >
            <ApperIcon name="Grid3x3" className="w-5 h-5" />
          </Button>
          <Button
            variant={viewMode === "list" ? "primary" : "ghost"}
            size="sm"
            onClick={() => setViewMode("list")}
          >
            <ApperIcon name="List" className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="mb-8"
      >
        <Card className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <SearchBar
              placeholder="Search by name or role..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Department
              </label>
              <select
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
                className="w-full px-4 py-2.5 text-sm text-gray-900 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
              >
                {departments.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Results */}
      {filteredEmployees.length === 0 ? (
        <Empty
          icon="Users"
          title="No employees found"
          message="Try adjusting your search or filter criteria"
        />
      ) : (
        <>
          {viewMode === "grid" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEmployees.map((employee, index) => (
<motion.div
                  key={employee.Id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <Card className="p-6 h-full hover:shadow-lg transition-all duration-200">
                    <div className="flex flex-col items-center text-center">
                      <div className="w-20 h-20 bg-gradient-to-br from-primary to-primary-dark rounded-full flex items-center justify-center text-white text-xl font-bold mb-4">
                        {employee.name_c.split(" ").map(n => n[0]).join("")}
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        {employee.name_c}
                      </h3>
                      <p className="text-sm text-secondary mb-2">{employee.role_c}</p>
                      <span className="inline-block px-3 py-1 text-xs font-medium bg-primary/10 text-primary rounded-full mb-4">
                        {employee.department_c}
                      </span>
                      <div className="w-full space-y-2 text-sm text-secondary">
                        <div className="flex items-center justify-center space-x-2">
                          <ApperIcon name="Mail" className="w-4 h-4" />
                          <span className="truncate">{employee.email_c}</span>
                        </div>
                        <div className="flex items-center justify-center space-x-2">
                          <ApperIcon name="Phone" className="w-4 h-4" />
                          <span>{employee.phone_c}</span>
                        </div>
                      </div>
                      <div className="flex space-x-2 mt-4 w-full">
                        <Button variant="secondary" size="sm" className="flex-1">
                          <ApperIcon name="Mail" className="w-4 h-4 mr-2" />
                          Email
                        </Button>
                        <Button variant="secondary" size="sm" className="flex-1">
                          <ApperIcon name="Phone" className="w-4 h-4 mr-2" />
                          Call
                        </Button>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          ) : (
            <Card className="p-6">
              <div className="space-y-4">
                {filteredEmployees.map((employee, index) => (
                  <motion.div
key={employee.Id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-primary hover:shadow-md transition-all duration-200"
                  >
                    <div className="flex items-center space-x-4 flex-1 min-w-0">
                      <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-primary to-primary-dark rounded-full flex items-center justify-center text-white font-bold">
                        {employee.name_c.split(" ").map(n => n[0]).join("")}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">
                          {employee.name_c}
                        </h3>
                        <p className="text-sm text-secondary mb-1">{employee.role_c}</p>
                        <div className="flex items-center space-x-4 text-sm text-secondary">
                          <div className="flex items-center space-x-1">
                            <ApperIcon name="Briefcase" className="w-4 h-4" />
                            <span>{employee.department_c}</span>
                          </div>
                          <div className="flex items-center space-x-1 truncate">
                            <ApperIcon name="Mail" className="w-4 h-4" />
                            <span className="truncate">{employee.email_c}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <ApperIcon name="Phone" className="w-4 h-4" />
                            <span>{employee.phone_c}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-2 ml-4">
                      <Button variant="ghost" size="sm">
                        <ApperIcon name="Mail" className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <ApperIcon name="Phone" className="w-4 h-4" />
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </Card>
          )}
        </>
      )}
    </div>
  );
};

export default Directory;