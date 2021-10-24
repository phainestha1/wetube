import express from "express";
import {
  profile,
  signout,
  postEdit,
  remove,
  startGithubSignin,
  finishGithubSignin,
  startKakaoSignin,
  getChangePassword,
  postChangePassword,
  finishKakaoSignin,
} from "../controllers/userController";
import {
  avatarUpload,
  protectorMiddleware,
  publicOnlyMiddleware,
} from "../middlewares";

const userRouter = express.Router();

userRouter.get("/github/start", publicOnlyMiddleware, startGithubSignin);
userRouter.get("/github/finish", publicOnlyMiddleware, finishGithubSignin);
userRouter.get("/kakao/start", publicOnlyMiddleware, startKakaoSignin);
userRouter.get("/kakao/finish", publicOnlyMiddleware, finishKakaoSignin);
userRouter.get("/signout", protectorMiddleware, signout);
userRouter.get("/:id", profile);
userRouter
  .route("/:id/edit")
  .all(protectorMiddleware)
  .post(avatarUpload.single("avatar"), postEdit);
userRouter
  .route("/:id/edit/change-password")
  .all(protectorMiddleware)
  .get(getChangePassword)
  .post(postChangePassword);

userRouter.get("/:id/remove", remove);

export default userRouter;
