import axios from "axios";
import {JSDOM} from "jsdom"
enum PRICE_TYPE {
  TOPBID = "Top bid",
  MINBID = "Minium bid",
  LISTED = "Listed Price",
  NONE = "No price info",
}
export type PriceResult = {
  priceType: PRICE_TYPE;
  price?: number;
  url: string;
  platfrom: PLATFORM;
};
enum PLATFORM {
  OPENSEA = "opensea",
  LOOKSRARE = "looksrare",
}
export async function loadOpenSeaPrice(address: string, itemId: string): Promise<PriceResult> {
  try {
    const result = await axios.get(`https://opensea.io/assets/${address}/${itemId}`);
    if (result.status === 200) {
      const doc = new JSDOM(`<!DOCTYPE html><p>Hello world</p>`).window.document;
      const listedPrice=doc.evaluate("/html/body/div[1]/div[1]/main/div/div/div/div[1]/div/div[1]/div[2]/div[1]/div/section/div[2]/div[2]/div[1]/div[2]/text()",doc,null,2,null).stringValue
      
      console.log("p", listedPrice);
      const priceType = doc.evaluate(
          "/html/body/div[1]/div[1]/main/div/div/div/div[2]/div/div[1]/div/section/div[2]/div[1]",doc,null,2,null).stringValue;
    console.log(priceType)
      let currentPriceType: PRICE_TYPE;
      if (priceType.toLocaleLowerCase().indexOf("top bid") >= 0) {
        currentPriceType = PRICE_TYPE.TOPBID;
      } else if (priceType.toLocaleLowerCase().indexOf("Minimum bid") >= 0) {
        currentPriceType = PRICE_TYPE.MINBID;
      }
      return {
        platfrom: PLATFORM.OPENSEA,
        priceType: PRICE_TYPE.LISTED,
        price: Number(listedPrice),
        url: `https://opensea.io/assets/${address}/${itemId}`,
      };
    }
    return {
      platfrom: PLATFORM.OPENSEA,
      priceType: PRICE_TYPE.NONE,
      url: `https://opensea.io/assets/${address}/${itemId}`,
    };
  } catch (e) {
    return {
      platfrom: PLATFORM.OPENSEA,
      priceType: PRICE_TYPE.NONE,
      url: `https://opensea.io/assets/${address}/${itemId}`,
    };
  }
}
export async function loadLooksRarePrice(address: string, itemId: string): Promise<PriceResult> {
  try {
    const result = await axios.get(`https://looksrare.org/collections/${address}/${itemId}`);
    if (result.status === 200) {
      const el = document.createElement("html");
      el.innerHTML = result.data;
      const price = el.getElementsByTagName("h2")[0].innerHTML;
      return {
        platfrom: PLATFORM.LOOKSRARE,
        priceType: PRICE_TYPE.LISTED,
        price: Number(price),
        url: `https://looksrare.org/collections/${address}/${itemId}`,
      };
    }
    return {
      platfrom: PLATFORM.LOOKSRARE,
      priceType: PRICE_TYPE.NONE,
      url: `https://looksrare.org/collections/${address}/${itemId}`,
    };
  } catch (e) {
    return {
      platfrom: PLATFORM.LOOKSRARE,
      priceType: PRICE_TYPE.NONE,
      url: `https://looksrare.org/collections/${address}/${itemId}`,
    };
  }
}
function getElementByXpath(path: string) {
  return document.evaluate(path, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null)
    .singleNodeValue;
}
