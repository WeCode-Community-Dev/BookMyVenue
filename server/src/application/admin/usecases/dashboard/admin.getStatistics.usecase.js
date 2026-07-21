export class AdminDashboardStatisticsUsecase {
  constructor(dashboardRepository) {
    this._dashboardRepository = dashboardRepository;
  }

  async execute() {
    return await this._dashboardRepository.getDashboardStatistics();
  }
}