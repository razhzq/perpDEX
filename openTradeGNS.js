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
const privateKey = '8efdc0791463c898a60b543d4800937023a1ad3d9046cc885806ebed5092b4ce';

const readFromContract = require('./getGNSprice');
const gnsabiPath = path.resolve("contractABI/GNSPrice.json");  
const gnsrawData = fs.readFileSync(gnsabiPath);  
const pricecontractAbi = JSON.parse(gnsrawData);


async function openTradeGNS() {

    const price = await readFromContract("0xc907E116054Ad103354f2D350FD2514433D57F6f", pricecontractAbi);
    console.log(price)


     const account = web3.eth.accounts.privateKeyToAccount(privateKey);
     web3.eth.accounts.wallet.add(account);
     const contract = new web3.eth.Contract(contractAbi, '0xDAFa580585d2849088a5212F729adFe9b9512413');

     const convPrice = (price / 1e8)
     console.log(convPrice)
     const tp = convPrice + (0.01 * convPrice * (15/5));
     const tpConv = parseFloat(tp).toFixed(4);

     console.log(`tp: ${tpConv}`);


     const contractPrice = (price * 1e2);
     const contractTp = (tpConv * 1e10);

     console.log(`openPrice: ${contractPrice}`)
     console.log(`contractp: ${contractTp}`)

     const tradeTuple = {
        'trader': '0x6E7aD7BC0Bf749c87F59E8995c158cDa08b7E657',
        'pairIndex': 0,
        'index': 0,
        'initialPosToken': 0,
        'positionSizeDai': '2000000000000000000000',  // collateral in 1e18
        'openPrice': contractPrice,
        'buy': true,
        'leverage': 5,  //leverage adjustable by slider on frontend
        'tp': contractTp,
        'sl': 0
     }


     try {
       
        const trade = contract.methods.openTrade(tradeTuple, 0, 0, '30000000000', '0x0000000000000000000000000000000000000000').send({ from: '0x6E7aD7BC0Bf749c87F59E8995c158cDa08b7E657', gasLimit: '5000000', transactionBlockTimeout: 200});

     } catch (error) {
        console.log(error);
     }
}

openTradeGNS();
