window.addEventListener("scroll", function () {
  const postElements = Array.prototype.slice.call(document.getElementsByClassName("feed-shared-update-v2"))
    // filter out non-first-order activity
    //.filter(el => el.querySelector(".feed-shared-header") === null)
    // filter out Promoted posts
    .filter(el => el.querySelector(".feed-shared-actor__sub-description")?.innerText !== "Promoted");

  const data = Object.assign({}, ...postElements.map((el) => ({ [el.id]: {
    name: el.querySelector(".feed-shared-actor__name span")?.innerText,
    imageSrc: el.querySelector(".feed-shared-actor__avatar-image").src,
    text: el.querySelector(".feed-shared-text span span")?.innerText,
  }})));

  console.log(data);
  chrome.runtime.sendMessage(data);
});