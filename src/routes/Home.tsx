import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { ChromeMessage, Sender } from "../types";
import { getCurrentTabUId, getCurrentTabUrl } from "../chrome/utils";
import web3 from "web3";
import {loadOpenSeaPrice,loadLooksRarePrice} from "../utility/priceLoader"
import { urlParser } from "../utility/urlParser";
export const Home = () => {
    const [url, setUrl] = useState<string>('');
    const [prices,setPrices]= useState<string[]>([]);
    const [responseFromContent, setResponseFromContent] = useState<string>('');
    const [errorMsg,setErrorMsg]=useState<string|undefined>()
    let {push} = useHistory();
    console.log(web3.utils.isAddress('0xc1912fee45d61c87cc5ea59dae31190fffff232d'))
    /**
     * Get current URL
     */
    useEffect(() => {
        getCurrentTabUrl((url) => {
            setUrl(url || 'undefined');
        })
    }, []);

    const sendTestMessage = () => {
        const message: ChromeMessage = {
            from: Sender.React,
            message: "Hello from React",
        }

        getCurrentTabUId((id) => {
            id && chrome.tabs.sendMessage(
                id,
                message,
                (responseFromContentScript) => {
                    setResponseFromContent(responseFromContentScript);
                });
        });
    };

    const sendRemoveMessage = () => {
        const message: ChromeMessage = {
            from: Sender.React,
            message: "delete logo",
        }

        getCurrentTabUId((id) => {
            id && chrome.tabs.sendMessage(
                id,
                message,
                (response) => {
                    setResponseFromContent(response);
                });
        });
    };
    useEffect(()=>{
        const loadPrice=async(address:string,id:string)=>{
            await Promise.all([
                setPrices([...prices,await loadOpenSeaPrice(address,id)]),
                setPrices([...prices,await loadLooksRarePrice(address,id)])
            ])
        }
        const result =urlParser(url)
        if(result.success){
            loadPrice(result.address!,result.id!)
        }else{
            setErrorMsg(result.msg)
        }
    },[prices, url])

    return (
        <div className="App">
            <header className="App-header">
                {errorMsg?<div style={{width:"100%"}}>
                    {errorMsg}
                </div>:<div>
                    
                    
                    {prices.length>0?<div>
                        {
                            prices.map((v)=><div>{v}</div>)
                        }
                    </div>:<div>loading</div>}
                    
                    </div>}
            </header>
        </div>
    )
}
