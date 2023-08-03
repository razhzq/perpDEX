const Web3 = require('web3');

const path = require("path");
const fs = require("fs");

const fetchGMXPrice = require('../getPrice/getGMXprice');


// setup provider
const providerUrl = 'https://arb-mainnet.g.alchemy.com/v2/QKEmGABomINorp6sJe8ir_JXMKRaMGeD';
const web3 = new Web3(new Web3.providers.HttpProvider(providerUrl));


// setup account
const privateKey = '';


//gmx router
const gmxRouterPath = path.resolve("contractABI/GMXRouter.json");
const gmxRawData = fs.readFileSync(gmxRouterPath);
const gmxContractABI = JSON.parse(gmxRawData);

//gmx position router
const gmxPositionPath = path.resolve("contractABI/GMXPositionRouter.json");
const gmxPositionRaw = fs.readFileSync(gmxPositionPath);
const gmxPositionRouterABI = JSON.parse(gmxPositionRaw);

//erc20 contract 
const stableContractPath = path.resolve("contractABI/DAIcontract.json");
const stableRawData = fs.readFileSync(stableContractPath);
const stableContractABI = JSON.parse(stableRawData);


const assetPair = [
    { name: 'btc', contractAddress: '0x2f2a2543B76A4166549F7aaB2e75Bef0aefC5B0f'},
    { name: 'eth', contractAddress: '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1'},
    { name: 'link', contractAddress: '0xf97f4df75117a78c1A5a0DBb814Af92458539FB4'},
    { name: 'uni', contractAddress: '0xFa7F8980b0f1E64A2062791cc3b0871572f1F7f0'},
]


async function openTradeGMX(pairContract, collateral, isLong, address, leverage) {

    const account = web3.eth.accounts.privateKeyToAccount(privateKey);
    web3.eth.accounts.wallet.add(account);
    const gmxRouter = new web3.eth.Contract(gmxContractABI, '0xaBBc5F99639c9B6bCb58544ddf04EFA6802F4064')
    const gmxPositionRouter = new web3.eth.Contract(gmxPositionRouterABI, '0xb87a436B93fFE9D75c5cFA7bAcFff96430b09868');
    const stable = new web3.eth.Contract(stableContractABI, '0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1');  // DAI contract addressß

    const collateralConv = web3.utils.toWei(toString(collateral), 'ether')

    const price = await fetchGMXPrice(pairContract);
    const acceptablePrice = price *1.5;

    const sizeDelta = web3.utils.toWei(toString(collateral *leverage), 'tether');

    try {
        gmxRouter.methods.approvePlugin('0xb87a436B93fFE9D75c5cFA7bAcFff96430b09868').send({ from: address, gasLimit: '5000000', transactionBlockTimeout: 200 }).then(() => {
            stable.approve('0xaBBc5F99639c9B6bCb58544ddf04EFA6802F4064', '115792089237316195423570985008687907853269984665640564039457584007913129639935').send({ from: address, gasLimit: '5000000', transactionBlockTimeout: 200 }) // approve router and amount of deposit 
        }).then(() => {
            gmxPositionRouter.methods.createIncreasePosition(
              ['0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1'],  // address[] collateralToken DAI
                pairContract,   //  address of token to long or short
                collateralConv,   // collateral amount 
                0,    //minOut 0
                sizeDelta,  // sizeDelta = collateral x leverage // in 1e30 format
                isLong,  // isLong - true for long - false for short
                acceptablePrice, //acceptable Price for the pair = price from API + slippage // price from API + 0.5% (1e30 format)
                gmxPositionRouter.minExecutionFee, //min execution fee
                0x0000000000000000000000000000000000000000000000000000000000000000 //referral code
            ).send({ from: address, gasLimit: '5000000', transactionBlockTimeout: 200 });
        })

    

    } catch (error) {
        console.log(error)
    }
}

module.exports = openTradeGMX;


