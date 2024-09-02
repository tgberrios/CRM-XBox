let hardwareData = [];
let filteredData = [];
let currentPage = 1;
const itemsPerPage = 10;

document.addEventListener("DOMContentLoaded", () => {
  loadHardware();
  document.getElementById("searchInput").addEventListener("input", filterTable);
  document.getElementById("showFormButton").addEventListener("click", showForm);
  document.getElementById("hideFormButton").addEventListener("click", hideForm);
  document
    .getElementById("hardwareForm")
    .addEventListener("submit", handleSubmit);
  document.getElementById("importButton").addEventListener("click", importData);
  document.getElementById("exportButton").addEventListener("click", exportData);
});

async function loadHardware() {
  try {
    hardwareData = await window.cert.invoke("get-hardware");
    filteredData = hardwareData; // Start with unfiltered data
    updateTable();
  } catch (error) {
    console.error("Error loading data:", error);
  }
}

function showForm() {
  document.getElementById("hardwareFormContainer").classList.add("active");
  // Reset form mode and clear fields when showing
  document.getElementById("hardwareForm").dataset.mode = "";
  document.getElementById("hardwareForm").reset();
}

function hideForm() {
  document.getElementById("hardwareFormContainer").classList.remove("active");
}

async function handleSubmit(e) {
  e.preventDefault();
  const form = e.target;
  const mode = form.dataset.mode;

  const newHardware = {
    serialNumber: form.serialNumber.value,
    consoleId: form.consoleId.value,
    xboxLiveId: form.xboxLiveId.value,
    assetOwner: form.assetOwner.value,
    projectOwner: form.projectOwner.value,
    type: form.type.value,
    classification: form.classification.value,
    assetTag: form.assetTag.value,
    location: form.location.value,
    status: form.status.value,
    owner: form.owner.value,
  };

  try {
    await window.cert.invoke("add-or-update-hardware", newHardware);
    hideForm();
    loadHardware();
  } catch (error) {
    console.error("Error saving data:", error);
  }
}

function updateTable() {
  const tableBody = document.getElementById("hardwareTable");
  tableBody.innerHTML = "";

  const start = (currentPage - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  const paginatedData = filteredData.slice(start, end);

  paginatedData.forEach((item) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${item.serialNumber}</td>
      <td>${item.consoleId}</td>
      <td>${item.xboxLiveId}</td>
      <td>${item.assetOwner}</td>
      <td>${item.projectOwner}</td>
      <td>${item.type}</td>
      <td>${item.classification}</td>
      <td>${item.assetTag}</td>
      <td>${item.location}</td>
      <td>${item.status}</td>
      <td>${item.owner}</td>
      <td class="action-buttons">
        <button class="btn btn-secondary btn-sm" onclick="editHardware('${item.serialNumber}')">Edit</button>
        <button class="btn btn-danger btn-sm" onclick="deleteHardware('${item.serialNumber}')">Delete</button>
      </td>
    `;
    tableBody.appendChild(row);
  });

  updatePagination();
}

function updatePagination() {
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const pagination = document.getElementById("pagination");
  pagination.innerHTML = "";

  for (let i = 1; i <= totalPages; i++) {
    const li = document.createElement("li");
    li.className = `page-item ${i === currentPage ? "active" : ""}`;
    li.innerHTML = `<a class="page-link" href="#" onclick="changePage(${i})">${i}</a>`;
    pagination.appendChild(li);
  }
}

function changePage(page) {
  currentPage = page;
  updateTable();
}

function filterTable() {
  const searchValue = document
    .getElementById("searchInput")
    .value.toLowerCase();
  filteredData = hardwareData.filter((item) =>
    Object.values(item).some((val) => val.toLowerCase().includes(searchValue))
  );
  currentPage = 1;
  updateTable();
}

async function deleteHardware(serialNumber) {
  try {
    await window.cert.invoke("delete-hardware", serialNumber);
    loadHardware();
  } catch (error) {
    console.error("Error deleting data:", error);
  }
}

function importData() {
  const fileInput = document.createElement("input");
  fileInput.type = "file";
  fileInput.accept = ".csv";
  fileInput.addEventListener("change", handleFileSelect);
  fileInput.click();
}

function handleFileSelect(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function (e) {
    const content = e.target.result;
    parseCSV(content);
  };
  reader.readAsText(file);
}

async function parseCSV(content) {
  const rows = content.split("\n");
  const headers = rows[0].split(",");

  const newData = rows.slice(1).map((row) => {
    const values = row.split(",");
    const data = {};

    headers.forEach((header, index) => {
      data[header.trim()] = values[index].trim();
    });

    return data;
  });

  try {
    for (const data of newData) {
      await window.cert.invoke("add-or-update-hardware", data);
    }
    console.log("Data imported successfully.");
    loadHardware();
  } catch (error) {
    console.error("Error importing data:", error);
  }
}

async function exportData() {
  try {
    const data = await window.cert.invoke("get-hardware");
    const csv = convertToCSV(data);
    downloadCSV(csv);
  } catch (error) {
    console.error("Error exporting data:", error);
  }
}

function convertToCSV(data) {
  if (!data.length) return "";
  const headers = Object.keys(data[0]);
  const rows = data.map((item) =>
    headers.map((header) => item[header]).join(",")
  );
  return [headers.join(","), ...rows].join("\n");
}

function downloadCSV(csv) {
  const link = document.createElement("a");
  link.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
  link.download = "hardware_data.csv";
  link.click();
}

function editHardware(serialNumber) {
  const hardware = hardwareData.find(
    (item) => item.serialNumber === serialNumber
  );
  if (hardware) {
    const form = document.getElementById("hardwareForm");
    form.serialNumber.value = hardware.serialNumber;
    form.consoleId.value = hardware.consoleId;
    form.xboxLiveId.value = hardware.xboxLiveId;
    form.assetOwner.value = hardware.assetOwner;
    form.projectOwner.value = hardware.projectOwner;
    form.type.value = hardware.type;
    form.classification.value = hardware.classification;
    form.assetTag.value = hardware.assetTag;
    form.location.value = hardware.location;
    form.status.value = hardware.status;
    form.owner.value = hardware.owner;
    form.dataset.mode = "edit";
    form.dataset.serialNumber = serialNumber;
    document.getElementById("hardwareFormContainer").classList.add("active");
  }
}
