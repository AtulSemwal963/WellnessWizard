import React, { useState, useRef } from 'react';
import {
  Text,
  View,
  Animated,
  TouchableWithoutFeedback,
  Easing,
} from 'react-native';

export default function PriceTabView() {
  const [selectedCard, setSelectedCard] = useState(null);

  // Animated values for scaling, translation, and rotation
  const scaleAnimations = useRef([
    new Animated.Value(1),
    new Animated.Value(1),
    new Animated.Value(1),
  ]).current;

  const translateYAnimations = useRef([
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0),
  ]).current;

  const rotationAnimations = useRef([
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0),
  ]).current;

  const handleCardPress = (index) => {
    if (selectedCard === index) {
      // Reset scale, translation, and rotation for the same card
      Animated.parallel([
        Animated.timing(scaleAnimations[index], {
          toValue: 1,
          duration: 300,
          easing: Easing.ease,
          useNativeDriver: true,
        }),
        Animated.timing(translateYAnimations[index], {
          toValue: 0,
          duration: 300,
          easing: Easing.ease,
          useNativeDriver: true,
        }),
        Animated.timing(rotationAnimations[index], {
          toValue: 0,
          duration: 300,
          easing: Easing.ease,
          useNativeDriver: true,
        }),
      ]).start(() => setSelectedCard(null));
    } else {
      // Reset other cards
      scaleAnimations.forEach((anim, idx) => {
        if (idx !== index) {
          Animated.parallel([
            Animated.timing(anim, {
              toValue: 1,
              duration: 300,
              easing: Easing.ease,
              useNativeDriver: true,
            }),
            Animated.timing(translateYAnimations[idx], {
              toValue: 0,
              duration: 300,
              easing: Easing.ease,
              useNativeDriver: true,
            }),
            Animated.timing(rotationAnimations[idx], {
              toValue: 0,
              duration: 300,
              easing: Easing.ease,
              useNativeDriver: true,
            }),
          ]).start();
        }
      });

      // Apply scaling, translation, and rotation to the selected card
      Animated.parallel([
        Animated.timing(scaleAnimations[index], {
          toValue: 1.2,
          duration: 300,
          easing: Easing.ease,
          useNativeDriver: true,
        }),
        Animated.timing(translateYAnimations[index], {
          toValue: -30,
          duration: 300,
          easing: Easing.ease,
          useNativeDriver: true,
        }),
        Animated.timing(rotationAnimations[index], {
          toValue: 10,
          duration: 300,
          easing: Easing.ease,
          useNativeDriver: true,
        }),
      ]).start(() => setSelectedCard(index));
    }
  };

  const getRotationStyle = (index) => {
    const rotate = rotationAnimations[index].interpolate({
      inputRange: [0, 10],
      outputRange: ['0deg', '10deg'],
    });

    return { transform: [{ rotate }] };
  };

  const PriceCard = ({ props }) => {
    return (
      <>
        <View
          className="bg-gray-300 rounded-lg"
          style={{
            width: '100%',
            height: '10%',
            borderBottomRightRadius: 0,
            borderBottomLeftRadius: 0,
          }}
        >
          <View
            className="bg-gray-100 self-center"
            style={{ width: '50%', height: '30%' }}
          ></View>
        </View>
        <View
          className="bg-gray-100 self-center rounded-lg flex-col"
          style={{ height: '86%', width: '90%' }}
        >
          <Text
            className="text-center text-2xl"
            style={{ fontFamily: 'Gabarito-SemiBold' }}
          >
            {props[0]}
          </Text>
          <Text
            className="text-center"
            style={{ fontFamily: 'Gabarito-SemiBold', fontSize: 60 }}
          >
            ₹{props[1]}
          </Text>
          <View
            style={{ width: '90%', height: '1%' }}
            className="bg-gray-500 rounded-full self-center my-3"
          ></View>
          <Text
            className="text-center text-2xl text-gray-500"
            style={{ fontFamily: 'Gabarito-SemiBold' }}
          >
            {props[2]}
          </Text>
          <View
            style={{ width: '90%', height: '1%' }}
            className="bg-gray-500 rounded-full self-center my-3"
          ></View>
          <Text
            className="text-center text-2xl text-gray-500"
            style={{ fontFamily: 'Gabarito-SemiBold' }}
          >
            Click for More Details
          </Text>
        </View>
      </>
    );
  };

  return (
    <View
      className="flex-row justify-center h-full w-full"
      style={{
        flex: 1,
        transform: [{ scale: 0.7 }],
        backgroundColor: 'rgba(0,0,0,0)',
        marginTop:10,
      }}
    >
      <TouchableWithoutFeedback onPress={() => handleCardPress(0)}>
        <Animated.View
          style={{
            height: 250,
            width: 150,
            transform: [
              { rotate: '-30deg' },
              { scale: scaleAnimations[0] },
              { translateY: translateYAnimations[0] },
              ...getRotationStyle(0).transform,
            ],
            zIndex: selectedCard === 0 ? 1 : -1,
            position: 'absolute',
            left: 10,
            elevation: 10,
          }}
          className="bg-gray-300 rounded-lg flex-col"
        >
          <PriceCard props={['3 Months', '99', 'Basic Plan']} />
        </Animated.View>
      </TouchableWithoutFeedback>

      <TouchableWithoutFeedback onPress={() => handleCardPress(1)}>
        <Animated.View
          style={{
            height: 250,
            width: 150,
            transform: [
              { scale: scaleAnimations[1] },
              { translateY: translateYAnimations[1] },
              ...getRotationStyle(1).transform,
            ],
            zIndex: selectedCard === 1 ? 1 : -1,
            opacity: selectedCard === 1 ? 1 : 0.7,
          }}
          className="bg-gray-300 rounded-lg flex-col"
        >
          <PriceCard props={['6 Months', '299', 'Premium Plan']} />
        </Animated.View>
      </TouchableWithoutFeedback>

      <TouchableWithoutFeedback onPress={() => handleCardPress(2)}>
        <Animated.View
          style={{
            height: 250,
            width: 150,
            transform: [
              { rotate: '30deg' },
              { scale: scaleAnimations[2] },
              { translateY: translateYAnimations[2] },
              ...getRotationStyle(2).transform,
            ],
            zIndex: selectedCard === 2 ? 1 : -1,
            position: 'absolute',
            right: 10,
            elevation: 10,
          }}
          className="bg-gray-300 rounded-lg flex-col"
        >
          <PriceCard props={['12 Months', '499', 'Ultimate Plan']} />
        </Animated.View>
      </TouchableWithoutFeedback>
    </View>
  );
}
