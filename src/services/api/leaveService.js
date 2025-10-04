const { ApperClient } = window.ApperSDK;

const apperClient = new ApperClient({
  apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
  apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
});

const leaveService = {
  getAll: async () => {
    try {
      const response = await apperClient.fetchRecords("leave_request_c", {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "leave_type_c" } },
          { field: { Name: "start_date_c" } },
          { field: { Name: "end_date_c" } },
          { field: { Name: "days_c" } },
          { field: { Name: "reason_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "submitted_date_c" } },
          { field: { Name: "employee_id_c" } }
        ],
        orderBy: [{ fieldName: "submitted_date_c", sorttype: "DESC" }]
      });

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching leave requests:", error.message);
      throw error;
    }
  },

  getById: async (id) => {
    try {
      const response = await apperClient.getRecordById("leave_request_c", parseInt(id), {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "leave_type_c" } },
          { field: { Name: "start_date_c" } },
          { field: { Name: "end_date_c" } },
          { field: { Name: "days_c" } },
          { field: { Name: "reason_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "submitted_date_c" } },
          { field: { Name: "employee_id_c" } }
        ]
      });

      if (!response.success) {
        console.error(response.message);
        return null;
      }

      return response.data || null;
    } catch (error) {
      console.error(`Error fetching leave request ${id}:`, error.message);
      return null;
    }
  },

  getBalance: async (employeeId) => {
    try {
      const response = await apperClient.fetchRecords("leave_balance_c", {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "annual_c" } },
          { field: { Name: "sick_c" } },
          { field: { Name: "casual_c" } },
          { field: { Name: "used_annual_c" } },
          { field: { Name: "used_sick_c" } },
          { field: { Name: "used_casual_c" } },
          { field: { Name: "employee_id_c" } }
        ],
        where: [
          {
            FieldName: "employee_id_c",
            Operator: "EqualTo",
            Values: [parseInt(employeeId)]
          }
        ],
        pagingInfo: { limit: 1, offset: 0 }
      });

      if (!response.success) {
        console.error(response.message);
        return null;
      }

      return response.data?.[0] || null;
    } catch (error) {
      console.error("Error fetching leave balance:", error.message);
      return null;
    }
  },

  create: async (leaveData) => {
    try {
      const createData = {};
      
      if (leaveData.employee_id_c !== undefined) createData.employee_id_c = parseInt(leaveData.employee_id_c);
      if (leaveData.leave_type_c !== undefined) createData.leave_type_c = leaveData.leave_type_c;
      if (leaveData.start_date_c !== undefined) createData.start_date_c = leaveData.start_date_c;
      if (leaveData.end_date_c !== undefined) createData.end_date_c = leaveData.end_date_c;
      if (leaveData.days_c !== undefined) createData.days_c = parseInt(leaveData.days_c);
      if (leaveData.reason_c !== undefined) createData.reason_c = leaveData.reason_c;
      if (leaveData.status_c !== undefined) createData.status_c = leaveData.status_c;
      if (leaveData.submitted_date_c !== undefined) createData.submitted_date_c = leaveData.submitted_date_c;

      const response = await apperClient.createRecord("leave_request_c", {
        records: [createData]
      });

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);

        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} records:`, failed);
        }

        return successful[0]?.data || null;
      }

      return null;
    } catch (error) {
      console.error("Error creating leave request:", error.message);
      throw error;
    }
  },

  update: async (id, data) => {
    try {
      const updateData = {
        Id: parseInt(id)
      };

      if (data.leave_type_c !== undefined) updateData.leave_type_c = data.leave_type_c;
      if (data.start_date_c !== undefined) updateData.start_date_c = data.start_date_c;
      if (data.end_date_c !== undefined) updateData.end_date_c = data.end_date_c;
      if (data.days_c !== undefined) updateData.days_c = parseInt(data.days_c);
      if (data.reason_c !== undefined) updateData.reason_c = data.reason_c;
      if (data.status_c !== undefined) updateData.status_c = data.status_c;

      const response = await apperClient.updateRecord("leave_request_c", {
        records: [updateData]
      });

      if (!response.success) {
        console.error(response.message);
        return null;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);

        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} records:`, failed);
        }

        return successful[0]?.data || null;
      }

      return null;
    } catch (error) {
      console.error("Error updating leave request:", error.message);
      return null;
    }
  },

  delete: async (id) => {
    try {
      const response = await apperClient.deleteRecord("leave_request_c", {
        RecordIds: [parseInt(id)]
      });

      if (!response.success) {
        console.error(response.message);
        return false;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);

        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} records:`, failed);
        }

        return successful.length > 0;
      }

      return false;
    } catch (error) {
      console.error("Error deleting leave request:", error.message);
      return false;
    }
  }
};

export default leaveService;