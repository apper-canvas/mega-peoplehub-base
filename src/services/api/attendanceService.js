import attendanceData from "@/services/mockData/attendance.json";

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const attendanceService = {
  getAll: async () => {
    await delay(300);
    return [...attendanceData];
  },

  getByEmployeeId: async (employeeId) => {
    await delay(300);
    return attendanceData
      .filter(a => a.employeeId === employeeId)
      .map(a => ({ ...a }))
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  },

  getMonthSummary: async (employeeId, year, month) => {
    await delay(300);
    const records = attendanceData.filter(a => {
      const date = new Date(a.date);
      return a.employeeId === employeeId && 
             date.getFullYear() === year && 
             date.getMonth() === month;
    });

    const summary = {
      totalDays: records.length,
      presentDays: records.filter(r => r.status === "Present").length,
      lateDays: records.filter(r => r.status === "Late").length,
      absentDays: records.filter(r => r.status === "Absent").length,
      totalHours: records.reduce((sum, r) => sum + r.workHours, 0)
    };

    return summary;
  }
};

export default attendanceService;