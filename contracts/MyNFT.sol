// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.1;


import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "hardhat/console.sol";

// We need to import the helper functions from the contract that we copy/pasted.
import { Base64 } from "./libraries/Base64.sol";

contract MyEpicNFT is ERC721URIStorage{
    event NewEpicNFTMinted(address sender, uint256 tokenId);
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    // We need to pass the name of our NFTs token and its symbol.
    constructor() ERC721 ("SquareNFT", "SQUARE") {
        console.log("This is my NFT contract. Woah!");
    }

    string baseSvg = "<svg xmlns='http://www.w3.org/2000/svg' preserveAspectRatio='xMinYMin meet' viewBox='0 0 350 350'><style>.base { fill: white; font-family: serif; font-size: 24px; }</style><rect width='100%' height='100%' fill='black' /><text x='50%' y='50%' class='base' dominant-baseline='middle' text-anchor='middle'>";
    string main_sentence = "I am ";
    string[] firstWords = ["Ironman", "Thor", "Spiderman", "Captain-America"];

    // A function our user will hit to get their NFT.
    function makeAnEpicNFT(uint index) public {
        // Get the current tokenId, this starts at 0.
        uint256 newItemId = _tokenIds.current();
        console.log("Minted token %s for user %s!", newItemId, msg.sender);
        string memory finalSvg = string(abi.encodePacked(baseSvg, main_sentence, firstWords[index], "</text></svg>"));

        // Get all the JSON metadata in place and base64 encode it.
        string memory json = Base64.encode(
            bytes(
                string(
                    abi.encodePacked(
                        '{"name": "',
                    // We set the title of our NFT as the generated word.
                            string(abi.encodePacked(main_sentence, firstWords[index])),
                        '", "description": "A highly acclaimed collection of squares.", "image": "data:image/svg+xml;base64,',
                    // We add data:image/svg+xml;base64 and then append our base64 encode our svg.
                        Base64.encode(bytes(finalSvg)),
                        '"}'
                    )
                )
            )
        );

        // Just like before, we prepend data:application/json;base64, to our data.
        string memory finalTokenUri = string(
            abi.encodePacked("data:application/json;base64,", json)
        );

        // Actually mint the NFT to the sender using msg.sender.
        _safeMint(msg.sender, newItemId);

        // Set the NFTs data.
        _setTokenURI(newItemId, finalTokenUri);

        // Increment the counter for when the next NFT is minted.
        _tokenIds.increment();
        emit NewEpicNFTMinted(msg.sender, newItemId);
    }
}