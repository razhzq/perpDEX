const fetchGMXPrice = require("./getPrice/getGMXprice")
const readFromContract = require("./getPrice/getGNSprice")

const openTradeGNS = require("./openTrade/openTradeGNS")
const openTradeGMX = require("./openTrade/openTradeGMX")


const btc =  {
    gmx: "0x2f2a2543B76A4166549F7aaB2e75Bef0aefC5B0f",
    gns: "0xc907E116054Ad103354f2D350FD2514433D57F6f",
    gnsId: 0
}  // 0

const eth =  {
    gmx: "0x82aF49447D8a07e3bd95BD0d56f35241523fBab1",
    gns: "0xF9680D99D6C9589e2a93a78A04A279e509205945",
    gnsId: 1
}  // 1

const link =  {
    gmx: "0xf97f4df75117a78c1A5a0DBb814Af92458539FB4",
    gns: "0xd9FFdb71EbE7496cC440152d43986Aae0AB76665",
    gnsId: 2
}  // 2

const uni =  {
    gmx: "0xFa7F8980b0f1E64A2062791cc3b0871572f1F7f0",
    gns: "0xdf0Fb4e4F928d2dCB76f438575fDD8682386e13C",
    gnsId: 17
}  // 3




async function openTradeAggregator(pair, address, collateral, isLong) {

    let gmx = '';
    let gns = '';
    let id = 0;

    switch (pair) {
        case 0: 
         gmx = btc.gmx;
         gns = btc.gns;
         id = btc.gnsId;
         break;
        case 1:
         gmx = eth.gmx;
         gns = eth.gmx;
         id = eth.gnsId;
         break;
        case 2:
         gmx = link.gmx;
         gns = link.gns;
         id = link.gnsId;
         break;
        case 3:
         gmx = uni.gmx;
         gns = uni.gns;
         id = uni.gnsId;
         break;
           
    }

    const gmxPrice = await fetchGMXPrice(gmx);
    const gnsPrice = await readFromContract(gns);

    if(gmx > gns) {
        openTradeGNS(gns, address, id, collateral, isLong, leverage )
    } else {
        openTradeGMX(gmx, collateral, isLong, address, leverage);
    }

}



module.exports = openTradeAggregator;
