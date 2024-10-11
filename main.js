const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const crypto = require("crypto");
const sqlite3 = require("sqlite3").verbose();

// DISABLE GPU ACCELERATION
app.disableHardwareAcceleration();
app.commandLine.appendSwitch("disable-software-rasterizer");
app.commandLine.appendSwitch("ignore-gpu-blacklist");
app.commandLine.appendSwitch("disable-gpu");
app.commandLine.appendSwitch("disable-gpu-compositing");
app.commandLine.appendSwitch("no-sandbox");
// END DISABLE GPU ACCELERATION

let db;
let basePath = path.dirname(process.execPath);

// Verificar si la aplicación se está ejecutando en desarrollo o en producción
if (process.env.NODE_ENV !== "production") {
  basePath = process.cwd();
}

const dbPath = path.join(basePath, "appDB.db");
console.log(`Database path: ${dbPath}`);
// END DB PATH

// Inicializar la base de datos
function initializeDB() {
  db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
      console.error("Error opening database:", err.message);
    } else {
      console.log("Database connected successfully.");

      const tables = [
        {
          name: "users",
          sql: `
            CREATE TABLE IF NOT EXISTS users (
              username TEXT PRIMARY KEY,
              password TEXT NOT NULL
            )
          `,
        },
        {
          name: "tickets",
          sql: `
            CREATE TABLE IF NOT EXISTS tickets (
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              name TEXT,
              category TEXT,
              description TEXT,
              priority TEXT,
              status TEXT,
              date TEXT
            )
          `,
        },
        {
          name: "logs",
          sql: `
            CREATE TABLE IF NOT EXISTS logs (
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              action TEXT NOT NULL,
              timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
            )
          `,
        },
        {
          name: "updates",
          sql: `
            CREATE TABLE IF NOT EXISTS updates (
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              title TEXT,
              type TEXT,
              content TEXT
            )
          `,
        },
        {
          name: "testCases",
          sql: `
            CREATE TABLE IF NOT EXISTS testCases (
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              xr TEXT,
              documentation TEXT,
              passExample TEXT,
              failExample TEXT,
              naExample TEXT
            )
          `,
        },
        {
          name: "data",
          sql: `CREATE TABLE IF NOT EXISTS data (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    date DATE,
    position TEXT,
    email TEXT,
    gamertag TEXT,
    title_name TEXT,
    title_version TEXT,
    submission_iteration TEXT,
    progress TEXT,
    options TEXT,
    publisher_accounts TEXT,
    publisher_password TEXT
  )`,
        },
        {
          name: "reviews",
          sql: `
            CREATE TABLE IF NOT EXISTS reviews (
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              testerName TEXT,
              performanceScore INTEGER,
              bugDetectionAccuracy INTEGER,
              testingEfficiency INTEGER,
              communicationSkills INTEGER,
              creativity INTEGER,
              responsiveness INTEGER,
              punctuality INTEGER,
              problemAnalysis INTEGER,
              toolsKnowledge INTEGER,
              overallRating INTEGER,
              observations TEXT,
              date TEXT
            )
          `,
        },
        {
          name: "levels",
          sql: `
            CREATE TABLE IF NOT EXISTS levels (
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              testerName TEXT,
              level INTEGER
            )
          `,
        },
        {
          name: "items",
          sql: `
            CREATE TABLE IF NOT EXISTS items (
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              fecha TEXT,
              posicion TEXT,
              email TEXT,
              gamertag TEXT,
              titleName TEXT,
              titleVersion TEXT,
              submissionIteration TEXT,
              generation TEXT,
              options TEXT,
              publisherAccount TEXT,
              publisherPassword TEXT
            )
          `,
        },
        {
          name: "issues",
          sql: `
            CREATE TABLE IF NOT EXISTS issues (
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              name TEXT,
              date TEXT,
              observedBehavior TEXT,
              reproductionSteps TEXT,
              expectedBehavior TEXT,
              notes TEXT,
              bqScore INTEGER,
              tags TEXT,
              xr TEXT,
              scenario TEXT
            )
          `,
        },
        {
          name: "accounts",
          sql: `
            CREATE TABLE IF NOT EXISTS accounts (
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              state TEXT,
              email TEXT,
              position TEXT,
              gamertag TEXT,
              sandbox TEXT,
              subscription TEXT,
              location TEXT,
              notes TEXT
            )
          `,
        },
        {
          name: "testers",
          sql: `
            CREATE TABLE IF NOT EXISTS testers (
              name TEXT PRIMARY KEY
            )
          `,
        },
        {
          name: "audits",
          sql: `
            CREATE TABLE IF NOT EXISTS audits (
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              titleName TEXT,
              submissionIteration TEXT,
              generation TEXT,
              testDate TEXT,    
              nonCFRIssuesLogged TEXT,
              cfrIssuesLogged TEXT,
              totalCFRMissed TEXT,
              lead TEXT,
              testers TEXT,
              actionItems TEXT,
              bugQualityTracking TEXT
            )
          `,
        },
        {
          name: "trackers",
          sql: `
            CREATE TABLE IF NOT EXISTS trackers (
              id TEXT PRIMARY KEY,
              titleName TEXT,
              leadName TEXT,
              testStartDate TEXT,
              testEndDate TEXT,
              sandboxIds TEXT,
              recoveryVersion TEXT,
              binaryId TEXT,
              skuIdentifier TEXT,
              xboxVersion TEXT,
              simplifiedUserModel TEXT,
              windowsVersion TEXT,
              supportedPlatforms TEXT,
              testModel TEXT,
              testCases TEXT
            )
          `,
        },
        {
          name: "widget_positions",
          sql: `CREATE TABLE IF NOT EXISTS widget_positions (
        id TEXT PRIMARY KEY,
        top INTEGER,
        left INTEGER,
        width INTEGER,
        height INTEGER
    )`,
        },
        {
          name: "hardware",
          sql: `
            CREATE TABLE IF NOT EXISTS hardware (
              serialNumber TEXT PRIMARY KEY,
              consoleId TEXT,
              xboxLiveId TEXT,
              assetOwner TEXT,
              projectOwner TEXT,
              type TEXT,
              classification TEXT,
              assetTag TEXT,
              location TEXT,
              status TEXT,
              owner TEXT
            )
          `,
        },
        {
          name: "history",
          sql: `
      CREATE TABLE IF NOT EXISTS history (
        id INTEGER PRIMARY KEY,                 
        titleName TEXT NOT NULL,               
        supportedPlatforms TEXT,            
        leadName TEXT,                          
        testCases TEXT,                         
        date TEXT NOT NULL 
      )
    `,
        },
      ];

      tables.forEach((table) => {
        db.run(table.sql, (err) => {
          if (err) {
            console.error(`Error creating ${table.name} table:`, err.message);
          } else {
          }
        });
      });
    }
  });
}
initializeDB();
// END INITIALIZE DB

