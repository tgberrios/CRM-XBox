document.addEventListener("DOMContentLoaded", () => {
  const filePath = "../data/xrComments.xlsx";

  fetch(filePath)
    .then((response) => response.arrayBuffer())
    .then((data) => {
      const workbook = XLSX.read(data, { type: "array" });
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];
      const json = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
      if (json.length > 0) {
        displayTable(json);
      } else {
        console.error("Excel file is empty.");
      }
    })
    .catch((error) => console.error("Error fetching the Excel file:", error));
});

function displayTable(data) {
  const tableHeader = document.getElementById("tableHeader");
  const tableBody = document.getElementById("tableBody");
  tableHeader.innerHTML = "";
  tableBody.innerHTML = "";

  const headerFragment = document.createDocumentFragment();
  const bodyFragment = document.createDocumentFragment();

  // Create table header
  data[0].forEach((header) => {
    const th = document.createElement("th");
    th.textContent = header;
    headerFragment.appendChild(th);
  });
  tableHeader.appendChild(headerFragment);

  // Create table rows
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
    bodyFragment.appendChild(tr);
  });
  tableBody.appendChild(bodyFragment);
}

function isTitleRow(row) {
  return row.some((cell) => typeof cell === "string" && /^\d{2} - /.test(cell));
}

function searchTable() {
  const input = document.getElementById("searchInput");
  const filter = input.value.toLowerCase();
  const rows = document.getElementById("tableBody").getElementsByTagName("tr");

  for (let i = 0; i < rows.length; i++) {
    let visible = false;
    const cells = rows[i].getElementsByTagName("td");
    for (let j = 0; j < cells.length; j++) {
      if (cells[j] && cells[j].textContent.toLowerCase().includes(filter)) {
        visible = true;
        break;
      }
    }
    rows[i].style.display = visible ? "" : "none";
  }
}

function goHome() {
  window.location.href = "../index.html"; // Adjust this URL according to your home page path
}
