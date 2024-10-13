// Import Electron modules
const { app, BrowserWindow, ipcMain } = require("electron");
// Import other modules
const path = require("path");
const crypto = require("crypto");
const sqlite3 = require("sqlite3").verbose();
const initializeTables = require("../CRM XBox/src/js/dbSchema");

// Disable GPU acceleration
app.disableHardwareAcceleration();
app.commandLine.appendSwitch("disable-software-rasterizer");
app.commandLine.appendSwitch("ignore-gpu-blacklist");
app.commandLine.appendSwitch("disable-gpu");
app.commandLine.appendSwitch("disable-gpu-compositing");
app.commandLine.appendSwitch("no-sandbox");

// Initialize the database path
let db; // Variable global

let basePath = path.dirname(process.execPath);

if (process.env.NODE_ENV !== "production") {
  basePath = process.cwd();
}

// Initialize the database path
const dbPath = path.join(basePath, "appDB.db");
console.log(`Database path: ${dbPath}`);

// DB
function initializeDB() {
  db = new sqlite3.Database(dbPath, (err) => {
    // Usa la variable global `db`
    if (err) {
      console.error("Error opening database:", err.message);
    } else {
      console.log("Database connected successfully.");
      // Inicializa las tablas desde el archivo externo
      initializeTables(db);
    }
  });
}

initializeDB();

// CREATE WINDOW
function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    fullscreen: false,
    webPreferences: {
      preload: path.join(__dirname, "./preload.js"),
      contextIsolation: true,
      enableRemoteModule: false,
      nodeIntegration: false,
      sandbox: true,
    },
    icon: path.join(__dirname, "src/assets/xbox.ico"),
  });

  // Load the HTML file (authentication.html)
  mainWindow.loadFile("src/authentication.html").catch((err) => {
    console.error("Error loading HTML file:", err);
  });

  // Maximize the window after loading
  mainWindow.webContents.on("did-finish-load", () => {
    mainWindow.maximize(); // Maximize the window after loading
    // mainWindow.setMenu(null); // Uncomment to disable the menu
  });

  // Handle new window requests
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    // Allow new window requests
    return {
      action: "allow",
      overrideBrowserWindowOptions: {
        webPreferences: {
          preload: path.join(__dirname, "./preload.js"), // Ensure preload.js is loaded in new windows
          contextIsolation: true,
          enableRemoteModule: false,
          nodeIntegration: false,
          sandbox: true, // Enable sandboxing for additional security
        },
        icon: path.join(__dirname, "src/assets/xbox.ico"), // Path to the icon
        title: "CERT CR MANAGEMENT",
        fullscreen: false,
      },
    };
  });
}

// IPC LoginUser
ipcMain.handle("loginUser", async (event, username, password) => {
  return new Promise((resolve, reject) => {
    const hashedPassword = crypto
      .createHash("sha256")
      .update(password)
      .digest("hex");
    db.get(
      `SELECT * FROM users WHERE username = ? AND password = ?`,
      [username, hashedPassword],
      (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row);
        }
      }
    );
  });
});

// IPC RegisterUser
ipcMain.handle("registerUser", async (event, username, password) => {
  return new Promise((resolve, reject) => {
    const hashedPassword = crypto
      .createHash("sha256")
      .update(password)
      .digest("hex");
    db.run(
      `INSERT INTO users (username, password) VALUES (?, ?)`,
      [username, hashedPassword],
      function (err) {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      }
    );
  });
});

// IPC LoadDataById
ipcMain.handle("loadDataById", async (event, id) => {
  return new Promise((resolve, reject) => {
    db.get("SELECT * FROM data WHERE id = ?", [id], (err, row) => {
      if (err) {
        reject(err);
      } else {
        resolve(row);
      }
    });
  });
});

