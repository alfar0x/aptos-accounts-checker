import { AptosClient } from "aptos";
import getAccountResources, { TokenResource } from "./getResources";
import Big from "big.js";
import tokens, { TokenId } from "../common/tokens";
import generateShortString from "./generateShortString";
import { addressFormat, hideTokensLessThanUsd } from "../config";

export type AccountData = {
  address: string;
  // isAptosName: boolean;
  totalUsd: number;
  txs: number;
  aptCount: number;
} & Partial<Record<TokenId, number>>;

type TokenPrices = Record<string, number>;

const formatToken = (
  tokenResource: TokenResource,
  tokenPrices: TokenPrices
) => {
  const tokenData = tokens.find((token) => {
    const tokenType = "0x1::coin::CoinStore<" + token.address + ">";
    return tokenResource.type === tokenType;
  });

  if (!tokenData) return null;

  const { id, geskoId, decimals } = tokenData;

  const tokenPrice = tokenPrices[geskoId];

  if (!tokenPrice) {
    throw new Error(`Price of ${geskoId} is not defined`);
  }

  const decimalDivider = Big(10).pow(decimals);
  const count = Big(tokenResource.data.coin.value).div(decimalDivider);
  const usdBalance = count.round(2).toNumber();

  return { id, usdBalance, count: count.toNumber() };
};

const formatAddress = (address: string) => {
  switch (addressFormat) {
    case "url":
      return `https://explorer.aptoslabs.com/account/${address}?network=mainnet`;
    case "long":
      return address;
    default:
      return generateShortString(address);
  }
};

const getAccountData = async (
  address: string,
  client: AptosClient,
  tokenPrices: TokenPrices
) => {
  const resources = await getAccountResources(address, client);

  const data: AccountData = {
    address: formatAddress(address),
    totalUsd: 0,
    // isAptosName: false,
    txs: 0,
    aptCount: 0,
  };

  for (const resource of resources) {
    switch (resource.type) {
      case "0x1::account::Account": {
        data.txs = Big(resource.data.sequence_number).toNumber();
        break;
      }
      case "0x3::token::TokenStore": {
        break;
      }
      default: {
        const tokenData = formatToken(resource, tokenPrices);
        if (tokenData) {
          const { id, usdBalance, count } = tokenData;

          if (Big(usdBalance).gte(hideTokensLessThanUsd)) {
            data[id] = usdBalance;
          }

          if (id === "apt") {
            data.aptCount = count;
          }
        }
        break;
      }
    }
  }

  const totalUsd = tokens
    .reduce((acc, token) => Big(acc).plus(data[token.id] || 0), Big(0))
    .round(2)
    .toNumber();

  data.totalUsd = totalUsd;

  return data;
};

export default getAccountData;
