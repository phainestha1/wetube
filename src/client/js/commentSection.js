const videoContainer = document.querySelector(".video_container");
const form = document.getElementById("commentForm");

// const addComment = (text) => {
//   const videoComments = document.queryCommandIndeterm(".video_comments ul");
//   const newComment = document.createElement("li");
//   const span = document.createElement("span");
//   span.innerText = " ";
//   newComment.appendChild(span);
//   console.log(newComment); prepend
// };

// if (status === 201) {
//   addComment(text);
// }
// const { status } =

const handleSubmit = (event) => {
  event.preventDefault();
  const input = document.getElementById("comment");
  const text = input.value;
  const videoId = videoContainer.dataset.id;
  if (text === "") {
    return;
  }
  fetch(`/api/videos/${videoId}/comment`, {
    method: "post",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ text }),
  });
  input.value = "";
  window.location.reload();
};

if (form) {
  form.addEventListener("submit", handleSubmit);
}
