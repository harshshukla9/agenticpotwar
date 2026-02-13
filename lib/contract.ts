export const contractAddress = "0x48EC263A114Ce28924a118B56dBD32CFDd05820c";

/** Arbitrum One – contract is deployed here; reads must use this chain */
export const contractChainId = 42161;

export const contractABI = [
    {
      "inputs": [],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "potId",
          "type": "uint256"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "bidder",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        }
      ],
      "name": "BidPlaced",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "potId",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "address",
          "name": "winner",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "winnerAmount",
          "type": "uint256"
        }
      ],
      "name": "PotEnded",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "potId",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "newEndTime",
          "type": "uint256"
        }
      ],
      "name": "PotExtended",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "potId",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "endTime",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "initialFund",
          "type": "uint256"
        }
      ],
      "name": "PotStarted",
      "type": "event"
    },
    {
      "inputs": [],
      "name": "admin",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "antiSnipeTime",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "antiSnipeWindow",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "currentPotId",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_potId",
          "type": "uint256"
        }
      ],
      "name": "endPot",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getCurrentPotDetails",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "potId",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "totalFunds",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "endTime",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "timeRemaining",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "lastBidAmount",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "minimumNextBid",
          "type": "uint256"
        },
        {
          "internalType": "address",
          "name": "lastBidder",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "topContributor",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "topContributorAmount",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "participantCount",
          "type": "uint256"
        },
        {
          "internalType": "bool",
          "name": "isActive",
          "type": "bool"
        },
        {
          "internalType": "bool",
          "name": "hasEnded",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_potId",
          "type": "uint256"
        }
      ],
      "name": "getLeaderboard",
      "outputs": [
        {
          "internalType": "address[]",
          "name": "users",
          "type": "address[]"
        },
        {
          "internalType": "uint256[]",
          "name": "amounts",
          "type": "uint256[]"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "minIncrementPercent",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "minStartBid",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_potId",
          "type": "uint256"
        }
      ],
      "name": "participate",
      "outputs": [],
      "stateMutability": "payable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_duration",
          "type": "uint256"
        }
      ],
      "name": "startPot",
      "outputs": [],
      "stateMutability": "payable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_minStartBid",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "_incrementPercent",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "_antiSnipeTime",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "_antiSnipeWindow",
          "type": "uint256"
        }
      ],
      "name": "updateGameSettings",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "stateMutability": "payable",
      "type": "receive"
    }
  ];