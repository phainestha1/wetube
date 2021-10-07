export let videos = [
    {
        title: "First Video",
        id: 1
    },
    {
        title: "Second Video",
        id: 2
    },
    {
        title: "Third Video",
        id: 3
    },
    {
        title:"Fourth Video",
        id: 4
    }
]

export const home = (req, res) => {
    return res.render("home", {pageTitle: "Home", videos});
}

export const getUpload = (req, res) => {
    return res.render("upload", {pageTitle : "upload videos"});
}

export const postUpload = (req, res) => {
    return res.redirect("/");
}

export const watch = (req, res) => {
    const {id} = req.params;
    const video = videos[ id-1 ]
    return res.render("watch", {pageTitle: video.title, video });
}

export const getEdit = (req, res) => {
    const {id} = req.params;
    const video = videos[ id-1 ];
    return res.render("edit", {pageTitle: video.title, video });
}

export const postEdit = (req, res) => {
    const {id} = req.params;
    const {title} = req.body;
    videos[id-1].title = title;
    return res.redirect(`/videos/${id}`);
}

export const remove = (req, res) => {
    return res.render("watch", {pageTitle: "Watch"});
}