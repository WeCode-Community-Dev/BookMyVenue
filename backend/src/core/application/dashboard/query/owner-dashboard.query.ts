import { Inject } from "@nestjs/common";
import type { IDashboardRepository } from "../dashboard.repository.interface";

export class GetOwnerDashboardQuery {

    constructor(
        @Inject('IDashboardRepository')
        private readonly dashboardRepository: IDashboardRepository,
    ) { }

    async execute(ownerId: string) {
        return this.dashboardRepository.getOwnerDashboard(ownerId);
    }
}