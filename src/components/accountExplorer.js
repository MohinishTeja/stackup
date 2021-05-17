import React, {useState} from 'react';
import {Linking} from 'react-native';
import {InAppBrowser} from 'react-native-inappbrowser-reborn';
import {Icon} from 'react-native-magnus';
import {AppButton} from '.';
import {useWalletStorage} from '../hooks';
import Network from '../config/network';

export const AccountExplorer = props => {
  const [loading, setLoading] = useState(false);
  const {wallet} = useWalletStorage(set => ({wallet: set.wallet}));

  const onPress = async () => {
    try {
      setLoading(true);

      const url = 'https://www.google.com';
      if (await InAppBrowser.isAvailable()) {
        await InAppBrowser.open(
          `${Network.MATIC.EXPLORER_URL}/${wallet.address}`,
        );
      } else Linking.openURL(url);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppButton
      outline
      loading={loading}
      suffix={
        <Icon
          name="arrowright"
          color="blue500"
          fontSize="md"
          fontFamily="AntDesign"
        />
      }
      onPress={onPress}
      {...props}>
      Activity
    </AppButton>
  );
};
