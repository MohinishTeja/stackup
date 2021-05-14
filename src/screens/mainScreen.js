import React from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Div, Text, Tag} from 'react-native-magnus';
import {AppButton} from '../components';
import {useWalletStorage} from '../hooks/useWalletStorage';

export default function MainScreen({navigation}) {
  const {wallet, loading, clearWalletInKeychain} = useWalletStorage(set => ({
    wallet: set.wallet,
    loading: set.loading,
    clearWalletInKeychain: set.clearWalletInKeychain,
  }));

  const onClearPress = async () => {
    try {
      await clearWalletInKeychain();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <Div flex={1} alignItems="center" justifyContent="center" px="xl">
        <Div row>
          <Text fontSize="6xl" fontWeight="bold">
            StackUp
          </Text>
          <Tag ml="sm" bg="blue500" color="white">
            alpha
          </Tag>
        </Div>
        <Text mt="sm" textAlign="center" fontSize="lg" fontWeight="bold">
          {wallet}
        </Text>
        <AppButton
          danger
          block
          mt="lg"
          loading={loading}
          onPress={onClearPress}>
          Clear wallet
        </AppButton>
      </Div>
    </SafeAreaView>
  );
}
