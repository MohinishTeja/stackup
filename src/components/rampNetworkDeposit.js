import React, {useState} from 'react';
import {Linking} from 'react-native';
import {InAppBrowser} from 'react-native-inappbrowser-reborn';
import queryString from 'query-string';
import {AppButton} from '.';
import {useWalletStorage} from '../hooks';
import App from '../config/app';
import Network from '../config/network';

export const RampNetworkDeposit = props => {
  const [loading, setLoading] = useState(false);
  const {wallet} = useWalletStorage(set => ({wallet: set.wallet}));

  const generateRampURL = () => {
    const swapAsset = [
      `${Network.MATIC.SYMBOL}_${Network.MATIC.ERC20_TOKENS.DAI.SYMBOL}`,
      `${Network.MATIC.SYMBOL}_${Network.MATIC.ERC20_TOKENS.USDC.SYMBOL}`,
      Network.MATIC.SYMBOL,
    ];
    const userAddress = wallet?.address;

    return `${App.RAMP_URL}/?${queryString.stringify(
      {swapAsset, userAddress},
      {arrayFormat: 'comma'},
    )}`;
  };

  const onPress = async () => {
    try {
      setLoading(true);

      const url = generateRampURL();
      if (await InAppBrowser.isAvailable()) {
        await InAppBrowser.open(url);
      } else Linking.openURL(url);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppButton outline loading={loading} onPress={onPress} {...props}>
      Ramp Network
    </AppButton>
  );
};
