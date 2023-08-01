const Web3 = require('web3');

const Web3 = require('web3');

const path = require("path");
const fs = require("fs");


// storage contract 
const abiPath = path.resolve("contractABI/GMXReader.json");  
const rawData = fs.readFileSync(abiPath);  
const contractAbi = JSON.parse(rawData);

storageContractAddress = '';


const providerUrl = 'https://polygon-mumbai.g.alchemy.com/v2/I9k_EQCfvzjTOKfEp7EM2PJJ0HVYiNSK';
const web3 = new Web3(new Web3.providers.HttpProvider(providerUrl));


async function getTradeGMX() {

    const contract = new web3.eth.Contract(contractAbi, storageContractAddress);

    try {
    
        const tradeList = await contract.methods.getPositions('0x489ee077994B6658eAfA855C308275EAd8097C4A',  // arbitrum vault 
                                                               '',   // user address
                                                               [''], //  array of collateralToken 
                                                               [''], // array of indexToken
                                                               true   // boolean isLong trades                                       
                                                               ).call()
                                                                 
        return tradeList;

    } catch (error) {
        console.log(error);
    }
}
