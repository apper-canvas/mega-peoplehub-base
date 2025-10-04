const { ApperClient } = window.ApperSDK;

const apperClient = new ApperClient({
  apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
  apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
});

const documentService = {
  getAll: async () => {
    try {
      const response = await apperClient.fetchRecords("document_c", {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "title_c" } },
          { field: { Name: "category_c" } },
          { field: { Name: "file_url_c" } },
          { field: { Name: "upload_date_c" } },
          { field: { Name: "size_c" } }
        ]
      });

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching documents:", error.message);
      throw error;
    }
  },

  getById: async (id) => {
    try {
      const response = await apperClient.getRecordById("document_c", parseInt(id), {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "title_c" } },
          { field: { Name: "category_c" } },
          { field: { Name: "file_url_c" } },
          { field: { Name: "upload_date_c" } },
          { field: { Name: "size_c" } }
        ]
      });

      if (!response.success) {
        console.error(response.message);
        return null;
      }

      return response.data || null;
    } catch (error) {
      console.error(`Error fetching document ${id}:`, error.message);
      return null;
    }
  },

  getByCategory: async (category) => {
    try {
      const response = await apperClient.fetchRecords("document_c", {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "title_c" } },
          { field: { Name: "category_c" } },
          { field: { Name: "file_url_c" } },
          { field: { Name: "upload_date_c" } },
          { field: { Name: "size_c" } }
        ],
        where: [
          {
            FieldName: "category_c",
            Operator: "EqualTo",
            Values: [category]
          }
        ]
      });

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching documents by category:", error.message);
      throw error;
    }
  }
};

export default documentService;