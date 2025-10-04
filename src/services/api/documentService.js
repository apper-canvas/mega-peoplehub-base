import documentsData from "@/services/mockData/documents.json";

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const documentService = {
  getAll: async () => {
    await delay(300);
    return [...documentsData];
  },

  getById: async (id) => {
    await delay(200);
    const doc = documentsData.find(d => d.Id === parseInt(id));
    return doc ? { ...doc } : null;
  },

  getByCategory: async (category) => {
    await delay(300);
    return documentsData.filter(d => d.category === category).map(d => ({ ...d }));
  }
};

export default documentService;