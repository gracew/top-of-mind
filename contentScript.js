function getPosts() {
  const postElements = Array.prototype.slice.call(document.getElementsByClassName("feed-shared-update-v2"))
    // filter out Promoted posts
    .filter(el => el.querySelector(".feed-shared-actor__description")?.innerText !== "Promoted")
    .filter(el => el.querySelector(".feed-shared-actor__sub-description")?.innerText !== "Promoted")
    // only include elements with avatar images and text
    .filter(el => el.querySelector(".feed-shared-actor__avatar-image") && el.querySelector(".feed-shared-text span span"));

  const posts = postElements.map((el) => ({
    id: el.id,
    name: el.querySelector(".feed-shared-actor__name span")?.innerText,
    imageSrc: el.querySelector(".feed-shared-actor__avatar-image").src,
    text: el.querySelector(".feed-shared-text span span")?.innerText,
    firstOrder: el.querySelector(".feed-shared-header") === null,
  }));

  chrome.runtime.sendMessage({ type: "new_posts", posts });
}

window.addEventListener("scroll", getPosts);

chrome.runtime.onMessage.addListener((msg) => {
  if (msg.type === "get_posts") {
    getPosts();
  } else if (msg.type === "scroll_to") {
    document.getElementById(msg.id).scrollIntoView();
  } else if (msg.type === "fill") {
    const postElement = document.getElementById(msg.id);
    if (postElement) {
      postElement.querySelector(".comment-button").click();
      postElement.querySelector(".ql-editor p").innerText = msg.text;
    }
  }
});