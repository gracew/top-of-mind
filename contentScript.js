function getPosts() {
  const postElements = Array.prototype.slice.call(document.getElementsByClassName("feed-shared-update-v2"))
    // filter out Promoted posts
    .filter(el => el.querySelector(".feed-shared-actor__description")?.innerText !== "Promoted")
    .filter(el => el.querySelector(".feed-shared-actor__sub-description")?.innerText !== "Promoted")
    // only include elements with avatar images (LinkedIn uses the feed-shared-update-v2 class to format events as well)
    .filter(el => el.querySelector(".feed-shared-actor__avatar-image"));

  const posts = postElements.map((el) => ({
    id: el.id,
    name: el.querySelector(".feed-shared-actor__name span")?.innerText,
    imageSrc: el.querySelector(".feed-shared-actor__avatar-image").src,
    text: el.querySelector(".feed-shared-text span span")?.innerText,
    firstOrder: el.querySelector(".feed-shared-header") === null,
  }));

  chrome.storage.local.set({ posts });
  chrome.runtime.sendMessage({ type: "get_posts" });
}

// get posts on page load and also on scroll events
getPosts();
window.addEventListener("scroll", getPosts);

chrome.runtime.onMessage.addListener((msg) => {
  if (msg.type === "scroll_to") {
    document.getElementById(msg.id).scrollIntoView();
  } else if (msg.type === "fill") {
    const postElement = document.getElementById(msg.id);
    if (postElement) {
      postElement.querySelector(".comment-button").click();
      postElement.querySelector(".ql-editor p").innerText = msg.text;
    }
  }
});