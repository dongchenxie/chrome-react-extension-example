import web3 from "web3";
export enum UrlMatch {
  LOOKSRARE,
  OPENSEA,
  NONE,
}

export type UrlValidateResult = {
  url: UrlMatch;
  msg: string;
  success: boolean;
  address?: string;
  id?: string;
};
export function urlParser(url: string): UrlValidateResult {
  if (!validURL(url)) {
    return {
      url: UrlMatch.NONE,
      msg: "URL in current tab is not a valid URL",
      success: false,
    };
  }
  const result: UrlValidateResult = {
    url: UrlMatch.NONE,
    msg: "We support opensea and looksrare only at now",
    success: false,
  };
  const urlArray = url.split("/");
  if (urlArray[2] === "looksrare.org") {
    if (web3.utils.isAddress(urlArray[4]) && !urlArray[5]) {
      result.address = urlArray[4];
      result.id = urlArray[5];
      result.url = UrlMatch.LOOKSRARE;
      result.msg = "URL ok";
      result.success = true;
    } else {
      result.url = UrlMatch.LOOKSRARE;
      result.msg = "Please navigate to the item page";
    }
  } else if (urlArray[2] === "opensea.io") {
    if (web3.utils.isAddress(urlArray[4]) && !urlArray[5]) {
      result.address = urlArray[4];
      result.id = urlArray[5];
      result.url = UrlMatch.OPENSEA;
      result.msg = "URL ok";
      result.success = true;
    } else {
      result.url = UrlMatch.OPENSEA;
      result.msg = "Please navigate to the item page";
    }
  }
  return result;
}
function validURL(str: string): boolean {
  var pattern = new RegExp(
    "^(https?:\\/\\/)?" + // protocol
      "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + // domain name
      "((\\d{1,3}\\.){3}\\d{1,3}))" + // OR ip (v4) address
      "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // port and path
      "(\\?[;&a-z\\d%_.~+=-]*)?" + // query string
      "(\\#[-a-z\\d_]*)?$",
    "i"
  ); // fragment locator
  return !!pattern.test(str);
}
