const { ApperClient } = window.ApperSDK;

const apperClient = new ApperClient({
  apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
  apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
});

const employeeService = {
  getAll: async () => {
    try {
      const response = await apperClient.fetchRecords("employee_c", {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "name_c" } },
          { field: { Name: "email_c" } },
          { field: { Name: "phone_c" } },
          { field: { Name: "department_c" } },
          { field: { Name: "role_c" } },
          { field: { Name: "join_date_c" } },
          { field: { Name: "address_c" } },
          { field: { Name: "emergency_contact_name_c" } },
          { field: { Name: "emergency_contact_relationship_c" } },
          { field: { Name: "emergency_contact_phone_c" } }
        ]
      });

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching employees:", error.message);
      throw error;
    }
  },

  getById: async (id) => {
    try {
      const response = await apperClient.getRecordById("employee_c", parseInt(id), {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "name_c" } },
          { field: { Name: "email_c" } },
          { field: { Name: "phone_c" } },
          { field: { Name: "department_c" } },
          { field: { Name: "role_c" } },
          { field: { Name: "join_date_c" } },
          { field: { Name: "address_c" } },
          { field: { Name: "emergency_contact_name_c" } },
          { field: { Name: "emergency_contact_relationship_c" } },
          { field: { Name: "emergency_contact_phone_c" } }
        ]
      });

      if (!response.success) {
        console.error(response.message);
        return null;
      }

      return response.data || null;
    } catch (error) {
      console.error(`Error fetching employee ${id}:`, error.message);
      return null;
    }
  },

  getCurrentEmployee: async () => {
    try {
      const response = await apperClient.fetchRecords("employee_c", {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "name_c" } },
          { field: { Name: "email_c" } },
          { field: { Name: "phone_c" } },
          { field: { Name: "department_c" } },
          { field: { Name: "role_c" } },
          { field: { Name: "join_date_c" } },
          { field: { Name: "address_c" } },
          { field: { Name: "emergency_contact_name_c" } },
          { field: { Name: "emergency_contact_relationship_c" } },
          { field: { Name: "emergency_contact_phone_c" } }
        ],
        pagingInfo: { limit: 1, offset: 0 }
      });

      if (!response.success) {
        console.error(response.message);
        return null;
      }

      return response.data?.[0] || null;
    } catch (error) {
      console.error("Error fetching current employee:", error.message);
      return null;
    }
  },

  update: async (id, data) => {
    try {
      const updateData = {
        Id: parseInt(id)
      };

      if (data.name_c !== undefined) updateData.name_c = data.name_c;
      if (data.email_c !== undefined) updateData.email_c = data.email_c;
      if (data.phone_c !== undefined) updateData.phone_c = data.phone_c;
      if (data.address_c !== undefined) updateData.address_c = data.address_c;
      if (data.emergency_contact_name_c !== undefined) updateData.emergency_contact_name_c = data.emergency_contact_name_c;
      if (data.emergency_contact_relationship_c !== undefined) updateData.emergency_contact_relationship_c = data.emergency_contact_relationship_c;
      if (data.emergency_contact_phone_c !== undefined) updateData.emergency_contact_phone_c = data.emergency_contact_phone_c;

      const response = await apperClient.updateRecord("employee_c", {
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
      console.error("Error updating employee:", error.message);
      return null;
    }
  }
};

export default employeeService;