const data = require("./config.json");

const { item, product, link } = data;

jest.setTimeout(10000);

beforeAll(async () => {
  await page.goto("https://amazon.in");
});

describe("Open Amazon", () => {
  it('should be titled "Amazon"', async () => {
    await expect(page.title()).resolves.toContain("Amazon.in");
  });
});

describe("Search for item", () => {
  it(`should search for '${item}'`, async () => {
    await page.type("input[name=field-keywords]", item);
    await page.keyboard.press("Enter");
    await page.waitForNavigation();
    await expect(page.title()).resolves.toMatch(`Amazon.in : ${item}`);
  });
});

describe("Select product", () => {
  it(`should select '${product}'`, async () => {
    await page.goto(link);
    await expect(page.title()).resolves.toContain(`${product}`);
  });
});

describe("Add to cart", () => {
  it("should add to cart", async () => {
    await page.click("#add-to-cart-button");
    await page.waitForNavigation();
    await expect(page.title()).resolves.toContain("Amazon.in Shopping Cart");
  });
});

describe("Checkout", () => {
  it("should checkout", async () => {
    await page.click("input[name=proceedToRetailCheckout]");
    await page.waitForNavigation();
    await expect(page.title()).resolves.toContain("Amazon Sign In");
  });
});
