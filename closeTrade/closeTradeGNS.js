const Web3 = require('web3');

const path = require("path");
const fs = require("fs");

const abiPath = path.resolve("contractABI/GNSTradingContract.json");  
const rawData = fs.readFileSync(abiPath);  
const contractAbi = JSON.parse(rawData);

// setup provider
const providerUrl = 'https://polygon-mumbai.g.alchemy.com/v2/I9k_EQCfvzjTOKfEp7EM2PJJ0HVYiNSK';
const web3 = new Web3(new Web3.providers.HttpProvider(providerUrl));

// setup account
const privateKey = '';


async function closeTradeGNS(pairIndex, tradeIndex) {
    
    const account = web3.eth.accounts.privateKeyToAccount(privateKey);
    web3.eth.accounts.wallet.add(account);

    const contract = new web3.eth.Contract(contractAbi, '0xcDCB434D576c5B1CF387cB272756199B7E72C44d');

    try {
        contract.methods.closeTradeMarket(pairIndex, tradeIndex).send({ from: account, gasLimit: '5000000', transactionBlockTimeout: 200});

    } catch (error) {
        console.log(error);
    }
}

module.exports = closeTradeGNS;