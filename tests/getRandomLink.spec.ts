import fs from "node:fs";
import { describe, expect, expectTypeOf, test, vi } from "vitest";

import { getSitemapLinks, getLinkMetaData } from "../api/getRandomLink";

async function mockFetchResponse(text: string) {
  return new Promise((resolve) =>
    resolve({
      text: () => new Promise((resolve) => resolve(text)),
    })
  );
}

const mockLinkData = fs.readFileSync("tests/mocks/page-mock.txt", "utf-8");
const mockText = fs.readFileSync("tests/mocks/sitemap-mock.txt", "utf-8");

describe("getRandomLink", () => {
  test("should return an array of links", async () => {
    global.fetch = vi.fn().mockReturnValue(mockFetchResponse(mockText));

    const links = await getSitemapLinks();
    expectTypeOf(links).toBeArray();
    expect(links).toHaveLength(5252);
  });

  test("should return metadata of a link", async () => {
    global.fetch = vi.fn().mockReturnValue(mockFetchResponse(mockLinkData));
    const mockLink = "/en-US/docs/Web/API/AbortController/abort";

    const linkData = await getLinkMetaData(mockLink);
    expect(linkData.tag).toBe("WEB API");
    expect(linkData.title).toBe("AbortController: abort() method");
    expect(linkData.description)
      .toBe(`The abort() method of the AbortController interface aborts an asynchronous operation before it has completed.
  This is able to abort fetch requests, the consumption of any response bodies, or streams.`);
    expect(linkData.url).toBe(mockLink);
  });
});
