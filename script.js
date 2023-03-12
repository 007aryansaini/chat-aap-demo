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
        indexed: false,
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
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
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
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "registered",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];
const contractAddress = "0x746E3dAf6Bb9c367f6140c1Be0387770DF756331";
let defaultAccount;
let provider;
let contract;

// DOM Selectors
const walletConnectBtn = document.querySelector("#connect");
const walletAddress = document.querySelector("#wallet-address");
const registerBtn = document.querySelector("#regiter");
const sendBtn = document.querySelector("#send");
const textMessage = document.querySelector("#input");
const textAddress = document.querySelector("#address");
const container = document.querySelector("#container");
const getMsgBtn = document.querySelector("#getMessages");

// Connect to Metamask function
async function connectWallet() {
  if (window.ethereum && window.ethereum.isMetaMask) {
    try {
      // Metasmak connect
      provider = new ethers.providers.Web3Provider(window.ethereum);
      const accounts = await provider.send("eth_requestAccounts", []);
      defaultAccount = accounts[0];

      walletAddress.innerText = defaultAccount;
      walletConnectBtn.innerText = "Wallet connected";

      // Getting Signer
      const signer = provider.getSigner();

      // initializing Contract
      contract = new ethers.Contract(contractAddress, abi, signer);
    } catch (error) {
      console.log(error);
    }
  } else {
    alert("You need to install metamask first");
  }
}

// Function to register user
async function registerUser() {
  try {
    const isRegistered = await contract.registered(defaultAccount);
    if (isRegistered) {
      registerBtn.innerText = "Registered";
      await getMessages();
    } else {
      await contract.register();

      registerBtn.innerText = "Registered";
    }
  } catch (error) {
    console.log(error.meesage);
  }
}

// function to send message
async function sendMessage(event) {
  event.preventDefault();

  const message = textMessage.value;
  const address = textAddress.value;
  textAddress.value = "";
  textMessage.value = "";

  if (message !== "" && address !== "") {
    try {
      await contract.sendMessage(address, message);

      contract.on("messageSent", (from, to, message) => {
        const li = document.createElement("li");
        li.textContent = message;
        container.appendChild(li);
      });
    } catch (error) {
      console.log(error);
    }
  } else {
    alert("Invald address or message");
  }
}

// Function to get All Messages

async function getMessages() {
  try {
    const messages = await contract.getAllMessages(defaultAccount);

    messages.forEach((item) => {
      const li = document.createElement("li");

      li.textContent = item;

      container.appendChild(li);
    });
  } catch (error) {
    console.log(error);
  }
}

// Event listners
walletConnectBtn.addEventListener("click", connectWallet);
registerBtn.addEventListener("click", registerUser);
sendBtn.addEventListener("click", sendMessage);
