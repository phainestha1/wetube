import videoModel from "../model/videoModel";
import userModel from "../model/userModel";
import commentModel from "../model/commentModel";
import date from "date-and-time";

// Controllers
// Main Page: Home & Watch a Video
export const home = async (req, res) => {
  let videos;
  const { search } = req.query;
  // Search
  if (search) {
    videos = [];
    const searchResults = await videoModel
      .find({
        title: {
          $regex: new RegExp(search, "i"),
        },
      })
      .populate("owner");
    return res.render("home", { pageTitle: "Home", searchResults });
  }

  // Home Main Page
  try {
    videos = await videoModel
      .find({})
      .sort({ createdAt: "desc" })
      .populate("owner");
    return res.render("home", { pageTitle: "Home", videos });
  } catch {
    return res.status(404).render("404");
  }
};
export const watch = async (req, res) => {
  const { id } = req.params;
  const videos = await videoModel
    .find({})
    .sort({ createdAt: "desc" })
    .populate("owner");
  const video = await videoModel
    .findById(id)
    .populate("owner")
    .populate("comments");
  if (!video) {
    return res.status(404).render("404");
  }
  return res.render("watch", { pageTitle: video.title, video, videos });
};

// Upload Part
export const getUpload = (req, res) => {
  return res.render("upload", { pageTitle: "upload videos" });
};
export const postUpload = async (req, res) => {
  const {
    user: { _id },
  } = req.session;
  const { title, description, hashtags } = req.body;
  const { video, thumb } = req.files;
  const createdAt = date.format(new Date(), "YYYY.MM.DD");
  const isHeroku = process.env.NODE_ENV === "production";
  try {
    const newVideo = await videoModel.create({
      fileUrl: isHeroku ? video[0].location : video[0].path,
      thumbUrl: isHeroku ? thumb[0].location : thumb[0].path,
      owner: _id,
      title,
      description,
      createdAt,
      hashtags: videoModel.formatHashtags(hashtags),
    });
    console.log(newVideo);
    const user = await userModel.findById(_id);
    user.videos.push(newVideo._id);
    user.save();
    req.flash("info", `"${title}" 영상이 업로드 되었습니다.`);
    return res.redirect("/");
  } catch (error) {
    return res.status(400).render("upload", {
      pageTitle: "Upload Video",
      errorMessage: error._message,
    });
  }
};

// Edit Part
export const getEdit = async (req, res) => {
  const { id } = req.params;
  const video = await videoModel.findById(id);
  if (!video) {
    return res.status(404).render("404");
  }
  if (String(video.owner) !== String(req.session.user._id)) {
    req.flash("error", "Not authorized");
    return res.status(403).redirect("/");
  }
  return res.render("edit", { pageTitle: `Editing`, video });
};
export const postEdit = async (req, res) => {
  const { id } = req.params;
  const { title, description, hashtags } = req.body;
  const video = await videoModel.findById(id);
  if (!video) {
    return res.sendStatus(404);
  }
  if (String(video.owner) !== String(req.session.user._id)) {
    req.flash("error", "Error!!");
    return res.status(403).redirect("/");
  }
  await videoModel.findByIdAndUpdate(id, {
    title,
    description,
    hashtags: videoModel.formatHashtags(hashtags),
  });
  if (req.file) {
    const { path } = req.file;
    await videoModel.findByIdAndUpdate(id, {
      thumbUrl: path,
    });
  }
  req.flash("info", `"${title}" 영상이 변경 되었습니다.`);
  return res.redirect(`/videos/${id}`);
};

// Removae Part
export const remove = async (req, res) => {
  const { id } = req.params;
  const video = await videoModel.findById(id);
  if (!video) {
    return res.status(404).render("404", { pageTitle: "Video not found." });
  }
  if (String(video.owner) !== String(req.session.user._id)) {
    return res.status(403).redirect("/");
  }
  await videoModel.findByIdAndDelete(id);
  req.flash("info", `영상이 삭제 되었습니다.`);
  return res.redirect("/");
};

// Search Part
export const search = async (req, res) => {
  const { search } = req.query;
  let videos = [];
  if (search) {
    videos = await videoModel.find({
      title: {
        $regex: new RegExp(search, "i"),
      },
    });
  }
  return res.render("search", { pageTitle: "Search", videos });
};

// Views
export const registerView = async (req, res) => {
  const { id } = req.params;
  const video = await videoModel.findById(id);
  if (!video) {
    return res.sendStatus(404);
  }
  video.meta.views = video.meta.views + 1;
  await video.save();
  return res.sendStatus(200);
};

export const createComment = async (req, res) => {
  const {
    session: { user },
    body: { text },
    params: { id },
  } = req;
  const video = await videoModel.findById(id);
  if (!video) {
    return res.sendStatus(400);
  }
  const createdAt = date.format(new Date(), "YYYY.MM.DD");
  const comment = await commentModel.create({
    text,
    owner: user._id,
    ownerName: user.username,
    ownerAvatarUrl: user.avatarUrl,
    video: id,
    createdAt,
  });
  video.comments.push(comment._id);
  video.save();
  return res.status(201).json({
    newCommentId: comment._id,
    newCommentOwner: comment.owner,
    newCommentText: comment.text,
    likeCount: comment.likes.length,
    dislikeCount: comment.dislikes.length,
  });
};

export const removeComment = async (req, res) => {
  const {
    body: { commentId },
    params: { id },
  } = req;
  const video = await videoModel.findById(id);
  if (!video) {
    return res.sendStatus(400);
  }
  await commentModel.findByIdAndDelete(commentId);
  video.save();
  return res.sendStatus(201);
};

export const videoLike = async (req, res) => {
  const {
    session: { user },
    body: { likeBtnId },
    params: { id },
  } = req;
  const video = await videoModel.findById(id);
  const comment = await commentModel.findById(likeBtnId);
  if (!video) {
    return res.sendStatus(400);
  } else if (!comment) {
    return res.sendStatus(400);
  }
  if (!comment.likes.find((element) => element === user._id)) {
    comment.likes.push(user._id);
    comment.save();
    return res.status(201).json({
      likeCount: comment.likes.length,
    });
  }
  const filterResult = comment.likes.filter((ele) => ele !== user._id);
  comment.likes = filterResult;
  comment.save();
  return res.status(201).json({
    likeCount: comment.likes.length,
  });
};
export const videoDislike = async (req, res) => {
  const {
    session: { user },
    body: { dislikeBtnId },
    params: { id },
  } = req;
  const video = await videoModel.findById(id);
  const comment = await commentModel.findById(dislikeBtnId);
  if (!video) {
    return res.sendStatus(400);
  } else if (!comment) {
    return res.sendStatus(400);
  }
  if (!comment.dislikes.find((element) => element === user._id)) {
    comment.dislikes.push(user._id);
    comment.save();
    return res.status(201).json({
      dislikeCount: comment.dislikes.length,
    });
  }
  const filterResult = comment.dislikes.filter((ele) => ele !== user._id);
  comment.dislikes = filterResult;
  comment.save();
  return res.status(201).json({
    dislikeCount: comment.dislikes.length,
  });
};
