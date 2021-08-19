window.addEventListener("DOMContentLoaded", (event) => {
  console.log("DOM fully loaded and parsed");
  init();
});

window.onpopstate = function (e) {
  parseURL();
};

function init() {
  // init theme
  init__theme();

  // init dashboard with list of videos
  parseURL();
}

function parseURL() {
  const path = window.location.pathname;
  if (path === "/") {
    document.querySelector(".video-container").innerHTML = "";
    init__dashboard();
  } else if (path.startsWith("/video/")) {
    const video = path.replace("/video/", "");
    init_video_container(video);
  }
}

async function init__dashboard() {
  show_videolist_container();
  const containerEl = document.querySelector(".list-videos__content");
  const response = await fetch("/list-videos");
  if (response.status === 200) {
    const jsonResponse = await response.json();
    if (jsonResponse.status === "success") {
      const { data } = jsonResponse;
      let output = data
        .map(
          (d) =>
            `<li><a onclick="javascript: open_video('${encodeURI(d.file)}', '${
              d.mime
            }'); return false;">${d.file}</a></li>`
        )
        .join("");
      containerEl.innerHTML = output;
    }
  }
}

function init__theme() {
  const toggleSwitch = document.querySelector(
    '.theme-switch input[type="checkbox"]'
  );
  const currentTheme = localStorage.getItem("theme");

  if (currentTheme) {
    document.documentElement.setAttribute("data-theme", currentTheme);

    if (currentTheme === "dark") {
      toggleSwitch.checked = true;
    }
  }

  toggleSwitch.addEventListener(
    "change",
    (e) => {
      if (e.target.checked) {
        document.documentElement.setAttribute("data-theme", "dark");
        localStorage.setItem("theme", "dark");
      } else {
        document.documentElement.setAttribute("data-theme", "light");
        localStorage.setItem("theme", "light");
      }
    },
    false
  );
}

function init_video_container(video) {
  hide_videolist_container();
  open_video(video);
}

function open_video(video__path, video__mime = null) {
  hide_videolist_container();

  history.pushState({}, null, "/video/" + video__path);

  const x = document.createElement("VIDEO");
  const container = document.querySelector(".video-container");
  container.innerHTML = "";

  x.setAttribute("src", "/video/" + video__path);
  if (video__mime) x.setAttribute("type", video__mime);

  x.setAttribute("controls", "controls");
  x.setAttribute("autoplay", "autoplay");
  container.appendChild(x);
}

function show_videolist_container() {
  show(".list-videos");
  hide(".video-container");
}

function hide_videolist_container() {
  hide(".list-videos");
  show(".video-container");
}

function hide(selector) {
  const el = document.querySelector(selector);
  el.style.display = "none";
}

function show(selector) {
  const el = document.querySelector(selector);
  el.style.display = "block";
}
