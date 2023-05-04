const Web3 = require('web3');

// Replace with your own Ethereum node's URL or use a service like Infura (https://infura.io/)
const providerUrl = 'https://polygon-mumbai.g.alchemy.com/v2/I9k_EQCfvzjTOKfEp7EM2PJJ0HVYiNSK';
const web3 = new Web3(new Web3.providers.HttpProvider(providerUrl));

// Replace this with your own private key
const privateKey = '8efdc0791463c898a60b543d4800937023a1ad3d9046cc885806ebed5092b4ce';

async function interactWithContract(contractAddress, contractABI, methodName, ...args) {
  const account = web3.eth.accounts.privateKeyToAccount(privateKey);
  web3.eth.accounts.wallet.add(account);
  const contract = new web3.eth.Contract(contractABI, contractAddress);

  try {
    const method = contract.methods[methodName](...args).call();
    const gasPrice = await web3.eth.getGasPrice();
    const gasEstimate = await method.estimateGas({ from: account.address });

    const transaction = {
      to: contractAddress,
      data: method.encodeABI(),
      gas: gasEstimate,
      gasPrice,
    };

    const signedTx = await web3.eth.accounts.signTransaction(transaction, account.privateKey);
    const receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);

    return receipt;
  } catch (error) {
    console.error(`Error interacting with contract: ${error.message}`);
    return null;
  }
}

module.exports = interactWithContract;
