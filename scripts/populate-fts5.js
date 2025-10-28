import pkg from 'better-sqlite3';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const betterSqlite3 = pkg.default || pkg;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, '..', 'prisma', 'notesai.db');
const db = betterSqlite3(dbPath);

console.log('Populating FTS5 index...');

try {
  // Get all pages
  const pages = db.prepare('SELECT id, title, searchableText FROM page').all();
  console.log(`Found ${pages.length} pages`);

  // Insert into FTS5
  for (const page of pages) {
    try {
      db.prepare(
        'INSERT INTO pages_fts(id, title, searchableText) VALUES (?, ?, ?)'
      ).run(page.id, page.title, page.searchableText || page.title);
      console.log(`Inserted: ${page.title}`);
    } catch (err) {
      if (err.message.includes('UNIQUE')) {
        console.log(`Skipped: ${page.title} (already exists)`);
      } else {
        console.error(`Error inserting ${page.title}:`, err.message);
      }
    }
  }

  // Verify
  const count = db.prepare('SELECT COUNT(*) as count FROM pages_fts').get();
  console.log(`\nFTS5 index now contains ${count.count} pages`);
} catch (error) {
  console.error('Error:', error.message);
}

db.close();
