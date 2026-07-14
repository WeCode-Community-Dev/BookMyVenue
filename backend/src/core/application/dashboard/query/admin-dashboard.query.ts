import { Inject } from "@nestjs/common";
import type { IDashboardRepository } from "../dashboard.repository.interface";

export class GetAdminDashboardQuery {

    constructor(
        @Inject('IDashboardRepository')
        private readonly dashboardRepository: IDashboardRepository,
    ) { }

    async execute() {
        return this.dashboardRepository.getAdminDashboard();
    }
}