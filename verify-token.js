#!/usr/bin/env node

// Simple token verification script
require('dotenv').config({ path: '.env.local' });

const token = process.env.NOTION_TOKEN;
const dbId = process.env.NOTION_BLOG_DB_ID;

console.log('=====================================');
console.log('TOKEN VERIFICATION');
console.log('=====================================\n');

// Check token presence
if (!token) {
  console.error('❌ NOTION_TOKEN not found in .env.local');
  process.exit(1);
}

// Check token format
console.log('Token Analysis:');
console.log('---------------');
console.log(`Length: ${token.length} characters`);
console.log(`First 10 chars: ${token.substring(0, 10)}`);
console.log(`Last 5 chars: ${token.substring(token.length - 5)}`);

// Validate token format
const validPrefixes = ['secret_', 'ntn_'];
const hasValidPrefix = validPrefixes.some(prefix => token.startsWith(prefix));

if (!hasValidPrefix) {
  console.error('\n❌ Token doesn\'t start with expected prefix (secret_ or ntn_)');
} else {
  console.log('\n✅ Token has valid prefix');
}

if (token.length !== 50) {
  console.error(`❌ Token length is ${token.length}, expected 50`);
} else {
  console.log('✅ Token length is correct (50 chars)');
}

// Check for common issues
if (token.includes(' ')) {
  console.error('❌ Token contains spaces - this is likely a copy/paste error');
}

if (token.includes('\n') || token.includes('\r')) {
  console.error('❌ Token contains line breaks - this is likely a copy/paste error');
}

// Check database ID
console.log('\n\nDatabase ID Analysis:');
console.log('--------------------');
if (!dbId) {
  console.error('❌ NOTION_BLOG_DB_ID not found in .env.local');
} else {
  console.log(`Database ID: ${dbId}`);
  console.log(`Length: ${dbId.length} characters`);
  
  // Check if it looks like a valid Notion ID
  if (dbId.length === 32 && /^[a-f0-9]{32}$/.test(dbId)) {
    console.log('✅ Database ID format looks correct');
  } else if (dbId.includes('-')) {
    console.log('⚠️  Database ID contains dashes - Notion IDs usually don\'t have dashes');
    const cleanId = dbId.replace(/-/g, '');
    console.log(`   Try using: ${cleanId}`);
  } else {
    console.log('⚠️  Database ID format might be incorrect');
  }
}

console.log('\n\n=====================================');
console.log('WHAT TO DO NEXT:');
console.log('=====================================');

if (!hasValidPrefix || token.length !== 50) {
  console.log('\n1. Go to https://www.notion.so/my-integrations');
  console.log('2. Click on your integration (or create a new one)');
  console.log('3. Find "Internal Integration Secret"');
  console.log('4. Click "Regenerate" to get a fresh token');
  console.log('5. Copy the ENTIRE token');
  console.log('6. Paste it in .env.local replacing the current NOTION_TOKEN value');
  console.log('\nMake sure to copy ALL 50 characters with no extra spaces!');
} else {
  console.log('\nYour token format looks correct!');
  console.log('\nIf you\'re still getting "API token is invalid", the token might be:');
  console.log('1. From a deleted integration');
  console.log('2. From a different workspace');
  console.log('3. Already revoked/regenerated');
  console.log('\nTry regenerating a new token at https://www.notion.so/my-integrations');
}

console.log('\n=====================================\n');