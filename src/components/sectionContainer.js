import React from 'react';
import {Div, Text} from 'react-native-magnus';

export const SectionContainer = ({
  children,
  blueBorder = false,
  redBorder = false,
  title,
  ...props
}) => {
  return (
    <Div {...props}>
      <Text fontSize="xl" fontWeight="bold">
        {title}
      </Text>
      <Div
        mt="sm"
        p="lg"
        borderWidth={1}
        borderColor={
          (blueBorder && 'blue500') || (redBorder && 'red500') || 'black'
        }
        rounded="md">
        {children}
      </Div>
    </Div>
  );
};
