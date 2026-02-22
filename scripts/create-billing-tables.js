const fs = require('fs');
const path = require('path');
const { neon } = require('@neondatabase/serverless');

function loadEnvFile() {
  const envPaths = [
    path.join(__dirname, '..', '.env.local'),
    path.join(__dirname, '..', '.env')
  ];

  for (const envPath of envPaths) {
    if (!fs.existsSync(envPath)) {
      continue;
    }

    const envContent = fs.readFileSync(envPath, 'utf8');
    const lines = envContent.split('\n');

    for (const line of lines) {
      const trimmedLine = line.trim();
      if (!trimmedLine || trimmedLine.startsWith('#')) {
        continue;
      }

      const [key, ...valueParts] = trimmedLine.split('=');
      if (!key || valueParts.length === 0) {
        continue;
      }

      if (process.env[key] !== undefined) {
        continue;
      }

      const rawValue = valueParts.join('=').trim();
      const cleanedValue = rawValue.replace(/^['\"]|['\"]$/g, '');
      process.env[key] = cleanedValue;
    }
  }
}

function splitSqlStatements(sqlContent) {
  const statements = [];
  let current = '';
  let i = 0;

  let inSingleQuote = false;
  let inDoubleQuote = false;
  let inLineComment = false;
  let inBlockComment = false;
  let dollarTag = null;

  while (i < sqlContent.length) {
    const char = sqlContent[i];
    const nextChar = sqlContent[i + 1];

    if (inLineComment) {
      current += char;
      if (char === '\n') {
        inLineComment = false;
      }
      i += 1;
      continue;
    }

    if (inBlockComment) {
      current += char;
      if (char === '*' && nextChar === '/') {
        current += nextChar;
        inBlockComment = false;
        i += 2;
      } else {
        i += 1;
      }
      continue;
    }

    if (!inSingleQuote && !inDoubleQuote && !dollarTag && char === '-' && nextChar === '-') {
      current += char + nextChar;
      inLineComment = true;
      i += 2;
      continue;
    }

    if (!inSingleQuote && !inDoubleQuote && !dollarTag && char === '/' && nextChar === '*') {
      current += char + nextChar;
      inBlockComment = true;
      i += 2;
      continue;
    }

    if (!inSingleQuote && !inDoubleQuote && !dollarTag && char === '$') {
      const rest = sqlContent.slice(i);
      const match = rest.match(/^\$[a-zA-Z0-9_]*\$/);
      if (match) {
        dollarTag = match[0];
        current += dollarTag;
        i += dollarTag.length;
        continue;
      }
    }

    if (dollarTag) {
      if (sqlContent.startsWith(dollarTag, i)) {
        current += dollarTag;
        i += dollarTag.length;
        dollarTag = null;
      } else {
        current += char;
        i += 1;
      }
      continue;
    }

    if (!inDoubleQuote && char === '\'' && sqlContent[i - 1] !== '\\') {
      inSingleQuote = !inSingleQuote;
      current += char;
      i += 1;
      continue;
    }

    if (!inSingleQuote && char === '"' && sqlContent[i - 1] !== '\\') {
      inDoubleQuote = !inDoubleQuote;
      current += char;
      i += 1;
      continue;
    }

    if (!inSingleQuote && !inDoubleQuote && char === ';') {
      const statement = current.trim();
      if (statement) {
        statements.push(statement);
      }
      current = '';
      i += 1;
      continue;
    }

    current += char;
    i += 1;
  }

  const trailing = current.trim();
  if (trailing) {
    statements.push(trailing);
  }

  return statements;
}

async function createBillingTables() {
  loadEnvFile();

  if (!process.env.DATABASE_URL) {
    console.error('Error: DATABASE_URL environment variable is not set');
    process.exit(1);
  }

  const targetHost = new URL(process.env.DATABASE_URL).host;
  const sql = neon(process.env.DATABASE_URL);
  const filePath = path.join(__dirname, '004_create_billing_tables.sql');

  if (!fs.existsSync(filePath)) {
    console.error('Error: 004_create_billing_tables.sql was not found');
    process.exit(1);
  }

  try {
    const sqlContent = fs.readFileSync(filePath, 'utf8');
    const statements = splitSqlStatements(sqlContent);

    console.log(`Target database host: ${targetHost}`);
    console.log(`Running billing migration (${statements.length} statements)...`);

    for (const statement of statements) {
      await sql.unsafe(statement);
    }

    console.log('Billing tables created successfully.');
  } catch (error) {
    console.error('Failed to create billing tables:', error.message || error);
    process.exit(1);
  }
}

createBillingTables();