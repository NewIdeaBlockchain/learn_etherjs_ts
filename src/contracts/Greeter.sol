//SPDX-License-Identifier: Unlicense
pragma solidity >=0.4.21 <0.9.0;


contract Greeter {
  string greeting;

  constructor() public {
    // console.log("Deploying a Greeter with greeting:", _greeting);
    greeting = "Hello Hero";
  }

  function greet() public view returns (string memory) {
    return greeting;
  }

  function setGreeting(string memory _greeting) public {
    // console.log("Changing greeting from '%s' to '%s'", greeting, _greeting);
    greeting = _greeting;
  }
}