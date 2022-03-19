import { useVariablesOfToken } from "../hooks/useVariablesOfToken"
import brownieConfig from "../brownie-config.json"
import { useEthers } from "@usedapp/core"
import { constants } from "ethers"
import helperConfig from "../helper-config.json"


export const DisplayRate = () => {
    const { chainId, error } = useEthers()
    const networkName = chainId ? helperConfig[chainId] : "dev"  //if chainId exists, call helperConfig[chainId]. if not, call 'dev'
    const wethTokenAddress = chainId ? brownieConfig["networks"][networkName]["weth_token"] : constants.AddressZero


    const { useConvertionRate, useGetPriceFeed, useGetTokenValue } = useVariablesOfToken(wethTokenAddress)
    //const rate = useConvertionRate(1 * 10 ** 8)
    const priceFeed = useGetPriceFeed()
    const rate = useGetTokenValue()

    console.log(priceFeed)
    console.log(rate)

    const price = useConvertionRate(50 * 10 ** 8)
    console.log(price)


    //console.log(price.toNumber())


    return (<>
        <div>ETH/USD rate:  ${rate ? rate / (10 ** 8) : "NaN"}</div>
        <div>Price in ETH (50USD):  {price ? price.toNumber() / (10 ** 8) : "NaN"}</div>
    </>
    )


    if (chainId === 42) {

    }
    else {
        return (<></>)
    }

}