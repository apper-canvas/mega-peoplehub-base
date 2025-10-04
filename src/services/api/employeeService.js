import employeesData from "@/services/mockData/employees.json";

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const employeeService = {
  getAll: async () => {
    await delay(300);
    return [...employeesData];
  },

  getById: async (id) => {
    await delay(200);
    const employee = employeesData.find(emp => emp.Id === parseInt(id));
    return employee ? { ...employee } : null;
  },

  getCurrentEmployee: async () => {
    await delay(200);
    return { ...employeesData[0] };
  },

  update: async (id, data) => {
    await delay(300);
    const index = employeesData.findIndex(emp => emp.Id === parseInt(id));
    if (index !== -1) {
      employeesData[index] = { ...employeesData[index], ...data };
      return { ...employeesData[index] };
    }
    return null;
  }
};

export default employeeService;