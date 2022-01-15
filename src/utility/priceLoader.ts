import axios from "axios";

enum PRICE_TYPE{
    BESTOFFER,
    LISTED,
    NONE
}
export type PriceResult =  {
    priceType:PRICE_TYPE;
    price?:number;
    url:string;
    platfrom:PLATFORM
}
enum PLATFORM{
    OPENSEA="opensea",
    LOOKSRARE="looksrare"
}
export async function loadOpenSeaPrice(address:string,itemId:string):Promise<PriceResult>{
    try{
        const result=await axios.get(`https://opensea.io/assets/${address}/${itemId}`)
        if(result.status===200){
            const el = document.createElement( 'html' );
            el.innerHTML=result.data
            const price=el.querySelector("#main > div > div > div > div.fresnel-container.fresnel-lessThan-lg > div > div:nth-child(4) > div > section > div.TradeStation--main > div.TradeStation--price-container > div.Pricereact__DivContainer-sc-t54vn5-0.iBLrYW.Price--main.TradeStation--price > div.Overflowreact__OverflowContainer-sc-7qr9y8-0.jPSCbX.Price--amount")?.innerHTML.split("<")[0]
            return {
                platfrom:PLATFORM.OPENSEA,
                priceType:PRICE_TYPE.LISTED,
                price:Number(price),
                url:`https://opensea.io/assets/${address}/${itemId}`
            }
        }
        return {
            platfrom:PLATFORM.OPENSEA,
            priceType:PRICE_TYPE.NONE,
            url:`https://opensea.io/assets/${address}/${itemId}`
        }
    }catch(e){
        return {
            platfrom:PLATFORM.OPENSEA,
            priceType:PRICE_TYPE.NONE,
            url:`https://opensea.io/assets/${address}/${itemId}`
        }
    }
    
}
export async function loadLooksRarePrice(address:string,itemId:string):Promise<PriceResult>{
    try{
        const result=await axios.get(`https://looksrare.org/collections/${address}/${itemId}`)
        if(result.status===200){
            const el = document.createElement( 'html' );
            el.innerHTML=result.data
            const price=el.getElementsByTagName("h2")[0].innerHTML;
            return {
                platfrom:PLATFORM.LOOKSRARE,
                priceType:PRICE_TYPE.LISTED,
                price:Number(price),
                url:`https://opensea.io/assets/${address}/${itemId}`
            }
        }
        return  {
            platfrom:PLATFORM.LOOKSRARE,
            priceType:PRICE_TYPE.NONE,
            url:`https://opensea.io/assets/${address}/${itemId}`
        }
    }catch(e){
        return {
            platfrom:PLATFORM.LOOKSRARE,
            priceType:PRICE_TYPE.NONE,
            url:`https://opensea.io/assets/${address}/${itemId}`
        }
    }
    
}
function getElementByXpath(path:string) {
    return document.evaluate(path, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
  }