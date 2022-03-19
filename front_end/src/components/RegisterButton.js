import { usePayToken } from "../hooks/usePayToken"
import { constants, utils } from "ethers"
import { Button, CircularProgress } from "@material-ui/core"
import { useVariables } from "../hooks/useVariables"
import { useVariablesOfToken } from "../hooks/useVariablesOfToken"





export const RegisterButton = (props) => {
    const { registerCusSend, registerCusState } = usePayToken(props.tokenAddress)
    const { useCustomerIsAllowed } = useVariables()
    const { useConvertionRate } = useVariablesOfToken(props.tokenAddress)
    const price = useConvertionRate(50 * 10 ** 8)
    console.log(price)
    const cusIsAllowed = useCustomerIsAllowed()
    const isMining = registerCusState.status === "Mining";

    const register = (amount) => {
        return registerCusSend(props.tokenAddress, amount)
    }

    const amount = 50;

    const handleRegisterSubmit = () => {
        //const amountAsWei = utils.parseEther(amount.toString())
        return register(price.toString())
    }

    if (props.tokenAddress === constants.AddressZero) {
        return (<></>)
    }
    else if (cusIsAllowed) {
        return (<div>You are already allowed!</div>)
    }
    else {
        return (<Button color='primary' size="large" variant="contained" disabled={isMining} onClick={handleRegisterSubmit}>
            {isMining ? <CircularProgress size={26} /> : "Pay and Predict!"}</Button>)
    }
}