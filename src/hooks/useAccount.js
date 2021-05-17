import create from 'zustand';
import {uniqBy, orderBy} from 'lodash';
import {ethers} from '../lib/ethers';
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

const INIT = {
  provider: new ethers.providers.JsonRpcProvider(Network.MATIC.RPC_URL),
  symbol: Network.MATIC.SYMBOL,
  balance: ethers.BigNumber.from(0),
  erc20Tokens: [],
  loading: false,
};
const LOADING_START = {loading: true};
const LOADING_END = {loading: false};
const setBalanceState = balance => ({balance, ...LOADING_END});
const setERC20TokenState = (erc20Tokens, symbol, balance) => ({
  erc20Tokens: orderBy(
    uniqBy([...erc20Tokens, {symbol, balance}], 'name'),
    'name',
  ),
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

  fetchERC20Balance: async (wallet, symbol, tokenAddress) => {
    try {
      set(LOADING_START);

      const contract = new ethers.Contract(
        tokenAddress,
        ERC20_ABI,
        get().provider,
      );
      const balance = await contract.balanceOf(wallet.address);
      set(state => setERC20TokenState(state.erc20Tokens, symbol, balance));
    } catch (error) {
      set(LOADING_END);
      throw error;
    }
  },

  clearAccount: async () => {
    set(INIT);
  },
}));
