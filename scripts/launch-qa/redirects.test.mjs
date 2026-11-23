/**
 * Redirect tests for the Nov 22, 2026 redirect audit.
 *
 *   npm run build && npx next start -p 3000      then, in another terminal:
 *   npm run test:redirects                       (BASE_URL defaults to http://localhost:3000)
 *   BASE_URL=https://www.kosick.com npm run test:redirects     against production, after a deploy
 *
 * The first group needs no server: it checks the redirect table itself. The rest request a running site and
 * follow every hop by hand (`redirect: "manual"`), so they assert the exact status code and Location header,
 * not just where a followed request ends up.
 */
import assert from "node:assert/strict";
import { before, describe, it } from "node:test";
import { LEGACY_REDIRECTS } from "../../src/lib/legacy-redirects.ts";

const BASE = (process.env.BASE_URL || "http://localhost:3000").replace(/\/$/, "");
const HEADERS = { "user-agent": "Mozilla/5.0 (compatible; kosick-redirect-test/1.0)" };

/** The 23 redirects added by the audit: [old URL as Google lists it, destination]. All must be 301. */
const NEW_301 = [
  ["/hvac-lead-generation/", "/services/hvac-marketing/"],
  ["/hvac-lead-generation-2/", "/services/hvac-marketing/"],
  ["/blog-hvac-marketing-guide/", "/services/hvac-marketing/"],
  ["/blog-what-is-social-marketing/", "/what-is-social-marketing/"],
  ["/social-media-marketing/", "/services/social-media-marketing/"],
  ["/social-media-content-creation-vancouver/", "/social-media-advertising-vancouver/"],
  ["/strategic-vancouver-branding-company/", "/services/corporate-branding/"],
  ["/the-art-of-branding/", "/corporate-branding-guide/"],
  ["/services/digital-video-advertising/", "/services/digital-connected-tv/"],
  ["/the-power-of-tv-advertising/", "/is-television-advertising-worth-it/"],
  // The typo ("vancouve") is the URL Google knows; it is kept exactly
  ["/how-to-choose-a-marketing-company-in-vancouve/", "/how-to-choose-a-marketing-company-in-vancouver/"],
  ["/social-organic-and-paid-marketing-agency/", "/organic-social-media-vs-paid-advertising/"],
  ["/strategic-media-advertising/", "/media-buying-canada/"],
  ["/advertising-in-2026/", "/feature-articles/"],
  ["/website-development/", "/services/website-development/"],
  ["/blog-importance-of-website-development/", "/services/website-development/"],
  ["/websites-that-work-for-your-business/", "/services/website-development/"],
  ["/ai-search-optimization-guide/", "/services/search-engine-optimization/"],
  ["/corporate-events-travel-incentives-conferences/", "/corporate-events/"],
  ["/blog-golf-course-marketing/", "/services/golf-marketing/"],
  ["/services/creative-production/", "/services/creative/"],
  ["/integrated-marketing-drives-better-results/", "/marketing-programs/"],
  ["/the-power-of-geo-targeted-campaigns/", "/services/digital-marketing/"],
];

/** The 14 redirects that already worked before the audit and must keep working unchanged (all 301). */
const EXISTING_301 = [
  ["/services/hvac-marketing/hvac-lead-generation/", "/services/hvac-marketing/"],
  ["/services/hvac-marketing/digital-marketing/", "/services/hvac-marketing/digital-advertising/"],
  ["/services/hvac-marketing/branding-advertising/", "/services/hvac-marketing/outdoor-advertising/"],
  ["/blog-black-friday-advertising/", "/black-friday-advertising/"],
  ["/blog-dental-marketing/", "/dental-marketing-custom-websites/"],
  ["/blog-digital-tv-advertising-ad-creative/", "/ad-creative-digital-tv-advertising/"],
  ["/blog-golf-marketing-strategies/", "/golf-course-branding/"],
  ["/blog-hvac-website-development/", "/hvac-website-development/"],
  ["/blog-importance-of-social-media-marketing/", "/importance-of-social-media-marketing/"],
  ["/blog-kosick-com-corporate-branding-guide/", "/corporate-branding-guide/"],
  ["/blog-media-buying-canada-tv-streaming-radio/", "/media-buying-canada/"],
  ["/blog-social-media-marketing/", "/social-media-golf-resorts-real-estate/"],
  ["/blog-tiktok-instagram-facebook-ad-safe-zones/", "/ad-safe-zones-tiktok-instagram-facebook/"],
  ["/hvac-marketing-strategies-guide/", "/hvac-dealer-marketing/"],
];

