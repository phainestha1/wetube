import express from "express";
import {
  registerView,
  createComment,
  removeComment,
} from "../controllers/videoController";

const apiRouter = express.Router();

apiRouter.delete("/videos/comments/:id/delete", removeComment);
apiRouter.post("/videos/:id/view", registerView);
apiRouter.post("/videos/:id/comment", createComment);

export default apiRouter;
