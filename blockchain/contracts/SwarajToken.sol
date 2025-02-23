// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract SwarajToken is ERC20, Ownable {
    constructor() ERC20("SwarajToken", "SWJ") Ownable(msg.sender) {
        _mint(msg.sender, 0 * 10 ** decimals()); // Initial supply
    }

    /**
     * @dev Distributes exactly 1 token to each recipient. Optionally sends ETH for gas fees.
     * @param recipients List of recipient addresses.
     */
    function batchTransfer(address[] calldata recipients) external onlyOwner {
        require(recipients.length > 0, "No recipients provided");
        require(recipients.length <= (balanceOf(msg.sender)/(10 ** decimals())), "Not enough tokens");
        for (uint256 i = 0; i < recipients.length; i++) {
            _transfer(msg.sender, recipients[i], 1 * 10 ** decimals());
            emit BatchTransfer(msg.sender, recipients[i], 1 * 10 ** decimals());
            payable(recipients[i]).transfer( 0.001 ether);
            emit GasSent(recipients[i],  0.001 ether);
        }
    }

    /**
     * @dev Burns 1 token from each specified holder.
     * @param holders List of addresses to burn tokens from.
     */
    function batchBurn(address[] calldata holders) external onlyOwner {
        require(holders.length > 0, "No holders provided");

        for (uint256 i = 0; i < holders.length; i++) {
            _burn(holders[i], 1 * 10 ** decimals());
            emit BatchBurn(holders[i], 1 * 10 ** decimals());
        }
    }

    /**
     * @dev Mints new tokens dynamically.
     * @param to Address receiving the minted tokens.
     * @param amount Number of tokens to mint.
     */
    function mint(address to, uint256 amount) external onlyOwner {
        require(to == owner(), "Minting allowed only to the contract owner");
        require(amount > 0, "Mint amount must be greater than zero");
        
        _mint(to, amount);
        emit Minted(to, amount);
    }

    /**
     * @dev Burns all tokens from the contract owner.
     */
    function burnAllTokens() external onlyOwner {
        uint256 supply = totalSupply();
        _burn(owner(), balanceOf(owner()));
        emit TokensBurned(supply);
    }

    /**
     * @dev Allows the contract owner to deposit ETH into the contract for gas assistance.
     */
    function depositGasFunds() external payable onlyOwner {
        emit GasFundsDeposited(msg.value);
    }

    /**
     * @dev Allows the owner to withdraw unused ETH from the contract.
     */
    function withdrawGasFunds(uint256 amount) external onlyOwner {
        require(address(this).balance >= amount, "Not enough funds");
        payable(owner()).transfer(amount);
        emit GasFundsWithdrawn(amount);
    }

    /**
     * @dev Events to log important actions.
     */
    event BatchTransfer(address indexed from, address indexed to, uint256 amount);
    event BatchBurn(address indexed holder, uint256 amount);
    event Minted(address indexed to, uint256 amount);
    event TokensBurned(uint256 totalSupplyBurned);
    event GasSent(address indexed recipient, uint256 amount);
    event GasFundsDeposited(uint256 amount);
    event GasFundsWithdrawn(uint256 amount);
}
