// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol"; // to create my own token or make available the token on smart contract
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol"; // to get current rate of currencies

contract CryptCurrencyRate is Ownable {
    // Basically most of variables are from _token

    mapping(address => address) public tokenPriceFeeds;
    mapping(address => uint256) public payedTokenAmount;
    address[] public customers;
    address[] public allowedTokens;

    function allowToken(address _token) public onlyOwner {
        allowedTokens.push(_token);
    }

    function tokenIsAllowed(address _token) public returns (bool) {
        for (uint256 index = 0; index < allowedTokens.length; index++) {
            if (allowedTokens[index] == _token) {
                return true;
            }
        }
        return false;
    }

    function setPriceFeed(address _token, address _priceFeed) public onlyOwner {
        tokenPriceFeeds[_token] = _priceFeed;
    }

    function getTokenValue(address _token)
        public
        view
        returns (uint256, uint256)
    {
        address priceFeedAddress = tokenPriceFeeds[_token];
        AggregatorV3Interface priceFeed = AggregatorV3Interface(
            priceFeedAddress
        );
        (
            uint80 roundID,
            int256 price,
            uint256 startedAt,
            uint256 timeStamp,
            uint80 answeredInRound
        ) = priceFeed.latestRoundData();
        uint256 decimal = uint256(priceFeed.decimals());
        return (uint256(price), decimal);
    }

    // In solidity, we can't use decimal
    function getConvertionRate(address _token, uint256 _amount)
        public
        view
        returns (uint256)
    {
        //uint256 productPrice = 50 * 10 ** 18;

        (uint256 price, uint256 decimal) = getTokenValue(_token);
        uint256 need_token = (_amount * (10**decimal)) / price; // Don't make any decimal during calculating like '(_amount / price)*10**decimal'
        return need_token;
    }

    function registerCustomer(address _token, uint256 _amount) public {
        require(
            _amount >= getConvertionRate(_token, 50 * 10**8), // 10**18 or 10**8
            "You have to pay over 50USD."
        );
        require(tokenIsAllowed(_token), "This token is not allowed.");
        IERC20(_token).transferFrom(msg.sender, address(this), _amount);
        payedTokenAmount[_token] += _amount;
        customers.push(msg.sender);
    }

    function getRevenue(address _token, uint256 _amount) public onlyOwner {
        require(
            _amount <= payedTokenAmount[_token],
            "You don't have the amount of token."
        );
        require(tokenIsAllowed(_token), "This token is not allowed.");
        IERC20(_token).transfer(msg.sender, _amount);
        payedTokenAmount[_token] -= _amount;
    }

    function customerIsAllowed(address _customer) public view returns (bool) {
        for (uint256 index = 0; index < customers.length; index++) {
            if (customers[index] == _customer) {
                return true;
            }
        }
        return false;
    }
}
