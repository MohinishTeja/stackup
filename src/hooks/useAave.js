import create from 'zustand';
import axios from 'axios';
import {v2} from '@aave/protocol-js';
import {orderBy} from 'lodash';
import {LOADING_START, LOADING_END} from '../utils/commonStates';
import {getAaveErc20AddressMap} from '../utils/configHelpers';
import {AAVE_RESERVE_DATA} from '../utils/graphql/queries';
import Network from '../config/network';

const ERC20_ADDRESS_MAP = getAaveErc20AddressMap(Network);

const INIT = {
  reserveData: [],
  loading: false,
};
const setReserveData = reserveData => ({
  reserveData: orderBy(reserveData, 'symbol'),
  ...LOADING_END,
});

export const useAave = create(set => ({
  ...INIT,

  fetchReserveData: async () => {
    try {
      set(LOADING_START);

      const response = await axios.post(
        Network.MATIC.PROTOCOLS.AAVE.SUBGRAPH_URL,
        {
          query: AAVE_RESERVE_DATA,
          variables: {
            pool: Network.MATIC.PROTOCOLS.AAVE.LENDING_POOL_ADDRESS_PROVIDER,
          },
        },
      );

      const {data, error} = response.data;
      if (error) throw new Error(JSON.stringify(error));

      const reserveData = v2.formatReserves(data.reserves);
      set(
        setReserveData(
          reserveData
            .filter(data => data.aToken.id in ERC20_ADDRESS_MAP)
            .map(r => ({symbol: ERC20_ADDRESS_MAP[r.aToken.id], ...r})),
        ),
      );
    } catch (error) {
      set(LOADING_END);
      throw error;
    }
  },
}));
