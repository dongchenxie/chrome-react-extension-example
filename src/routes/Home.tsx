import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { ChromeMessage, Sender } from "../types";
import { getCurrentTabUId, getCurrentTabUrl } from "../chrome/utils";
import web3 from "web3";
import { loadOpenSeaPrice, loadLooksRarePrice, PriceResult } from "../utility/priceLoader"
import { urlParser } from "../utility/urlParser";
import { ReactSVG } from 'react-svg'
import ETHIcon from "../assets/ethereum.svg"
export const Home = () => {
    const [url, setUrl] = useState<string>('');
    const [tabId, setTabId] = useState<number | undefined>();
    const [prices, setPrices] = useState<PriceResult[]>([]);
    const [responseFromContent, setResponseFromContent] = useState<string>('');
    const [errorMsg, setErrorMsg] = useState<string | undefined>()
    let { push } = useHistory();
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
    useEffect(() => {
        const loadPrice = async (address: string, id: string) => {
            const result1 = await loadOpenSeaPrice(address, id)
            const result2 = await loadLooksRarePrice(address, id)
            setPrices([...prices, result1, result2])

        }
        // getCurrentTabUId((id) => {
        //     setTabId(id)
        // })
        console.log("url", url)
        if (url) {
            const result = urlParser(url)
            if (result.success) {
                loadPrice(result.address!, result.id!)
            } else {
                setErrorMsg(result.msg)
            }
        }

    }, [url])

    return (
        <>
            <div className="App" style={{ width: "100%" }}>
                <header className="App-header text-3xl font-bold underline">
                    <p className=" text-3xl font-bold underline">price</p>
                    <table className="table">
                        <thead>
                            <tr>
                                <th scope="col">#</th>
                                <th scope="col">First</th>
                                <th scope="col">Last</th>
                                <th scope="col">Handle</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <th scope="row">1</th>
                                <td>Mark</td>
                                <td>Otto</td>
                                <td>@mdo</td>
                            </tr>
                            <tr>
                                <th scope="row">2</th>
                                <td>Jacob</td>
                                <td>Thornton</td>
                                <td>@fat</td>
                            </tr>
                            <tr>
                                <th scope="row">3</th>
                                <td >Larry the Bird</td>
                                <td>@twitter</td>
                            </tr>
                        </tbody>
                    </table>
                    {errorMsg ? <div style={{}}>
                        {errorMsg}
                    </div> : <div>


                        {prices.length > 0 ? <table className="table border border-1 rounded">
                            <tr>
                                <th>
                                    Platform name
                                </th>
                                <th>
                                    Result
                                </th>
                                <th>
                                    Price
                                </th>
                            </tr>
                            {
                                prices.map((v) => <tr onClick={() => { window.open(v.url); }} role="button">
                                    <td>{v.platfrom}</td>
                                    <td>{v.priceType}</td>
                                    <td>{v.price}</td>
                                </tr>)
                            }
                        </table> : <div className="App-logo-spin"><ReactSVG src={ETHIcon}/></div>}

                    </div>}
                </header>
            </div>
            <script src="https://cdn.tailwindcss.com"></script>

        </>

    )
}
