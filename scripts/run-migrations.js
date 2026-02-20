const fs = require('fs');
const path = require('path');
const { neon } = require('@neondatabase/serverless');

// Load environment variables from .env file manually
function loadEnvFile() {
  const envPath = path.join(__dirname, '..', '.env');
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    const lines = envContent.split('\n');
    
    for (const line of lines) {
      const trimmedLine = line.trim();
      if (trimmedLine && !trimmedLine.startsWith('#')) {
        const [key, ...valueParts] = trimmedLine.split('=');
        if (key && valueParts.length > 0) {
          const value = valueParts.join('=').trim();
          process.env[key] = value;
        }
      }
    }
  }
}

// Load environment variables
loadEnvFile();

// Check if DATABASE_URL is set
if (!process.env.DATABASE_URL) {
  console.error('Error: DATABASE_URL environment variable is not set');
  process.exit(1);
}

const sql = neon(process.env.DATABASE_URL);

async function runMigrations() {
  try {
    console.log('Starting database migrations...');
    
    // Read and run migrations in order
    const migrationFiles = [
      '001_create_auth_tables.sql',
      '002_create_api_tokens_table.sql',
      '003_create_password_reset_table.sql',
      '004_create_billing_tables.sql',
      '005_add_role_column.sql',
      '006_create_app_tables_for_supabase.sql'
    ];

    for (const migrationFile of migrationFiles) {
      const filePath = path.join(__dirname, migrationFile);
      
      if (fs.existsSync(filePath)) {
        console.log(`Running migration: ${migrationFile}`);
        const sqlContent = fs.readFileSync(filePath, 'utf8');
        
        // Split SQL content by semicolons and execute each statement
        const statements = sqlContent
          .split(';')
          .map(stmt => stmt.trim())
          .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));
        
        for (const statement of statements) {
          if (statement.trim()) {
            try {
              await sql.unsafe(statement);
              console.log(`  ✓ Executed: ${statement.substring(0, 50)}...`);
            } catch (error) {
              // Ignore "already exists" errors
              if (error.message.includes('already exists') || error.message.includes('duplicate key')) {
                console.log(`  ⚠ Skipped (already exists): ${statement.substring(0, 50)}...`);
              } else {
                throw error;
              }
            }
          }
        }
        console.log(`  ✓ Completed: ${migrationFile}`);
      } else {
        console.log(`⚠ Skipping: ${migrationFile} (file not found)`);
      }
    }
    
    console.log('All migrations completed successfully!');
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

runMigrations();
