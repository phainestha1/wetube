import express from "express";
import {
  profile,
  getSignup,
  postSignup,
  getSignin,
  postSignin,
} from "../controllers/userController";
import { home, search } from "../controllers/videoController";
import { publicOnlyMiddleware } from "../middlewares";

const rootRouter = express.Router();

rootRouter.get("/", home);
rootRouter
  .route("/signup")
  .all(publicOnlyMiddleware)
  .get(getSignup)
  .post(postSignup);
rootRouter
  .route("/signin")
  .all(publicOnlyMiddleware)
  .get(getSignin)
  .post(postSignin);
rootRouter.get("/profile", profile);
rootRouter.get("/search", search);

export default rootRouter;
