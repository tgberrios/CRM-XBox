document.addEventListener("DOMContentLoaded", function () {
  const logUpdateButton = document.getElementById("logUpdateButton");
  const openSidePeekButton = document.getElementById("openSidePeekButton");
  const closeSidePeekButton = document.getElementById("closeSidePeekButton");
  const closeContentSidePeekButton = document.getElementById(
    "closeContentSidePeekButton"
  );
  const sidePeek = document.getElementById("sidePeek");
  const contentSidePeek = document.getElementById("contentSidePeek");
  const newsList = document.getElementById("newsList");
  const contentSidePeekTitle = document.getElementById("contentSidePeekTitle");
  const contentSidePeekBody = document.getElementById("contentSidePeekBody");
  const contentSidePeekImage = document.getElementById("contentSidePeekImage");
  const deleteUpdateButton = document.getElementById("deleteUpdateButton");

  if (logUpdateButton) {
    logUpdateButton.addEventListener("click", logUpdate);
  }

  if (openSidePeekButton) {
    openSidePeekButton.addEventListener("click", () =>
      sidePeek.classList.add("show")
    );
  }

  if (closeSidePeekButton) {
    closeSidePeekButton.addEventListener("click", () =>
      sidePeek.classList.remove("show")
    );
  }

  if (closeContentSidePeekButton) {
    closeContentSidePeekButton.addEventListener("click", () =>
      contentSidePeek.classList.remove("show")
    );
  }

  async function logUpdate() {
    const updateTitle = document.getElementById("updateTitle").value;
    const updateType = document.getElementById("updateType").value;
    const updateContent = quill.root.innerHTML;

    if (!updateTitle || !updateType || !updateContent) {
      alert("Please complete all fields.");
      return;
    }

    const update = {
      title: updateTitle,
      type: updateType,
      content: updateContent,
      image: document.getElementById("updateImage")
        ? document.getElementById("updateImage").src
        : "",
    };

    try {
      const result = await window.cert.logUpdate(update);
      update.id = result.id;
      addUpdateToList(update);
      document.getElementById("updateForm").reset();
      quill.root.innerHTML = "";
      sidePeek.classList.remove("show");
    } catch (error) {
      console.error("Error adding update:", error);
      alert("Failed to log update.");
    }
  }

  async function loadUpdates() {
    try {
      const updates = await window.cert.loadUpdates();
      updates.forEach(addUpdateToList);
    } catch (error) {
      console.error("Error loading updates:", error);
      alert("Failed to load updates.");
    }
  }

  function addUpdateToList(update) {
    const updateItem = document.createElement("div");
    updateItem.classList.add("update-item");

    const updateHeader = document.createElement("div");
    updateHeader.classList.add("update-header");

    const updateTitle = document.createElement("div");
    updateTitle.classList.add("update-title");
    updateTitle.textContent = update.title;
    updateTitle.onclick = () => showContentSidePeek(update);

    const updateType = document.createElement("div");
    updateType.classList.add("update-type");
    updateType.textContent = update.type;

    updateHeader.appendChild(updateTitle);
    updateHeader.appendChild(updateType);
    updateItem.appendChild(updateHeader);

    const updatePreview = document.createElement("div");
    updatePreview.classList.add("update-preview");
    updatePreview.innerHTML = truncateText(
      update.content.replace(/<[^>]+>/g, ""),
      150
    );

    if (update.image) {
      const updateImage = document.createElement("img");
      updateImage.src = update.image;
      updateImage.classList.add("update-image");
      updateItem.appendChild(updateImage);
    }

    updateItem.appendChild(updatePreview);
    newsList.appendChild(updateItem);
  }

  function showContentSidePeek(update) {
    contentSidePeekTitle.textContent = update.title;
    contentSidePeekBody.innerHTML = update.content;
    contentSidePeekImage.src = update.image;
    contentSidePeekImage.style.display = update.image ? "block" : "none";

    contentSidePeek.classList.add("show");

    deleteUpdateButton.onclick = () => deleteUpdate(update.id);
  }

  async function deleteUpdate(updateId) {
    try {
      await window.cert.deleteUpdate(updateId);
      newsList.innerHTML = "";
      await loadUpdates();
      contentSidePeek.classList.remove("show");
    } catch (error) {
      console.error("Error deleting update:", error);
      alert("Failed to delete update.");
    }
  }

  loadUpdates();
});

function truncateText(text, maxLength) {
  return text.length <= maxLength ? text : text.slice(0, maxLength) + "...";
}
