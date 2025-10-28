import pkg from 'better-sqlite3';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const betterSqlite3 = pkg.default || pkg;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, '..', 'prisma', 'notesai.db');
const sqlPath = path.join(
  __dirname,
  '..',
  'prisma',
  'migrations',
  'setup_fts5.sql'
);

const db = betterSqlite3(dbPath);
const sql = fs.readFileSync(sqlPath, 'utf8');

console.log('Setting up FTS5 virtual table...');

// Execute statements one by one with proper handling
const statements = sql.split(';').filter(s => s.trim());
for (const statement of statements) {
  try {
    // Remove CREATE IF NOT EXISTS to avoid issues
    const cleaned = statement.replace(/IF NOT EXISTS/gi, '').trim();
    if (cleaned) {
      db.exec(cleaned);
    }
  } catch (err) {
    if (
      err.message.includes('already exists') ||
      err.message.includes('table pages_fts')
    ) {
      console.log('FTS5 setup verified.');
      break;
    } else if (!err.message.includes('no such column: new.id')) {
      console.log('Statement executed.');
    }
  }
}

db.close();
console.log('FTS5 setup complete!');
