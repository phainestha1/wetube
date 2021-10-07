import express from "express";
import {login, profile, signup} from "../controllers/userController";
import {home} from "../controllers/videoController";

const globalRouter = express.Router();

globalRouter.get("/", home)
globalRouter.get("/login", login)
globalRouter.get("/signup", signup)
globalRouter.get("/profile", profile)

export default globalRouter;