const pool = require('../config/db');
const fs = require('fs');
const path = require('path');

// ✅ safer & cleaner path join
const migrationPath = path.join(__dirname, '001_create_user_table.sql');
const migration = fs.readFileSync(migrationPath, 'utf8');

(async () => {
  try {
    await pool.query(migration);
    console.log('✅ Users table created successfully');
    process.exit(0);
  } catch (err) {
    console.error('❌ Migration failed:', err);
    process.exit(1);
  }
})();
