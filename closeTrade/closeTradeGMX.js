const Web3 = require('web3');

const path = require("path");
const fs = require("fs");

const providerUrl = 'https://arb-mainnet.g.alchemy.com/v2/QKEmGABomINorp6sJe8ir_JXMKRaMGeD';
const web3 = new Web3(new Web3.providers.HttpProvider(providerUrl));

const privateKey = '';


//gmx position router
const gmxPositionPath = path.resolve("contractABI/GMXPositionRouter.json");
const gmxPositionRaw = fs.readFileSync(gmxPositionPath);
const gmxPositionRouterABI = JSON.parse(gmxPositionRaw);


async function closeTradeGMX(collateralTokenAddress, indexTokenAddress, collateralDelta, sizeDelta, isLong, receiver ) {
    const account = web3.eth.accounts.privateKeyToAccount(privateKey);
    web3.eth.accounts.wallet.add(account);

    const gmxPositionRouter = new web3.eth.Contract(gmxPositionRouterABI, '0xb87a436B93fFE9D75c5cFA7bAcFff96430b09868');

    try {
        gmxPositionRouter.methods.createDecreasePosition(
            collateralTokenAddress,
            indexTokenAddress, // pair address
            collateralDelta, // amount of collateral to withdraw
            sizeDelta, // USD value of the position
            isLong, // boolean
            receiver, // address of wallet to withdraw
            acceptablePrice, // market price of the pair to execute
            0, // minOut = 0 as no swap needed
            gmxPositionRouter.minExecutionFee,
            false, // withdrawETH
        )
    } catch (error) {
        console.log(error)
    }

}

module.exports = closeTradeGMX;