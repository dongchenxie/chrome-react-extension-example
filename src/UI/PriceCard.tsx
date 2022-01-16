import React from "react"
import { PriceResult } from "../utility/priceLoader"
type PriceCardProps = {
  priceResult: PriceResult
}
export function PriceCard({ priceResult }: PriceCardProps) {
  return (
    <div className="card my-2 w-75 mx-auto" >
      <div className="card-body">
        <div className="d-flex"><h5 className="card-title">{priceResult.platform}</h5>
          <p className="mx-2 text-muted">{" "}{priceResult.prices?.["Listed price"] ?
            `Price:${priceResult.prices?.["Listed price"]}` :
            priceResult.prices?.["Minium bid"] || priceResult.prices?.["Minium bid"] ? "Biding" : "Unlisted"}</p>
        </div>
        {priceResult.prices?.["Minium bid"] && <p className="card-subtitle mb-2 text-muted">Minium bid:{priceResult.prices?.["Minium bid"]}</p>}
        {priceResult.prices?.["Best offer"] ? <p className="card-subtitle mb-2 text-muted">Best offer:{priceResult.prices?.["Best offer"]}</p> : <></>}
        {priceResult.prices?.["Top bid"] && <p className="card-subtitle mb-2 text-muted">Top bid:{priceResult.prices?.["Top bid"]}</p>}
        <a target="_blank" rel="noreferrer" href={priceResult.url} className="btn btn-primary">View Item</a>
      </div>
    </div>)
}