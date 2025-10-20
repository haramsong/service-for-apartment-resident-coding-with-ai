const fs = require("fs");
const path = require("path");
require("dotenv").config();
const { Client } = require("@notionhq/client");
const { markdownToBlocks } = require("@tryfabric/martian");

const notion = new Client({ auth: process.env.NOTION_TOKEN });
const rootParentId = process.env.NOTION_PARENT_PAGE_ID;
const docsDir = path.resolve("docs");

// === 캐시 관리 ===
const CACHE_FILE = path.resolve(".notion-cache.json");
let cache = fs.existsSync(CACHE_FILE)
  ? JSON.parse(fs.readFileSync(CACHE_FILE, "utf-8"))
  : {};

function saveCache() {
  fs.writeFileSync(CACHE_FILE, JSON.stringify(cache, null, 2));
}

// === 새로 생성 방식 (recreate) ===
async function recreatePage(title, parentId, blocks) {
  const cacheKey = `${parentId}:${title}`;
  const oldPageId = cache[cacheKey];

  // 🔥 기존 페이지 아카이브 (삭제보다 훨씬 빠름)
  if (oldPageId) {
    try {
      await notion.pages.update({ page_id: oldPageId, archived: true });
      console.log(`🗑️ Archived old page: ${title}`);
    } catch (e) {
      console.warn(`⚠️ Failed to archive ${title}: ${e.message}`);
    }
  }

  // 🆕 새 페이지 생성
  const firstBatch = blocks.slice(0, 100);
  const newPage = await notion.pages.create({
    parent: { page_id: parentId },
    properties: {
      title: { title: [{ text: { content: title } }] },
    },
    children: firstBatch,
  });

  // 💾 캐시 업데이트
  cache[cacheKey] = newPage.id;
  saveCache();

  // 나머지 블록 append
  for (let i = 100; i < blocks.length; i += 100) {
    const chunk = blocks.slice(i, i + 100);
    await notion.blocks.children.append({
      block_id: newPage.id,
      children: chunk,
    });
  }

  console.log(`✅ Synced (recreated): ${title}`);
  return newPage.id;
}

// === Markdown 업로드 ===
async function uploadMarkdown(filePath, parentId) {
  const md = fs.readFileSync(filePath, "utf-8");
  const blocks = markdownToBlocks(md);
  const title = path.basename(filePath, ".md");

  console.log(`📄 Syncing: ${title}`);
  await recreatePage(title, parentId, blocks);
}

// === 폴더 재귀 처리 ===
async function processDirectory(dirPath, parentId) {
  const dirName = path.basename(dirPath);
  let currentParentId = parentId;

  if (dirPath !== docsDir) {
    const cacheKey = `${parentId}:${dirName}`;
    if (cache[cacheKey]) {
      currentParentId = cache[cacheKey];
      console.log(`📁 Using cached folder: ${dirName}`);
    } else {
      console.log(`📁 Creating folder page: ${dirName}`);
      const folderPage = await notion.pages.create({
        parent: { page_id: parentId },
        properties: {
          title: { title: [{ text: { content: dirName } }] },
        },
      });
      currentParentId = folderPage.id;
      cache[cacheKey] = currentParentId;
      saveCache();
    }
  }

  const entries = fs.readdirSync(dirPath, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);
    if (entry.isDirectory()) {
      await processDirectory(fullPath, currentParentId);
    } else if (entry.isFile() && entry.name.endsWith(".md")) {
      await uploadMarkdown(fullPath, currentParentId);
    }
  }
}

// === 메인 ===
(async () => {
  console.log("🚀 Uploading docs hierarchy to Notion...");
  try {
    await processDirectory(docsDir, rootParentId);
    console.log("✅ All docs uploaded successfully!");
  } catch (err) {
    console.error("❌ Script crashed:", err);
  } finally {
    console.log("👋 Done, exiting process");
    process.exit(0);
  }
})();