import React, {useEffect} from 'react';
import {useWindowDimensions} from 'react-native';
import {Div, Text} from 'react-native-magnus';
import Carousel from 'react-native-snap-carousel';

export const AppTabBar = ({state, descriptors, navigation, position}) => {
  const {width: viewportWidth} = useWindowDimensions();
  const wp = percentage => {
    const value = (percentage * viewportWidth) / 100;
    return Math.round(value);
  };
  const sliderWidth = viewportWidth;
  const itemWidth = wp(18) + wp(2) * 2;

  useEffect(() => {
    this.carouselRef.snapToItem(state.index, true, false);
  }, [state]);

  const onSnapToItem = index => {
    navigation.navigate(state.routes[index].name);
  };

  const renderItem = ({item, index}) => {
    const {
      options: {title},
    } = descriptors[item.key];
    const isFocused = state.index === index;

    return (
      <Text
        fontWeight="500"
        fontSize="lg"
        color={(isFocused && 'black') || 'gray700'}
        textAlign="center"
        onPress={() => onSnapToItem(index)}>
        {title}
      </Text>
    );
  };

  return (
    <Div my="md">
      <Carousel
        ref={c => {
          this.carouselRef = c;
        }}
        data={state.routes}
        renderItem={renderItem}
        sliderWidth={sliderWidth}
        itemWidth={itemWidth}
        onSnapToItem={onSnapToItem}
      />
    </Div>
  );
};
