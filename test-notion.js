// Test script to verify Notion connection
const { Client } = require('@notionhq/client');
require('dotenv').config({ path: '.env.local' });

const notion = new Client({
  auth: process.env.NOTION_TOKEN,
});

async function testConnection() {
  console.log('Testing Notion connection...');
  console.log('Token:', process.env.NOTION_TOKEN ? 'Found (hidden)' : 'NOT FOUND');
  console.log('Database ID:', process.env.NOTION_BLOG_DB_ID || 'NOT FOUND');
  
  if (!process.env.NOTION_TOKEN || !process.env.NOTION_BLOG_DB_ID) {
    console.error('Missing environment variables!');
    return;
  }

  try {
    // Try to query the database
    const response = await notion.databases.query({
      database_id: process.env.NOTION_BLOG_DB_ID,
      page_size: 1,
    });
    
    console.log('✅ SUCCESS! Connection working!');
    console.log('Database has', response.results.length, 'entries visible');
    
  } catch (error) {
    console.error('❌ ERROR:', error.message);
    
    if (error.code === 'unauthorized') {
      console.log('\nThis means either:');
      console.log('1. The integration token is invalid');
      console.log('2. The database ID is wrong');
      console.log('3. The integration hasn\'t been given access to the database');
      console.log('\nTo fix: Open your database in Notion, click "..." → "Connections" → "Add connections" → Select your integration');
    } else if (error.code === 'object_not_found') {
      console.log('\nThis means:');
      console.log('1. The database ID doesn\'t exist');
      console.log('2. Or it\'s not a database (might be a page ID instead)');
      console.log('\nMake sure you\'re using a DATABASE (table/board/gallery view), not a regular page');
    }
  }
}

testConnection();