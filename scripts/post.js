const apiBaseUrl = "https://jsolutions.no/wp-json";

const coverWrapper = document.querySelector("#cover");
const titleWrapper = document.querySelector("#title");
const contentWrapper = document.querySelector("#content");
const blogPostWrapper = document.querySelector("#wrapper");
const loadingSpinner = document.querySelector("#loading-spinner");
const headMeta = document.querySelector("head");

const query = new URLSearchParams(window.location.search);
const postID = query.get("id");

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
 *  function to update the meta tags for SEO purposes
 * @param {string} title
 * @param {string} description
 * @param {string} cover
 * @returns meta tags for SEO
 */
function updateMetaTags(
  title = "Post",
  description = "Enjoy your read!",
  cover = "/assets/image__bg.jpg"
) {
  headCurrent = headMeta.innerHTML.replace("<title>Nature | Post</title>", "");

  updatedMeta = `
  <title>Nature | ${title}</title>
  <meta name="title" content="Nature | ${title}" />
  <meta
    name="description"
    content="Nature Blog — ${title}. ${description}!"
  />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="url" />
  <meta property="og:title" content="Nature | ${title}" />
  <meta
    property="og:description"
    content="Nature Blog — ${title}. ${description}"
  />
  <meta property="og:image" content="${cover}" />
  <meta property="twitter:card" content="summary_large_image" />
  <meta property="twitter:url" content="url" />
  <meta property="twitter:title" content="Nature | ${title}" />
  <meta
    property="twitter:description"
    content="Nature Blog — ${title}. ${description}"
  />
  <meta property="twitter:image" content="${cover}" />
`;
  headMeta.innerHTML = headCurrent + updatedMeta;
}

/**
 * Gets Blog posts from wordpress api and renders
 * the appropriate UI depending on the api response
 */
const getBlogPosts = async () => {
  try {
    let getData = await fetch(`${apiBaseUrl}/wp/v2/posts/${postID}`);
    let response = await getData.json();

    // shows blog post UI
    const { featured_media_src_url: cover } = response;
    const {
      content: { rendered: content },
      excerpt: { rendered: excerpt },
    } = response;
    const {
      title: { rendered: title },
    } = response;

    const metaDesc = excerpt
      .replaceAll("[&hellip;]</p>\n", "")
      .replaceAll("<p>", "");

    updateMetaTags(title, metaDesc, cover);
    coverWrapper.setAttribute("src", cover);
    titleWrapper.innerHTML = title;
    contentWrapper.innerHTML = content;

    loadingSpinner.style.display = "none";
    blogPostWrapper.style.display = "block";
    initModal();
  } catch (err) {
    // shows an error message
    blogPostWrapper.innerHTML = "";

    showErrorMsg(blogPostWrapper);
    updateMetaTags();

    loadingSpinner.style.display = "none";
    blogPostWrapper.style.display = "flex";
  }
};

getBlogPosts();

/**
 * init the image modal functionality
 */
function initModal() {
  const contentWrapper = document.querySelector(".S01-content-wrapper");
  const modalWrapper = document.querySelector("#modal-wrapper");
  const modalImg = document.querySelector("#modal-img");
  const contentImgs = document.querySelectorAll(".S01-content-wrapper img");

  contentImgs.forEach((img) => {
    img.addEventListener("click", (e) => {
      e.stopPropagation();
      modalImg.setAttribute("src", e.target.src);
      contentWrapper.classList.add("open");
      document.body.style.overflow = "hidden";
    });
  });

  modalWrapper.addEventListener("click", () => {
    modalImg.setAttribute("src", "#");
    contentWrapper.classList.remove("open");
    document.body.style.overflow = "initial";
  });
}
