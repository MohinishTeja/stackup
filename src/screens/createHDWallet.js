import React, {useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Div, Text, Input, Icon, Snackbar} from 'react-native-magnus';
import Clipboard from '@react-native-clipboard/clipboard';
import {AppButton} from '../components';
import {ethers} from '../lib/ethers';
import {useWalletStorage} from '../hooks/useWalletStorage';

export default function CreateHDWalletScreen() {
  const [seedPhrase] = useState(
    ethers.utils.entropyToMnemonic(ethers.utils.randomBytes(32)),
  );
  const {loading, setWalletInKeychain} = useWalletStorage(set => ({
    loading: set.loading,
    setWalletInKeychain: set.setWalletInKeychain,
  }));
  this.snackbarRef = null;

  const onCopyPress = () => {
    Clipboard.setString(seedPhrase);
    snackbarRef.show('Seed phrase copied to clipboard', {
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

  const onContinuePress = async () => {
    try {
      await setWalletInKeychain(seedPhrase);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <Div flex={1} px="xl">
        <Text fontSize="xl" fontWeight="bold">
          Seed Phrase:
        </Text>
        <Input mt="lg" multiline fontSize="xl" value={seedPhrase} />
        <AppButton
          outline
          block
          mt="lg"
          loading={loading}
          onPress={onCopyPress}>
          Copy
        </AppButton>
        <AppButton block mt="lg" loading={loading} onPress={onContinuePress}>
          Continue
        </AppButton>
      </Div>
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
