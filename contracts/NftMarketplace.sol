// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

error NftMarketplace__PriceMustBeAboveZero();
error NftMarketplace__NotApprovedForMarketplace();
error NftMarketplace__AlreadyListed(address nftAddress, uint256 tokenId);
error NftMarketplace__NotOwner();

contract NftMarketplace {
    // Type declaration
    struct Listing {
        uint256 price;
        address seller;
    }

    // Events
    event ItemListed(
        address indexed seller,
        address indexed nftAddress,
        uint256 indexed tokenId,
        uint256 price
    );

    // NFT contract address -> NFT tokenId -> Listing
    mapping(address => mapping(uint256 => Listing)) private s_listings;

    ////////////////
    // Modifiers //
    ///////////////

    modifier notListed(
        address nftAddress,
        uint256 tokenId,
        address owner
    ) {
        Listing memory listing = s_listings[nftAddress][tokenId];
        if (listing.price > 0) {
            revert NftMarketplace__AlreadyListed(nftAddress, tokenId);
        }
        _;
    }

    modifier isOwner(
        address nftAddress,
        uint256 tokenId,
        address spender
    ) {
        IERC721 nft = IERC721(nftAddress);
        address owner = nft.ownerOf(tokenId);
        if (spender != owner) {
            revert NftMarketplace__NotOwner();
        }
        _;
    }

    /////////////////////
    // Main Functions //
    ////////////////////

    /**
     * @notice Method for listing your NFT on the Marketplace
     * @param nftAddress: Address of the NFT contract
     * @param tokenId: Token ID of the NFT
     * @param price: Price of the NFT, you want to list
     * @dev Technically, we could have the contract be the escrow for the NFTs
     * but this way, owner can still hold the NFT while it is listed on Marketplace
     */
    function listItem(
        address nftAddress,
        uint256 tokenId,
        uint256 price
    ) external notListed(nftAddress, tokenId, msg.sender) isOwner(nftAddress, tokenId, msg.sender) {
        if (price <= 0) {
            revert NftMarketplace__PriceMustBeAboveZero();
        }
        // one of two ways
        // 1. Send the NFT to the contract. Transfer -> Contract "hold" the NFT.
        // 2. Owners can still "hold" their NFTs, and give the marketplace approval
        // to sell the NFT for them.
        IERC721 nft = IERC721(nftAddress);
        if (nft.getApproved(tokenId) != address(this)) {
            revert NftMarketplace__NotApprovedForMarketplace();
        }
        s_listings[nftAddress][tokenId] = Listing(price, msg.sender);
        emit ItemListed(msg.sender, nftAddress, tokenId, price);
    }
}

//  * `listItem`: List NFTs on marketplace
//  * `buyItem`: Buy the NFTs
//  * `cancelItem`: Cancel a listing
//  * `updateListing`: Update price
//  * `withdrawProceeds`: Withdraw payment for my bought NFTs
