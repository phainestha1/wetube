const videoInput = document.getElementById("video");
const message = document.getElementById("videoMessage");
const videoPreview = document.getElementById("videoPreview");

videoInput.addEventListener("change", (event) => {
  const file = event.target.files[0];
  const previewURL = URL.createObjectURL(file);
  videoPreview.src = previewURL;
  videoPreview.play();
});
