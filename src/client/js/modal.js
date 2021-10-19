const modalShowing = document.querySelector(".modal_showing");
const modalHidden = document.querySelector(".modal_hidden");
const modalContainer = document.querySelector(".modal_container");

modalHidden.addEventListener("click", () => {
  modalContainer.classList.add("hidden");
});
modalShowing.addEventListener("click", () => {
  modalContainer.classList.remove("hidden");
});
