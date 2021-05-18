const apiBaseUrl = "https://jsolutions.no/wp-json";

const carousel = document.querySelector(".S01-cards-carousel");
const nextBtn = document.querySelectorAll("#next");
const nextBtnMob = document.querySelectorAll("#next-mobile");
const prevBtn = document.querySelectorAll("#prev");
const prevBtnMob = document.querySelectorAll("#prev-mobile");

const nextButtons = [nextBtn, nextBtnMob];
const prevButtons = [prevBtn, prevBtnMob];

nextButtons.forEach((elem) => {
  elem[0].addEventListener("click", () => slideCarousel("next"));
});

prevButtons.forEach((elem) => {
  elem[0].addEventListener("click", () => slideCarousel("prev"));
});

/**
 * Slides the carousel to rigth or left
 * @param {String} btnType
 */
function slideCarousel(btnType) {
  if (btnType === "next") {
    carousel.style.transform = "translateX(-50%)";
  } else {
    carousel.style.transform = "translateX(0%)";
  }
}

/**
 * Renders error message if failed to retrieve wp data
 * @param {HTMLElement} parentElem
 */
function showErrorMsg(parentElem) {
  let messageWrapper = document.createElement("div");
  let spanTag = document.createElement("span");

  messageWrapper.setAttribute("class", "--centred");
  spanTag.setAttribute("class", "heading --block");
  spanTag.innerHTML = "An error occured, please refresh the page";

  messageWrapper.appendChild(spanTag);
  parentElem.appendChild(messageWrapper);
}

/**
 * Renders the carousel lists
 * @param {Array} blogPosts
 */
function renderCarouselLists(posts) {
  const lists = [posts.slice(0, 4), posts.slice(4)];

  const secondListWrapper = document.createElement("div");
  secondListWrapper.setAttribute("class", "S01-cards-list");

  lists.forEach((list) => {
    const listWrapper = document.createElement("div");
    listWrapper.setAttribute("class", "S01-cards-list");

    list.forEach((item) => {
      const { id, featured_media_src_url: cover } = item;
      const {
        excerpt: { rendered: pollutedDesc },
      } = item;
      const {
        title: { rendered: title },
      } = item;

      const desc = pollutedDesc
        .replaceAll("[&hellip;]</p>\n", "")
        .replaceAll("<p>", "");

      const card = renderPostCard(id, cover, title, desc);
      listWrapper.appendChild(card);
    });

    carousel.appendChild(listWrapper);
  });
}

/**
 * Renders a single post card
 * @param {Number} id
 * @param {String} cover
 * @param {String} title
 * @param {String} desc
 * @returns {HTMLElement}
 */
function renderPostCard(id, cover, title, desc) {
  // Card wrapper div element
  let cardWrapper = document.createElement("div");
  cardWrapper.setAttribute("class", "card-wrapper");

  // Card cover
  let cardCover = document.createElement("img");
  cardCover.setAttribute("alt", "post cover");
  cardCover.setAttribute("src", cover);

  // Card body
  let cardBody = document.createElement("div");
  cardBody.setAttribute("class", "card-body");

  let titleHolder = document.createElement("h2");
  titleHolder.setAttribute("class", "heading4");

  let titleText = document.createElement("span");
  titleText.setAttribute("class", "--block");
  titleText.innerHTML = title;
  titleHolder.appendChild(titleText);

  let descHolder = document.createElement("div");
  descHolder.setAttribute("class", "card-p-holder");

  let descText = document.createElement("p");
  descText.setAttribute("class", "paragraph");
  descText.innerHTML = desc;
  descHolder.appendChild(descText);

  cardBody.appendChild(titleHolder);
  cardBody.appendChild(descHolder);

  // Card Footer
  let cardFooter = document.createElement("div");
  cardFooter.setAttribute("class", "card-footer");

  let linkToPost = document.createElement("a");
  linkToPost.setAttribute("class", "btn btn--sm btn--orange");
  linkToPost.setAttribute("href", `post.html?id=${id}`);
  linkToPost.innerHTML = "continue reading";
  cardFooter.appendChild(linkToPost);

  cardWrapper.appendChild(cardCover);
  cardWrapper.appendChild(cardBody);
  cardWrapper.appendChild(cardFooter);

  return cardWrapper;
}

/**
 * Gets Blog posts from worpdress api and renders
 * the appropriate UI deppending on the api response
 */
const getBlogPosts = async () => {
  try {
    let getData = await fetch(`${apiBaseUrl}/wp/v2/posts?per_page=8`);
    let response = await getData.json();
    // shows carousel lists UI
    renderCarouselLists(response);
  } catch (err) {
    // shows an error message
    showErrorMsg(carousel);
    nextBtn.forEach((elem) => {
      elem.disabled = true;
    });
    prevBtn.forEach((elem) => {
      elem.disabled = true;
    });
  }
};

getBlogPosts();
