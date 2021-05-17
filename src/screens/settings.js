import React, {useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import Clipboard from '@react-native-clipboard/clipboard';
import {Div, Overlay, Input, Icon, Snackbar} from 'react-native-magnus';
import {useWalletStorage, useAccount} from '../hooks';
import {SectionContainer, AppButton} from '../components';

export default function SettingsPage({navigation}) {
  const [showSeedPhrase, setShowSeedPhrase] = useState(false);
  const {wallet, walletLoading, clearWallet} = useWalletStorage(set => ({
    wallet: set.wallet,
    walletLoading: set.loading,
    clearWallet: set.clearWallet,
  }));
  const {maticLoading, clearAccount} = useAccount(set => ({
    maticLoading: set.loading,
    clearAccount: set.clearAccount,
  }));
  const isLoading = walletLoading || maticLoading;
  this.snackbarRef = null;

  const onClearPress = async () => {
    try {
      await Promise.all([clearAccount(), clearWallet()]);
    } catch (error) {
      console.error(error);
    }
  };

  const onCopyPress = () => {
    Clipboard.setString(wallet?.mnemonic?.phrase);
    this.snackbarRef.show('Seed phrase copied to clipboard', {
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
      <Div flex={1} p="xl">
        <SectionContainer redBorder title="⚠️ Danger zone">
          <AppButton
            danger
            loading={isLoading}
            onPress={() => setShowSeedPhrase(true)}>
            Reveal seed phrase
          </AppButton>
          <AppButton
            danger
            marginTop
            loading={isLoading}
            onPress={onClearPress}>
            Clear wallet
          </AppButton>
        </SectionContainer>
      </Div>
      <Div>
        <Snackbar
          ref={ref => (this.snackbarRef = ref)}
          bg="green700"
          color="white"
        />
      </Div>
      <Overlay
        visible={showSeedPhrase}
        onBackdropPress={() => setShowSeedPhrase(false)}
        p="xl">
        <Input
          mt="lg"
          multiline
          fontSize="xl"
          value={wallet?.mnemonic?.phrase}
        />
        <AppButton outline marginTop onPress={onCopyPress}>
          Copy
        </AppButton>
      </Overlay>
    </SafeAreaView>
  );
}
