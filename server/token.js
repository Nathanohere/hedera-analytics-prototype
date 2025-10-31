// server/token.js
const { TokenCreateTransaction, TokenMintTransaction, Hbar, AccountBalanceQuery } = require("@hashgraph/sdk");
// assume client defined and operator set
async function createToken() {
  const tx = await new TokenCreateTransaction()
    .setTokenName("DataAccessToken")
    .setTokenSymbol("DAT")
    .setDecimals(0)            // integer credits
    .setInitialSupply(1000)
    .setTreasuryAccountId(operatorId)
    .execute(client);

  const receipt = await tx.getReceipt(client);
  const tokenId = receipt.tokenId.toString();
  console.log("Token created:", tokenId);
  return tokenId;
}