/** Must stay a plain 404: no redirect, no page. */
const MUST_404 = ["/prefooter/"];

const noSlash = (path) => path.replace(/\/$/, "");
const tableEntry = (source) => LEGACY_REDIRECTS.find((entry) => entry.source === noSlash(source));

async function request(path) {
  const response = await fetch(BASE + path, { redirect: "manual", headers: HEADERS });
  const location = response.headers.get("location");
  // Compare paths, not hosts: Location is absolute and carries the host the request came in on
  const locationPath = location ? new URL(location, BASE).pathname + new URL(location, BASE).search : null;
  return { status: response.status, location, locationPath };
}

/** Follows redirects one hop at a time. */
async function trace(path, maxHops = 5) {
  const hops = [];
  let current = path;
  for (let i = 0; i < maxHops; i += 1) {
    const hop = await request(current);
    hops.push({ from: current, status: hop.status, to: hop.locationPath });
    if (!hop.locationPath) return hops;
    current = hop.locationPath;
  }
  return hops;
}

/* ------------------------------------------------------------------------------------------------ the table */

describe("redirect table (no server needed)", () => {
  it("holds all 23 new redirects, each a real 301 to the exact destination", () => {
    for (const [source, destination] of NEW_301) {
      const entry = tableEntry(source);
      assert.ok(entry, `missing from LEGACY_REDIRECTS: ${source}`);
      assert.equal(entry.destination, destination, `wrong destination for ${source}`);
      assert.equal("statusCode" in entry && entry.statusCode, 301, `${source} must use statusCode 301, not Next's default 308`);
    }
    assert.equal(NEW_301.length, 23);
  });

  it("keeps the 14 existing 301 redirects exactly as they were", () => {
    for (const [source, destination] of EXISTING_301) {
      const entry = tableEntry(source);
      assert.ok(entry, `existing redirect was removed: ${source}`);
      assert.equal(entry.destination, destination, `existing redirect changed: ${source}`);
      assert.equal("statusCode" in entry && entry.statusCode, 301, `${source} lost its 301`);
    }
    assert.equal(EXISTING_301.length, 14);
  });

  it("has no duplicate sources", () => {
    const sources = LEGACY_REDIRECTS.map((entry) => entry.source);
    assert.equal(new Set(sources).size, sources.length, "a source appears twice, so the first match silently wins");
  });

  it("never sends a redirect to another redirect (no chains, no loops)", () => {
    const sources = new Set(LEGACY_REDIRECTS.map((entry) => entry.source));
    for (const entry of LEGACY_REDIRECTS) {
      const destination = noSlash(entry.destination.split("?")[0]);
      assert.ok(!sources.has(destination), `${entry.source} -> ${entry.destination} lands on another redirect source`);
      assert.notEqual(noSlash(entry.source), destination, `${entry.source} redirects to itself`);
    }
  });

  it("does not redirect /prefooter/, and keeps the vancouve typo source exactly", () => {
    assert.ok(!LEGACY_REDIRECTS.some((entry) => /prefooter/.test(entry.source + entry.destination)));
    assert.ok(tableEntry("/how-to-choose-a-marketing-company-in-vancouve"), "typo source missing");
    assert.ok(!tableEntry("/how-to-choose-a-marketing-company-in-vancouver"), "the correctly spelled live article must not be redirected");
  });

  it("never redirects a destination that is itself a live page's path to anywhere", () => {
    for (const [, destination] of [...NEW_301, ...EXISTING_301]) {
      assert.ok(!tableEntry(destination), `destination ${destination} is also a redirect source`);
    }
  });
});

