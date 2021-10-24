import regeneratorRuntime from "regenerator-runtime/runtime";

const videoContainer = document.querySelector(".video_container");
const videoAddComments = document.querySelector(".video_add-comments");
const form = document.getElementById("commentForm");
const videoId = videoContainer.dataset.id;
let deleteBtn = document.querySelectorAll("#deleteBtn");
let likeBtn = document.querySelectorAll("#likeBtn");
let dislikeBtn = document.querySelectorAll("#dislikeBtn");

// Comment Creation and Removal
const handleDeleteBtn = () => {
  for (let i = 0; i < deleteBtn.length; i++) {
    deleteBtn[i].addEventListener("click", handleCommentDelete);
  }
};

const addComment = (
  text,
  userName,
  commentCreatedDate,
  userAvatarUrl,
  newCommentId,
  newCommentOwner,
  newCommentText,
  likeCount,
  dislikeCount
) => {
  // Container the new comment should be placed in.
  const videoComments = document.querySelector(".video_comments");

  // Comment Container and its class name.
  const commentContaienr = document.createElement("div");
  commentContaienr.className = "comment_container";
  commentContaienr.id = newCommentId;
  commentContaienr.dataset.id = newCommentId;

  // Left Section with user avatar
  const commentLeft = document.createElement("div");
  const userAvatar = document.createElement("img");
  commentLeft.className = "comment_left";
  userAvatar.src = userAvatarUrl;
  userAvatar.width = 40;
  userAvatar.height = 40;
  commentLeft.appendChild(userAvatar);

  // Right Section with the comment and some icons.
  const commentRight = document.createElement("div");
  commentRight.className = "comment_right";

  // username and date container
  const commentNameDate = document.createElement("div");
  const ownerName = document.createElement("small");
  const createdAt = document.createElement("small");
  commentNameDate.className = "comment_name_date";
  ownerName.id = "ownername";
  createdAt.id = "ownerdate";
  ownerName.innerText = userName;
  createdAt.innerText = commentCreatedDate;
  commentNameDate.appendChild(ownerName);
  commentNameDate.appendChild(createdAt);

  // Comment Box and the New Comment
  const commentBox = document.createElement("div");
  commentBox.className = "comment_text";
  const newComment = document.createElement("small");
  newComment.id = "ownertext";
  newComment.innerText = text;
  commentBox.appendChild(newComment);

  // Icon Box and the Icons
  const iconBox = document.createElement("div");
  iconBox.className = "comment_icon_box";
  const likeIcon = document.createElement("i");
  const dislikeIcon = document.createElement("i");
  const reCommentIcon = document.createElement("i");
  const deleteIcon = document.createElement("i");
  const likeCounter = document.createElement("small");
  const dislikeCounter = document.createElement("small");
  likeIcon.className = "far fa-thumbs-up";
  dislikeIcon.className = "far fa-thumbs-down";
  deleteIcon.className = "far fa-trash-alt";
  deleteIcon.id = "deleteBtn";
  deleteIcon.dataset.id = newCommentId;
  deleteIcon.dataset.user = newCommentOwner;
  deleteIcon.dataset.text = newCommentText;
  reCommentIcon.className = "far fa-comment";
  likeCounter.className = "likeCount";
  dislikeCounter.className = "dislikeCount";
  likeCounter.innerText = likeCount;
  dislikeCounter.innerText = dislikeCount;
  likeCounter.id = `like_${newCommentId}`;
  dislikeCounter.id = `dislike_${newCommentId}`;
  iconBox.appendChild(likeIcon);
  iconBox.appendChild(likeCounter);
  iconBox.appendChild(dislikeIcon);
  iconBox.appendChild(dislikeCounter);
  iconBox.appendChild(reCommentIcon);
  iconBox.appendChild(deleteIcon);

  commentRight.appendChild(commentNameDate);
  commentRight.appendChild(commentBox);
  commentRight.appendChild(iconBox);
  commentContaienr.appendChild(commentLeft);
  commentContaienr.appendChild(commentRight);
  videoComments.prepend(commentContaienr);

  deleteBtn = [deleteIcon, ...deleteBtn];
  likeBtn = [likeIcon, ...likeBtn];
  dislikeBtn = [dislikeIcon, ...dislikeBtn];
  handleDeleteBtn();
  handleLikeBtn();
  handleDislikeBtn();
  console.log(likeBtn);
};

const handleSubmit = async (event) => {
  event.preventDefault();
  const input = document.getElementById("comment");
  const text = input.value;
  const videoId = videoContainer.dataset.id;
  const userAvatarUrl = videoAddComments.dataset.id;
  const userName = videoAddComments.dataset.user;
  const time = new Date();
  const year = time.getFullYear();
  const month = time.getMonth() + 1;
  const date = time.getDate();
  const commentCreatedDate = `${year}.${month}.${date}`;
  if (text === "") {
    return;
  }
  const response = await fetch(`/api/videos/${videoId}/comment`, {
    method: "post",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ text }),
  });
  if (response.status === 201) {
    input.value = "";
    const {
      newCommentId,
      newCommentOwner,
      newCommentText,
      likeCount,
      dislikeCount,
    } = await response.json();
    addComment(
      text,
      userName,
      commentCreatedDate,
      userAvatarUrl,
      newCommentId,
      newCommentOwner,
      newCommentText,
      likeCount,
      dislikeCount
    );
  }
};

const deleteCommentBox = (commentId) => {
  const commentContainer = document.getElementById(commentId);
  commentContainer.remove();
};

const handleCommentDelete = async (event) => {
  const { id: commentId } = event.target.dataset;
  const response = await fetch(`/api/videos/comments/${videoId}/delete`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ commentId }),
  });

  if (response.status === 201) {
    deleteCommentBox(commentId);
  }
};

// Likes and Dislikes
// Likes
const likeCountUp = (likeBtnId, likeCount) => {
  let likeCounter = document.getElementById(`like_${likeBtnId}`);
  likeCounter.innerText = likeCount;
};

const handleLikeFunction = async (event) => {
  event.preventDefault();
  const { id: likeBtnId } = event.target.dataset;
  const response = await fetch(`/api/videos/comments/${videoId}/like`, {
    method: "post",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ likeBtnId }),
  });

  if (response.status === 201) {
    const { likeCount } = await response.json();
    likeCountUp(likeBtnId, likeCount);
  }
};

const handleLikeBtn = () => {
  for (let i = 0; i < likeBtn.length; i++) {
    likeBtn[i].addEventListener("click", handleLikeFunction);
  }
};

//Dislikes
const dislikeCountUp = (dislikeBtnId, dislikeCount) => {
  let dislikeCounter = document.getElementById(`dislike_${dislikeBtnId}`);
  dislikeCounter.innerText = dislikeCount;
};

const handleDislikeFunction = async (event) => {
  event.preventDefault();
  const { id: dislikeBtnId } = event.target.dataset;
  const response = await fetch(`/api/videos/comments/${videoId}/dislike`, {
    method: "post",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ dislikeBtnId }),
  });

  if (response.status === 201) {
    const { dislikeCount } = await response.json();
    dislikeCountUp(dislikeBtnId, dislikeCount);
  }
};
const handleDislikeBtn = () => {
  for (let i = 0; i < dislikeBtn.length; i++) {
    dislikeBtn[i].addEventListener("click", handleDislikeFunction);
  }
};

// Event Listeners
if (form) {
  form.addEventListener("submit", handleSubmit);
}
handleDeleteBtn();
handleLikeBtn();
handleDislikeBtn();
