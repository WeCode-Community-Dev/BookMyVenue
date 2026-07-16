import express from "express"
import registerRouter from "../v1/registerRouter.js"

const v1Routes = express.Router()

v1Routes.use("/register", registerRouter)

export  default v1Routes