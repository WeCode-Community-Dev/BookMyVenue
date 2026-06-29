import { sendResponse } from '../handlers/response_handlers.js';
import analyticService from '../services/analyticsServices.js';

export default {
  adminDashboardStats: async (req, res) => {
    const response = await analyticService.adminDashboardStats();
    sendResponse(res, { data: response });
  },
};
