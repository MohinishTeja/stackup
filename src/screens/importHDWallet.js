import React, {useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Div, Text, Input, Icon, Snackbar} from 'react-native-magnus';
import {AppButton} from '../components';
import {useWalletStorage} from '../hooks/useWalletStorage';
import {App} from '../config/app';

export default function ImportHDWalletScreen() {
  const [seedPhrase, setSeedPhrase] = useState('');
  const {loading, setWalletInKeychain} = useWalletStorage(set => ({
    loading: set.loading,
    setWalletInKeychain: set.setWalletInKeychain,
  }));
  this.snackbarRef = null;

  const onContinuePress = async () => {
    try {
      await setWalletInKeychain(seedPhrase);
    } catch (error) {
      this.snackbarRef.show(error.message || App.GENERIC_ERROR_MSG, {
        duration: 2000,
        suffix: (
          <Icon
            name="closecircle"
            color="white"
            fontSize="md"
            fontFamily="AntDesign"
          />
        ),
      });
    }
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <Div flex={1} px="xl">
        <Text fontSize="xl" fontWeight="bold">
          Seed Phrase:
        </Text>
        <Input
          onChangeText={setSeedPhrase}
          mt="lg"
          multiline
          fontSize="xl"
          focusBorderColor="blue700"
        />
        <AppButton block mt="lg" loading={loading} onPress={onContinuePress}>
          Continue
        </AppButton>
      </Div>
      <Div>
        <Snackbar
          ref={ref => (this.snackbarRef = ref)}
          bg="red700"
          color="white"
        />
      </Div>
    </SafeAreaView>
  );
}
