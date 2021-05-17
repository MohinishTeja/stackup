import React from 'react';
import {Icon} from 'react-native-magnus';
import {AppButton} from '.';

export const AccountExplorer = props => {
  return (
    <AppButton
      outline
      suffix={
        <Icon
          name="arrowright"
          color="blue500"
          fontSize="md"
          fontFamily="AntDesign"
        />
      }
      {...props}>
      Activity
    </AppButton>
  );
};
