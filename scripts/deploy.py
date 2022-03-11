from scripts.helpful_scripts import get_account, get_contract
from brownie import CryptCurrencyRate, network, config
from web3 import Web3
import yaml
import json
import os
import shutil

def deploy_CryptCurrencyRate(front_end_update=False):
    account = get_account()
    ccr = CryptCurrencyRate.deploy({'from': account}, publish_source=config['networks'][network.show_active()].get('verify', False))
    weth_token = get_contract('weth_token')
    dict_of_allowed_tokens = {
        weth_token: get_contract('eth_usd_price_feed')
    }
    add_allowed_tokens(ccr, dict_of_allowed_tokens, account)
    if front_end_update:
        update_front_end()
    return ccr


def add_allowed_tokens(ccr, dict_of_allowed_tokens, account):
    for token in dict_of_allowed_tokens:
        add_tx = ccr.allowToken(token.address, {'from':account})
        add_tx.wait(1)
        set_tx = ccr.setPriceFeed(token.address, dict_of_allowed_tokens[token], {"from":account})
        set_tx.wait(1)
    return ccr

def update_front_end():
    #Send the build folder
    copy_folders_to_front_end("./build", './front_end/src/chain-info')
    #Sending the front end our config JSON format
    with open('brownie-config.yaml', 'r') as brownie_config:
        config_dict = yaml.load(brownie_config, Loader=yaml.FullLoader)
        with open('./front_end/src/brownie-config.json', 'w') as brownie_config_json:
            json.dump(config_dict, brownie_config_json)
    print('Front end Updated!')

def copy_folders_to_front_end(src, dest):
    if os.path.exists(dest):
        shutil.rmtree(dest)
    shutil.copytree(src, dest)

def main():
    deploy_CryptCurrencyRate(front_end_update=True)