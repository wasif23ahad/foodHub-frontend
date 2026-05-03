// contrast-check.mjs
//
// Optional follow-up to theme-qa.mjs. Loads each route in dark mode,
// audits every visible text element, and flags any that fail WCAG AA contrast.
//
// Usage:
//   node contrast-check.mjs                              # dark mode, public routes
//   THEME=light node contrast-check.mjs                  # light mode
//   BASE_URL=https://prod.example.com node contrast-check.mjs

import { chromium } from "playwright";
import { writeFile } from "node:fs/promises";

const BASE_URL = process.env.BASE_URL || "http://localhost:3000";
const THEME = process.env.THEME || "dark";
const OUTPUT = "./contrast-report.json";

const ROUTES = [
  "/", "/meals", "/providers", "/about", "/contact",
  "/help", "/login", "/register",
];

// Convert any CSS color (rgb, rgba, oklch via getComputedStyle which returns rgb) to luminance
function relativeLuminance([r, g, b]) {
  const a = [r, g, b].map((v) => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * a[0] + 0.7152 * a[1] + 0.0722 * a[2];
}

function contrastRatio(rgb1, rgb2) {
  const l1 = relativeLuminance(rgb1);
  const l2 = relativeLuminance(rgb2);
  const [light, dark] = l1 > l2 ? [l1, l2] : [l2, l1];
  return (light + 0.05) / (dark + 0.05);
}

function parseRgb(str) {
  const m = str.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
  return m ? [+m[1], +m[2], +m[3]] : null;
}

// Composite an rgba color over a background to get the effective rgb
function composite(fg, bg) {
  const m = fg.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
  if (!m) return null;
  const [r, g, b] = [+m[1], +m[2], +m[3]];
  const a = m[4] !== undefined ? +m[4] : 1;
  if (a >= 1) return [r, g, b];
  if (!bg) return [r, g, b];
  return [
    Math.round(r * a + bg[0] * (1 - a)),
    Math.round(g * a + bg[1] * (1 - a)),
    Math.round(b * a + bg[2] * (1 - a)),
  ];
}

async function findEffectiveBackground(el) {
  // Walk up the DOM looking for the first non-transparent background
  return await el.evaluate((node) => {
    let cur = node;
    while (cur && cur !== document.documentElement) {
      const s = getComputedStyle(cur);
      if (s.backgroundColor && s.backgroundColor !== "rgba(0, 0, 0, 0)" && s.backgroundColor !== "transparent") {
        return s.backgroundColor;
      }
      cur = cur.parentElement;
    }
    return getComputedStyle(document.body).backgroundColor;
  });
}

async function auditPage(page, routePath) {
  const findings = await page.evaluate(() => {
    const issues = [];

    function rl([r, g, b]) {
      const a = [r, g, b].map((v) => {
        v /= 255;
        return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
      });
      return 0.2126 * a[0] + 0.7152 * a[1] + 0.0722 * a[2];
    }
    function cr(rgb1, rgb2) {
      const l1 = rl(rgb1), l2 = rl(rgb2);
      const [light, dark] = l1 > l2 ? [l1, l2] : [l2, l1];
      return (light + 0.05) / (dark + 0.05);
    }
    function parseRgb(str) {
      const m = str.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
      if (!m) return null;
      return { r: +m[1], g: +m[2], b: +m[3], a: m[4] !== undefined ? +m[4] : 1 };
    }
    function composite(fg, bg) {
      if (fg.a >= 1) return [fg.r, fg.g, fg.b];
      return [
        Math.round(fg.r * fg.a + bg[0] * (1 - fg.a)),
        Math.round(fg.g * fg.a + bg[1] * (1 - fg.a)),
        Math.round(fg.b * fg.a + bg[2] * (1 - fg.a)),
      ];
    }
    function findBg(node) {
      let cur = node;
      while (cur && cur !== document.documentElement) {
        const s = getComputedStyle(cur);
        if (s.backgroundColor && s.backgroundColor !== "rgba(0, 0, 0, 0)") {
          const p = parseRgb(s.backgroundColor);
          if (p && p.a > 0) return [p.r, p.g, p.b];
        }
        cur = cur.parentElement;
      }
      const p = parseRgb(getComputedStyle(document.body).backgroundColor);
      return p ? [p.r, p.g, p.b] : [255, 255, 255];
    }

    const els = Array.from(document.querySelectorAll("body *"));
    for (const el of els) {
      const text = el.innerText?.trim();
      if (!text || text.length < 1) continue;
      // Skip if has child elements with their own text (we'll catch the leaf)
      const hasTextNodes = Array.from(el.childNodes).some(
        (n) => n.nodeType === Node.TEXT_NODE && n.textContent.trim().length > 0
      );
      if (!hasTextNodes) continue;

      const rect = el.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) continue;

      const s = getComputedStyle(el);
      if (s.visibility === "hidden" || s.display === "none" || s.opacity === "0") continue;

      const fg = parseRgb(s.color);
      if (!fg) continue;

      const bg = findBg(el);
      const effectiveFg = composite(fg, bg);
      const ratio = cr(effectiveFg, bg);

      const fontSize = parseFloat(s.fontSize);
      const fontWeight = parseInt(s.fontWeight) || 400;
      const isLargeText = fontSize >= 24 || (fontSize >= 18.66 && fontWeight >= 700);
      const required = isLargeText ? 3 : 4.5;

      if (ratio < required) {
        issues.push({
          tag: el.tagName.toLowerCase(),
          text: text.substring(0, 80),
          color: s.color,
          background: `rgb(${bg.join(", ")})`,
          ratio: Math.round(ratio * 100) / 100,
          required,
          fontSize: Math.round(fontSize),
          fontWeight,
          selector: el.tagName.toLowerCase() +
            (el.id ? `#${el.id}` : "") +
            (el.className && typeof el.className === "string"
              ? "." + el.className.split(" ").filter(Boolean).slice(0, 3).join(".")
              : ""),
        });
      }
    }
    return issues;
  });

  return { route: routePath, count: findings.length, issues: findings };
}

