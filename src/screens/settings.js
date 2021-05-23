import React, {useState} from 'react';
import Clipboard from '@react-native-clipboard/clipboard';
import {Div, Overlay, Input, Icon, Snackbar} from 'react-native-magnus';
import {useWalletStorage, useAccount} from '../hooks';
import {
  SectionContainer,
  AppButton,
  AccountAvatar,
  AccountAddress,
} from '../components';

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

  const onCopyPress = (string, message) => {
    Clipboard.setString(string);
    this.snackbarRef.show(message, {
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
      <Div flex={1} p="xl">
        <Div rounded="md" bg="white" p="lg">
          <AccountAvatar mt="sm" />
          <AccountAddress
            mt="xl"
            onPress={() =>
              onCopyPress(wallet?.address, 'Address copied to clipboard')
            }
          />
        </Div>

        <SectionContainer mt="xl" redBorder title="⚠️ Danger zone">
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
        <AppButton
          outline
          marginTop
          onPress={() =>
            onCopyPress(
              wallet?.mnemonic?.phrase,
              'Seed phrase copied to clipboard',
            )
          }>
          Copy
        </AppButton>
      </Overlay>
    </>
  );
}
