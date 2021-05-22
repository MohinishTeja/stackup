import React from 'react';
import {Skeleton, Avatar} from 'react-native-magnus';
import md5 from 'blueimp-md5';
import {useWalletStorage} from '../hooks';

const GRAVATAR_URL = 'https://www.gravatar.com/avatar';
const AVATAR_SIZE = 80;

export const AccountAvatar = props => {
  const {wallet, loading} = useWalletStorage(set => ({
    wallet: set.wallet,
    loading: set.loading,
  }));

  const getURI = () => {
    return `${GRAVATAR_URL}/${md5(
      wallet.address.toLowerCase(),
    )}?s=${AVATAR_SIZE}&d=retro`;
  };

  return (
    <>
      {!wallet || loading ? (
        <Skeleton.Circle
          h={AVATAR_SIZE}
          w={AVATAR_SIZE}
          alignSelf="center"
          {...props}
        />
      ) : (
        <Avatar
          alignSelf="center"
          size={AVATAR_SIZE}
          source={{uri: getURI()}}
          {...props}
        />
      )}
    </>
  );
};
