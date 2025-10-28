-- FTS5 Virtual Table Setup
-- This migration creates a full-text search index for pages

-- Create FTS5 virtual table for full-text search
CREATE VIRTUAL TABLE IF NOT EXISTS pages_fts USING fts5(
  id,
  title,
  searchableText
);

-- Create triggers to keep FTS5 in sync with page table
CREATE TRIGGER IF NOT EXISTS pages_ai AFTER INSERT ON Page BEGIN
  INSERT INTO pages_fts(id, title, searchableText) VALUES (new.id, new.title, new.searchableText);
END;

CREATE TRIGGER IF NOT EXISTS pages_ad AFTER DELETE ON Page BEGIN
  INSERT INTO pages_fts(pages_fts, id, title, searchableText) VALUES('delete', old.id, old.title, old.searchableText);
END;

CREATE TRIGGER IF NOT EXISTS pages_au AFTER UPDATE ON Page BEGIN
  INSERT INTO pages_fts(pages_fts, id, title, searchableText) VALUES('delete', old.id, old.title, old.searchableText);
  INSERT INTO pages_fts(id, title, searchableText) VALUES (new.id, new.title, new.searchableText);
END;

-- Populate FTS5 table with existing data (ON CONFLICT handles duplicates)
INSERT OR IGNORE INTO pages_fts(id, title, searchableText) 
SELECT id, title, searchableText FROM Page WHERE searchableText IS NOT NULL;

