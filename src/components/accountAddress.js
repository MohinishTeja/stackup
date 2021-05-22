import React from 'react';
import {Pressable} from 'react-native';
import {Div, Text, Skeleton, Icon} from 'react-native-magnus';
import {useWalletStorage} from '../hooks';
import {startAndEnd} from '../utils/addressHelpers';

export const AccountAddress = props => {
  const {wallet, walletLoading} = useWalletStorage(set => ({
    wallet: set.wallet,
    walletLoading: set.loading,
  }));

  return (
    <>
      {walletLoading ? (
        <Skeleton.Box h={32} {...props} />
      ) : (
        <Pressable onPress={props.onPress}>
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
            <Text fontWeight="bold">
              Address: {startAndEnd(wallet?.address)}
            </Text>
            <Icon name="copy1" color="black" />
          </Div>
        </Pressable>
      )}
    </>
  );
};
