// theme-qa.mjs
//
// Screenshots every route in light + dark + mobile viewports.
// Writes to ./screenshots/<viewport>/<theme>/<route>.png
// Also produces an HTML report at ./screenshots/report.html for side-by-side review.
//
// Usage:
//   node theme-qa.mjs                       # uses defaults: localhost:3000, no auth
//   BASE_URL=https://foodhub-frontend-sand.vercel.app node theme-qa.mjs
//   AUTH_EMAIL=demo-customer@foodhub.app AUTH_PASSWORD=Demo@1234 node theme-qa.mjs
//
// Setup (one time):
//   pnpm add -D playwright
//   pnpm exec playwright install chromium

import { chromium } from "playwright";
import { mkdir, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";

// ============================================================================
// CONFIG
// ============================================================================

const BASE_URL = process.env.BASE_URL || "http://localhost:3000";
const AUTH_EMAIL = process.env.AUTH_EMAIL || "";
const AUTH_PASSWORD = process.env.AUTH_PASSWORD || "";
const OUTPUT_DIR = path.resolve("./screenshots");
const FULL_PAGE = process.env.FULL_PAGE !== "false"; // true by default

const VIEWPORTS = [
  { name: "desktop", width: 1440, height: 900 },
  { name: "mobile",  width: 390,  height: 844 },
];

const THEMES = ["light", "dark"];

// Routes split by auth requirement.
// Add or remove freely — the script tolerates 404s without crashing.
const PUBLIC_ROUTES = [
  { path: "/",                  name: "home" },
  { path: "/meals",             name: "meals-list" },
  { path: "/providers",         name: "providers-list" },
  { path: "/about",             name: "about" },
  { path: "/contact",           name: "contact" },
  { path: "/help",              name: "help" },
  { path: "/faq",               name: "faq" },
  { path: "/privacy",           name: "privacy" },
  { path: "/terms",             name: "terms" },
  { path: "/login",             name: "login" },
  { path: "/register",          name: "register" },
];

const AUTH_ROUTES_CUSTOMER = [
  { path: "/cart",              name: "cart" },
  { path: "/orders",            name: "orders" },
  { path: "/profile",           name: "profile" },
];

const AUTH_ROUTES_ADMIN = [
  { path: "/admin",             name: "admin-overview" },
  { path: "/admin/users",       name: "admin-users" },
  { path: "/admin/providers",   name: "admin-providers" },
  { path: "/admin/orders",      name: "admin-orders" },
  { path: "/admin/meals",       name: "admin-meals" },
  { path: "/admin/categories",  name: "admin-categories" },
];

const AUTH_ROUTES_PROVIDER = [
  { path: "/provider/dashboard", name: "provider-dashboard" },
  { path: "/provider/menu",      name: "provider-menu" },
  { path: "/provider/orders",    name: "provider-orders" },
];

// ============================================================================
// HELPERS
// ============================================================================

function log(msg, kind = "info") {
  const colors = { info: "\x1b[36m", ok: "\x1b[32m", warn: "\x1b[33m", err: "\x1b[31m" };
  const reset = "\x1b[0m";
  console.log(`${colors[kind] || ""}${msg}${reset}`);
}

async function ensureDir(dir) {
  if (!existsSync(dir)) await mkdir(dir, { recursive: true });
}

async function applyTheme(page, theme) {
  // FoodHub uses next-themes which writes to localStorage and toggles the `dark` class
  // on <html>. We do both so the page renders correctly even before hydration.
  await page.evaluate((t) => {
    try {
      localStorage.setItem("theme", t);
    } catch {}
    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(t);
    document.documentElement.style.colorScheme = t;
  }, theme);
}

async function login(context, email, password) {
  const page = await context.newPage();
  log(`Logging in as ${email}...`);
  await page.goto(`${BASE_URL}/login`, { waitUntil: "networkidle" });

  // Best-effort selectors — adjust if FoodHub's form differs.
  // We try common patterns and skip silently if not found.
  const emailSelectors = [
    'input[type="email"]',
    'input[name="email"]',
    'input[placeholder*="example.com"]',
    'input[placeholder*="email" i]',
  ];
  const passwordSelectors = [
    'input[type="password"]',
    'input[name="password"]',
  ];
  const submitSelectors = [
    'button[type="submit"]',
    'button:has-text("Sign In")',
    'button:has-text("Sign in")',
    'button:has-text("Login")',
  ];

  let filled = false;
  for (const sel of emailSelectors) {
    if (await page.locator(sel).first().isVisible().catch(() => false)) {
      await page.locator(sel).first().fill(email);
      filled = true;
      break;
    }
  }
  if (!filled) {
    log("Email input not found — skipping auth", "warn");
    await page.close();
    return false;
  }

  for (const sel of passwordSelectors) {
    if (await page.locator(sel).first().isVisible().catch(() => false)) {
      await page.locator(sel).first().fill(password);
      break;
    }
  }

  for (const sel of submitSelectors) {
    if (await page.locator(sel).first().isVisible().catch(() => false)) {
      await page.locator(sel).first().click();
      break;
    }
  }

  // Wait for navigation away from login or for an authenticated cookie
  try {
    await page.waitForURL((url) => !url.pathname.startsWith("/login"), { timeout: 8000 });
    log(`Logged in successfully`, "ok");
    await page.close();
    return true;
  } catch {
    log("Login may have failed — continuing without auth", "warn");
    await page.close();
    return false;
  }
}

async function captureRoute(context, route, viewport, theme) {
  const page = await context.newPage();
  await page.setViewportSize({ width: viewport.width, height: viewport.height });

  const url = `${BASE_URL}${route.path}`;
  let status = "ok";
  let httpStatus = 0;

  try {
    const response = await page.goto(url, { waitUntil: "networkidle", timeout: 20000 });
    httpStatus = response?.status() ?? 0;

    if (httpStatus >= 400) {
      status = `http-${httpStatus}`;
    }

    await applyTheme(page, theme);
    // Reload after applying so SSR + hydration settle into the chosen theme
    await page.reload({ waitUntil: "networkidle", timeout: 20000 });

    // Give any animations / image loads a moment
    await page.waitForTimeout(800);

    // Disable animations for a stable screenshot
    await page.addStyleTag({
      content: `*,*::before,*::after{animation-duration:0s!important;animation-delay:0s!important;transition-duration:0s!important;transition-delay:0s!important;}`,
    });

    const dir = path.join(OUTPUT_DIR, viewport.name, theme);
    await ensureDir(dir);
    const file = path.join(dir, `${route.name}.png`);
    await page.screenshot({ path: file, fullPage: FULL_PAGE });
    log(`  ✓ ${viewport.name}/${theme}/${route.name}.png  (${httpStatus})`, "ok");
  } catch (e) {
    status = `error: ${e.message.split("\n")[0]}`;
    log(`  ✗ ${viewport.name}/${theme}/${route.name}  ${status}`, "err");
  } finally {
    await page.close();
  }

  return { route: route.name, path: route.path, viewport: viewport.name, theme, status, httpStatus };
}

async function buildReport(results) {
  // Pivot results: route × viewport → light/dark side-by-side
  const grouped = {};
  for (const r of results) {
    const key = `${r.viewport}|${r.route}`;
    if (!grouped[key]) grouped[key] = { route: r.route, path: r.path, viewport: r.viewport };
    grouped[key][r.theme] = r;
  }

  const cards = Object.values(grouped).map((g) => {
    const lightSrc = `./${g.viewport}/light/${g.route}.png`;
    const darkSrc = `./${g.viewport}/dark/${g.route}.png`;
    const statusBadge = (s) => {
      if (!s) return "";
      const cls = s.status === "ok" ? "ok" : "err";
      return `<span class="badge ${cls}">${s.status}</span>`;
    };
    return `
    <section class="card">
      <header>
        <h2>${g.route}</h2>
        <div class="meta">
          <code>${g.path}</code>
          <span class="vp">${g.viewport}</span>
          ${statusBadge(g.light)}
          ${statusBadge(g.dark)}
        </div>
      </header>
      <div class="pair">
        <figure>
          <figcaption>Light</figcaption>
          <img src="${lightSrc}" alt="${g.route} light" loading="lazy" />
        </figure>
        <figure class="dark-bg">
          <figcaption>Dark</figcaption>
          <img src="${darkSrc}" alt="${g.route} dark" loading="lazy" />
        </figure>
      </div>
    </section>`;
  }).join("\n");

  const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<title>FoodHub Theme QA Report</title>
<meta name="viewport" content="width=device-width,initial-scale=1" />
<style>
  :root { color-scheme: dark; }
  * { box-sizing: border-box; }
  body {
    margin: 0; padding: 24px;
    font: 14px/1.5 ui-sans-serif, system-ui, sans-serif;
    background: #0a0a0a; color: #f4f4f5;
  }
  h1 { margin: 0 0 8px; }
  .legend { color: #a1a1aa; margin-bottom: 24px; font-size: 13px; }
  .card {
    background: #18181b; border: 1px solid #27272a; border-radius: 12px;
    padding: 16px; margin-bottom: 24px;
  }
  .card header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; gap: 12px; flex-wrap: wrap; }
  .card h2 { margin: 0; font-size: 16px; }
  .meta { display: flex; gap: 8px; align-items: center; font-size: 12px; color: #a1a1aa; flex-wrap: wrap; }
  .meta code { background: #27272a; padding: 2px 6px; border-radius: 4px; }
  .vp { padding: 2px 8px; background: #3f3f46; border-radius: 999px; font-size: 11px; }
  .badge { padding: 2px 8px; border-radius: 999px; font-size: 11px; font-weight: 600; }
  .badge.ok { background: #14532d; color: #bbf7d0; }
  .badge.err { background: #7f1d1d; color: #fecaca; }
  .pair { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
  figure { margin: 0; background: #27272a; border-radius: 8px; padding: 8px; }
  figure.dark-bg { background: #000; }
  figcaption { font-size: 12px; color: #a1a1aa; margin-bottom: 8px; text-align: center; text-transform: uppercase; letter-spacing: 0.05em; }
  img { width: 100%; height: auto; display: block; border-radius: 4px; cursor: zoom-in; }
  img.zoomed { position: fixed; inset: 0; width: 100vw; height: 100vh; object-fit: contain; background: rgba(0,0,0,0.95); z-index: 9999; padding: 20px; cursor: zoom-out; }
  .toolbar { position: sticky; top: 0; background: #0a0a0a; padding: 12px 0; margin-bottom: 12px; z-index: 10; border-bottom: 1px solid #27272a; }
  .toolbar input { width: 100%; max-width: 400px; padding: 8px 12px; border-radius: 6px; border: 1px solid #3f3f46; background: #18181b; color: inherit; font: inherit; }
  @media (max-width: 800px) { .pair { grid-template-columns: 1fr; } }
</style>
</head>
<body>
  <h1>FoodHub Theme QA Report</h1>
  <p class="legend">${results.length} screenshots across ${Object.keys(grouped).length} route×viewport pairs. Click any image to zoom. Generated ${new Date().toLocaleString()}.</p>
  <div class="toolbar">
    <input type="text" id="filter" placeholder="Filter routes (e.g. admin, mobile, login)..." />
  </div>
  <div id="cards">
    ${cards}
  </div>
  <script>
    // Click-to-zoom
    document.addEventListener("click", (e) => {
      if (e.target.tagName === "IMG") e.target.classList.toggle("zoomed");
    });
    // Filter
    const filter = document.getElementById("filter");
    const cards = document.querySelectorAll(".card");
    filter.addEventListener("input", (e) => {
      const q = e.target.value.toLowerCase();
      cards.forEach((c) => {
        c.style.display = c.textContent.toLowerCase().includes(q) ? "" : "none";
      });
    });
  </script>
</body>
</html>`;

  await writeFile(path.join(OUTPUT_DIR, "report.html"), html);
}

// ============================================================================
// MAIN
// ============================================================================

async function run() {
  log(`\n📸 FoodHub Theme QA — capturing ${BASE_URL}\n`);
  await ensureDir(OUTPUT_DIR);

  const browser = await chromium.launch({ headless: true });
  const results = [];

  // Pass 1 — public routes (no auth)
  {
    const context = await browser.newContext({ viewport: VIEWPORTS[0] });
    log("=== Public routes ===");
    for (const viewport of VIEWPORTS) {
      for (const theme of THEMES) {
        for (const route of PUBLIC_ROUTES) {
          results.push(await captureRoute(context, route, viewport, theme));
        }
      }
    }
    await context.close();
  }

  // Pass 2 — authenticated routes (only if creds provided)
  if (AUTH_EMAIL && AUTH_PASSWORD) {
    const context = await browser.newContext({ viewport: VIEWPORTS[0] });
    const ok = await login(context, AUTH_EMAIL, AUTH_PASSWORD);
    if (ok) {
      // Decide which set based on email pattern — adjust as needed
      let routes = AUTH_ROUTES_CUSTOMER;
      if (AUTH_EMAIL.includes("admin")) routes = [...AUTH_ROUTES_ADMIN, ...AUTH_ROUTES_CUSTOMER];
      else if (AUTH_EMAIL.includes("provider")) routes = [...AUTH_ROUTES_PROVIDER, ...AUTH_ROUTES_CUSTOMER];

      log(`\n=== Authenticated routes (${routes.length}) ===`);
      for (const viewport of VIEWPORTS) {
        for (const theme of THEMES) {
          for (const route of routes) {
            results.push(await captureRoute(context, route, viewport, theme));
          }
        }
      }
    }
    await context.close();
  } else {
    log("\nSkipping authenticated routes (no AUTH_EMAIL / AUTH_PASSWORD set)", "warn");
  }

  await browser.close();

  // Write report + summary
  await buildReport(results);
  await writeFile(
    path.join(OUTPUT_DIR, "results.json"),
    JSON.stringify(results, null, 2)
  );

  const failures = results.filter((r) => r.status !== "ok");
  log(`\n📊 Summary`);
  log(`   Total screenshots: ${results.length}`, "info");
  log(`   Successful:        ${results.length - failures.length}`, "ok");
  if (failures.length) {
    log(`   Failed/skipped:    ${failures.length}`, "err");
    failures.slice(0, 10).forEach((f) =>
      log(`     - ${f.viewport}/${f.theme}/${f.route} → ${f.status}`, "err")
    );
    if (failures.length > 10) log(`     ...and ${failures.length - 10} more`, "err");
  }
  log(`\n📁 Output:        ${OUTPUT_DIR}`);
  log(`📄 Open report:   file://${path.join(OUTPUT_DIR, "report.html")}\n`);
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
