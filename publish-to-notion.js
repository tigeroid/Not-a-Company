#!/usr/bin/env node

/**
 * Publish Not A Company Manifesto to Notion
 * Converts README.md to Notion blocks and publishes to specified page
 */

require('dotenv').config();
const { Client } = require('@notionhq/client');
const { markdownToBlocks } = require('@tryfabric/martian');
const fs = require('fs');
const path = require('path');

// Initialize Notion client
const notion = new Client({ auth: process.env.NOTION_API_KEY });
const pageId = process.env.NOTION_PAGE_ID;

async function publishToNotion() {
  try {
    console.log('📖 Reading manifesto from README.md...');

    // Read the manifesto
    const manifestoPath = path.join(__dirname, 'README.md');
    const manifestoContent = fs.readFileSync(manifestoPath, 'utf-8');

    console.log('🔄 Converting markdown to Notion blocks...');

    // Convert markdown to Notion blocks using Martian
    const blocks = markdownToBlocks(manifestoContent);

    console.log(`✅ Converted to ${blocks.length} Notion blocks`);

    // First, get the existing page to check if it has children
    console.log('🔍 Checking existing page content...');
    const existingPage = await notion.pages.retrieve({ page_id: pageId });

    // Get existing blocks to delete them (with pagination)
    console.log('🧹 Clearing existing content...');
    let hasMore = true;
    let cursor = undefined;
    let totalDeleted = 0;

    while (hasMore) {
      const existingBlocks = await notion.blocks.children.list({
        block_id: pageId,
        page_size: 100,
        start_cursor: cursor,
      });

      // Delete all blocks in this page
      for (const block of existingBlocks.results) {
        await notion.blocks.delete({ block_id: block.id });
        totalDeleted++;
      }

      hasMore = existingBlocks.has_more;
      cursor = existingBlocks.next_cursor;
    }

    console.log(`  ✓ Deleted ${totalDeleted} existing blocks`);

    console.log('📝 Publishing new content to Notion...');

    // Notion API has a limit of 100 blocks per request
    // Split into chunks if needed
    const chunkSize = 100;
    for (let i = 0; i < blocks.length; i += chunkSize) {
      const chunk = blocks.slice(i, i + chunkSize);

      await notion.blocks.children.append({
        block_id: pageId,
        children: chunk,
      });

      console.log(`  ✓ Published blocks ${i + 1}-${Math.min(i + chunk.length, blocks.length)} of ${blocks.length}`);
    }

    console.log('\n🎉 SUCCESS! Manifesto published to Notion!');
    console.log(`📄 View at: https://notion.so/${pageId.replace(/-/g, '')}`);

  } catch (error) {
    console.error('❌ ERROR publishing to Notion:');

    if (error.code === 'object_not_found') {
      console.error('\n🔴 Page not found. Make sure:');
      console.error('  1. The page ID is correct');
      console.error('  2. You shared the page with your integration');
      console.error('  3. The integration has proper permissions');
    } else if (error.code === 'unauthorized') {
      console.error('\n🔴 Unauthorized. Check that:');
      console.error('  1. Your NOTION_API_KEY is correct');
      console.error('  2. The integration token is valid');
    } else {
      console.error(error);
    }

    process.exit(1);
  }
}

// Run the script
publishToNotion();
