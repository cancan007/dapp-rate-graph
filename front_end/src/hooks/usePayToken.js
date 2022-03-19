import { useEthers, useContractFunction, TransactionStatus } from '@usedapp/core'
import CryptCurrencyRate from "../chain-info/contracts/CryptCurrencyRate.json"

import networkMapping from "../chain-info/deployments/map.json"
import { constants, utils } from "ethers"
import { Contract } from "@ethersproject/contracts"




export const usePayToken = (tokenAddress) => {
    const { account, chainId } = useEthers()
    const { abi } = CryptCurrencyRate
    const cryptCurrencyRateAddress = chainId ? networkMapping[String(chainId)]["CryptCurrencyRate"][0] : constants.AddressZero
    const cryptCurrencyRateInterface = new utils.Interface(abi)
    const cryptCurrencyRateContract = new Contract(cryptCurrencyRateAddress, cryptCurrencyRateInterface)

    const { send: registerCusSend, state: registerCusState } = useContractFunction(
        cryptCurrencyRateContract, "registerCustomer", {
        transactionName: "Pay token to register customer"
    }
    )


    return { registerCusState, registerCusSend }

}