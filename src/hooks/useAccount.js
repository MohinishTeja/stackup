import create from 'zustand';
import {uniqBy, orderBy, groupBy} from 'lodash';
import axios from 'axios';
import {COVALENT_API_KEY} from '@env';
import dayjs from 'dayjs';
import {ethers} from '../lib/ethers';
import App from '../config/app';
import Network from '../config/network';
import {LOADING_START, LOADING_END} from '../utils/commonStates';
import {
  getErc20AddressMap,
  getAaveErc20AddressMap,
} from '../utils/configHelpers';

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

const ERC20_ADDRESS_MAP = getErc20AddressMap(Network);

const AAVE_ERC20_ADDRESS_MAP = getAaveErc20AddressMap(Network);

const INIT = {
  provider: new ethers.providers.JsonRpcProvider(Network.MATIC.RPC_URL),
  symbol: Network.MATIC.SYMBOL,
  balance: ethers.BigNumber.from(0),
  erc20Tokens: [],
  stakedERC20Tokens: [],
  savers: [],
  transactions: [],
  pagination: null,
  loading: false,
};
const setBalanceState = balance => ({balance, ...LOADING_END});
const setTokenState = (erc20Tokens, stakedERC20Tokens, savers) => ({
  erc20Tokens: orderBy(uniqBy(erc20Tokens, 'symbol'), 'symbol'),
  stakedERC20Tokens: orderBy(uniqBy(stakedERC20Tokens, 'symbol'), 'symbol'),
  savers,
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

      // Supported ERC 20 token
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

      // Supported ERC 20 token being staked
      const stakedERC20Tokens = items.reduce((prev, curr) => {
        if (curr.contract_address.toLowerCase() in AAVE_ERC20_ADDRESS_MAP) {
          const tokenKey =
            AAVE_ERC20_ADDRESS_MAP[curr.contract_address.toLowerCase()];
          prev.push({
            balance: curr.balance,
            symbol: Network.MATIC.ERC20_TOKENS[tokenKey].SYMBOL,
            pool: Network.MATIC.PROTOCOLS.AAVE.NAME,
          });
        }

        return prev;
      }, []);

      // TODO: Fetch savers from a local DB using someting like Realm
      // At the moment this is hardcoded for demo
      const savers = [
        {
          icon: '🏎',
          name: 'New car',
          target: 20000,
          symbol: Network.MATIC.ERC20_TOKENS.DAI.SYMBOL,
          ratio: 1,
        },
        {
          icon: '✈️',
          name: 'Holiday',
          target: 4000,
          symbol: Network.MATIC.ERC20_TOKENS.USDC.SYMBOL,
          ratio: 1,
        },
      ];

      set(setTokenState(ERC20Tokens, stakedERC20Tokens, savers));
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
