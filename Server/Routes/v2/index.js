import express from "express"
import listingRoutes from "./listingRoutes.js"

const v2Routes = express.Router()


v2Routes.use("/list", listingRoutes)


export default v2Routes