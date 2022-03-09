from scripts.helpful_scripts import LOCAL_BLOCKCHAIN_ENVIRONMENTS, get_account, get_contract, INITIAL_PRICE_FEED_VALUE
from brownie import network, exceptions
import pytest
from scripts.deploy import deploy_CryptCurrencyRate
import time


def test_allowed_tokens():
    #Arrange
    if network.show_active() not in LOCAL_BLOCKCHAIN_ENVIRONMENTS:
        pytest.skip('Only for local testing!')
    account = get_account()
    non_owner = get_account(index=1)
    ccr = deploy_CryptCurrencyRate()
    weth_token = get_contract('weth_token')
    weth_price_feed = get_contract('eth_usd_price_feed')
    # Act, Assert
    assert ccr.tokenPriceFeeds(weth_token.address) == weth_price_feed.address
    with pytest.raises(exceptions.VirtualMachineError): # valid onlyOwner is working
        ccr.setPriceFeed(get_contract('weth_token').address, get_contract('eth_usd_price_feed'), {'from': non_owner})
    return ccr, weth_token

def test_money_move(amount_staked):
    #Arrange
    if network.show_active() not in LOCAL_BLOCKCHAIN_ENVIRONMENTS:
        pytest.skip('Only for local testing!')
    account = get_account()
    customer = get_account(index=1)
    #customer2 = get_account(index=2)
    ccr, weth_token = test_allowed_tokens()
    price, decimal = ccr.getTokenValue(weth_token.address)
    print(f'Price: {price}, Decimal: {decimal}')
    need_token = ccr.getConvertionRate(weth_token.address, 50*amount_staked)
    print(f'REQUIRE_WETH: {need_token / amount_staked}')
    weth_token.transfer(customer, 0.024 * amount_staked, {'from': account})
    #weth_token.transfer(customer2, 0.024 * amount_staked, {'from': account})
    weth_token.approve(ccr.address, 0.025*amount_staked, {'from': account})
    ccr.registerCustomer(weth_token.address, 0.025*amount_staked, {'from': account})
    ccr_revenue = ccr.payedTokenAmount(weth_token.address)
    #print(f'Before_CCR_REVENUE: {ccr_revenue}')
    account_weth_balance = weth_token.balanceOf(account.address)
    #print(f'Before balance: {account_weth_balance}')
    ccr.getRevenue(weth_token.address, ccr_revenue ,{'from':account})
    assert need_token == 0.025 * amount_staked
    assert ccr.customers(0) == account
    with pytest.raises(exceptions.VirtualMachineError):
        weth_token.approve(ccr.address, 0.024*amount_staked, {'from': customer.address})
        ccr.registerCustomer(weth_token.address, 0.024*amount_staked, {'from': customer.address})
    assert weth_token.balanceOf(account.address) == account_weth_balance + ccr_revenue
    assert ccr.payedTokenAmount(weth_token.address) == 0
    assert ccr.customerIsAllowed(account.address) == True
