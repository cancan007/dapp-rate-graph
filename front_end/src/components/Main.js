/* eslint-disable spaced-comment */
/// <reference types="react-scripts"/>
import { useEthers } from "@usedapp/core"
import { makeStyles } from "@material-ui/core"
import helperConfig from "../helper-config.json"
import networkMapping from "../chain-info/deployments/map.json"
import { constants } from "ethers"
import brownieConfig from "../brownie-config.json"
import eth from "../eth.png"
import { GeneralGraph } from "./graphs/GeneralGraph"
import { GeneralGraphEx } from "./graphs/GeneralGraphEx"
import { BtcUsdGraph } from "./graphs/BtcUsdGraph"
import { EthUsdGraph } from "./graphs/EthUsdGraph"
import { EthUsdEx } from "./graphs/EthUsdEx"
import { useVariablesOfToken } from "../hooks/useVariablesOfToken"
import { DisplayRate } from "./DisplayRate"
import { RegisterButton } from "./RegisterButton"
import { ExGraphs } from "./ExGraphs"

const useStyles = makeStyles((theme) => ({
    title: {
        color: theme.palette.primary.light,
        textAlign: "center",
        padding: theme.spacing(4)
    }
}))


export const Main = () => {
    //Show betToken values from the wallet

    //Get the address of different tokens
    //Get the balannce of the users wallet

    //send the brownie-config to our 'src' folder
    //send the build folder
    const classes = useStyles()
    const { chainId, error } = useEthers()
    const networkName = chainId ? helperConfig[chainId] : "dev"  //if chainId exists, call helperConfig[chainId]. if not, call 'dev'
    const wethTokenAddress = chainId ? brownieConfig["networks"][networkName]["weth_token"] : constants.AddressZero

    if (error) {
        console.log(error)
    }
    const supportedTokens = [
        {
            image: eth,
            address: wethTokenAddress,
            name: "WETH"
        }
    ]
    console.log(chainId)
    console.log(networkName)



    return (<>
        <h2 className={classes.title}>Crypt currencies Graphs</h2>
        <DisplayRate />
        <RegisterButton tokenAddress={wethTokenAddress} />
        <BtcUsdGraph />
        <GeneralGraph url="btc-eur" />
        <EthUsdGraph />
        <GeneralGraph url="eth-eur" />
        <ExGraphs tokenAddress={wethTokenAddress} />

    </>
    )
}