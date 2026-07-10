import repo, { HomeDataDto } from '@/repositories/home.repository';

const getHomeData = async (): Promise<HomeDataDto> => {
  return await repo.getHomeData();
};

export default {
  getHomeData,
};
