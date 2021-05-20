import React, {useState} from 'react';
import {ScrollView, RefreshControl} from 'react-native';
import Clipboard from '@react-native-clipboard/clipboard';
import {Div, Icon, Snackbar} from 'react-native-magnus';
import {
  AccountBalance,
  AppButton,
  AccountExplorer,
  AccountAddress,
  AccountDeposit,
  SectionContainer,
} from '../components';
import {useWalletStorage, useAccount, useInit} from '../hooks';
import Router from '../config/router';

export default function MainScreen({navigation}) {
  const [refreshing, setRefreshing] = useState(false);
  const {wallet, walletLoading} = useWalletStorage(set => ({
    wallet: set.wallet,
    walletLoading: set.loading,
  }));
  const {maticLoading} = useAccount(set => ({maticLoading: set.loading}));
  const init = useInit();
  const isLoading = walletLoading || maticLoading;
  this.snackbarRef = null;

  const onRefresh = async () => {
    try {
      setRefreshing(true);

      await init();
    } catch (error) {
      console.error(error);
    } finally {
      setRefreshing(false);
    }
  };

  const onCopyPress = () => {
    Clipboard.setString(wallet?.address);
    this.snackbarRef.show('Address copied to clipboard', {
      duration: 2000,
      suffix: (
        <Icon
          name="checkcircle"
          color="white"
          fontSize="md"
          fontFamily="AntDesign"
        />
      ),
    });
  };

  return (
    <>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        <Div p="xl">
          <AccountBalance />

          <AccountAddress mt="xl" onPress={onCopyPress} />

          <SectionContainer mt="xl" blueBorder title="💸 Account">
            <AccountExplorer loading={isLoading} />
            <AccountDeposit marginTop loading={isLoading} />
            <AppButton outline marginTop block loading={isLoading}>
              Pay
            </AppButton>
          </SectionContainer>

          <SectionContainer mt="xl" blueBorder title="⚡️ Protocols">
            <AppButton outline loading={isLoading}>
              Earn
            </AppButton>
            <AppButton outline marginTop loading={isLoading}>
              Loan
            </AppButton>
            <AppButton outline marginTop loading={isLoading}>
              Exchange
            </AppButton>
          </SectionContainer>

          <SectionContainer mt="xl" title="📱 App">
            <AppButton
              outline
              loading={isLoading}
              onPress={() => navigation.navigate(Router.SETTINGS)}>
              Settings
            </AppButton>
          </SectionContainer>
        </Div>
      </ScrollView>
      <Div>
        <Snackbar
          ref={ref => (this.snackbarRef = ref)}
          bg="green700"
          color="white"
        />
      </Div>
    </>
  );
}
