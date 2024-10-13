const path = require("path");
const sqlite3 = require("sqlite3").verbose();

// Initialize the database path
let db;
let basePath = path.dirname(process.execPath);

if (process.env.NODE_ENV !== "production") {
  basePath = process.cwd();
}

// Initialize the database path
const dbPath = path.join(basePath, "appDB.db");
console.log(`Database path: ${dbPath}`);

function initializeDB() {
  db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
      console.error("Error opening database:", err.message);
    } else {
      console.log("Database connected successfully.");
      initializeTables(db); // Call the table initialization here
    }
  });
}

function initializeTables(db) {
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
      sql: `
        CREATE TABLE IF NOT EXISTS data (
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
        )
      `,
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
      sql: `
        CREATE TABLE IF NOT EXISTS widget_positions (
          id TEXT PRIMARY KEY,
          top INTEGER,
          left INTEGER,
          width INTEGER,
          height INTEGER
        )
      `,
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

  // Iterate over the table definitions and create them
  tables.forEach((table) => {
    db.run(table.sql, (err) => {
      if (err) {
        console.error(`Error creating ${table.name} table:`, err.message);
      } else {
        console.log(`${table.name} table created or already exists.`);
      }
    });
  });
}

initializeDB();

module.exports = initializeTables;
