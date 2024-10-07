// Import the Electron API
const { contextBridge, ipcRenderer } = require("electron");

// Expose the API to the renderer process
console.log("Preload script loaded and exposing API");
console.log("ipcRenderer is defined:", ipcRenderer !== undefined);

// Define the IPC invoke function
const ipcInvoke = (channel, ...args) => {
  console.log(`IPC invoke: ${channel}`, args);
  return ipcRenderer.invoke(channel, ...args).catch((error) => {
    console.error(`Error invoking ${channel}:`, error);
    throw error;
  });
};

// Define the API object
const api = {
  // Open the database
  openDB: () => ipcInvoke("openDB"),
  // Register a new user
  registerUser: (username, password) =>
    ipcInvoke("registerUser", username, password),
  // Login a user
  loginUser: (username, password) => ipcInvoke("loginUser", username, password),

  logUpdate: (update) => ipcInvoke("logUpdate", update),
  loadUpdates: () => ipcInvoke("loadUpdates"),
  deleteUpdate: (id) => ipcInvoke("deleteUpdate", id),

  insertTestCase: (testCase) => ipcInvoke("insertTestCase", testCase),
  getAllTestCases: () => ipcInvoke("getAllTestCases"),
  getTestCaseById: (id) => ipcInvoke("getTestCaseById", id),
  updateTestCase: (testCase) => ipcInvoke("updateTestCase", testCase),
  deleteTestCase: (id) => ipcInvoke("deleteTestCase", id),

  getReviews: () => ipcInvoke("getReviews"),
  addReview: (review) => ipcInvoke("add-review", review),
  updateReview: (review) => ipcInvoke("update-review", review),
  deleteReview: (id) => ipcInvoke("delete-review", id),
  getTesters: () => ipcInvoke("get-testers"),
  addTester: (name) => ipcInvoke("add-tester", name),
  getReviewById: (id) => ipcRenderer.invoke("get-review-by-id", id),

  addAudit: (audit) => ipcInvoke("add-audit", audit),
  loadAudits: () => ipcInvoke("load-audits"),
  getAudit: (id) => ipcInvoke("get-audit", id),
  deleteAudit: (id) => ipcInvoke("delete-audit", id),
  editAudit: (id, audit) => ipcInvoke("edit-audit", id, audit),

  loadTrackers: () => ipcInvoke("load-trackers"),
  deleteTracker: (id) => ipcInvoke("deleteTracker", id),
  migrateTrackers: () => ipcInvoke("migrate-trackers"),
  viewTestCases: (id) => ipcInvoke("view-test-cases", id),
  clearLocalStorage: () => ipcRenderer.send("clear-local-storage"),

  loadHistory: () => ipcInvoke("load-history"),
  searchHistory: (term) => ipcInvoke("search-history", term),

  saveTracker: (tracker) => ipcInvoke("save-tracker", tracker),
  loadTracker: (id) => ipcInvoke("load-tracker", id),

  loadTrackerDetails: (trackerId) => ipcInvoke("loadTrackerDetails", trackerId),
  saveTrackerDetails: (tracker) => ipcInvoke("saveTrackerDetails", tracker),

  moveTrackerToHistory: (tracker) => ipcInvoke("moveTrackerToHistory", tracker),
  getAllTrackers: () => ipcInvoke("getAllTrackers"),

  getTestCases: (trackerId) => {
    console.log("Calling getTestCases with trackerId:", trackerId);
    return ipcInvoke("getTestCases", trackerId);
  },

  addTicket: (ticket) => ipcInvoke("addTicket", ticket),
  getTickets: () => ipcInvoke("get-tickets"),
  deleteTicket: (id) => ipcInvoke("delete-ticket", id),

  addIssue: (issue) => ipcInvoke("addIssue", issue),
  getIssues: () => ipcInvoke("get-issues"),
  searchIssues: (query) => ipcInvoke("search-issues", query),

  fetchItems: () => ipcInvoke("fetch-items"),
  addItem: (item) => ipcInvoke("add-item", item),
  updateItem: (item) => ipcInvoke("update-item", item),
  deleteItem: (id) => ipcInvoke("delete-item", id),
  searchItems: (query) => ipcInvoke("search-items", query),

  getAccounts: (page, search) => ipcInvoke("get-accounts", page, search),
  getAccount: (id) => ipcInvoke("get-account", id),
  saveAccount: (account) => ipcInvoke("save-account", account),
  deleteAccount: (id) => ipcInvoke("delete-account", id),
  getNextId: () => ipcInvoke("get-next-id"),

  getHardware: () => ipcInvoke("get-hardware"),
  addOrUpdateHardware: (hardware) =>
    ipcInvoke("add-or-update-hardware", hardware),
  deleteHardware: (serialNumber) => ipcInvoke("delete-hardware", serialNumber),

  saveData: (data) => ipcRenderer.invoke("save-data", data),
  loadDataById: (id) => ipcRenderer.invoke("loadDataById", id),
  loadData: (id) => ipcRenderer.invoke("load-data", id),
  updateData: (data) => ipcRenderer.invoke("update-data", data),
  deleteData: (id) => ipcRenderer.invoke("delete-data", id),
  loadAllData: () => ipcRenderer.invoke("loadAllData"),

  // Expose the ipcRenderer.invoke method
  invoke: ipcRenderer.invoke.bind(ipcRenderer),
  on: ipcRenderer.on.bind(ipcRenderer),
};

// Expose the api object to the main process
contextBridge.exposeInMainWorld("cert", api);
