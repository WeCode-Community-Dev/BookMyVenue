import { Request, Response, NextFunction } from 'express';

export const parseVenueFormData = (req: Request, res: Response, next: NextFunction) => {
  try {
    if (req.body.address) {
      req.body.address = JSON.parse(req.body.address);
    }

    if (req.body.location) {
      req.body.location = JSON.parse(req.body.location);
    }

    if (req.body.amenities) {
      req.body.amenities = JSON.parse(req.body.amenities);
    }

    if (req.body.capacity) {
      req.body.capacity = Number(req.body.capacity);
    }

    next();
  } catch (error) {
    next(new Error('Invalid form data'));
  }
};
