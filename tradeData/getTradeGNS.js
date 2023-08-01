const Web3 = require('web3');

const Web3 = require('web3');

const path = require("path");
const fs = require("fs");


// storage contract 
const abiPath = path.resolve("contractABI/GNSStorage.json");  
const rawData = fs.readFileSync(abiPath);  
const contractAbi = JSON.parse(rawData);

storageContractAddress = '';


const providerUrl = 'https://polygon-mumbai.g.alchemy.com/v2/I9k_EQCfvzjTOKfEp7EM2PJJ0HVYiNSK';
const web3 = new Web3(new Web3.providers.HttpProvider(providerUrl));


async function getTradeGNS(address, pairID) {

    const contract = new web3.eth.Contract(contractAbi, storageContractAddress);

    try{
        const tradeList = await contract.methods.openTradesCount(address, pairID).call();
        return tradeList;
    } catch (error) {
        console.log(error)
    }

   
}

module.exports = getTradeGNS;