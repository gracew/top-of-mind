window.addEventListener("scroll", function () {
  const postElements = Array.prototype.slice.call(document.getElementsByClassName("feed-shared-update-v2"))
    // filter out non-first-order activity
    //.filter(el => el.querySelector(".feed-shared-header") === null)
    // filter out Promoted posts
    .filter(el => el.querySelector(".feed-shared-actor__sub-description")?.innerText !== "Promoted");

  const data = Object.assign({}, ...postElements.map((el) => ({
    [el.id]: {
      name: el.querySelector(".feed-shared-actor__name span")?.innerText,
      imageSrc: el.querySelector(".feed-shared-actor__avatar-image").src,
      text: el.querySelector(".feed-shared-text span span")?.innerText,
    }
  })));

  console.log(data);
  chrome.runtime.sendMessage({ type: "get_posts", data });
});

chrome.runtime.onMessage.addListener((msg) => {
  console.log(msg);
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