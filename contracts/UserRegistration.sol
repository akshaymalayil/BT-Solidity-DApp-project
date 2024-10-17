// SPDX-License-Identifier: MIT
pragma solidity ^0.5.16;

contract UserRegistration {
    struct User {
        string name;
        string email;
        bool exists;
    }

    mapping(address => User) private users;

    event UserRegistered(address indexed userAddress, string name, string email);

    // Function to register a new user
    function registerUser(string memory _name, string memory _email) public {
        require(!users[msg.sender].exists, "User already registered!");

        users[msg.sender] = User({
            name: _name,
            email: _email,
            exists: true
        });

        emit UserRegistered(msg.sender, _name, _email);
    }

    // Function to get user details
    function getUser(address _userAddress) public view returns (string memory name, string memory email) {
        require(users[_userAddress].exists, "User does not exist!");
        User memory user = users[_userAddress];
        return (user.name, user.email);
    }

    // Check if the user is registered
    function isUserRegistered(address _userAddress) public view returns (bool) {
        return users[_userAddress].exists;
    }
}
