import React from 'react';
import {Pressable, Linking} from 'react-native';
import {InAppBrowser} from 'react-native-inappbrowser-reborn';
import {Div, Text, Skeleton, Icon} from 'react-native-magnus';
import {useWalletStorage} from '../hooks';
import Network from '../config/network';

export const AccountExplorer = props => {
  const {wallet, walletLoading} = useWalletStorage(set => ({
    wallet: set.wallet,
    walletLoading: set.loading,
  }));

  const onPress = async () => {
    try {
      const url = `${Network.MATIC.EXPLORER_URL}/address/${wallet.address}`;
      if (await InAppBrowser.isAvailable()) {
        await InAppBrowser.open(url);
      } else Linking.openURL(url);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      {walletLoading ? (
        <Skeleton.Box h={32} {...props} />
      ) : (
        <Pressable onPress={onPress}>
          <Div
            row
            p="md"
            borderWidth={1}
            borderColor="blue500"
            bg="blue100"
            rounded="md"
            alignItems="center"
            justifyContent="space-between"
            {...props}>
            <Text fontWeight="bold">🔎 Open explorer</Text>
            <Icon name="open-in-new" fontFamily="MaterialIcons" color="black" />
          </Div>
        </Pressable>
      )}
    </>
  );
};
