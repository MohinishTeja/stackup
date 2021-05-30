import React from 'react';
import {Div, Text, Button, Icon} from 'react-native-magnus';

export const SectionContainer = ({
  children,
  blueBorder = false,
  redBorder = false,
  onInfoPress,
  title,
  ...props
}) => {
  return (
    <Div {...props}>
      <Div row alignItems="center" justifyContent="space-between">
        <Text fontSize="xl" fontWeight="bold">
          {title}
        </Text>
        {onInfoPress && (
          <Button
            bg="transparent"
            underlayColor="blue100"
            p="xs"
            rounded="circle"
            onPress={onInfoPress}>
            <Icon
              name="questioncircleo"
              fontFamily="AntDesign"
              fontSize="xl"
              color="blue500"
            />
          </Button>
        )}
      </Div>
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
