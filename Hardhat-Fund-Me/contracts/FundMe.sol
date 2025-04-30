// SPDX-License-Identifier: MIT
pragma solidity ^0.8.8;

import "./PriceConverter.sol";

error FundMe__NotOwner();

contract FundMe {
    using PriceConverter for uint256;

    uint256 public constant MINIMUM_FUND_USD = 1 * 1e18;
    address public immutable i_owner;

    mapping(address => uint256) public addressToAmountFunded;
    address[] public funders;

    AggregatorV3Interface private priceFeed;

    constructor(address priceFeedAddress) {
        i_owner = msg.sender;
        priceFeed = AggregatorV3Interface(priceFeedAddress);
    }

    modifier onlyOwner() {
        if (msg.sender != i_owner) {
            revert FundMe__NotOwner();
        }
        _;
    }

    function fund() public payable {
        require(msg.value.getConversionRate(priceFeed) >= MINIMUM_FUND_USD, "Amount too low");
        addressToAmountFunded[msg.sender] += msg.value;
        funders.push(msg.sender);
    }

    function withdraw() public onlyOwner {
        for (uint256 i = 0; i < funders.length; i++) {
            address funder = funders[i];
            addressToAmountFunded[funder] = 0;
        }
        funders = new address[](0);

        (bool success, ) = payable(msg.sender).call{value: address(this).balance}("");
        require(success, "Failed to withdraw money");
    }

    function getPriceFeed() public view returns (address) {
        return address(priceFeed);
    }

    // What if users try to fund us without calling the fund function?
    // e.g. Sending Ether through MetaMask?
    // To handle this issue, we need a receive function
    receive() external payable { 
        fund();
    }

    // What if a user sends data or makes a mistake in the function name?
    // Fallback catches such unmatched calls and still funds the contract
    fallback() external payable {
        fund();
    }
}