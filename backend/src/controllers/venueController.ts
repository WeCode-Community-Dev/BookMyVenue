// Venue controller
import { Request, Response } from "express";
import { venueService } from "../services/venueService";

export const venueController = {
  async register(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      const result = await venueService.registerVenue(email, password);
      return res.status(201).json(result);
    } catch (error: any) {
      return res.status(400).json({
        error: error.message,
      });
    }
  },

  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      const result = await venueService.loginVenue(email, password);
      return res.status(200).json(result);
    } catch (error: any) {
      return res.status(401).json({
        error: error.message,
      });
    }
  },

  // Note: getMe was added from the dev branch
  async getMe(req: Request, res: Response) {
    try {
      // You can expand this later to return user data
      res.status(200).json({ message: "User Authorized" });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
};