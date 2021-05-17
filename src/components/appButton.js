import React from 'react';
import {Button, Skeleton} from 'react-native-magnus';

const SKELETON_HEIGHT = 44;

export const AppButton = ({
  loading = false,
  outline = false,
  danger = false,
  marginTop = false,
  onPress,
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
    <>
      {loading ? (
        <Skeleton.Box
          h={SKELETON_HEIGHT}
          mt={(marginTop && 'lg') || undefined}
          {...props}
        />
      ) : (
        <Button
          block
          mt={(marginTop && 'lg') || undefined}
          onPress={onPress}
          {...outlineProps}
          {...dangerProps}
          {...props}>
          {children}
        </Button>
      )}
    </>
  );
};
