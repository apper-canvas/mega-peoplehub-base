const { ApperClient } = window.ApperSDK;

const apperClient = new ApperClient({
  apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
  apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
});

const attendanceService = {
  getAll: async () => {
    try {
      const response = await apperClient.fetchRecords("attendance_c", {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "date_c" } },
          { field: { Name: "check_in_c" } },
          { field: { Name: "check_out_c" } },
          { field: { Name: "work_hours_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "employee_id_c" } }
        ],
        orderBy: [{ fieldName: "date_c", sorttype: "DESC" }]
      });

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching attendance records:", error.message);
      throw error;
    }
  },

  getByEmployeeId: async (employeeId) => {
    try {
      const response = await apperClient.fetchRecords("attendance_c", {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "date_c" } },
          { field: { Name: "check_in_c" } },
          { field: { Name: "check_out_c" } },
          { field: { Name: "work_hours_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "employee_id_c" } }
        ],
        where: [
          {
            FieldName: "employee_id_c",
            Operator: "EqualTo",
            Values: [parseInt(employeeId)]
          }
        ],
        orderBy: [{ fieldName: "date_c", sorttype: "DESC" }]
      });

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching attendance by employee:", error.message);
      throw error;
    }
  },

  getMonthSummary: async (employeeId, year, month) => {
    try {
      const startDate = new Date(year, month, 1);
      const endDate = new Date(year, month + 1, 0);

      const response = await apperClient.fetchRecords("attendance_c", {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "date_c" } },
          { field: { Name: "work_hours_c" } },
          { field: { Name: "status_c" } }
        ],
        where: [
          {
            FieldName: "employee_id_c",
            Operator: "EqualTo",
            Values: [parseInt(employeeId)]
          },
          {
            FieldName: "date_c",
            Operator: "GreaterThanOrEqualTo",
            Values: [startDate.toISOString().split("T")[0]]
          },
          {
            FieldName: "date_c",
            Operator: "LessThanOrEqualTo",
            Values: [endDate.toISOString().split("T")[0]]
          }
        ]
      });

      if (!response.success) {
        console.error(response.message);
        return {
          totalDays: 0,
          presentDays: 0,
          lateDays: 0,
          absentDays: 0,
          totalHours: 0
        };
      }

      const records = response.data || [];
      const summary = {
        totalDays: records.length,
        presentDays: records.filter(r => r.status_c === "Present").length,
        lateDays: records.filter(r => r.status_c === "Late").length,
        absentDays: records.filter(r => r.status_c === "Absent").length,
        totalHours: records.reduce((sum, r) => sum + (parseFloat(r.work_hours_c) || 0), 0)
      };

      return summary;
    } catch (error) {
      console.error("Error fetching month summary:", error.message);
      return {
        totalDays: 0,
        presentDays: 0,
        lateDays: 0,
        absentDays: 0,
        totalHours: 0
      };
    }
  }
};

export default attendanceService;