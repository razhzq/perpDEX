# Gains.trade and GMX Price Fetcher and Market Trader
This GitHub repository contains scripts that fetches asset pair prices from the Gains.trade and GMX platforms and allows you to submit market trade positions (long or short) to these platforms.

Features
Fetches the latest asset pair prices from Gains.trade and GMX.
Provides a simple and convenient way to submit market trade positions to both platforms.
Supports both long and short positions.



1. Open Trade on GMX or Gains
- run openTradeGMX.js or openTradeGNS.js for openTrade in /openTrade/
example: node openTradeGNS.js

2. Get trade position data
- scripts in /tradeData
- run getTradeGNS.js for GAINS
-     getTradeGNS.js for GMX

3. Close Trade
- scripts in /closeTrade

4. Limit Order
-scripts in /limitOrder



Reference:
GMX Contract Interaction - https://gmxio.gitbook.io/gmx/contracts
GAINS Contract Interaction - https://gains-network.gitbook.io/docs-home/help/direct-contract-interaction