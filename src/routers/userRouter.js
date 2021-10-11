import express from "express";
import {
  profile,
  signout,
  getEdit,
  postEdit,
  remove,
  startGithubSignin,
  finishGithubSignin,
} from "../controllers/userController";
import { protectorMiddleware, publicOnlyMiddleware } from "../middlewares";

const userRouter = express.Router();

userRouter.get("/github/start", publicOnlyMiddleware, startGithubSignin);
userRouter.get("/github/finish", publicOnlyMiddleware, finishGithubSignin);
userRouter.get("/signout", protectorMiddleware, signout);
userRouter.get("/profile", protectorMiddleware, profile);
userRouter
  .route("/profile/edit")
  .all(protectorMiddleware)
  .get(getEdit)
  .post(postEdit);
userRouter.get("/profile/remove", remove);

export default userRouter;