// IPC GetReviews
ipcMain.handle("get-reviews", async () => {
  return new Promise((resolve, reject) => {
    db.all("SELECT * FROM reviews", (err, rows) => {
      if (err) {
        console.error("Error fetching reviews:", err);
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
});

// IPC GetReviewById
ipcMain.handle("get-review-by-id", async (event, id) => {
  return new Promise((resolve, reject) => {
    db.get("SELECT * FROM reviews WHERE id = ?", [id], (err, row) => {
      if (err) {
        console.error("Error fetching review by ID:", err);
        reject(err);
      } else {
        resolve(row);
      }
    });
  });
});

//IPC FetchItems
ipcMain.handle("fetch-items", async () => {
  return new Promise((resolve, reject) => {
    db.all("SELECT * FROM items", [], (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
});

// IPC GetHardWare
ipcMain.handle("get-hardware", async () => {
  return new Promise((resolve, reject) => {
    db.all("SELECT * FROM hardware", [], (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
});

// IPC AddOrUpdateHardware
ipcMain.handle("add-or-update-hardware", async (event, hardware) => {
  return new Promise((resolve, reject) => {
    db.run(
      `INSERT OR REPLACE INTO hardware (
        serialNumber, consoleId, xboxLiveId, assetOwner, projectOwner, type, classification, assetTag, location, status, owner
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        hardware.serialNumber,
        hardware.consoleId,
        hardware.xboxLiveId,
        hardware.assetOwner,
        hardware.projectOwner,
        hardware.type,
        hardware.classification,
        hardware.assetTag,
        hardware.location,
        hardware.status,
        hardware.owner,
      ],
      (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      }
    );
  });
});

// IPC DeleteHardware
ipcMain.handle("delete-hardware", async (event, serialNumber) => {
  return new Promise((resolve, reject) => {
    db.run(
      "DELETE FROM hardware WHERE serialNumber = ?",
      [serialNumber],
      (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      }
    );
  });
});

// IPC GetAccounts
ipcMain.handle("get-accounts", async (event, page, search) => {
  const itemsPerPage = 10;
  const offset = (page - 1) * itemsPerPage;

  return new Promise((resolve, reject) => {
    db.all(
      `
      SELECT * FROM accounts
      WHERE state LIKE ? OR email LIKE ? OR position LIKE ? OR gamertag LIKE ? OR sandbox LIKE ? OR subscription LIKE ? OR location LIKE ? OR notes LIKE ?
      LIMIT ? OFFSET ?
    `,
      [
        `%${search}%`,
        `%${search}%`,
        `%${search}%`,
        `%${search}%`,
        `%${search}%`,
        `%${search}%`,
        `%${search}%`,
        `%${search}%`,
        itemsPerPage,
        offset,
      ],
      (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      }
    );
  });
});

//IPC GetAccount
ipcMain.handle("get-account", async (event, id) => {
  return new Promise((resolve, reject) => {
    db.get("SELECT * FROM accounts WHERE id = ?", [id], (err, row) => {
      if (err) {
        reject(err);
      } else {
        resolve(row);
      }
    });
  });
});

// IPC SaveAccount
ipcMain.handle("save-account", async (event, account) => {
  if (account.id) {
    return new Promise((resolve, reject) => {
      db.run(
        `
        UPDATE accounts SET state = ?, email = ?, position = ?, gamertag = ?, sandbox = ?, subscription = ?, location = ?, notes = ?
        WHERE id = ?
      `,
        [
          account.state,
          account.email,
          account.position,
          account.gamertag,
          account.sandbox,
          account.subscription,
          account.location,
          account.notes,
          account.id,
        ],
        function (err) {
          if (err) {
            reject(err);
          } else {
            resolve(this.changes);
          }
        }
      );
    });
  } else {
    return new Promise((resolve, reject) => {
      db.run(
        `
        INSERT INTO accounts (state, email, position, gamertag, sandbox, subscription, location, notes)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `,
        [
          account.state,
          account.email,
          account.position,
          account.gamertag,
          account.sandbox,
          account.subscription,
          account.location,
          account.notes,
        ],
        function (err) {
          if (err) {
            reject(err);
          } else {
            resolve(this.lastID);
          }
        }
      );
    });
  }
});

// IPC DeleteAccount
ipcMain.handle("delete-account", async (event, id) => {
  return new Promise((resolve, reject) => {
    db.run("DELETE FROM accounts WHERE id = ?", [id], function (err) {
      if (err) {
        reject(err);
      } else {
        resolve(this.changes);
      }
    });
  });
});

// IPC GetNextId
ipcMain.handle("get-next-id", async () => {
  return new Promise((resolve, reject) => {
    db.get("SELECT MAX(id) AS maxId FROM accounts", (err, row) => {
      if (err) {
        reject(err);
      } else {
        resolve((row.maxId || 0) + 1);
      }
    });
  });
});

// IPC AddItem
ipcMain.handle("add-item", async (event, item) => {
  return new Promise((resolve, reject) => {
    db.run(
      `INSERT INTO items (fecha, posicion, email, gamertag, titleName, titleVersion, submissionIteration, generation, options, publisherAccount, publisherPassword) 
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        item.fecha,
        item.posicion,
        item.email,
        item.gamertag,
        item.titleName,
        item.titleVersion,
        item.submissionIteration,
        item.generation,
        item.options,
        item.publisherAccount,
        item.publisherPassword,
      ],
      function (err) {
        if (err) {
          reject(err);
        } else {
          resolve(this.lastID);
        }
      }
    );
  });
});

// IPC UpdateItem
ipcMain.handle("update-item", async (event, item) => {
  return new Promise((resolve, reject) => {
    db.run(
      `UPDATE items SET 
              fecha = ?, 
              posicion = ?, 
              email = ?, 
              gamertag = ?, 
              titleName = ?, 
              titleVersion = ?, 
              submissionIteration = ?, 
              generation = ?, 
              options = ?, 
              publisherAccount = ?, 
              publisherPassword = ?
              WHERE id = ?`,
      [
        item.fecha,
        item.posicion,
        item.email,
        item.gamertag,
        item.titleName,
        item.titleVersion,
        item.submissionIteration,
        item.generation,
        item.options,
        item.publisherAccount,
        item.publisherPassword,
        item.id,
      ],
      function (err) {
        if (err) {
          reject(err);
        } else {
          resolve(this.changes);
        }
      }
    );
  });
});

// IPC GetData
ipcMain.handle("get-data", (event, query) => {
  console.log(`Executing query: ${query}`);
  return new Promise((resolve, reject) => {
    db.all(query, [], (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
});

// IPC DeleteItem
ipcMain.handle("delete-item", async (event, id) => {
  return new Promise((resolve, reject) => {
    db.run("DELETE FROM items WHERE id = ?", id, function (err) {
      if (err) {
        reject(err);
      } else {
        resolve(this.changes);
      }
    });
  });
});

//IPC SearchItems
ipcMain.handle("search-items", async (event, query) => {
  return new Promise((resolve, reject) => {
    db.all(
      "SELECT * FROM items WHERE titleName LIKE ? OR fecha LIKE ? OR generation LIKE ?",
      [`%${query}%`, `%${query}%`, `%${query}%`],
      (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      }
    );
  });
});

//IPC addIssue
ipcMain.handle("addIssue", async (event, issue) => {
  return new Promise((resolve, reject) => {
    const query = `
      INSERT INTO issues (name, date, observedBehavior, reproductionSteps, expectedBehavior, notes, bqScore, tags, xr, scenario)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    db.run(
      query,
      [
        issue.name,
        issue.date,
        issue.observedBehavior,
        issue.reproductionSteps,
        issue.expectedBehavior,
        issue.notes,
        issue.bqScore,
        issue.tags,
        issue.xr,
        issue.scenario,
      ],
      function (err) {
        if (err) {
          reject(err);
        } else {
          resolve(this.lastID); // return the ID of the newly inserted row
        }
      }
    );
  });
});

//IPC GetIssues
ipcMain.handle("get-issues", async () => {
  return new Promise((resolve, reject) => {
    const query = "SELECT * FROM issues";
    db.all(query, [], (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
});

// IPC SearchIssues
ipcMain.handle("search-issues", async (event, query) => {
  return new Promise((resolve, reject) => {
    const searchQuery = `
      SELECT * FROM issues
      WHERE name LIKE ? OR observedBehavior LIKE ? OR tags LIKE ?
    `;
    db.all(
      searchQuery,
      [`%${query}%`, `%${query}%`, `%${query}%`],
      (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      }
    );
  });
});

// IPC AddTicket
ipcMain.handle("addTicket", (event, ticket) => {
  return new Promise((resolve, reject) => {
    db.run(
      `INSERT INTO tickets (name, category, description, priority, status, date) VALUES (?, ?, ?, ?, ?, ?)`,
      [
        ticket.name,
        ticket.category,
        ticket.description,
        ticket.priority,
        ticket.status,
        ticket.date,
      ],
      function (err) {
        if (err) {
          reject(err);
        } else {
          resolve(this.lastID);
        }
      }
    );
  });
});

// IPC LoadAllData
ipcMain.handle("loadAllData", async () => {
  return new Promise((resolve, reject) => {
    db.all(`SELECT * FROM data`, [], (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
});

// IPC DeleteData
ipcMain.handle("delete-data", async (event, id) => {
  return new Promise((resolve, reject) => {
    db.run(`DELETE FROM data WHERE id = ?`, [id], function (err) {
      if (err) {
        reject(err);
      } else {
        resolve({ changes: this.changes });
      }
    });
  });
});

// IPC GetTickets
ipcMain.handle("get-tickets", () => {
  return new Promise((resolve, reject) => {
    db.all("SELECT * FROM tickets", (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
});

// IPC DeleteTicket
ipcMain.handle("delete-ticket", (event, id) => {
  return new Promise((resolve, reject) => {
    db.run("DELETE FROM tickets WHERE id = ?", id, function (err) {
      if (err) {
        reject(err);
      } else {
        resolve(this.changes);
      }
    });
  });
});

// IPC LogUpdate
ipcMain.handle("logUpdate", async (event, update) => {
  return new Promise((resolve, reject) => {
    db.run(
      "INSERT INTO updates (title, type, content) VALUES (?, ?, ?)",
      [update.title, update.type, update.content],
      function (err) {
        if (err) {
          console.error("Error: ", err);
          reject(err);
        } else {
          resolve({ id: this.lastID });
        }
      }
    );
  });
});

// IPC SaveData
ipcMain.handle("save-data", async (event, data) => {
  const {
    id,
    date,
    position,
    email,
    gamertag,
    title_name,
    title_version,
    submission_iteration,
    progress,
    options,
    publisher_accounts,
    publisher_password,
  } = data;

  return new Promise((resolve, reject) => {
    db.run(
      `INSERT OR REPLACE INTO data (id, date, position, email, gamertag, title_name, title_version, submission_iteration, progress, options, publisher_accounts, publisher_password)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        date,
        position,
        email,
        gamertag,
        title_name,
        title_version,
        submission_iteration,
        progress,
        options,
        publisher_accounts,
        publisher_password,
      ],
      (err) => {
        if (err) {
          reject(err);
        } else {
          resolve("Data saved successfully");
        }
      }
    );
  });
});

// IPC LoadData
ipcMain.handle("load-data", async (event, id) => {
  return new Promise((resolve, reject) => {
    db.get(`SELECT * FROM data WHERE id = ?`, [id], (err, row) => {
      if (err) {
        reject(err);
      } else {
        resolve(row);
      }
    });
  });
});

// IPC UpdateData
ipcMain.handle("update-data", async (event, data) => {
  const {
    id,
    date,
    position,
    email,
    gamertag,
    title_name,
    title_version,
    submission_iteration,
    progress,
    options,
    publisher_accounts,
    publisher_password,
  } = data;

  return new Promise((resolve, reject) => {
    db.run(
      `UPDATE data SET date = ?, position = ?, email = ?, gamertag = ?, title_name = ?, title_version = ?, submission_iteration = ?, progress = ?, options = ?, publisher_accounts = ?, publisher_password = ?
                WHERE id = ?`,
      [
        date,
        position,
        email,
        gamertag,
        title_name,
        title_version,
        submission_iteration,
        progress,
        options,
        publisher_accounts,
        publisher_password,
        id,
      ],
      (err) => {
        if (err) {
          reject(err);
        } else {
          resolve("Data updated successfully");
        }
      }
    );
  });
});

// IPC LoadUpdates
ipcMain.handle("loadUpdates", async () => {
  return new Promise((resolve, reject) => {
    db.all("SELECT * FROM updates", [], (err, rows) => {
      if (err) {
        console.error("Error: ", err);
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
});

// IPC DeleteUpdate
ipcMain.handle("deleteUpdate", async (event, updateID) => {
  return new Promise((resolve, reject) => {
    db.run("DELETE FROM updates WHERE id = ?", [updateID], function (err) {
      if (err) {
        console.error("Error:", err);
        reject(err);
      } else {
        resolve();
      }
    });
  });
});

// IPC InsertTestCase
ipcMain.handle("insertTestCase", async (event, testCase) => {
  const { xr, documentation, passExample, failExample, naExample } = testCase;
  return new Promise((resolve, reject) => {
    const stmt = db.prepare(
      "INSERT INTO testCases (xr, documentation, passExample, failExample, naExample) VALUES (?, ?, ?, ?, ?)"
    );
    stmt.run(
      xr,
      documentation,
      passExample,
      failExample,
      naExample,
      function (err) {
        if (err) {
          reject(err);
        } else {
          resolve(this.lastID);
        }
      }
    );
    stmt.finalize();
  });
});

// IPC GetAllTestCases
ipcMain.handle("getAllTestCases", async () => {
  return new Promise((resolve, reject) => {
    db.all("SELECT * FROM testCases", (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
});

// IPC GetTestCaseById
ipcMain.handle("getTestCaseById", async (event, id) => {
  return new Promise((resolve, reject) => {
    db.get("SELECT * FROM testCases WHERE id = ?", [id], (err, row) => {
      if (err) {
        reject(err);
      } else {
        resolve(row);
      }
    });
  });
});

// IPC UpdateTestCase
ipcMain.handle("updateTestCase", async (event, testCase) => {
  const { id, xr, documentation, passExample, failExample, naExample } =
    testCase;
  return new Promise((resolve, reject) => {
    const stmt = db.prepare(
      "UPDATE testCases SET xr = ?, documentation = ?, passExample = ?, failExample = ?, naExample = ? WHERE id = ?"
    );
    stmt.run(
      xr,
      documentation,
      passExample,
      failExample,
      naExample,
      id,
      function (err) {
        if (err) {
          reject(err);
        } else {
          resolve(this.changes);
        }
      }
    );
    stmt.finalize();
  });
});

// IPC DeleteTestCase
ipcMain.handle("deleteTestCase", async (event, id) => {
  return new Promise((resolve, reject) => {
    const stmt = db.prepare("DELETE FROM testCases WHERE id = ?");
    stmt.run(id, function (err) {
      if (err) {
        reject(err);
      } else {
        resolve(this.changes);
      }
    });
    stmt.finalize();
  });
});

// IPC GetReviews
ipcMain.handle("getReviews", async () => {
  return new Promise((resolve, reject) => {
    db.all("SELECT * FROM reviews", [], (err, rows) => {
      if (err) {
        return reject(err);
      }
      resolve(rows);
    });
  });
});

// IPC AddReview
ipcMain.handle("add-review", async (event, review) => {
  return new Promise((resolve, reject) => {
    const {
      testerName,
      performanceScore,
      bugDetectionAccuracy,
      testingEfficiency,
      communicationSkills,
      creativity,
      responsiveness,
      punctuality,
      problemAnalysis,
      toolsKnowledge,
      overallRating,
      observations,
      date,
    } = review;
    db.run(
      `INSERT INTO reviews (testerName, performanceScore, bugDetectionAccuracy, testingEfficiency, communicationSkills, creativity, responsiveness, punctuality, problemAnalysis, toolsKnowledge, overallRating, observations, date) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        testerName,
        performanceScore,
        bugDetectionAccuracy,
        testingEfficiency,
        communicationSkills,
        creativity,
        responsiveness,
        punctuality,
        problemAnalysis,
        toolsKnowledge,
        overallRating,
        observations,
        date,
      ],
      function (err) {
        if (err) {
          return reject(err);
        }
        resolve(this.lastID);
      }
    );
  });
});

// IPC UpdateReview
ipcMain.handle("update-review", async (event, review) => {
  return new Promise((resolve, reject) => {
    const {
      id,
      testerName,
      performanceScore,
      bugDetectionAccuracy,
      testingEfficiency,
      communicationSkills,
      creativity,
      responsiveness,
      punctuality,
      problemAnalysis,
      toolsKnowledge,
      overallRating,
      observations,
      date,
    } = review;
    db.run(
      `UPDATE reviews SET testerName = ?, performanceScore = ?, bugDetectionAccuracy = ?, testingEfficiency = ?, communicationSkills = ?, creativity = ?, responsiveness = ?, punctuality = ?, problemAnalysis = ?, toolsKnowledge = ?, overallRating = ?, observations = ?, date = ? WHERE id = ?`,
      [
        testerName,
        performanceScore,
        bugDetectionAccuracy,
        testingEfficiency,
        communicationSkills,
        creativity,
        responsiveness,
        punctuality,
        problemAnalysis,
        toolsKnowledge,
        overallRating,
        observations,
        date,
        id,
      ],
      function (err) {
        if (err) {
          return reject(err);
        }
        resolve(this.changes);
      }
    );
  });
});

// IPC DeleteReview
ipcMain.handle("delete-review", async (event, id) => {
  return new Promise((resolve, reject) => {
    db.run("DELETE FROM reviews WHERE id = ?", id, function (err) {
      if (err) {
        return reject(err);
      }
      resolve(this.changes);
    });
  });
});

// IPC GetAllTrackers
ipcMain.handle("getAllTrackers", async () => {
  return new Promise((resolve, reject) => {
    const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE, (err) => {
      if (err) {
        return reject(err.message);
      }
    });

    db.all("SELECT * FROM trackers", [], (err, rows) => {
      if (err) {
        return reject(err.message);
      }
      resolve(rows);
      db.close((closeErr) => {
        if (closeErr) {
          console.error("Error closing database:", closeErr.message);
        }
      });
    });
  });
});

// IPC GetTesters
ipcMain.handle("get-testers", async () => {
  return new Promise((resolve, reject) => {
    db.all("SELECT * FROM testers", [], (err, rows) => {
      if (err) {
        return reject(err);
      }
      resolve(rows);
    });
  });
});

// IPC AddTester
ipcMain.handle("add-tester", async (event, testerName) => {
  return new Promise((resolve, reject) => {
    db.run(
      "INSERT INTO testers (name) VALUES (?)",
      [testerName],
      function (err) {
        if (err) {
          return reject(err);
        }
        resolve(this.lastID);
      }
    );
  });
});

// IPC AddAudit
ipcMain.handle("add-audit", (event, audit) => {
  return new Promise((resolve, reject) => {
    db.run(
      `INSERT INTO audits (titleName, submissionIteration, generation, testDate, nonCFRIssuesLogged, cfrIssuesLogged, totalCFRMissed, lead, testers, actionItems, bugQualityTracking)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        audit.titleName,
        audit.submissionIteration,
        audit.generation,
        audit.testDate,
        audit.nonCFRIssuesLogged,
        audit.cfrIssuesLogged,
        audit.totalCFRMissed,
        audit.lead,
        audit.testers,
        audit.actionItems,
        audit.bugQualityTracking,
      ],
      function (err) {
        if (err) {
          reject(err);
        } else {
          resolve(this.lastID);
        }
      }
    );
  });
});

// IPC LoadAudits
ipcMain.handle("load-audits", () => {
  return new Promise((resolve, reject) => {
    db.all("SELECT * FROM audits", [], (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
});

// IPC GetTestCases
ipcMain.handle("getTestCases", async (event, trackerId) => {
  console.log("Handler for getTestCases called with trackerId:", trackerId);

  // Initialize the database
  const db = new sqlite3.Database(dbPath);

  return new Promise((resolve, reject) => {
    db.get(
      "SELECT testCases FROM history WHERE id = ?",
      [trackerId],
      (err, row) => {
        if (err) {
          console.error("Error querying the database:", err);
          reject(err);
        } else if (row && row.testCases) {
          console.log("Test cases found:", row.testCases);
          resolve(JSON.parse(row.testCases)); // Asegúrate de que testCases esté en formato JSON
        } else {
          console.log("No test cases found for tracker ID:", trackerId);
          resolve([]); // Devuelve un array vacío si no hay test cases
        }
        db.close();
      }
    );
  });
});

// IPC GetAudit
ipcMain.handle("get-audit", (event, id) => {
  return new Promise((resolve, reject) => {
    db.get("SELECT * FROM audits WHERE id = ?", [id], (err, row) => {
      if (err) {
        reject(err);
      } else {
        resolve(row);
      }
    });
  });
});

// IPC DeleteAudit
ipcMain.handle("delete-audit", (event, id) => {
  return new Promise((resolve, reject) => {
    db.run("DELETE FROM audits WHERE id = ?", [id], (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
});

// IPC EditAudit
ipcMain.handle("edit-audit", (event, id, audit) => {
  return new Promise((resolve, reject) => {
    db.run(
      `UPDATE audits SET titleName = ?, submissionIteration = ?, generation = ?, testDate = ?, nonCFRIssuesLogged = ?, cfrIssuesLogged = ?, totalCFRMissed = ?, lead = ?, testers = ?, actionItems = ?, bugQualityTracking = ?
         WHERE id = ?`,
      [
        audit.titleName,
        audit.submissionIteration,
        audit.generation,
        audit.testDate,
        audit.nonCFRIssuesLogged,
        audit.cfrIssuesLogged,
        audit.totalCFRMissed,
        audit.lead,
        audit.testers,
        audit.actionItems,
        audit.bugQualityTracking,
        id,
      ],
      function (err) {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      }
    );
  });
});

// IPC LoadTrackers
ipcMain.handle("load-trackers", async () => {
  return new Promise((resolve, reject) => {
    let db = new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE, (err) => {
      if (err) {
        return reject(err.message);
      }
    });

    db.all("SELECT * FROM trackers", [], (err, rows) => {
      if (err) {
        return reject(err.message);
      }
      resolve(rows);
      db.close();
    });
  });
});

// IPC LoadHistory
ipcMain.handle("load-history", async () => {
  return new Promise((resolve, reject) => {
    let db = new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE, (err) => {
      if (err) {
        return reject(err.message);
      }
    });

    db.all("SELECT * FROM history", [], (err, rows) => {
      if (err) {
        return reject(err.message);
      }
      resolve(rows);
      db.close();
    });
  });
});

// IPC DeleteTracker
ipcMain.handle("deleteTracker", async (event, id) => {
  return new Promise((resolve, reject) => {
    let db = new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE, (err) => {
      if (err) {
        return reject(err.message);
      }
    });

    db.run("DELETE FROM trackers WHERE id = ?", [id], (err) => {
      if (err) {
        return reject(err.message);
      }
      resolve();
      db.close();
    });
  });
});

// IPC MoveTrackerToHistory
ipcMain.handle("moveTrackerToHistory", async (event, tracker) => {
  console.log("Tracker data before moving:", tracker);

  return new Promise((resolve, reject) => {
    const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE, (err) => {
      if (err) {
        console.error("Error opening database:", err.message);
        return reject(err.message);
      }
    });

    db.all("PRAGMA table_info(history);", (err, columns) => {
      if (err) {
        console.error("Error fetching table info:", err.message);
        db.close();
        return reject("Error fetching table info: " + err.message);
      }

      console.log("Columns in history table:", columns);

      const hasSupportedPlatforms = columns.some(
        (column) => column.name === "supportedPlatforms"
      );

      if (!hasSupportedPlatforms) {
        console.error(
          "Table 'history' does not have column 'supportedPlatforms'"
        );
        db.close();
        return reject(
          "Table 'history' does not have column 'supportedPlatforms'"
        );
      }

      const id = typeof tracker.id === "number" ? tracker.id : null;
      const testCasesString = JSON.stringify(tracker.testCases || []);
      const dateText = new Date().toISOString(); // Esto debe ser una cadena de texto válida

      db.run(
        `INSERT INTO history (id, titleName, supportedPlatforms, leadName, testCases, date) 
         VALUES (?, ?, ?, ?, ?, ?)`,
        [
          id,
          tracker.titleName || "",
          tracker.supportedPlatforms || "",
          tracker.leadName || "",
          testCasesString,
          dateText,
        ],
        (err) => {
          if (err) {
            console.error("Error inserting into history:", err.message);
            db.close();
            return reject("Error inserting into history: " + err.message);
          }

          db.run("DELETE FROM trackers WHERE id = ?", [tracker.id], (err) => {
            if (err) {
              console.error("Error deleting from trackers:", err.message);
              db.close();
              return reject("Error deleting from trackers: " + err.message);
            }

            db.close((closeErr) => {
              if (closeErr) {
                console.error("Error closing database:", closeErr.message);
                return reject("Error closing database: " + closeErr.message);
              }
              console.log("Tracker successfully moved to history.");
              resolve();
            });
          });
        }
      );
    });
  });
});

// IPC GetLevels
ipcMain.handle("get-levels", async () => {
  return new Promise((resolve, reject) => {
    db.all("SELECT * FROM levels", [], (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
});
// IPC AddLevel
ipcMain.handle("add-level", async (event, level) => {
  return new Promise((resolve, reject) => {
    db.run(
      `INSERT INTO levels (testerName, level) VALUES (?, ?)`,
      [level.testerName, level.level],
      function (err) {
        if (err) {
          reject(err);
        } else {
          resolve(this.lastID);
        }
      }
    );
  });
});

// IPC UpdateLevel
ipcMain.handle("update-level", async (event, level) => {
  return new Promise((resolve, reject) => {
    db.run(
      `UPDATE levels SET testerName = ?, level = ? WHERE id = ?`,
      [level.testerName, level.level, level.id],
      function (err) {
        if (err) {
          reject(err);
        } else {
          resolve(this.changes);
        }
      }
    );
  });
});

// IPC DeleteLevel
ipcMain.handle("delete-level", async (event, id) => {
  return new Promise((resolve, reject) => {
    db.run("DELETE FROM levels WHERE id = ?", id, function (err) {
      if (err) {
        reject(err);
      } else {
        resolve(this.changes);
      }
    });
  });
});

// IPC ViewTestCases
ipcMain.handle("view-test-cases", async (event, id) => {
  return new Promise((resolve, reject) => {
    let db = new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE, (err) => {
      if (err) {
        return reject(err.message);
      }
    });

    db.get("SELECT * FROM trackers WHERE id = ?", [id], (err, row) => {
      if (err) {
        return reject(err.message);
      }
      resolve(row);
      db.close();
    });
  });
});

// IPC loadTrackerDetails
ipcMain.handle("loadTrackerDetails", async (event, trackerId) => {
  return new Promise((resolve, reject) => {
    db.get(`SELECT * FROM trackers WHERE id = ?`, [trackerId], (err, row) => {
      if (err) {
        reject(err);
      } else {
        resolve(row);
      }
    });
  });
});

// IPC SaveTrackerDetails
ipcMain.handle("saveTrackerDetails", async (event, tracker) => {
  return new Promise((resolve, reject) => {
    db.run(
      `REPLACE INTO trackers (
        id, titleName, leadName, testStartDate, testEndDate, sandboxIds,
        recoveryVersion, binaryId, skuIdentifier, xboxVersion, simplifiedUserModel,
        windowsVersion, supportedPlatforms, testModel, testCases
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        tracker.id,
        tracker.titleName,
        tracker.leadName,
        tracker.testStartDate,
        tracker.testEndDate,
        tracker.sandboxIds,
        tracker.recoveryVersion,
        tracker.binaryId,
        tracker.skuIdentifier,
        tracker.xboxVersion,
        tracker.simplifiedUserModel,
        tracker.windowsVersion,
        tracker.supportedPlatforms,
        tracker.testModel,
        tracker.testCases,
      ],
      (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      }
    );
  });
});

// IPC SaveTracker
ipcMain.handle("save-tracker", (event, tracker) => {
  return new Promise((resolve, reject) => {
    const stmt = db.prepare(`INSERT OR REPLACE INTO trackers (
        id, titleName, leadName, testStartDate, testEndDate, sandboxIds,
        recoveryVersion, binaryId, skuIdentifier, xboxVersion, simplifiedUserModel,
        windowsVersion, supportedPlatforms, testModel, testCases
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`);

    stmt.run(
      [
        tracker.id,
        tracker.titleName,
        tracker.leadName,
        tracker.testStartDate,
        tracker.testEndDate,
        tracker.sandboxIds,
        tracker.recoveryVersion,
        tracker.binaryId,
        tracker.skuIdentifier,
        tracker.xboxVersion,
        tracker.simplifiedUserModel,
        tracker.windowsVersion,
        tracker.supportedPlatforms,
        tracker.testModel,
        JSON.stringify(tracker.testCases),
      ],
      (err) => {
        if (err) {
          reject(err);
        } else {
          resolve("Tracker saved successfully.");
        }
      }
    );

    stmt.finalize();
  });
});

// IPC LoadTracker
ipcMain.handle("load-tracker", (event, id) => {
  return new Promise((resolve, reject) => {
    db.get("SELECT * FROM trackers WHERE id = ?", [id], (err, row) => {
      if (err) {
        reject(err);
      } else {
        resolve(
          row
            ? {
                ...row,
                testCases: JSON.parse(row.testCases),
              }
            : null
        );
      }
    });
  });
});

// IPC ClearDatabase
ipcMain.handle("clear-database", async () => {
  return new Promise((resolve, reject) => {
    let db = new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE, (err) => {
      if (err) {
        return reject(err.message);
      }
    });

    db.run("DELETE FROM trackers", (err) => {
      if (err) {
        return reject(err.message);
      }
      resolve();
      db.close();
    });
  });
});

// IPC SearchInput
ipcMain.handle("search-input", async (event, searchTerm) => {
  return new Promise((resolve, reject) => {
    let db = new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE, (err) => {
      if (err) {
        return reject(err.message);
      }
    });

    // Fetch accounts with optional search query
    ipcMain.handle("get-accounts", async (event, page, query) => {
      const limit = 10; // Set your desired limit
      const offset = (page - 1) * limit;
      let sql = `SELECT * FROM accounts LIMIT ? OFFSET ?`;
      let params = [limit, offset];

      if (query) {
        sql = `SELECT * FROM accounts WHERE titleName LIKE ? OR email LIKE ? LIMIT ? OFFSET ?`;
        params = [`%${query}%`, `%${query}%`, limit, offset];
      }

      return new Promise((resolve, reject) => {
        db.all(sql, params, (err, rows) => {
          if (err) {
            console.error("Error fetching accounts:", err);
            reject(err);
          } else {
            resolve(rows);
          }
        });
      });
    });

    // Save or update an account
    ipcMain.handle("save-account", async (event, account) => {
      const {
        id,
        fecha,
        posicion,
        email,
        gamertag,
        titleName,
        titleVersion,
        submissionIteration,
        generation,
        options,
        publisherAccount,
        publisherPassword,
      } = account;

      if (id) {
        // Update existing account
        return new Promise((resolve, reject) => {
          db.run(
            `UPDATE accounts SET fecha = ?, posicion = ?, email = ?, gamertag = ?, titleName = ?, titleVersion = ?, submissionIteration = ?, generation = ?, options = ?, publisherAccount = ?, publisherPassword = ? WHERE id = ?`,
            [
              fecha,
              posicion,
              email,
              gamertag,
              titleName,
              titleVersion,
              submissionIteration,
              generation,
              options,
              publisherAccount,
              publisherPassword,
              id,
            ],
            function (err) {
              if (err) {
                console.error("Error updating account:", err);
                reject(err);
              } else {
                resolve(this.changes);
              }
            }
          );
        });
      } else {
        return new Promise((resolve, reject) => {
          db.run(
            `INSERT INTO accounts (fecha, posicion, email, gamertag, titleName, titleVersion, submissionIteration, generation, options, publisherAccount, publisherPassword) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
              fecha,
              posicion,
              email,
              gamertag,
              titleName,
              titleVersion,
              submissionIteration,
              generation,
              options,
              publisherAccount,
              publisherPassword,
            ],
            function (err) {
              if (err) {
                console.error("Error inserting account:", err);
                reject(err);
              } else {
                resolve(this.lastID);
              }
            }
          );
        });
      }
    });

    // IPC DeleteAccount
    ipcMain.handle("delete-account", async (event, id) => {
      return new Promise((resolve, reject) => {
        db.run(`DELETE FROM accounts WHERE id = ?`, [id], function (err) {
          if (err) {
            console.error("Error deleting account:", err);
            reject(err);
          } else {
            resolve(this.changes);
          }
        });
      });
    });

    // IPC GetNextId
    ipcMain.handle("get-next-id", async () => {
      return new Promise((resolve, reject) => {
        db.get(`SELECT MAX(id) AS maxId FROM accounts`, (err, row) => {
          if (err) {
            console.error("Error fetching next ID:", err);
            reject(err);
          } else {
            resolve(row.maxId ? row.maxId + 1 : 1);
          }
        });
      });
    });

    // IPC SearchHistory
    db.all(
      "SELECT * FROM history WHERE titleName LIKE ?",
      [`%${searchTerm}%`],
      (err, rows) => {
        if (err) {
          return reject(err.message);
        }
        resolve(rows);
        db.close();
      }
    );
  });
});

// Initialize the app.
app.whenReady().then(() => {
  initializeDB(); // Asegúrate de inicializar la base de datos

  createWindow();
});

// Close the app.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

// Activate the app.
app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
