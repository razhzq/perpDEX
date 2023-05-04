
const readFromContract = require('./getGNSprice');
const path = require("path");
const fs = require("fs");

const abiPath = path.resolve("contractABI/GNSPrice.json");  
const rawData = fs.readFileSync(abiPath);  
const contractAbi = JSON.parse(rawData);


const assetPairAddress = [
   {
     contractAddress: '0xc907E116054Ad103354f2D350FD2514433D57F6f',  
     asset: 'BTC/USD'
   },
   {
    contractAddress: '0xF9680D99D6C9589e2a93a78A04A279e509205945',
    asset: 'ETH/USD'
  },
  {
    contractAddress: '0xF9680D99D6C9589e2a93a78A04A279e509205945',
    asset: 'LINK/USD'
  },
  {
    contractAddress: '0xdf0Fb4e4F928d2dCB76f438575fDD8682386e13C',
    asset: 'UNI/USD'
  }
]

const dummyABI = contractAbi;


(async () => {
  for (let i = 0; i < assetPairAddress.length; i++) {
    const result = await readFromContract(assetPairAddress[i].contractAddress, dummyABI);
    console.log(`${assetPairAddress[i].asset}: `, result);
  }
})();
