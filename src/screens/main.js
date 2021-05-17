import React, {useState, useEffect} from 'react';
import {ScrollView, RefreshControl} from 'react-native';
import Clipboard from '@react-native-clipboard/clipboard';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Div, Icon, Snackbar} from 'react-native-magnus';
import {
  AccountBalance,
  AppButton,
  AccountExplorer,
  AccountAddress,
  SectionContainer,
} from '../components';
import {useWalletStorage, useAccount} from '../hooks';
import Network from '../config/network';
import Router from '../config/router';

export default function MainScreen({navigation}) {
  const [refreshing, setRefreshing] = useState(false);
  const {wallet, walletLoading} = useWalletStorage(set => ({
    wallet: set.wallet,
    walletLoading: set.loading,
  }));
  const {maticLoading, fetchBalance, fetchERC20Balance} = useAccount(set => ({
    maticLoading: set.loading,
    fetchBalance: set.fetchBalance,
    fetchERC20Balance: set.fetchERC20Balance,
  }));
  const isLoading = walletLoading || maticLoading;
  this.snackbarRef = null;

  const init = async () => {
    return Promise.all([
      fetchBalance(wallet),
      fetchERC20Balance(
        wallet,
        Network.MATIC.ERC20_TOKENS.DAI.SYMBOL,
        Network.MATIC.ERC20_TOKENS.DAI.ADDRESS,
      ),
    ]);
  };

  useEffect(() => {
    if (wallet) {
      init();
    }
  }, [wallet]);

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
    <SafeAreaView style={{flex: 1}}>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        <Div p="xl">
          <AccountBalance mt="2xl" />

          <AccountAddress mt="lg" onPress={onCopyPress} />

          <SectionContainer mt="xl" blueBorder title="💸 Account">
            <AccountExplorer loading={isLoading} />
            <AppButton outline marginTop block loading={isLoading}>
              Deposit
            </AppButton>
            <AppButton outline marginTop block loading={isLoading}>
              Pay
            </AppButton>
          </SectionContainer>

          <SectionContainer mt="xl" blueBorder title="⚡️ Protocols">
            <AppButton outline loading={isLoading}>
              Loans
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
    </SafeAreaView>
  );
}
