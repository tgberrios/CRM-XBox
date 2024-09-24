window.addEventListener("DOMContentLoaded", () => {
  // Crear el overlay
  const overlay = document.createElement("div");
  overlay.style.position = "fixed";
  overlay.style.top = "0";
  overlay.style.left = "0";
  overlay.style.width = "100%";
  overlay.style.height = "100%";
  overlay.style.backgroundColor = "#F2F2F7"; // Color blanco suave
  overlay.style.zIndex = "9998";
  overlay.style.filter = "blur(5px)"; // Efecto de desenfoque
  overlay.style.transition = "opacity 0.5s ease-in-out";
  overlay.style.opacity = "1";
  document.body.appendChild(overlay);

  // Eliminar el overlay después de que la página se haya cargado
  window.addEventListener("load", () => {
    setTimeout(() => {
      overlay.style.opacity = "0";
      setTimeout(() => {
        document.body.removeChild(overlay);
      }, 500);
    }, 500);
  });
});
