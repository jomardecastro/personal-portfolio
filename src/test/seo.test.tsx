import { readFileSync } from "fs";
import path from "path";
import { describe, it, expect, afterEach } from "vitest";
import { cleanup, render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import CanonicalLink from "@/components/CanonicalLink";
import { SITE_URL, indexablePaths } from "@/lib/seo";

const publicFile = (name: string) =>
  readFileSync(path.resolve(__dirname, "../../public", name), "utf8");

const canonicalAt = (route: string) => {
  render(
    <MemoryRouter initialEntries={[route]}>
      <CanonicalLink />
    </MemoryRouter>,
  );
  return document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]')?.href;
};

afterEach(cleanup);

describe("sitemap", () => {
  it("lists every page on the apex host, plus the resume", () => {
    const locs = [...publicFile("sitemap.xml").matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
    const expected = [...indexablePaths, "/resume.pdf"].map((p) => `${SITE_URL}${p}`);
    expect(locs.sort()).toEqual(expected.sort());
  });

  it("is advertised in robots.txt", () => {
    expect(publicFile("robots.txt")).toContain(`Sitemap: ${SITE_URL}/sitemap.xml`);
  });
});

describe("CanonicalLink", () => {
  it("points the home page at the apex root", () => {
    expect(canonicalAt("/")).toBe(`${SITE_URL}/`);
  });

  it("drops a trailing slash", () => {
    expect(canonicalAt("/systems/commission-engine/")).toBe(`${SITE_URL}/systems/commission-engine`);
  });

  it("leaves unknown paths without a canonical", () => {
    canonicalAt("/work/omni");
    expect(canonicalAt("/does-not-exist")).toBeUndefined();
  });
});
