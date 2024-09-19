window.addEventListener("DOMContentLoaded", () => {
  const overlay = document.createElement("div");
  overlay.style.position = "fixed";
  overlay.style.top = "0";
  overlay.style.left = "0";
  overlay.style.width = "100%";
  overlay.style.height = "100%";
  overlay.style.backgroundColor = "#000";
  overlay.style.zIndex = "9998";
  overlay.style.filter = "blur(5px)";
  overlay.style.transition = "opacity 0.5s ease-in-out";
  overlay.style.opacity = "1";
  document.body.appendChild(overlay);

  const loadingScreen = document.createElement("iframe");
  loadingScreen.src = "../loading.html";
  loadingScreen.style.position = "fixed";
  loadingScreen.style.top = "0";
  loadingScreen.style.left = "0";
  loadingScreen.style.width = "100%";
  loadingScreen.style.height = "100%";
  loadingScreen.style.border = "none";
  loadingScreen.style.zIndex = "9999";
  document.body.appendChild(loadingScreen);

  window.addEventListener("load", () => {
    setTimeout(() => {
      document.body.removeChild(loadingScreen);
      overlay.style.opacity = "0";
      setTimeout(() => {
        document.body.removeChild(overlay);
      }, 500);
    }, 500);
  });
});
