import pkg from 'better-sqlite3';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const betterSqlite3 = pkg.default || pkg;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, '..', 'prisma', 'notesai.db');
const db = betterSqlite3(dbPath);

console.log('Backfilling searchableText for existing pages...');

// Read all pages
const pages = db.prepare('SELECT id, title, content FROM page').all();

for (const page of pages) {
  try {
    // Extract text from content
    const blocks = JSON.parse(page.content);
    const textParts = [];
    
    function traverseBlock(block) {
      if (Array.isArray(block.content)) {
        block.content.forEach((item) => {
          if (typeof item === 'string') {
            textParts.push(item);
          } else if (typeof item === 'object' && item !== null) {
            if (item.text) {
              textParts.push(item.text);
            }
            if (item.url) {
              textParts.push(item.url);
            }
          }
        });
      }
      if (Array.isArray(block.children)) {
        block.children.forEach((child) => {
          if (typeof child === 'object' && child !== null) {
            traverseBlock(child);
          }
        });
      }
    }
    
    blocks.forEach(traverseBlock);
    const extractedText = textParts.join(' ').trim();
    const searchableText = `${page.title} ${extractedText}`.trim();
    
    // Update the page
    db.prepare('UPDATE page SET searchableText = ? WHERE id = ?').run(searchableText, page.id);
    console.log(`Updated page: ${page.title}`);
  } catch (error) {
    console.error(`Error processing page ${page.id}:`, error);
  }
}

console.log('Backfilling complete!');

db.close();

