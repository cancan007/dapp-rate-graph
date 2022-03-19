import { useEthers, useContractCall, useCall } from '@usedapp/core'
import CryptCurrencyRate from "../chain-info/contracts/CryptCurrencyRate.json"

import networkMapping from "../chain-info/deployments/map.json"
import { constants, utils } from "ethers"
import { Contract } from "@ethersproject/contracts"

export const useVariables = () => {
    const { account, chainId } = useEthers()
    const { abi } = CryptCurrencyRate
    const cryptCurrencyRateAddress = chainId ? networkMapping[String(chainId)]["CryptCurrencyRate"][0] : constants.AddressZero
    const cryptCurrencyRateInterface = new utils.Interface(abi)
    const cryptCurrencyRateContract = new Contract(cryptCurrencyRateAddress, cryptCurrencyRateInterface)

    function useCustomerIsAllowed() {
        const { value, error } = useCall({
            contract: cryptCurrencyRateContract,
            method: "customerIsAllowed",
            args: [account]
        }) ?? {}
        if (error) {
            console.error(error.message)
        }
        return value?.[0]
    }

    return { useCustomerIsAllowed }
}