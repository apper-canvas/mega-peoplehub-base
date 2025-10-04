import leaveRequestsData from "@/services/mockData/leaveRequests.json";
import leaveBalancesData from "@/services/mockData/leaveBalances.json";

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const leaveService = {
  getAll: async () => {
    await delay(300);
    return [...leaveRequestsData];
  },

  getById: async (id) => {
    await delay(200);
    const leave = leaveRequestsData.find(l => l.Id === parseInt(id));
    return leave ? { ...leave } : null;
  },

  getBalance: async (employeeId) => {
    await delay(200);
    const balance = leaveBalancesData.find(b => b.employeeId === employeeId);
    return balance ? { ...balance } : null;
  },

  create: async (leaveData) => {
    await delay(400);
    const maxId = Math.max(...leaveRequestsData.map(l => l.Id), 0);
    const newLeave = {
      Id: maxId + 1,
      ...leaveData,
      status: "Pending",
      submittedDate: new Date().toISOString().split("T")[0]
    };
    leaveRequestsData.push(newLeave);
    return { ...newLeave };
  },

  update: async (id, data) => {
    await delay(300);
    const index = leaveRequestsData.findIndex(l => l.Id === parseInt(id));
    if (index !== -1) {
      leaveRequestsData[index] = { ...leaveRequestsData[index], ...data };
      return { ...leaveRequestsData[index] };
    }
    return null;
  },

  delete: async (id) => {
    await delay(300);
    const index = leaveRequestsData.findIndex(l => l.Id === parseInt(id));
    if (index !== -1) {
      leaveRequestsData.splice(index, 1);
      return true;
    }
    return false;
  }
};

export default leaveService;