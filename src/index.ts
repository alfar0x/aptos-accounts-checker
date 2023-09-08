import { AptosClient } from "aptos";
import env from "./common/env";
import tokens from "./common/tokens";
import uniqueHelper from "./utils/uniqueHelper";
import getGeskoPrices from "./utils/getGeskoPrices";
import importAccounts from "./utils/importAccounts";
import sliceIntoChunks from "./utils/splitToChunks";
import getAccountData, { AccountData } from "./utils/getAccountData";
import sleep from "./common/sleep";
import {
  maxParallelAccounts,
  sleepBetweenChunksSec,
  sortField,
} from "./config";
import sortByKey from "./utils/sortByKey";

const main = async () => {
  const client = new AptosClient(env.RPC_URL);

  const geskoIds = tokens.map((t) => t.geskoId).filter(uniqueHelper);
  const tokenPrices = await getGeskoPrices(geskoIds);

  const accounts = await importAccounts();
  const chunks = sliceIntoChunks(accounts, maxParallelAccounts);

  const accountMapper = (address: string) =>
    getAccountData(address, client, tokenPrices);

  const addressesData: AccountData[] = [];

  for (const chunk of chunks) {
    const chunkData = await Promise.all(chunk.map(accountMapper));
    addressesData.push(...chunkData);
    await sleep(sleepBetweenChunksSec * 1000);
  }

  const sorted = sortField
    ? sortByKey(addressesData, sortField)
    : addressesData;

  console.table(sorted);
};

main();
