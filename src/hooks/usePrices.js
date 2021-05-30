import create from 'zustand';
import axios from 'axios';
import queryString from 'query-string';
import {COVALENT_API_KEY} from '@env';
import {LOADING_START, LOADING_END} from '../utils/commonStates';
import App from '../config/app';
import Network from '../config/network';

const INIT = {
  spotPrices: [],
  loading: true,
};
const setSpotPrices = spotPrices => ({spotPrices, ...LOADING_END});

export const usePrices = create(set => ({
  ...INIT,

  fetchSpotPrices: async () => {
    try {
      set(LOADING_START);

      const response = await axios.get(
        `${App.COVALENT_URL}/pricing/tickers/?${queryString.stringify(
          {
            tickers: [
              Network.MATIC.SYMBOL,
              ...Object.values(Network.MATIC.ERC20_TOKENS).map(
                token => token.SYMBOL,
              ),
            ],
          },
          {arrayFormat: 'comma'},
        )}`,
        {auth: {username: COVALENT_API_KEY}},
      );
      const {items} = response.data.data;

      set(setSpotPrices(items));
    } catch (error) {
      set(LOADING_END);
      throw error;
    }
  },
}));
