import pkg from 'better-sqlite3';
import { fileURLToPath } from 'url';
import path from 'path';

const betterSqlite3 = pkg.default || pkg;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, '..', 'prisma', 'notesai.db');
const db = betterSqlite3(dbPath);

console.log('Testing FTS5 search for "Models"...');

try {
  // Test 1: Direct search
  const result1 = db.prepare('SELECT * FROM pages_fts WHERE pages_fts MATCH ?').all('Models');
  console.log('Direct search results:', result1.length);
  
  // Test 2: Search with quote
  const result2 = db.prepare('SELECT * FROM pages_fts WHERE pages_fts MATCH ?').all('"Models"');
  console.log('Quoted search results:', result2.length);
  
  // Test 3: Check if data exists
  const allPages = db.prepare('SELECT COUNT(*) as count FROM pages_fts').get();
  console.log('Total pages in FTS5 index:', allPages.count);
  
  // Test 4: Check titles
  const titles = db.prepare('SELECT id, title FROM page').all();
  console.log('All page titles:', titles.map(p => p.title));
  
} catch (error) {
  console.error('Error:', error.message);
}

db.close();

