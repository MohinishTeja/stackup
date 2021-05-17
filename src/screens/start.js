import React from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Div, Text, Tag} from 'react-native-magnus';
import {useWalletStorage} from '../hooks';
import {AppButton} from '../components';
import Router from '../config/router';

export default function StartScreen({navigation}) {
  const {loading} = useWalletStorage(set => ({loading: set.loading}));

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
          A friendly DeFi app for the Polygon Network
        </Text>
        <AppButton
          mt="3xl"
          loading={loading}
          onPress={() => navigation.navigate(Router.IMPORT_HD_WALLET)}>
          Import Wallet
        </AppButton>
        <AppButton
          outline
          marginTop
          loading={loading}
          onPress={() => navigation.navigate(Router.CREATE_HD_WALLET)}>
          Create Wallet
        </AppButton>
      </Div>
    </SafeAreaView>
  );
}
