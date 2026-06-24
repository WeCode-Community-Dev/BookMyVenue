import "express";

// Augment Express's Request so req.user (set by isAuthenticated) is typed.
declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
        role: string;
      };
    }
  }
}

export {};
