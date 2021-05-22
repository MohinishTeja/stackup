import create from 'zustand';
import {uniqBy, orderBy, groupBy} from 'lodash';
import axios from 'axios';
import {COVALENT_API_KEY} from '@env';
import dayjs from 'dayjs';
import {ethers} from '../lib/ethers';
import App from '../config/app';
import Network from '../config/network';

const ERC20_ABI = [
  // Read-Only Functions
  'function balanceOf(address owner) view returns (uint256)',
  'function decimals() view returns (uint8)',
  'function symbol() view returns (string)',

  // Authenticated Functions
  'function transfer(address to, uint amount) returns (boolean)',

  // Events
  'event Transfer(address indexed from, address indexed to, uint amount)',
];

const ERC20_ADDRESS_MAP = Object.entries(Network.MATIC.ERC20_TOKENS).reduce(
  (prev, [key, value]) => {
    prev[value.ADDRESS.toLowerCase()] = key;
    return prev;
  },
  {},
);

const INIT = {
  provider: new ethers.providers.JsonRpcProvider(Network.MATIC.RPC_URL),
  symbol: Network.MATIC.SYMBOL,
  balance: ethers.BigNumber.from(0),
  erc20Tokens: [],
  transactions: [],
  pagination: null,
  loading: false,
};
const LOADING_START = {loading: true};
const LOADING_END = {loading: false};
const setBalanceState = balance => ({balance, ...LOADING_END});
const setERC20TokenState = erc20Tokens => ({
  erc20Tokens: orderBy(uniqBy(erc20Tokens, 'symbol'), 'symbol'),
  ...LOADING_END,
});
const setTransactionsState = (transactions, pagination) => ({
  transactions: Object.entries(
    groupBy(transactions, i =>
      dayjs(i.block_signed_at).startOf('days').format(),
    ),
  ).map(([date, data]) => ({date, data})),
  pagination,
  ...LOADING_END,
});

export const useAccount = create((set, get) => ({
  ...INIT,

  fetchBalance: async wallet => {
    try {
      set(LOADING_START);

      const balance = await wallet.connect(get().provider).getBalance();
      set(setBalanceState(balance));
    } catch (error) {
      set(LOADING_END);
      throw error;
    }
  },

  fetchERC20Balance: async wallet => {
    try {
      set(LOADING_START);

      const response = await axios.get(
        `${App.COVALENT_URL}/${Network.MATIC.CHAIN_ID}/address/${wallet.address}/balances_v2/`,
        {auth: {username: COVALENT_API_KEY}},
      );
      const {items} = response.data.data;

      const ERC20Tokens = items.reduce((prev, curr) => {
        if (curr.contract_address.toLowerCase() in ERC20_ADDRESS_MAP) {
          const tokenKey =
            ERC20_ADDRESS_MAP[curr.contract_address.toLowerCase()];
          prev.push({
            balance: curr.balance,
            symbol: Network.MATIC.ERC20_TOKENS[tokenKey].SYMBOL,
          });
        }

        return prev;
      }, []);

      set(setERC20TokenState(ERC20Tokens));
    } catch (error) {
      set(LOADING_END);
      throw error;
    }
  },

  fetchTransactions: async wallet => {
    try {
      set(LOADING_START);

      const response = await axios.get(
        `${App.COVALENT_URL}/${Network.MATIC.CHAIN_ID}/address/${wallet.address}/transactions_v2/`,
        {auth: {username: COVALENT_API_KEY}},
      );
      const {items, pagination} = response.data.data;

      const filteredTransactions = items
        .filter(i => i.successful)
        .reduce((prev, curr) => {
          // Filtering for native token transfers
          if (curr.value !== '0') {
            prev.push({
              tx_hash: curr.tx_hash,
              block_signed_at: curr.block_signed_at,
              from_address: curr.from_address,
              to_address: curr.to_address,
              value: ethers.utils.formatUnits(curr.value, Network.MATIC.UNITS),
              symbol: Network.MATIC.SYMBOL,
            });
          }

          // Filtering for ERC20 token transfers
          curr.log_events.forEach(ev => {
            if (
              ev.decoded?.name === 'Transfer' &&
              ev.sender_address?.toLowerCase() in ERC20_ADDRESS_MAP &&
              (ev.decoded.params[0].value.toLowerCase() ===
                wallet.address.toLowerCase() ||
                ev.decoded.params[1].value.toLowerCase() ===
                  wallet.address.toLowerCase())
            ) {
              const tokenKey =
                ERC20_ADDRESS_MAP[ev.sender_address.toLowerCase()];
              prev.push({
                tx_hash: ev.tx_hash,
                block_signed_at: ev.block_signed_at,
                from_address: ev.decoded.params[0].value,
                to_address: ev.decoded.params[1].value,
                value: ethers.utils.formatUnits(
                  ev.decoded.params[2].value,
                  Network.MATIC.ERC20_TOKENS[tokenKey].UNITS,
                ),
                symbol: Network.MATIC.ERC20_TOKENS[tokenKey].SYMBOL,
              });
            }
          });

          return prev;
        }, []);

      set(setTransactionsState(filteredTransactions, pagination));
    } catch (error) {
      set(LOADING_END);
      throw error;
    }
  },

  clearAccount: async () => {
    set(INIT);
  },
}));
