import express from "express";
import {
  registerView,
  createComment,
  removeComment,
  videoLike,
  videoDislike,
} from "../controllers/videoController";

const apiRouter = express.Router();

apiRouter.post("/videos/comments/:id/dislike", videoDislike);
apiRouter.post("/videos/comments/:id/like", videoLike);
apiRouter.delete("/videos/comments/:id/delete", removeComment);
apiRouter.post("/videos/:id/view", registerView);
apiRouter.post("/videos/:id/comment", createComment);

export default apiRouter;
