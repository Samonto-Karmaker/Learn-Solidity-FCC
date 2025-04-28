const { ethers } = require("hardhat");
const { assert, expect } = require("chai");

describe("SimpleStorage", function () {
    let simpleStorageFactory;
    let simpleStorage;
    beforeEach(async function () {
        // This code is run before each test
        simpleStorageFactory = await ethers.getContractFactory("SimpleStorage");
        simpleStorage = await simpleStorageFactory.deploy();
    })

    it("Should start with a favorite number of 0", async function () {
        const currentValue = await simpleStorage.retrieve();
        // as solidity returns a uint256 that becomes a bigInt, we should convert it to string
        const expectedValue = "0"; 
        assert.equal(currentValue.toString(), expectedValue);
        // expect(currentValue.toString()).to.equal(expectedValue); Same as above
    })
    it("Should update when we call store", async function () {
        const expectedValue = "7";
        const transactionResponse = await simpleStorage.store(expectedValue);
        await transactionResponse.wait(1);
        const currentValue = await simpleStorage.retrieve();
        assert.equal(currentValue.toString(), expectedValue);
        // expect(currentValue.toString()).to.equal(expectedValue); Same as above
    })
})