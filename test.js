const abi = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        indexed: true,
        internalType: "string",
        name: "message",
        type: "string",
      },
    ],
    name: "messageSent",
    type: "event",
  },
  {
    inputs: [],
    name: "register",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_to",
        type: "address",
      },
      {
        internalType: "string",
        name: "_message",
        type: "string",
      },
    ],
    name: "sendMessage",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_user",
        type: "address",
      },
    ],
    name: "getAllMessages",
    outputs: [
      {
        internalType: "string[]",
        name: "",
        type: "string[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];

const contractAddress = "0x4310106d966ac77cD09e892Cf13941C8c7945E0c";

const button = document.querySelector("#connect");
const walletAddress = document.querySelector("#wallet-address");

let provider;
let defaultAccount;
let signer;

async function connectWallet() {
  if (window.ethereum && window.ethereum.isMetaMask) {
    try {
      provider = new ethers.providers.Web3Provider(window.ethereum);
      const accounts = await provider.send("eth_requestAccounts", []);
      defaultAccount = accounts[0];

      walletAddress.innerText = defaultAccount;
      button.innerText = "Wallet connected";
      signer = provider.getSigner();

      // read only
      const contract = new ethers.Contract(contractAddress, abi, provider);
      //   const allMessages = await contract.getAllMessages(
      //     "0x74754BDa28eF993bd0F0C0a049C6Ce2CeB02c7f1"
      //   );
      //   console.log(allMessages);

      //   Signers
      const signerContract = new ethers.Contract(contractAddress, abi, signer);
      //   const tx = await signerContract.sendMessage(
      //     "0x442e9945d179F93b56CD4fe62888B75A6183482b",
      //     "Heyy 2"
      //   );

      //   signerContract.on("messageSent", (from, to, message, event) => {
      //     console.log(`${from} sent ${message} to ${to}`);
      //   });

      /////////////////////////////////////////////////////

      const allMessages = await signerContract.getAllMessages(
        "0x74754BDa28eF993bd0F0C0a049C6Ce2CeB02c7f1"
      );
      console.log(allMessages);
    } catch (error) {
      console.log(error);
    }
  } else {
    alert("You need to install metamask first");
  }
}

button.addEventListener("click", connectWallet);
