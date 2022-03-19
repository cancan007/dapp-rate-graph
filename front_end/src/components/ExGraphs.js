import { EthUsdEx } from "./graphs/EthUsdEx"
import { GeneralGraphEx } from "./graphs/GeneralGraphEx"
import { useVariables } from "../hooks/useVariables"


export const ExGraphs = (props) => {
    const { useCustomerIsAllowed } = useVariables(props.tokenAddress);
    const cusIsAllowed = useCustomerIsAllowed();

    if (cusIsAllowed) {
        return (<>
            <GeneralGraphEx url="btc-usd" />
            <EthUsdEx /></>)
    }
    else {
        return (<div>Pay and predict rates!</div>)
    }
}