async function run() {
  console.log(`\n🔍 Contrast audit — ${THEME} mode @ ${BASE_URL}\n`);
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  const allIssues = [];

  for (const route of ROUTES) {
    try {
      await page.goto(`${BASE_URL}${route}`, { waitUntil: "networkidle", timeout: 20000 });
      await page.evaluate((t) => {
        try { localStorage.setItem("theme", t); } catch {}
        document.documentElement.classList.remove("light", "dark");
        document.documentElement.classList.add(t);
      }, THEME);
      await page.reload({ waitUntil: "networkidle" });
      await page.waitForTimeout(500);

      const result = await auditPage(page, route);
      const tag = result.count === 0 ? "\x1b[32m✓" : "\x1b[31m✗";
      console.log(`${tag} ${route.padEnd(20)} ${result.count} issue(s)\x1b[0m`);
      allIssues.push(result);
    } catch (e) {
      console.log(`\x1b[33m! ${route} skipped: ${e.message.split("\n")[0]}\x1b[0m`);
    }
  }

  await browser.close();

  await writeFile(OUTPUT, JSON.stringify({ theme: THEME, baseUrl: BASE_URL, results: allIssues }, null, 2));

  const total = allIssues.reduce((sum, r) => sum + r.count, 0);
  console.log(`\n📊 Total issues: ${total}`);
  console.log(`📄 Detailed report: ${OUTPUT}\n`);

  if (total > 0) {
    console.log("Top 10 worst offenders:");
    const sorted = allIssues
      .flatMap((r) => r.issues.map((i) => ({ route: r.route, ...i })))
      .sort((a, b) => a.ratio - b.ratio)
      .slice(0, 10);
    for (const i of sorted) {
      console.log(`  ${i.route} → ratio ${i.ratio} (need ${i.required}): "${i.text}"`);
    }
  }
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
