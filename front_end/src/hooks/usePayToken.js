import { useEthers, useContractFunction, TransactionStatus } from '@usedapp/core'
import CryptCurrencyRate from "../chain-info/contracts/CryptCurrencyRate.json"
import ERC20 from "../chain-info/contracts/MockWETH.json"

import networkMapping from "../chain-info/deployments/map.json"
import { constants, utils } from "ethers"
import { Contract } from "@ethersproject/contracts"
import { useState, useEffect } from "react"




export const usePayToken = (tokenAddress) => {
    const { account, chainId } = useEthers()
    const { abi } = CryptCurrencyRate
    const cryptCurrencyRateAddress = chainId ? networkMapping[String(chainId)]["CryptCurrencyRate"][0] : constants.AddressZero
    const cryptCurrencyRateInterface = new utils.Interface(abi)
    const cryptCurrencyRateContract = new Contract(cryptCurrencyRateAddress, cryptCurrencyRateInterface)

    const erc20ABI = ERC20.abi  // or {abi} = ERC20
    const erc20Interface = new utils.Interface(erc20ABI)
    const erc20Contract = new Contract(tokenAddress, erc20Interface)

    const { send: approveErc20Send, state: approveErc20State } =
        useContractFunction(erc20Contract, "approve", {
            transactionName: "Approve ERC20 transfer"
        })

    const approveSetRegister = (amount) => {
        setAmountToBet(amount)
        return approveErc20Send(cryptCurrencyRateAddress, amount)
    }


    const { send: registerCusSend, state: registerCusState } = useContractFunction(
        cryptCurrencyRateContract, "registerCustomer", {
        transactionName: "Pay token to register customer"
    }
    )

    const [amountToBet, setAmountToBet] = useState("0")
    //useEffect: if this state is Success, betSend work
    useEffect(() => {
        if (approveErc20State.status === "Success") {
            // bet func
            registerCusSend(tokenAddress, amountToBet)
        }
    }, [approveErc20State, amountToBet, tokenAddress])

    const [state, setState] = useState(approveErc20State)

    useEffect(() => {
        if (approveErc20State.status === "Success") {
            setState(registerCusState)
        } else {
            setState(approveErc20State)
        }
    }, [approveErc20State, registerCusState])


    return { approveSetRegister, state }

}