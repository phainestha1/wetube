import videoModel from "../model/videoModel";

// Controllers
// Main Page: Home & Watch a Video
export const home = async (req, res) => {
  try {
    const videos = await videoModel.find({}).sort({ createdAt: "desc" });
    return res.render("home", { pageTitle: "Home", videos });
  } catch {
    return res.status(404).render("404");
  }
};
export const watch = async (req, res) => {
  const { id } = req.params;
  const video = await videoModel.findById(id);
  if (!video) {
    return res.status(404).render("404");
  }
  return res.render("watch", { pageTitle: video.title, video });
};

// Upload Part
export const getUpload = (req, res) => {
  return res.render("upload", { pageTitle: "upload videos" });
};
export const postUpload = async (req, res) => {
  const { title, description, hashtags } = req.body;
  try {
    await videoModel.create({
      title,
      description,
      hashtags: videoModel.formatHashtags(hashtags),
      meta: {
        views: 0,
        rating: 0,
      },
    });
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
  return res.render("edit", { pageTitle: `Editing`, video });
};

export const postEdit = async (req, res) => {
  const { id } = req.params;
  const { title, description, hashtags } = req.body;
  const video = await videoModel.exists({ _id: id });
  if (!video) {
    return res.status(404).render("404");
  }
  await videoModel.findByIdAndUpdate(id, {
    title,
    description,
    hashtags: videoModel.formatHashtags(hashtags),
  });
  return res.redirect(`/videos/${id}`);
};

// Removae Part
export const remove = async (req, res) => {
  const { id } = req.params;
  await videoModel.findByIdAndDelete(id);
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
