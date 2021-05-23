import create from 'zustand';
import * as Keychain from 'react-native-keychain';
import {ethers} from '../lib/ethers';
import App from '../config/app';
import {LOADING_START, LOADING_END} from '../utils/commonStates';

const RESET = {wallet: null, ...LOADING_END};
const setWalletState = wallet => ({wallet, ...LOADING_END});
const createWalletFromSeed = async seedPhrase => {
  try {
    // Prevent blocking
    await new Promise(resolve => setTimeout(resolve));
    return ethers.Wallet.fromMnemonic(seedPhrase);
  } catch (error) {
    throw error;
  }
};

export const useWalletStorage = create(set => ({
  wallet: null,
  loading: false,

  createRandomSeedPhrase: () => {
    return ethers.utils.entropyToMnemonic(ethers.utils.randomBytes(32));
  },

  getWallet: async () => {
    try {
      set(LOADING_START);

      const credentials = await Keychain.getGenericPassword();

      if (credentials) {
        const wallet = await createWalletFromSeed(credentials.password);
        set(setWalletState(wallet));
      } else {
        set(RESET);
      }
    } catch (error) {
      console.error(error);
      set(RESET);
    }
  },

  setWallet: async seedPhrase => {
    try {
      set(LOADING_START);

      const wallet = await createWalletFromSeed(seedPhrase);
      await Keychain.setGenericPassword(App.KEYCHAIN_USERNAME, seedPhrase);

      set(setWalletState(wallet));
    } catch (error) {
      set(RESET);
      throw error;
    }
  },

  clearWallet: async () => {
    try {
      set(LOADING_START);

      await Keychain.resetGenericPassword();

      set(RESET);
    } catch (error) {
      set(RESET);

      throw error;
    }
  },
}));