//CREATE WINDOW
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

  // Load the HTML file
  mainWindow.loadFile("src/authentication.html").catch((err) => {
    console.error("Error loading HTML file:", err);
  });

  mainWindow.webContents.on("did-finish-load", () => {
    mainWindow.maximize(); // Maximize the window after loading
    mainWindow.setMenu(null); // Uncomment to disable the menu
  });

  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    // Handle new window requests
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
// END CREATE WINDOW

// IPC handlers USERS
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

// Get all reviews
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

// Get a specific review by ID
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
// IPC handlers USERS

// IPC handlers HARDWARE
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
// IPC handlers HARDWARE

// IPC handlers ACCOUNTS
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
// IPC handlers ACCOUNTS

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

// IPC handlers USERS

// IPC handlers UPDATES
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
// IPC handlers UPDATES

// IPC handlers TEST CASES
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

// Obtener todos los casos de prueba
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

// Obtener un caso de prueba por id
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

// Actualizar un caso de prueba
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

// Eliminar un caso de prueba
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
// IPC handlers TEST CASES

// Controlador IPC para obtener revisiones
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

// Controlador IPC para agregar revisión
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

// Controlador IPC para actualizar revisión
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

// Controlador IPC para eliminar revisión
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

// Controlador IPC para obtener testers
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

// Controlador IPC para agregar tester
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

ipcMain.handle("getTestCases", async (event, trackerId) => {
  console.log("Handler for getTestCases called with trackerId:", trackerId);

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

// Manejador para mover un tracker al historial
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

// Get all levels
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
// Get a specific level by ID
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

//Update level

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

//Delete level

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

ipcMain.handle("migrate-trackers", async () => {
  // Implement migration logic if needed
});

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
        // Insert new account
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

    // Delete an account by ID
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

    // Get the next ID for a new account
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

// Inicializar la app.
app.whenReady().then(() => {
  initializeDB(); // Asegúrate de inicializar la base de datos

  createWindow();
});

// Salir de la app.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
