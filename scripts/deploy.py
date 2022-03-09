from scripts.helpful_scripts import get_account, get_contract
from brownie import CryptCurrencyRate, network, config
from web3 import Web3
import yaml
import json
import os
import shutil

def deploy_CryptCurrencyRate():
    account = get_account()
    ccr = CryptCurrencyRate.deploy({'from': account}, publish_source=config['networks'][network.show_active()].get('verify', False))
    weth_token = get_contract('weth_token')
    dict_of_allowed_tokens = {
        weth_token: get_contract('eth_usd_price_feed')
    }
    add_allowed_tokens(ccr, dict_of_allowed_tokens, account)
    return ccr





def add_allowed_tokens(ccr, dict_of_allowed_tokens, account):
    for token in dict_of_allowed_tokens:
        add_tx = ccr.allowToken(token.address, {'from':account})
        add_tx.wait(1)
        set_tx = ccr.setPriceFeed(token.address, dict_of_allowed_tokens[token], {"from":account})
        set_tx.wait(1)
    return ccr

def main():
    deploy_CryptCurrencyRate()