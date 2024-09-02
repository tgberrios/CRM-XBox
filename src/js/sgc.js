document.getElementById("dataForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const form = e.target;
  const formData = {
    date: form.date.value,
    position: form.position.value,
    email: form.email.value,
    gamertag: form.gamertag.value,
    title_name: form["title-name"].value,
    title_version: form["title-version"].value,
    submission_iteration: form["submission-iteration"].value,
    progress: form.progress.value,
    options: form.options.value,
    publisher_accounts: form["publisher-accounts"].value,
    publisher_password: form["publisher-password"].value,
  };

  try {
    await window.cert.saveData(formData);
    alert("Data saved successfully");
    loadAllData(); // Reload the data display after saving
  } catch (error) {
    console.error("Error saving data:", error);
    alert("Error saving data");
  }
});

async function loadAllData() {
  try {
    const dataDisplay = document.getElementById("dataDisplay");
    dataDisplay.innerHTML = ""; // Clear existing data

    const data = await window.cert.loadAllData(); // Method to get all data
    if (data && data.length > 0) {
      data.forEach((item) => {
        const itemElement = document.createElement("div");
        itemElement.classList.add("data-item");
        itemElement.innerHTML = `
                <h5>${item.title_name}</h5>
                <p><strong>Date:</strong> ${item.date}</p>
                <p><strong>Submission Iteration:</strong> ${item.submission_iteration}</p>
                <button class="btn btn-info btn-sm" data-id="${item.id}" data-toggle="modal" data-target="#dataModal">Details</button>
              `;
        dataDisplay.appendChild(itemElement);
      });

      // Attach event listeners for modals
      document.querySelectorAll(".data-item button").forEach((button) => {
        button.addEventListener("click", (e) => {
          const itemId = e.target.dataset.id;
          showItemDetails(itemId);
        });
      });
    } else {
      dataDisplay.innerHTML = "<p>No Data</p>";
    }
  } catch (error) {
    console.error("Error loading data:", error);
  }
}

async function showItemDetails(itemId) {
  try {
    const item = await window.cert.loadDataById(itemId);
    console.log(item);
    if (item) {
      document.getElementById("modal-date").textContent =
        item.date || "No data";
      document.getElementById("modal-title-name").textContent =
        item.title_name || "No data";
      document.getElementById("modal-submission-iteration").textContent =
        item.submission_iteration || "No data";
      document.getElementById("modal-position").textContent =
        item.position || "No data";
      document.getElementById("modal-email").textContent =
        item.email || "No data";
      document.getElementById("modal-gamertag").textContent =
        item.gamertag || "No data";
      document.getElementById("modal-title-version").textContent =
        item.title_version || "No data";
      document.getElementById("modal-progress").textContent =
        item.progress || "No data";
      document.getElementById("modal-options").textContent =
        item.options || "No data";
      document.getElementById("modal-publisher-accounts").textContent =
        item.publisher_accounts || "No data";
      document.getElementById("modal-publisher-password").textContent =
        item.publisher_password || "No data";

      document.getElementById("editButtonModal").onclick = () => {
        editItem(itemId);
      };
      document.getElementById("deleteButtonModal").onclick = () => {
        deleteItem(itemId);
      };
    }
  } catch (error) {
    console.error("Error loading item details:", error);
  }
}

function editItem(itemId) {
  // Logic to populate form fields with item details for editing
  window.cert.loadDataById(itemId).then((item) => {
    if (item) {
      const form = document.getElementById("dataForm");
      form.date.value = item.date;
      form.position.value = item.position;
      form.email.value = item.email;
      form.gamertag.value = item.gamertag;
      form["title-name"].value = item.title_name;
      form["title-version"].value = item.title_version;
      form["submission-iteration"].value = item.submission_iteration;
      form.progress.value = item.progress;
      form.options.value = item.options;
      form["publisher-accounts"].value = item.publisher_accounts;
      form["publisher-password"].value = item.publisher_password;
    }
  });
  // Optionally, you can scroll to the form or open the form section
}

function deleteItem(itemId) {
  if (confirm("Are you sure you want to delete this item?")) {
    window.cert
      .deleteData(itemId)
      .then(() => {
        alert("Data deleted successfully");
        loadAllData(); // Reload the data display after deletion
      })
      .catch((error) => {
        console.error("Error deleting data:", error);
        alert("Error deleting data");
      });
  }
}

// Initial load of data
loadAllData();

// Search functionality
document.getElementById("searchInput").addEventListener("input", function (e) {
  const query = e.target.value.toLowerCase();
  document.querySelectorAll(".data-item").forEach((item) => {
    const title = item.querySelector("h5").textContent.toLowerCase();
    const date = item.querySelector("p").textContent.toLowerCase();
    if (title.includes(query) || date.includes(query)) {
      item.style.display = "";
    } else {
      item.style.display = "none";
    }
  });
});
