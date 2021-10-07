import express from "express";
import {
    getUpload, 
    postUpload, 
    watch, 
    getEdit, 
    postEdit, 
    remove} from "../controllers/videoController";

const videoRouter = express.Router();

videoRouter.get("/:id(\\d+)", watch);
videoRouter.route("/:id(\\d+)/edit").get(getEdit).post(postEdit);
videoRouter.get("/:id(\\d+)/remove", remove);
videoRouter.route("/upload").get(getUpload).post(postUpload);

export default videoRouter