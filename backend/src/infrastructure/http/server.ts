import express from "express";
import cors from "cors";

export function createServer() {
  const app = express();

  app.use(cors());
  app.use(express.json());

  app.get("/health", (_, res) => {
    res.json({ status: "ok" });
  });

  return app;
}
