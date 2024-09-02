document.addEventListener("DOMContentLoaded", () => {
  // Fixed path to the Excel file
  const filePath = "../data/fma.xlsx";

  fetch(filePath)
    .then((response) => response.arrayBuffer())
    .then((data) => {
      const workbook = XLSX.read(data, { type: "array" });
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];
      const json = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
      displayTable(json);
    })
    .catch((error) => {
      console.error("Error fetching the Excel file:", error);
      alert("There was an error loading the data. Please try again later.");
    });
});

function displayTable(data) {
  const tableHeader = document.getElementById("tableHeader");
  const tableBody = document.getElementById("tableBody");
  tableHeader.innerHTML = "";
  tableBody.innerHTML = "";

  // Create table header
  data[0].forEach((header) => {
    const th = document.createElement("th");
    th.textContent = header;
    tableHeader.appendChild(th);
  });

  // Create table rows
  const fragment = document.createDocumentFragment(); // Batch DOM updates
  data.slice(1).forEach((row) => {
    const tr = document.createElement("tr");
    if (isTitleRow(row)) {
      tr.classList.add("title-row");
    }
    row.forEach((cell) => {
      const td = document.createElement("td");
      td.textContent = cell;
      tr.appendChild(td);
    });
    fragment.appendChild(tr);
  });
  tableBody.appendChild(fragment);
}

function isTitleRow(row) {
  return row.some((cell) => typeof cell === "string" && /^\d{2} - /.test(cell));
}

function searchTable() {
  const input = document.getElementById("searchInput");
  const filter = input.value.toLowerCase();
  const rows = document.getElementById("tableBody").getElementsByTagName("tr");

  // Debounce function for search
  debounce(() => {
    Array.from(rows).forEach((row) => {
      const cells = row.getElementsByTagName("td");
      const visible = Array.from(cells).some((cell) =>
        cell.textContent.toLowerCase().includes(filter)
      );
      row.style.display = visible ? "" : "none";
    });
  }, 300)(); // Adjust debounce delay as needed
}

function debounce(func, delay) {
  let timeout;
  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), delay);
  };
}

function goHome() {
  window.location.href = "../index.html"; // Adjust this URL according to the path of your homepage
}
