import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_FILE = path.join(__dirname, 'database.json');

function readDb() {
  if (!fs.existsSync(DB_FILE)) {
    return { leaderboard: {} };
  }
  return JSON.parse(fs.readFileSync(DB_FILE, 'utf-8'));
}

function writeDb(data) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

export function saveResult(hostname, data) {
  const db = readDb();
  db.leaderboard[hostname] = data;
  writeDb(db);
}

export function getLeaderboard() {
  const db = readDb();
  return Object.values(db.leaderboard).sort((a, b) => b.score - a.score);
}
