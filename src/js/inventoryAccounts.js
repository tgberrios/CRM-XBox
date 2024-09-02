const itemsPerPage = 10; // Number of items per page
let currentPage = 1;
let db;
let nextId = 1;

document.addEventListener("DOMContentLoaded", () => {
  openDatabase();
  document
    .getElementById("searchInput")
    .addEventListener("input", handleSearch);
});

function openDatabase() {
  const request = indexedDB.open("accountsDB", 1);

  request.onupgradeneeded = (event) => {
    db = event.target.result;
    const objectStore = db.createObjectStore("accounts", { keyPath: "id" });
    const indexes = [
      "state",
      "email",
      "position",
      "gamertag",
      "sandbox",
      "subscription",
      "location",
      "notes",
    ];
    indexes.forEach((index) =>
      objectStore.createIndex(index, index, { unique: false })
    );
  };

  request.onsuccess = (event) => {
    db = event.target.result;
    loadAccounts();
    getNextId(); // Initialize nextId
  };

  request.onerror = (event) => {
    console.error("Error opening database:", event.target.errorCode);
  };
}

function getNextId() {
  const transaction = db.transaction("accounts", "readonly");
  const objectStore = transaction.objectStore("accounts");
  const request = objectStore.openCursor(null, "prev");

  request.onsuccess = (event) => {
    const cursor = event.target.result;
    if (cursor) {
      nextId = cursor.value.id + 1;
    }
  };

  request.onerror = (event) => {
    console.error("Error fetching last ID:", event.target.errorCode);
  };
}

function loadAccounts(page = 1, search = "") {
  const transaction = db.transaction("accounts", "readonly");
  const objectStore = transaction.objectStore("accounts");
  const accounts = [];

  // Utilize indexes for efficient searching
  const index = objectStore.index("email"); // Change index based on search needs
  const query = search.toLowerCase();

  index.openCursor().onsuccess = (event) => {
    const cursor = event.target.result;
    if (cursor) {
      const account = cursor.value;
      if (
        Object.values(account).some((value) =>
          String(value).toLowerCase().includes(query)
        )
      ) {
        accounts.push(account);
      }
      cursor.continue();
    } else {
      renderTable(page, accounts);
      renderPagination(accounts);
    }
  };

  index.onerror = (event) => {
    console.error("Error loading accounts:", event.target.errorCode);
  };
}

