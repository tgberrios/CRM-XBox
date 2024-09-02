document.addEventListener("DOMContentLoaded", () => {
  // Ruta fija al archivo Excel
  const filePath = "../data/consolas.xlsx";

  fetch(filePath)
    .then((response) => response.arrayBuffer())
    .then((data) => {
      const workbook = XLSX.read(data, { type: "array" });
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];
      const json = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

      if (json.length) {
        displayTable(json);
      } else {
        console.error("No data found in the Excel file.");
      }
    })
    .catch((error) => console.error("Error fetching the Excel file:", error));
});

function displayTable(data) {
  const tableHeader = document.getElementById("tableHeader");
  const tableBody = document.getElementById("tableBody");
  tableHeader.innerHTML = "";
  tableBody.innerHTML = "";

  // Verificar que el encabezado exista
  if (!data[0] || !Array.isArray(data[0])) {
    console.error("Invalid table data.");
    return;
  }

  // Crear encabezado de la tabla
  data[0].forEach((header) => {
    const th = document.createElement("th");
    th.textContent = header;
    tableHeader.appendChild(th);
  });

  // Crear filas de la tabla
  for (let i = 1; i < data.length; i++) {
    const tr = document.createElement("tr");
    if (isTitleRow(data[i])) {
      tr.classList.add("title-row");
    }
    data[i].forEach((cell) => {
      const td = document.createElement("td");
      td.textContent = cell;
      tr.appendChild(td);
    });
    tableBody.appendChild(tr);
  }
}

function isTitleRow(row) {
  // Define the title row format more specifically if needed
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
    // Use class toggle instead of direct style manipulation for better performance
    rows[i].classList.toggle("hidden", !visible);
  }
}

function goHome() {
  window.location.href = "../index.html"; // Ajusta esta URL según la ruta de tu página de inicio
}
