import puppeteer, { Page } from "puppeteer";
import colors from "colors";

//@ts-ignore
import data from "./config.json";

const { item, product } = data;

const WEBSITE = "https://www.amazon.in/";
const WAITTIME = 5000;

const screenshot = `${item.split(" ").join("")}.png`;

async function main() {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.setViewport({
    width: 1920,
    height: 1080,
  });
  await page.goto(WEBSITE);

  let searchBox = await page
    .waitForXPath("//*[@id='twotabsearchtextbox']", {
      visible: true,
      timeout: WAITTIME,
    })
    .then((el: any) => {
      el.type(item);
      console.log(colors.green("✅ Search criteria has been entered"));
    })
    .catch((err: any) => {
      console.log(colors.red("❌ Amazon screen is not displayed"));
    });

  //Clicked on search button
  let btnSearch = await page
    .waitForXPath("//*/input[@id='nav-search-submit-button']", {
      visible: true,
      timeout: WAITTIME,
    })
    .then((el: any) => {
      el.click();
      console.log(colors.green("✅ Clicked on search button"));
    })
    .catch((err: any) => {
      console.log(colors.red("❌ Search button is not showing"));
    });

  //Click on specific search result
  let myItem = await page
    .waitForXPath(`//*[contains(text(),'${product}')]`, {
      visible: true,
      timeout: WAITTIME,
    })
    .then((el: any) => {
      el.click();
      console.log(colors.green(`✅ Click on specific ${item} to order`));
    })
    .catch((err: any) => {
      console.log(colors.red(`❌ ${item} is not available`));
    });

  // Identify if the new tab has opened
  const pageTarget = page.target();
  const newTarget = await browser.waitForTarget(
    (target) => target.opener() === pageTarget
  );

  //get the new page object:
  //@ts-ignore
  const page2: Page = await newTarget.page();
  await page2.setViewport({ width: 1280, height: 800 });

  //Add to cart
  let addToCart = await page2
    .waitForXPath("//*/input[@id='add-to-cart-button']", {
      visible: true,
      timeout: WAITTIME,
    })
    .then((el: any) => {
      el.click();
      console.log(colors.green("✅ Click on add to Cart button"));
    })
    .catch((err: any) => {
      console.log(colors.red("❌ Add to cart button is not available"));
    });

  //Verify add to cart process
  let successMessage = await page2
    .waitForXPath("//*[contains(text(),'Added to Cart')]", {
      visible: true,
      timeout: WAITTIME,
    })
    .then((el: any) => {
      el.click();
      console.log(colors.green("✅ Item is added to cart successfully"));
    })
    .catch((err: any) => {
      console.log(colors.red("❌ Item is not added to cart"));
    });

  // Capture no of cart
  let cartCount = await page2.waitForXPath("//*/span[@id='nav-cart-count']", {
    visible: true,
    timeout: WAITTIME,
  });

  let value = await page2.evaluate((el: any) => el.textContent, cartCount);
  console.log(colors.green("✅ Cart count: " + value));
  cartCount && cartCount.focus();

  await page2.screenshot({ path: screenshot });

  await page.waitForTimeout(2000);
  await page2.close();
  await page.close();
  await browser.close();
}

try {
  main();
} catch (err) {
  console.error(err);
}
