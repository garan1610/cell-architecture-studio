import { mkdir, readFile, writeFile } from "node:fs/promises";
import { fileURLToPath, pathToFileURL } from "node:url";
import { chromium } from "playwright-core";
import ts from "typescript";

const appUrl = process.env.APP_URL ?? "http://127.0.0.1:5173/";
const chromePath = process.env.CHROME_PATH ?? "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const cellsUrl = new URL("../src/data/cells.ts", import.meta.url);
const tempCellsUrl = new URL("./cells-data.tmp.mjs", import.meta.url);
const outDir = new URL("../verification/", import.meta.url);

function outPath(fileName) {
  return fileURLToPath(new URL(fileName, outDir));
}

async function importData() {
  const source = await readFile(cellsUrl, "utf8");
  const outputText = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.ES2022,
      target: ts.ScriptTarget.ES2022,
      verbatimModuleSyntax: true,
    },
  }).outputText;
  await writeFile(tempCellsUrl, outputText, "utf8");
  return import(`${pathToFileURL(fileURLToPath(tempCellsUrl)).href}?t=${Date.now()}`);
}

async function waitForViewportDots(page, viewportIndex, expectedCount, label) {
  await page.waitForFunction(
    ({ viewportIndex, expectedCount }) => {
      const viewport = document.querySelectorAll(".model-viewport")[viewportIndex];
      return viewport && viewport.querySelectorAll(".model-annotation-dot").length >= expectedCount;
    },
    { viewportIndex, expectedCount },
    { timeout: 30000 },
  ).catch(async (error) => {
    const count = await page.locator(".model-viewport").nth(viewportIndex).locator(".model-annotation-dot").count().catch(() => 0);
    throw new Error(`${label}: expected ${expectedCount} annotation dots, found ${count}. ${error.message}`);
  });
}

async function inspectViewport(page, viewportIndex, expectedCount, label) {
  await waitForViewportDots(page, viewportIndex, expectedCount, label);
  const result = await page.locator(".model-viewport").nth(viewportIndex).evaluate((viewport, expectedCount) => {
    const viewportBox = viewport.getBoundingClientRect();
    const dots = [...viewport.querySelectorAll(".model-annotation-dot")].map((dot) => {
      const box = dot.getBoundingClientRect();
      return {
        text: dot.textContent?.trim() ?? "",
        centerX: box.left + box.width / 2,
        centerY: box.top + box.height / 2,
        width: box.width,
        height: box.height,
      };
    });
    return {
      expectedCount,
      actualCount: dots.length,
      outside: dots.filter((dot) =>
        dot.centerX < viewportBox.left ||
        dot.centerX > viewportBox.right ||
        dot.centerY < viewportBox.top ||
        dot.centerY > viewportBox.bottom,
      ),
      tiny: dots.filter((dot) => dot.width < 3 || dot.height < 3),
    };
  }, expectedCount);

  if (result.actualCount < expectedCount) {
    throw new Error(`${label}: expected ${expectedCount} dots, found ${result.actualCount}`);
  }
  if (result.outside.length > 0) {
    throw new Error(`${label}: ${result.outside.length} annotation dots are outside the viewport`);
  }
  if (result.tiny.length > 0) {
    throw new Error(`${label}: ${result.tiny.length} annotation dots are too small to inspect`);
  }
  return result;
}

const { classItems } = await importData();
await mkdir(outDir, { recursive: true });

const browser = await chromium.launch({
  executablePath: chromePath,
  headless: true,
  args: ["--no-sandbox", "--disable-dev-shm-usage"],
});

const page = await browser.newPage({ viewport: { width: 1440, height: 1000 }, deviceScaleFactor: 1 });
page.setDefaultTimeout(30000);

const checked = [];

try {
  await page.goto(appUrl, { waitUntil: "domcontentloaded" });
  await page.waitForSelector(".model-viewport", { timeout: 30000 });

  for (const item of classItems.lop10.items) {
    await page.locator(".model-row").filter({ hasText: item.name }).click();
    await page.waitForTimeout(250);

    for (let tabIndex = 0; tabIndex < item.tabs.length; tabIndex += 1) {
      const tab = item.tabs[tabIndex];
      await page.locator(".tab-strip button").nth(tabIndex).click();
      await page.waitForTimeout(250);

      for (let modelIndex = 0; modelIndex < tab.models.length; modelIndex += 1) {
        const model = tab.models[modelIndex];
        const expectedCount = (model.annotations ?? model.modelAsset?.annotations ?? []).length + (model.modelLinks ?? []).length;
        if (expectedCount === 0) {
          continue;
        }

        if (tab.models.length > 1) {
          await inspectViewport(page, modelIndex, expectedCount, `${item.name} / ${tab.title} / grid ${model.name}`);
          await page.locator(".model-viewport").nth(modelIndex).locator(".canvas-hit-area").click();
          await page.waitForTimeout(250);
          await inspectViewport(page, 0, expectedCount, `${item.name} / ${tab.title} / detail ${model.name}`);
          await page.getByRole("button", { name: /Trở lại|Trá»Ÿ láº¡i/ }).click();
          await page.waitForTimeout(250);
        } else {
          await inspectViewport(page, 0, expectedCount, `${item.name} / ${tab.title} / ${model.name}`);
        }

        checked.push({ item: item.name, tab: tab.title, model: model.name, expectedCount });
      }
    }
  }

  await page.screenshot({ path: outPath("annotations-final.png"), fullPage: true });
  console.log(JSON.stringify({ ok: true, checkedCount: checked.length, checked }, null, 2));
} finally {
  await browser.close();
}
