import { Request, Response, NextFunction } from 'express';
import { SearchRepository } from '@/repositories/search.repository';
import { SearchService } from '@/services/search.service';
import { HTTP_STATUS } from '@/constants/http';

const searchRepository = new SearchRepository();
const searchService = new SearchService(searchRepository);


export const getSuggestions = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { type, q, latitude, longitude, radius } = req.query;
    const lat = latitude ? parseFloat(latitude as string) : undefined;
    const lng = longitude ? parseFloat(longitude as string) : undefined;
    const rad = radius ? parseFloat(radius as string) : undefined;
    const result = await searchService.getSuggestions(type as string, q as string, lat, lng, rad);
    res.status(HTTP_STATUS.OK).json(result);
  } catch (error) {
    next(error);
  }
};