function renderTable(page, accounts) {
  const accountsTable = document.getElementById("accountsTable");
  accountsTable.innerHTML = "";

  const start = (page - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  const paginatedAccounts = accounts.slice(start, end);

  paginatedAccounts.forEach((account) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${account.id}</td>
      <td>${account.state}</td>
      <td>${account.email}</td>
      <td>${account.position}</td>
      <td>${account.gamertag}</td>
      <td>${account.sandbox}</td>
      <td>${account.subscription}</td>
      <td>${account.location}</td>
      <td>${account.notes}</td>
      <td>
        <button class="btn btn-warning btn-sm" onclick="editAccount(${account.id})">Edit</button>
        <button class="btn btn-danger btn-sm" onclick="deleteAccount(${account.id})">Delete</button>
      </td>
    `;
    accountsTable.appendChild(row);
  });
}

function renderPagination(accounts) {
  const paginationControls = document.getElementById("paginationControls");
  paginationControls.innerHTML = "";

  const totalPages = Math.ceil(accounts.length / itemsPerPage);

  for (let i = 1; i <= totalPages; i++) {
    const pageItem = document.createElement("li");
    pageItem.classList.add("page-item");
    if (i === currentPage) pageItem.classList.add("active");

    pageItem.innerHTML = `<a class="page-link" href="#" onclick="changePage(${i})">${i}</a>`;
    paginationControls.appendChild(pageItem);
  }
}

function changePage(page) {
  currentPage = page;
  loadAccounts(page, document.getElementById("searchInput").value);
}

function handleSearch() {
  loadAccounts(currentPage, this.value);
}

function editAccount(id) {
  const transaction = db.transaction("accounts", "readonly");
  const objectStore = transaction.objectStore("accounts");
  const request = objectStore.get(id);

  request.onsuccess = (event) => {
    const account = event.target.result;
    if (account) {
      populateForm(account);
    }
  };

  request.onerror = (event) => {
    console.error("Error fetching account:", event.target.errorCode);
  };
}

function deleteAccount(id) {
  const transaction = db.transaction("accounts", "readwrite");
  const objectStore = transaction.objectStore("accounts");
  const request = objectStore.delete(id);

  request.onsuccess = () => {
    loadAccounts(currentPage, document.getElementById("searchInput").value);
  };

  request.onerror = (event) => {
    console.error("Error deleting account:", event.target.errorCode);
  };
}

document.getElementById("accountForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const account = {
    id: document.getElementById("id").value || nextId++,
    state: document.getElementById("state").value,
    email: document.getElementById("email").value,
    position: document.getElementById("position").value,
    gamertag: document.getElementById("gamertag").value,
    sandbox: document.getElementById("sandbox").value,
    subscription: document.getElementById("subscription").value,
    location: document.getElementById("location").value,
    notes: document.getElementById("notes").value,
  };

  const transaction = db.transaction("accounts", "readwrite");
  const objectStore = transaction.objectStore("accounts");
  const request = account.id
    ? objectStore.put(account)
    : objectStore.add(account);

  request.onsuccess = () => {
    loadAccounts(currentPage, document.getElementById("searchInput").value);
    clearForm();
  };

  request.onerror = (event) => {
    console.error("Error saving account:", event.target.errorCode);
  };
});

function clearForm() {
  document.getElementById("accountForm").reset();
}

function populateForm(account) {
  document.getElementById("id").value = account.id;
  document.getElementById("state").value = account.state;
  document.getElementById("email").value = account.email;
  document.getElementById("position").value = account.position;
  document.getElementById("gamertag").value = account.gamertag;
  document.getElementById("sandbox").value = account.sandbox;
  document.getElementById("subscription").value = account.subscription;
  document.getElementById("location").value = account.location;
  document.getElementById("notes").value = account.notes;
}

function exportToExcel() {
  const transaction = db.transaction("accounts", "readonly");
  const objectStore = transaction.objectStore("accounts");
  const accounts = [];

  objectStore.openCursor().onsuccess = (event) => {
    const cursor = event.target.result;
    if (cursor) {
      accounts.push(cursor.value);
      cursor.continue();
    } else {
      // Generate Excel file
      const ws = XLSX.utils.json_to_sheet(accounts);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Accounts");
      XLSX.writeFile(wb, "accounts.xlsx");
    }
  };

  objectStore.openCursor().onerror = (event) => {
    console.error("Error exporting accounts:", event.target.errorCode);
  };
}

function showImportSection() {
  document.getElementById("importSection").style.display = "block";
}

function importFromExcel() {
  const fileInput = document.getElementById("importFile");
  const file = fileInput.files[0];
  if (!file) {
    alert("Please select a file to import.");
    return;
  }

  const reader = new FileReader();
  reader.onload = (e) => {
    const data = new Uint8Array(e.target.result);
    const workbook = XLSX.read(data, { type: "array" });
    const firstSheet = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[firstSheet];
    const json = XLSX.utils.sheet_to_json(worksheet);

    const transaction = db.transaction("accounts", "readwrite");
    const objectStore = transaction.objectStore("accounts");

    json.forEach((account) => {
      if (
        account.id &&
        account.state &&
        account.email &&
        account.position &&
        account.gamertag &&
        account.sandbox &&
        account.subscription &&
        account.location &&
        account.notes
      ) {
        objectStore.put(account);
      }
    });

    transaction.oncomplete = () => {
      loadAccounts(currentPage, document.getElementById("searchInput").value);
      alert("Data imported successfully.");
      document.getElementById("importSection").style.display = "none"; // Hide import section
      fileInput.value = ""; // Clear file input
    };

    transaction.onerror = (event) => {
      console.error("Error importing accounts:", event.target.errorCode);
    };
  };

  reader.readAsArrayBuffer(file);
}
