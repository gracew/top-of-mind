window.addEventListener("scroll", function () {
  const v = Array.prototype.slice.call(document.getElementsByClassName("feed-shared-update-v2"))
    // filter out non-first-order activity
    .filter(el => el.querySelector(".feed-shared-header") === null)
    // filter out Promoted posts
    .filter(el => el.querySelector(".feed-shared-actor__sub-description").innerText !== "Promoted")
    .map(el => el.querySelector(".feed-shared-text span span").innerText);
  console.log(v);
});