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

//erc20 contract 
const stableContractPath = path.resolve("contractABI/DAIcontract.json");
const stableRawData = fs.readFileSync(stableContractPath);
const stableContractABI = JSON.parse(stableRawData);

const pairIDandContract = [

   { // BTC/USD
      assetID: 0,
      contractAddress: '0xc907E116054Ad103354f2D350FD2514433D57F6f'
   },
   { // ETH/USD
      assetID: 1,
      contractAddress: '0xF9680D99D6C9589e2a93a78A04A279e509205945'
   },
   { // LINK/USD
      assetID: 2,
      contractAddress: '0xd9FFdb71EbE7496cC440152d43986Aae0AB76665'
   },
   { // UNI/USD
      assetID: 17,
      contractAddress: '0xdf0Fb4e4F928d2dCB76f438575fDD8682386e13C'
   }
]


async function openTradeGNS() {

    const price = await readFromContract("0xdf0Fb4e4F928d2dCB76f438575fDD8682386e13C", pricecontractAbi);
    console.log(price)


     const account = web3.eth.accounts.privateKeyToAccount(privateKey);
     web3.eth.accounts.wallet.add(account);
   //   const contract = new web3.eth.Contract(contractAbi, '0xb3B13d3741A48876323C7cC17C5C6c47bcA223DF');  mumbai contract
     const contract = new web3.eth.Contract(contractAbi, '0xcDCB434D576c5B1CF387cB272756199B7E72C44d');
     const stable = new web3.eth.Contract(stableContractABI, '0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1'); 

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
        'pairIndex': 17,
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
        
        const collateral = '' // collateralValue from frontend * 1e18
        stable.approve('0xcDCB434D576c5B1CF387cB272756199B7E72C44d', collateral ).send({ from: '0x6E7aD7BC0Bf749c87F59E8995c158cDa08b7E657', gasLimit: '5000000', transactionBlockTimeout: 200 })
          .then(() => {
            contract.methods.openTrade(tradeTuple, 0, 0, '12492725505', '0x0000000000000000000000000000000000000000').send({ from: '0x6E7aD7BC0Bf749c87F59E8995c158cDa08b7E657', gasLimit: '5000000', transactionBlockTimeout: 200});
          })
        

     } catch (error) {
        console.log(error);
     }
}

openTradeGNS();
