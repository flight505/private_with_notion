// Script to check the actual structure of your Notion database
const { Client } = require('@notionhq/client');
require('dotenv').config({ path: '.env.local' });

const notion = new Client({
  auth: process.env.NOTION_TOKEN,
});

async function checkDatabaseStructure() {
  const dbId = process.env.NOTION_BLOG_DB_ID;
  
  console.log('Checking database structure...\n');
  
  try {
    // Get database metadata
    const database = await notion.databases.retrieve({
      database_id: dbId,
    });
    
    console.log('Database Title:', database.title?.[0]?.plain_text || 'Untitled');
    console.log('\n=== PROPERTIES ===\n');
    
    // List all properties and their types
    for (const [name, prop] of Object.entries(database.properties)) {
      console.log(`Property: "${name}"`);
      console.log(`  Type: ${prop.type}`);
      console.log(`  ID: ${prop.id}`);
      console.log('');
    }
    
    // Try to get one item without filters to see actual data
    console.log('\n=== SAMPLE DATA (First Item) ===\n');
    const response = await notion.databases.query({
      database_id: dbId,
      page_size: 1,
    });
    
    if (response.results.length > 0) {
      const page = response.results[0];
      console.log('Sample page properties:');
      for (const [name, value] of Object.entries(page.properties)) {
        console.log(`  ${name}:`, value.type, '/', JSON.stringify(value[value.type]).substring(0, 100));
      }
    } else {
      console.log('No items found in database');
    }
    
  } catch (error) {
    console.error('Error:', error.message);
    if (error.body) {
      console.log('Details:', error.body);
    }
  }
}

checkDatabaseStructure();