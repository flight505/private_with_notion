// Detailed test script for Notion connection
const { Client } = require('@notionhq/client');
require('dotenv').config({ path: '.env.local' });

console.log('='.repeat(60));
console.log('NOTION CONNECTION DIAGNOSTIC');
console.log('='.repeat(60));

// Show environment variables (partially hidden for security)
const token = process.env.NOTION_TOKEN;
const dbId = process.env.NOTION_BLOG_DB_ID;

console.log('\n1. ENVIRONMENT VARIABLES:');
console.log('   Token:', token ? `${token.substring(0, 10)}...${token.substring(token.length - 5)}` : 'NOT FOUND');
console.log('   Token length:', token ? token.length : 0);
console.log('   Token starts with:', token ? token.substring(0, 4) : 'N/A');
console.log('   Database ID:', dbId || 'NOT FOUND');
console.log('   Database ID length:', dbId ? dbId.length : 0);

if (!token || !dbId) {
  console.error('\n❌ Missing environment variables!');
  process.exit(1);
}

console.log('\n2. TESTING CONNECTION:');

const notion = new Client({
  auth: token,
  logLevel: 'debug', // Enable debug logging
});

async function testConnection() {
  try {
    // First, try to retrieve the database metadata
    console.log('   Attempting to retrieve database metadata...');
    const database = await notion.databases.retrieve({
      database_id: dbId,
    });
    
    console.log('\n✅ SUCCESS! Database found!');
    console.log('   Database title:', database.title?.[0]?.plain_text || 'Untitled');
    console.log('   Database ID confirmed:', database.id);
    
    // Now try to query it
    console.log('\n3. QUERYING DATABASE:');
    const response = await notion.databases.query({
      database_id: dbId,
      page_size: 1,
    });
    
    console.log('   ✅ Query successful!');
    console.log('   Number of items:', response.results.length);
    
  } catch (error) {
    console.error('\n❌ ERROR:', error.code || error.message);
    
    if (error.code === 'unauthorized') {
      console.log('\n📋 TROUBLESHOOTING STEPS:');
      console.log('   1. Go to: https://www.notion.so/my-integrations');
      console.log('   2. Click on your integration');
      console.log('   3. Find "Internal Integration Secret"');
      console.log('   4. Click "Show" or "Regenerate" to get a new token');
      console.log('   5. Copy the ENTIRE token (should be ~50 characters)');
      console.log('   6. Update .env.local with the new token');
      console.log('\n   Also check:');
      console.log('   - Is the integration in the SAME workspace as your database?');
      console.log('   - Did you grant the integration access to the database?');
    } else if (error.code === 'object_not_found') {
      console.log('\n📋 This means the database ID is incorrect or it\'s not a database.');
      console.log('   Your URL should look like:');
      console.log('   https://notion.site/[DATABASE_ID]?v=[view_id]');
      console.log('   Use the DATABASE_ID part (before the ?)');
    } else if (error.code === 'validation_error') {
      console.log('\n📋 The token format might be incorrect.');
      console.log('   - Token should start with "secret_" or "ntn_"');
      console.log('   - Make sure you copied the complete token');
      console.log('   - Check for extra spaces or line breaks');
    }
    
    if (error.body) {
      console.log('\n📋 Full error details:', JSON.stringify(error.body, null, 2));
    }
  }
}

testConnection();