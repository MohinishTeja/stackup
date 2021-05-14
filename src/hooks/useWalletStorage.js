import create from 'zustand';
import * as Keychain from 'react-native-keychain';
import {ethers} from '../lib/ethers';
import {App} from '../config/app';

const LOADING_START = {loading: true};
const RESET = {wallet: null, loading: false};
const setWallet = wallet => ({wallet, loading: false});

export const useWalletStorage = create(set => ({
  wallet: null,
  loading: false,

  getWalletFromKeychain: async () => {
    try {
      set(LOADING_START);

      const wallet = await Keychain.getGenericPassword();

      if (wallet) {
        set(setWallet(wallet.password));
      } else {
        set(RESET);
      }
    } catch (error) {
      console.error("Keychain couldn't be accessed!", error);
      set(RESET);
    }
  },

  setWalletInKeychain: async seedPhrase => {
    try {
      set(LOADING_START);

      // Prevent blocking
      await new Promise(resolve => setTimeout(resolve));
      ethers.Wallet.fromMnemonic(seedPhrase);
      await Keychain.setGenericPassword(App.KEYCHAIN_USERNAME, seedPhrase);

      set(setWallet(seedPhrase));
    } catch (error) {
      set(RESET);
      throw error;
    }
  },

  clearWalletInKeychain: async () => {
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
