import { Connection, PublicKey } from "@solana/web3.js";
import { binary_to_base58 } from "base58-js";
import { writeFileSync } from "fs";

const CONTRACT_ID = "GFr4KQrWNwa3APT1WXhH6Dm6JonKwAg8LGZk7QhQkar2"; //goofy dao contract id
const RPC_URL = "https://ssc-dao.genesysgo.net/";

(async () => {
  const connection = new Connection(RPC_URL, {
    commitment: "confirmed",
  });
  const accounts = await connection.getParsedProgramAccounts(
    new PublicKey(CONTRACT_ID),
    {
      filters: [
        {
          dataSize: 8 + 32 + 8 + 2 + 1, // number of bytes
        },
      ],
    }
  );

  let list = [];
  let totalStaked = 0;

  for (let i = 0; i < accounts.length; i++) {
    const data = new Uint8Array(accounts[i].account.data as ArrayBuffer);

    const user = binary_to_base58(data.slice(8, 40));

    const stakedAddress = accounts[i].pubkey.toBase58();

    list.push({
      user,
      amount: data[48],
    });

    totalStaked += data[48];
  }

  writeFileSync("./stakedHolders.json", JSON.stringify(list, null, 4));

  console.log("total staked", totalStaked);
})();
