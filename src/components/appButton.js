import React from 'react';
import {Button} from 'react-native-magnus';

export const AppButton = ({
  outline = false,
  danger = false,
  children,
  ...props
}) => {
  const outlineProps =
    (outline && {
      bg: 'white',
      borderWidth: 1,
      borderColor: 'blue500',
      color: 'blue500',
      loaderColor: 'blue500',
      underlayColor: 'blue100',
    }) ||
    {};

  const dangerProps =
    (danger && {
      bg: 'white',
      borderWidth: 1,
      borderColor: 'red500',
      color: 'red500',
      loaderColor: 'red500',
      underlayColor: 'red100',
    }) ||
    {};

  return (
    <Button {...outlineProps} {...dangerProps} {...props}>
      {children}
    </Button>
  );
};
