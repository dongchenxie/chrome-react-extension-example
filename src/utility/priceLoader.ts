import axios from "axios";
enum PRICE_TYPE {
  TOP_BID = "Top bid",
  MIN_BID = "Minium bid",
  BEST_OFFER = "Best offer",
  LISTED = "Listed price",
  NONE = "No price info",
}
type Prices = { [key in PRICE_TYPE]?: number };
export type PriceResult = {
  priceType: PRICE_TYPE;
  price?: number;
  prices?: Prices;
  url: string;
  platform: PLATFORM;
};
enum PLATFORM {
  OPENSEA = "OpenSea",
  LOOKSRARE = "Looksrare",
}
const parser = new DOMParser();
export async function loadOpenSeaPrice(
  address: string,
  itemId: string
): Promise<PriceResult> {
  try {
    const result = await axios.get(
      `https://opensea.io/assets/${address}/${itemId}`
    );
    if (result.status === 200) {
      const doc = parser.parseFromString(result.data, "text/html");
      let listedPrice = doc.xpath(
        "/html/body/div[1]/div[1]/main/div/div/div/div[1]/div/div[1]/div[2]/div[1]/div/section/div[2]/div[2]/div[1]/div[2]/text()"
      );
      let listedBestOffer = doc.xpath("/html/body/div[1]/div[1]/main/div/div/div/div[2]/div/div[1]/div/section/div/div[2]/div[1]/div[2]")
      const prices:Prices={}
      const bestOfferPrice=doc.xpath("/html/body/div[1]/div[1]/main/div/div/div/div[2]/div/div[4]/div/div/div/div/div/div/ul/li[2]/div[1]/div/div/div[2]/text()")
      console.log("bp",bestOfferPrice)
      const priceType = doc.getElementsByClassName("TradeStation--ask-label")[0].innerHTML;
      let currentPriceType: PRICE_TYPE = PRICE_TYPE.NONE;
      if (priceType.toLocaleLowerCase().indexOf("top bid") >= 0) {
        currentPriceType = PRICE_TYPE.TOP_BID;
      } else if (priceType.toLocaleLowerCase().indexOf("minimum bid") >= 0) {
        currentPriceType = PRICE_TYPE.MIN_BID;
      } else if (priceType.toLocaleLowerCase().indexOf("current price") >= 0) {
        currentPriceType = PRICE_TYPE.LISTED;
      }else if (priceType.toLocaleLowerCase().indexOf( "highest offer") >= 0) {
        currentPriceType = PRICE_TYPE.BEST_OFFER;
      }
      if(currentPriceType && Number(listedPrice) && currentPriceType!==PRICE_TYPE.NONE && currentPriceType !== PRICE_TYPE.BEST_OFFER){
          prices[currentPriceType]=Number(listedPrice)
      }else if(currentPriceType===PRICE_TYPE.BEST_OFFER && Number(listedBestOffer)){
          prices[PRICE_TYPE.BEST_OFFER]=Number(listedBestOffer)
      }
      if(bestOfferPrice && Number(bestOfferPrice)){
          prices[PRICE_TYPE.BEST_OFFER]=Number(bestOfferPrice)
      }
      return {
        platform: PLATFORM.OPENSEA,
        priceType: PRICE_TYPE.LISTED,
        prices:prices,
        price: Number(listedPrice),
        url: `https://opensea.io/assets/${address}/${itemId}`,
      };
    }
    return {
      platform: PLATFORM.OPENSEA,
      priceType: PRICE_TYPE.NONE,
      url: `https://opensea.io/assets/${address}/${itemId}`,
    };
  } catch (e) {
    return {
      platform: PLATFORM.OPENSEA,
      priceType: PRICE_TYPE.NONE,
      url: `https://opensea.io/assets/${address}/${itemId}`,
    };
  }
}
export async function loadLooksRarePrice(
  address: string,
  itemId: string
): Promise<PriceResult> {
  try {
    const result = await axios.get(
      `https://looksrare.org/collections/${address}/${itemId}`
    );
    if (result.status === 200) {
      const doc = parser.parseFromString(result.data, "text/html");
      const listedPrice = doc.xpath(
        "/html/body/div[1]/div[2]/div/div/div/div[1]/div[1]/div[1]/div[2]/div[1]/div[2]/h2"
      );

      const bestOfferPrice = doc.xpath(
        "/html/body/div[1]/div[2]/div/div/div/div[1]/div[1]/div[1]/div[2]/div[1]/div[3]/div[2]"
      );
      const bestOfferPrice2 = doc.xpath(
        "/html/body/div[1]/div[2]/div/div/div/div[1]/div[1]/div[1]/div[2]/div[1]/div[2]/div[2]"
      );
      const prices: Prices = {};
      if (listedPrice && Number(listedPrice))
        prices[PRICE_TYPE.LISTED] = Number(listedPrice);
      if (bestOfferPrice && Number(bestOfferPrice)) {
        prices[PRICE_TYPE.BEST_OFFER] = Number(bestOfferPrice);
      } else if (bestOfferPrice2 && Number(bestOfferPrice2)) {
        prices[PRICE_TYPE.BEST_OFFER] = Number(bestOfferPrice2);
      }

      return {
        platform: PLATFORM.LOOKSRARE,
        priceType: PRICE_TYPE.LISTED,
        price: Number(listedPrice),
        prices: prices,
        url: `https://looksrare.org/collections/${address}/${itemId}`,
      };
    }
    return {
      platform: PLATFORM.LOOKSRARE,
      priceType: PRICE_TYPE.NONE,
      url: `https://looksrare.org/collections/${address}/${itemId}`,
    };
  } catch (e) {
    return {
      platform: PLATFORM.LOOKSRARE,
      priceType: PRICE_TYPE.NONE,
      url: `https://looksrare.org/collections/${address}/${itemId}`,
    };
  }
}
declare global {
  interface Document {
    xpath(path: string): string;
  }
}

Document.prototype.xpath = function (path: string) {
  return this.evaluate(path, this, null, 2, null).stringValue;
};
