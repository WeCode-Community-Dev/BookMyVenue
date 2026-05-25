import { Request, Response } from "express";
import { UserService } from "../../../domain/services/UserService";

export class UserController {
  constructor(private userService: UserService) {}

  getById = async (req: Request, res: Response) => {
    const user = await this.userService.getUserById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(user);
  };

  create = async (req: Request, res: Response) => {
    // Implementation here
    res.status(201).json({ message: "User created" });
  };
}
