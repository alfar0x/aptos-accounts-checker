import { AptosClient } from "aptos";

export const accountResourceType = "0x1::account::Account";
export const aptosNameResourceType = "0x3::token::TokenStore";

type AccountResource = {
  type: typeof accountResourceType;
  data: {
    sequence_number: string;
  };
};

type AptosNamesResource = {
  type: typeof aptosNameResourceType;
};

export type TokenResource = {
  type: `0x1::coin::CoinStore<${string}>`;
  data: {
    coin: {
      value: string;
    };
  };
};

type Resource = AccountResource | AptosNamesResource | TokenResource;

const getAccountResources = async (address: string, client: AptosClient) => {
  const resources = await client.getAccountResources(address);

  return resources as Resource[];
};

export default getAccountResources;
