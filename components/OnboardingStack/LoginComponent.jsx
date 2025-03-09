import React, { useEffect, useState } from 'react';
import { Text, View, useWindowDimensions, Image, StyleSheet, TouchableOpacity,Alert,Keyboard } from 'react-native';
import { TabView, SceneMap } from 'react-native-tab-view';
import { useFonts } from 'expo-font';
import Constants from 'expo-constants'
import Animated, { 
  useAnimatedStyle, 
  withSpring, 
  withTiming,
  withRepeat,
  withSequence,
  useSharedValue,
  interpolate,
  useAnimatedProps
} from 'react-native-reanimated';

const slide1Picture = require('../../assets/images/slide1.png');
const slide2Picture = require('../../assets/images/slide2.png');
const slide3Picture = require('../../assets/images/slide3.png');
const slide4Picture = require('../../assets/images/slide4.png');
const slide5Picture = require('../../assets/images/slide5.png');

const PASTEL_COLORS = ['#f0abfc', '#a5b4fc', '#6ee7b7', '#f9a8d4'];

const getRandomColor = () => {
  return PASTEL_COLORS[Math.floor(Math.random() * PASTEL_COLORS.length)];
};

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

export default function LoginComponent({ navigation }) {
  const [loaded, error] = useFonts({
    'Gabarito-Regular': require('../../assets/fonts/Gabarito-Regular.ttf'),
    'Gabarito-Medium': require('../../assets/fonts/Gabarito-Medium.ttf'),
    'Gabarito-SemiBold': require('../../assets/fonts/Gabarito-SemiBold.ttf'),
    'Gabarito-Bold': require('../../assets/fonts/Gabarito-Bold.ttf'),
  });
  const [index, setIndex] = useState(0);
  const layout = useWindowDimensions();
  const [routes] = useState([
    { key: 'first', title: 'Slide1' },
    { key: 'second', title: 'Slide2' },
    { key: 'third', title: 'Slide3' },
    { key: 'fourth', title: 'Slide4' },
  ]);
 
  const progress = useSharedValue(0);
  const scale = useSharedValue(1);
  const sphereScale = useSharedValue(1);

  const [circleColors] = useState({
    circle1: getRandomColor(),
    circle2: getRandomColor(),
    circle3: getRandomColor(),
    circle4: getRandomColor(),
    sphere: getRandomColor(),
  });

  useEffect(() => {
    progress.value = withTiming((index + 1) * 25, { duration: 500 });
  }, [index]);

  useEffect(() => {
    scale.value = withRepeat(
      withSequence(
        withTiming(1.03, { duration: 3000 }),
        withTiming(1, { duration: 3000 })
      ),
      -1,
      true
    );
  }, []);

  useEffect(() => {
    sphereScale.value = withRepeat(
      withSequence(
        withTiming(1.1, { duration: 4000 }),
        withTiming(1, { duration: 4000 })
      ),
      -1,
      true
    );
  }, []);

  const progressAnimatedStyle = useAnimatedStyle(() => ({
    width: `${progress.value}%`,
  }));

  const imageAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const sphereAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: sphereScale.value }],
  }));

  const nextButtonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: withSpring(0.95, { damping: 15 }) }],
    opacity: withSpring(0.98),
  }));

  if (!loaded && !error) {
    return null;
  }

  const Slide1 = () => (
    <View style={{ flex: 1 }}>
      <Animated.View style={[dynamicStyles.backgroundSphere, sphereAnimatedStyle]} />
      <Animated.View style={[styles.slideImageContainer, imageAnimatedStyle]}>
        <Image 
          source={slide1Picture} 
          style={styles.slideImage}
        />
      </Animated.View>
      <View style={styles.slideTextContainer}>
        <Text style={styles.header}>Welcome to Wellness Wizard</Text>
        <Text style={styles.body}>
          Your personal healthcare assistant that uses Artificial Intelligence to help you understand and manage your health.
        </Text>
      </View>
    </View>
  );

  const Slide2 = () => (
    <View style={{ flex: 1 }}>
      <Animated.View style={[dynamicStyles.backgroundSphere, sphereAnimatedStyle]} />
      <Animated.View style={[styles.slideImageContainer, imageAnimatedStyle]}>
        <Image 
          source={slide2Picture} 
          style={[styles.slideImage,{transform:"scale(0.97)"}]}
        />
      </Animated.View>
      <View style={styles.slideTextContainer}>
        <Text style={styles.header}>AI-Powered Diagnostics</Text>
        <Text style={styles.body}>
          Our advanced AI analyzes your symptoms and medical history to provide personalized health insights.
        </Text>
      </View>
    </View>
  );

  const Slide3 = () => (
    <View style={{ flex: 1 }}>
      <Animated.View style={[dynamicStyles.backgroundSphere, sphereAnimatedStyle]} />
      <Animated.View style={[styles.slideImageContainer, imageAnimatedStyle]}>
        <Image 
          source={slide3Picture} 
          style={[styles.slideImage,{transform:"scale(0.97)"}]}
        />
      </Animated.View>
      <View style={styles.slideTextContainer}>
        <Text style={styles.header}>Easy to Use</Text>
        <Text style={styles.body}>
          Simply input your symptoms, and our AI will guide you through the diagnostic process step by step.
        </Text>
      </View>
    </View>
  );

  const Slide4 = () => (
    <View style={{ flex: 1 }}>
      <Animated.View style={[dynamicStyles.backgroundSphere, sphereAnimatedStyle]} />
      <Animated.View style={[styles.slideImageContainer, imageAnimatedStyle]}>
        <Image 
          source={slide5Picture} 
          style={styles.slideImage}
        />
      </Animated.View>
      <View style={styles.slideTextContainer}>
        <Text style={styles.header}>Your Health Journey Begins</Text>
        <Text style={styles.body}>
          Experience the future of healthcare with Wellness Wizard. Get started today and take control of your health with our AI-powered diagnostics.
        </Text>
      </View>
    </View>
  );

  const renderScene = SceneMap({
    first: Slide1,
    second: Slide2,
    third: Slide3,
    fourth: Slide4,
  });

  // Create dynamic styles using the circleColors
  const dynamicStyles = {
    circle1: {
      position: 'absolute',
      top: -100,
      right: -100,
      width: 200,
      height: 200,
      borderRadius: 100,
      transform: [{scale: 1.2}],
      backgroundColor: circleColors.circle1 + '40',
    },
    circle2: {
      position: 'absolute',
      bottom: 50,
      left: -50,
      width: 150,
      height: 150,
      borderRadius: 75,
      backgroundColor: circleColors.circle2 + '35',
    },
    circle3: {
      position: 'absolute',
      top: '40%',
      right: -30,
      width: 100,
      height: 100,
      borderRadius: 50,
      backgroundColor: circleColors.circle3 + '30',
    },
    circle4: {
      position: 'absolute',
      top: '20%',
      left: -20,
      width: 80,
      height: 80,
      borderRadius: 40,
      backgroundColor: circleColors.circle4 + '38',
    },
    backgroundSphere: {
      position: 'absolute',
      top: '15%',
      alignSelf: 'center',
      width: 300,
      height: 300,
      borderRadius: 150,
      backgroundColor: circleColors.sphere + '32',
      zIndex: -1,
    },
  };

  return (
    <View style={{
        flex: 1,
        backgroundColor:"white",
      }}>
      <View style={styles.backgroundShapes}>
        <View style={dynamicStyles.circle1} />
        <View style={dynamicStyles.circle2} />
        <View style={dynamicStyles.circle3} />
        <View style={dynamicStyles.circle4} />
      </View>
      <View style={{
    height: '70%',
    marginTop:"20%"
  }}>
        <TabView
          navigationState={{ index, routes }}
          renderScene={renderScene}
          onIndexChange={setIndex}
          initialLayout={{ width: layout.width }}
          renderTabBar={() => null}
          swipeEnabled={true}
        />
      </View>
      <View style={styles.progressContainer}>
        <View style={styles.progressTrack}>
          <Animated.View
            style={[styles.progressBar, progressAnimatedStyle]}
          />
        </View>
        <View style={styles.dotsContainer}>
          {[0, 1, 2, 3].map((dotIndex) => (
            <TouchableOpacity 
              key={dotIndex}
              onPress={() => setIndex(dotIndex)}
              style={[
                styles.dot,
                index === dotIndex && styles.activeDot
              ]}
            />
          ))}
        </View>
      </View>
      {index < 3 && (
        <View style={styles.buttonContainer}>
          <AnimatedTouchableOpacity
            style={[styles.nextButton, nextButtonStyle]}
            onPress={() => setIndex(index + 1)}
          >
            <View style={styles.buttonGradient}>
              <Text style={styles.buttonText}>Continue</Text>
            </View>
          </AnimatedTouchableOpacity>
        </View>
      )}
      {index === 3 && (
        <View style={styles.authButtonsContainer}>
          <TouchableOpacity
            style={styles.signupButton}
            onPress={() => navigation.navigate('Signup')}
          >
            <Text style={styles.signupText}>Sign up</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.signinButton}
            onPress={() => navigation.navigate('Signin')}
          >
            <Text style={styles.signinText}>Sign in</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    fontSize: 24,
    fontFamily: 'Gabarito-SemiBold',
    textAlign: 'center',
  },
  body: {
    fontSize: 16,
    fontFamily: 'Gabarito-Regular',
    textAlign: 'center',
    color: '#758DA3',
  },
  backgroundShapes: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    overflow: 'hidden',
  },
  progressContainer: {
    width: '85%',
    alignSelf: 'center',
    marginBottom: 30,
  },
  progressTrack: {
    height: 3,
    backgroundColor: 'rgba(117, 141, 163, 0.1)',
    borderRadius: 1.5,
    marginBottom: 20,
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#758DA3',
    borderRadius: 1.5,
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: 'rgba(117, 141, 163, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(117, 141, 163, 0.2)',
  },
  activeDot: {
    backgroundColor: '#758DA3',
    transform: [{scale: 1.2}],
    borderWidth: 0,
  },
  buttonContainer: {
    paddingHorizontal: 24,
    paddingBottom: 20,
  },
  nextButton: {
    borderRadius: 16,
    backgroundColor: '#758DA3',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    overflow: 'hidden',
  },
  buttonGradient: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontFamily: 'Gabarito-SemiBold',
    letterSpacing: 0.5,
  },
  authButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingBottom: 20,
    gap: 16,
  },
  signupButton: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#758DA3',
    paddingVertical: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  signinButton: {
    flex: 1,
    backgroundColor: '#758DA3',
    borderRadius: 16,
    paddingVertical: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  signupText: {
    color: '#758DA3',
    fontSize: 18,
    fontFamily: 'Gabarito-Medium',
    textAlign: 'center',
  },
  signinText: {
    color: 'white',
    fontSize: 18,
    fontFamily: 'Gabarito-Medium',
    textAlign: 'center',
  },
  slideImageContainer: {
    height: '75%',
    width: '100%',
    overflow: 'hidden',
    zIndex: 1,
  },
  slideImage: {
    height: '100%',
    width: '100%',
    resizeMode: 'cover',
  },
  slideTextContainer: {
    height: '30%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
});
