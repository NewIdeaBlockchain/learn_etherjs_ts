/* eslint-disable jest/valid-describe */
const { assert } = require("chai");

const Greeter = artifacts.require('./Greeter.sol')

contract("Greeter", (accounts) => {
  let greeter;

  before( async () => {
    greeter = await Greeter.deployed()
  })

  describe("deployment", async () => {
    it("deploys successfully", async () => {
      const address = await greeter.address
      assert.notEqual(address, 0x0);
    })

    it("has a name", async () => {
      const greet = await greeter.greet()
      assert.notEqual(greet, "");
    })
  })
})