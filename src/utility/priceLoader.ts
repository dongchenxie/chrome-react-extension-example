import axios from "axios";
export async function loadOpenSeaPrice(address:string,itemId:string):Promise<string>{
    try{
        const result=await axios.get(`https://opensea.io/assets/${address}/${itemId}`)
        if(result.status===200){
            const el = document.createElement( 'html' );
            el.innerHTML=result.data
            const price=el.querySelector("#main > div > div > div > div.fresnel-container.fresnel-lessThan-lg > div > div:nth-child(4) > div > section > div.TradeStation--main > div.TradeStation--price-container > div.Pricereact__DivContainer-sc-t54vn5-0.iBLrYW.Price--main.TradeStation--price > div.Overflowreact__OverflowContainer-sc-7qr9y8-0.jPSCbX.Price--amount")?.innerHTML.split("<")[0]
            return "opensea.io ETH:"+price;
        }
        return "opensea.io item unlisted or error"
    }catch(e){
        return "opensea.io price fetch error"
    }
    
}
export async function loadLooksRarePrice(address:string,itemId:string):Promise<string>{
    try{
        const result=await axios.get(`https://looksrare.org/collections/${address}/${itemId}`)
        if(result.status===200){
            const el = document.createElement( 'html' );
            el.innerHTML=result.data
            const price=el.getElementsByTagName("h2")[0].innerHTML;
            return "looksrare.org ETH:"+price;
        }
        return "looksrare.org item unlisted or error"
    }catch(e){
        return "looksrare.org price fetch error"
    }
    
}
function getElementByXpath(path:string) {
    return document.evaluate(path, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
  }