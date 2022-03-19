import { useEthers, useContractCall, useCall } from '@usedapp/core'
import CryptCurrencyRate from "../chain-info/contracts/CryptCurrencyRate.json"

import networkMapping from "../chain-info/deployments/map.json"
import { constants, utils } from "ethers"
import { Contract } from "@ethersproject/contracts"




export const useVariablesOfToken = (tokenAddress) => {
    const { account, chainId } = useEthers()
    const { abi } = CryptCurrencyRate
    const cryptCurrencyRateAddress = chainId ? networkMapping[String(chainId)]["CryptCurrencyRate"][0] : constants.AddressZero
    const cryptCurrencyRateInterface = new utils.Interface(abi)
    const cryptCurrencyRateContract = new Contract(cryptCurrencyRateAddress, cryptCurrencyRateInterface)

    const [payedTokenAmount] = useContractCall({
        abi: cryptCurrencyRateInterface,
        address: cryptCurrencyRateAddress,
        method: "payedTokenAmount",
        args: [tokenAddress]
    }) ?? []

    function useGetPriceFeed() {
        const { value, error } = useCall({
            contract: cryptCurrencyRateContract,
            method: "tokenPriceFeeds",
            args: [tokenAddress]
        }) ?? {}
        if (error) {
            console.error(error.message)
        }
        return value?.[0]
    }

    function usePayedTokenAmount() {
        const { value, error } = useCall({
            contract: cryptCurrencyRateContract,
            method: "payedTokenAmount",
            args: [tokenAddress]
        }) ?? {}
        if (error) {
            console.error(error.message)
        }
        return value?.[0]
    }

    const [convertionRate] = useContractCall({
        abi: cryptCurrencyRateInterface,
        address: cryptCurrencyRateAddress,
        method: "getConvertionRate",
        args: [tokenAddress, 10 ** 18]
    }) ?? []

    function useConvertionRate(amount) {
        const { value, error } = useCall({
            contract: cryptCurrencyRateContract,
            method: "getConvertionRate",
            args: [tokenAddress, amount]
        }) ?? {}
        if (error) {
            console.error(error.message)
        }
        return value?.[0]
    }

    function useGetTokenValue() {
        const { value, error } = useCall({
            contract: cryptCurrencyRateContract,
            method: "getTokenValue",
            args: [tokenAddress]
        }) ?? {}
        if (error) {
            console.error(error.message)
        }
        return value?.[0]
    }

    return { payedTokenAmount, usePayedTokenAmount, convertionRate, useConvertionRate, useGetPriceFeed, useGetTokenValue }
}