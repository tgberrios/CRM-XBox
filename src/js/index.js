/**
 * Opens a new browser window maximized to the full screen.
 * @param {string} url - The URL to be opened in the new window.
 */
function openMaximizedWindow(url) {
  const newWindow = window.open(
    url,
    "_blank",
    "toolbar=no,location=no,status=no,menubar=no,scrollbars=yes,resizable=yes"
  );

  if (newWindow) {
    // Usamos screen.availWidth y screen.availHeight para asegurarnos de que la ventana use todo el espacio disponible.
    newWindow.moveTo(0, 0);
    newWindow.resizeTo(screen.availWidth, screen.availHeight);
  } else {
    alert("Por favor, permita las ventanas emergentes en su navegador.");
  }
}

$(document).ready(function () {
  // Hide dropdown menus on page load
  $(".dropdown-menu").hide();

  // Attach click event to toggle dropdown menus
  $(".nav-link.dropdown-toggle").on("click", function (e) {
    e.preventDefault();
    const $dropdown = $(this).next(".dropdown-menu");
    $(".dropdown-menu").not($dropdown).hide(); // Close other open dropdowns
    $dropdown.toggle();
  });

  loadNews(); // Load saved news from local storage
});

/**
 * Handles the form submission to add a news item.
 */
$("#newsForm").on("submit", function (e) {
  e.preventDefault();

  const title = $("#newsTitle").val().trim();
  const description = $("#newsDescription").val().trim();
  const isImportant = $("#importantCheck").is(":checked");

  if (title && description) {
    const newsItem = {
      title,
      description,
      isImportant,
    };
    appendNewsItem(newsItem);
    saveNews(newsItem);
    $("#addNewsModal").modal("hide");
    $("#newsForm")[0].reset();
  }
});

/**
 * Appends a news item to the news list.
 * @param {Object} newsItem - The news item object containing title, description, and importance.
 */
function appendNewsItem({ title, description, isImportant }) {
  const newsItemHTML = `
        <li class="news-item">
            <div>
                <h4>${title}</h4>
                ${
                  isImportant
                    ? '<span class="important">(Importante)</span>'
                    : ""
                }
                <p>${description}</p>
            </div>
            <button type="button" class="btn btn-danger btn-sm delete-news" data-bs-toggle="modal" data-bs-target="#deleteNewsModal">Eliminar</button>
        </li>
    `;
  $("#newsList").append(newsItemHTML);
}

/**
 * Saves a news item to local storage.
 * @param {Object} newsItem - The news item object containing title, description, and importance.
 */
function saveNews(newsItem) {
  try {
    const newsList = JSON.parse(localStorage.getItem("newsList")) || [];
    newsList.push(newsItem);
    localStorage.setItem("newsList", JSON.stringify(newsList));
  } catch (error) {
    console.error("Error saving news to local storage:", error);
  }
}

/**
 * Loads news items from local storage and appends them to the news list.
 */
function loadNews() {
  try {
    const newsList = JSON.parse(localStorage.getItem("newsList")) || [];
    newsList.forEach(appendNewsItem);
  } catch (error) {
    console.error("Error loading news from local storage:", error);
  }
}

// Handle news item deletion
let newsItemToDelete = null;

$("#newsList").on("click", ".delete-news", function () {
  newsItemToDelete = $(this).closest(".news-item");
});

$("#confirmDeleteNews").on("click", function () {
  if (newsItemToDelete) {
    const index = newsItemToDelete.index();
    newsItemToDelete.remove();
    deleteNews(index);
    $("#deleteNewsModal").modal("hide");
  }
});

/**
 * Deletes a news item from local storage.
 * @param {number} index - The index of the news item to be deleted.
 */
function deleteNews(index) {
  try {
    let newsList = JSON.parse(localStorage.getItem("newsList")) || [];
    newsList.splice(index, 1);
    localStorage.setItem("newsList", JSON.stringify(newsList));
  } catch (error) {
    console.error("Error deleting news from local storage:", error);
  }
}

/**
 * Updates the clock displays for multiple time zones.
 */
function updateClock() {
  const now = new Date();
  const timeZones = {
    CR: "America/Costa_Rica",
    London: "Europe/London",
    Washington: "America/New_York",
  };

  const timeStrings = Object.entries(timeZones).map(([label, timeZone]) => {
    return `<span>${label}: ${now.toLocaleTimeString("es-ES", {
      timeZone,
      hour: "2-digit",
      minute: "2-digit",
    })}</span>`;
  });

  document.getElementById("clock").innerHTML = timeStrings.join(" - ");
}

// Update the clocks every minute
setInterval(updateClock, 60000);
updateClock(); // Initial clock update
