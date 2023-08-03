const { Telegraf, Markup } = require("telegraf");
const dotenv = require("dotenv").config({ path: __dirname + "/.env" });
const Web3 = require("web3");

const bot = new Telegraf(process.env.BOT_TOKEN);

const providerUrl = process.env.URL_TOKEN;
const web3 = new Web3(new Web3.providers.HttpProvider(providerUrl));

// function to create a wallet
const createWallet = () => {
  const account = web3.eth.accounts.create();
  console.log(`account: ${JSON.stringify(account)}`);
  return account;
};

// function to import a wallet with the private key
const importWallet = (privateKey) => {
  const account = web3.eth.accounts.privateKeyToAccount(privateKey);
  console.log(`account: ${JSON.stringify(account)}`);
  return account;
};

// functin to get the private key of the wallet recently created
const getPrivateKey = () => {
  const account = web3.eth.accounts.create();
  console.log(`account: ${JSON.stringify(account)}`);
  return account;
};

//==================================
const getPrivateKeyInline = Markup.inlineKeyboard([
  Markup.button.callback("Get Private Key", "get_private_key"),
]);
bot.hears("Get Private Key", (ctx) =>
  ctx.reply("Getting private key...", getPrivateKeyInline)
);
bot.action("get_private_key", (ctx) => {
  const account = getPrivateKey();
  ctx.reply(`Your private key is: ${account.privateKey}`);
});

const walletInline = Markup.inlineKeyboard([
  Markup.button.callback("Create Wallet", "create_wallet"),
  Markup.button.callback("Import Wallet", "import_wallet"),
]);
bot.hears("Create Wallet", (ctx) =>
  ctx.reply("Creating wallet...", walletInline)
);
bot.action("create_wallet", (ctx) => {
  const account = createWallet();
  ctx.reply(
    `Your wallet address is: ${account.address}, Would you like to get the private key of this wallet for later use?`,
    getPrivateKeyInline
  );
});
bot.hears("Import Wallet", (ctx) =>
  ctx.reply("Importing wallet...", walletInline)
);
bot.action("import_wallet", (ctx) => {
  const account = importWallet();
  ctx.reply(`Please enter your private key to import your wallet`);
});

bot.use(async (ctx) => {
  await ctx.reply(
    `Hello, Welcome to the APEDtrade bot. Would you like to import a wallet with your private key? Or do you want a wallet created that you can fund then later import into metamask?`,
    walletInline
  );
});

bot.launch();

process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