/* ------------------------------------------------------------------------------------------- the site */

describe(`live behaviour at ${BASE}`, () => {
  before(async () => {
    try {
      await request("/");
    } catch (error) {
      throw new Error(`Cannot reach ${BASE}. Start the site (npm run build && npx next start -p 3000) or set BASE_URL. ${error}`);
    }
  });

  for (const [group, pairs] of [
    ["new", NEW_301],
    ["existing", EXISTING_301],
  ]) {
    describe(`${group} 301 redirects`, () => {
      for (const [source, destination] of pairs) {
        it(`${source} -> 301 -> ${destination} (one hop, destination 200)`, async () => {
          const first = await request(source);
          assert.equal(first.status, 301, `expected a 301, got ${first.status}`);
          assert.equal(first.locationPath, destination, "Location header");

          // The destination answers directly: no second redirect, so no chain
          const landing = await request(destination);
          assert.equal(landing.status, 200, `destination answered ${landing.status}${landing.location ? " -> " + landing.location : ""}`);
        });

        it(`${noSlash(source)} (no trailing slash) ends on ${destination} through a final 301`, async () => {
          const hops = await trace(noSlash(source));
          const last = hops[hops.length - 1];
          assert.equal(last.status, 200, `chain did not end on a 200: ${JSON.stringify(hops)}`);
          const redirects = hops.filter((hop) => hop.status >= 300);
          assert.ok(redirects.length <= 2, `more than two hops: ${JSON.stringify(hops)}`);
          assert.equal(redirects[redirects.length - 1].status, 301, `the last hop must be the 301: ${JSON.stringify(hops)}`);
          assert.equal(redirects[redirects.length - 1].to, destination);
          // The only other hop allowed is Next's own trailing-slash normalisation
          for (const hop of redirects.slice(0, -1)) {
            assert.equal(hop.status, 308);
            assert.equal(hop.to, source, "the first hop may only add the trailing slash");
          }
        });
      }
    });
  }

  it("keeps campaign parameters through a redirect (gclid, utm_*)", async () => {
    const [source, destination] = NEW_301[0];
    const hop = await request(`${source}?gclid=TEST123&utm_source=audit`);
    assert.equal(hop.status, 301);
    assert.equal(hop.locationPath, `${destination}?gclid=TEST123&utm_source=audit`);
  });

  it("answers /prefooter/ with a plain 404", async () => {
    for (const path of MUST_404) {
      const hop = await request(path);
      assert.equal(hop.status, 404, `${path} answered ${hop.status}`);
    }
  });

  it("answers every other legacy redirect in the table with its declared status", async () => {
    const covered = new Set([...NEW_301, ...EXISTING_301].map(([source]) => noSlash(source)));
    for (const entry of LEGACY_REDIRECTS) {
      if (covered.has(entry.source) || entry.source.includes(":")) continue;
      const declared = "statusCode" in entry ? entry.statusCode : 308;
      if (/\.[a-z0-9]+$/i.test(entry.source)) {
        // File-style sources (the Rank Math .xml sitemaps) have no trailing-slash form: check the first hop and the landing
        const hops = await trace(entry.source);
        assert.equal(hops[0].status, declared, `${entry.source} answered ${hops[0].status}, table says ${declared}`);
        assert.equal(hops[hops.length - 1].status, 200, `${entry.source} did not end on a 200: ${JSON.stringify(hops)}`);
        continue;
      }
      const hop = await request(`${entry.source}/`);
      assert.equal(hop.status, declared, `${entry.source} answered ${hop.status}, table says ${declared}`);
      assert.equal(hop.locationPath, entry.destination, `${entry.source} Location`);
    }
  });
});
