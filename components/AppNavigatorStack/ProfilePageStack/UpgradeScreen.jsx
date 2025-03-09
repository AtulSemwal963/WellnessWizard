import React, { useRef } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Dimensions,
} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { useNavigation } from '@react-navigation/native';
import PriceTabView from './PriceTabView';

const SCREEN_WIDTH = Dimensions.get('window').width;



export default function UpgradeScreen() {
  const navigation = useNavigation();


  return (
    <View className="bg-gray-300 w-full h-full">
      <SafeAreaView
        className="self-center flex-col items-center bg-gray-100 h-full w-full rounded-3xl"
        style={[styles.container]}
      >
        <View
          style={[styles.header, { width: '100%' }]}
          className="w-full flex-row"
        >
          <TouchableOpacity onPress={() => navigation.navigate('ProfileHome')}>
            <AntDesign name={'arrowleft'} size={25} color={'black'} />
          </TouchableOpacity>
          <Text
            className="self-center text-xl text-center"
            style={{ fontFamily: 'Gabarito-SemiBold', width: '85%' }}
          >
            Upgrade to Unlimited
          </Text>
        </View>
        <ScrollView className="w-full">
          <View className="flex-col my-5">
            <View
              className="flex-row justify-between self-center bg-gray-200 p-3 rounded-lg"
              style={{
                width: '95%',
                borderBottomLeftRadius: 0,
                borderBottomRightRadius: 0,
              }}
            >
              <Text
                className="text-2xl flex-1 text-center"
                style={{ fontFamily: 'Gabarito-SemiBold' }}
              >
                Feature
              </Text>
              <Text
                className="text-2xl flex-1 text-center"
                style={{ fontFamily: 'Gabarito-SemiBold' }}
              >
                Free
              </Text>
              <Text
                className="text-2xl flex-1 text-center"
                style={{ fontFamily: 'Gabarito-SemiBold' }}
              >
                Paid
              </Text>
            </View>

            <View
              className="flex-row justify-between self-center p-3"
              style={{
                width: '95%',
                borderWidth: 1,
                borderColor: '#b0bec5',
                borderTopWidth: 0,
              }}
            >
              <Text
                className="text-lg flex-1 text-center"
                style={{ fontFamily: 'Gabarito-SemiBold' }}
              >
                Text Input
              </Text>
              <AntDesign
                name="check"
                color="black"
                size={20}
                style={{ flex: 1, textAlign: 'center' }}
              />
              <AntDesign
                name="check"
                color="black"
                size={20}
                style={{ flex: 1, textAlign: 'center' }}
              />
            </View>

            <View
              className="flex-row justify-between self-center p-3"
              style={{
                width: '95%',
                borderWidth: 1,
                borderColor: '#b0bec5',
                borderTopWidth: 0,
              }}
            >
              <Text
                className="text-lg flex-1 text-center"
                style={{ fontFamily: 'Gabarito-SemiBold' }}
              >
                Photo Input
              </Text>
              <AntDesign
                name="close"
                color="black"
                size={20}
                style={{ flex: 1, textAlign: 'center' }}
              />
              <AntDesign
                name="check"
                color="black"
                size={20}
                style={{ flex: 1, textAlign: 'center' }}
              />
            </View>

            <View
              className="flex-row justify-between self-center p-3"
              style={{
                width: '95%',
                borderWidth: 1,
                borderColor: '#b0bec5',
                borderTopWidth: 0,
              }}
            >
              <Text
                className="text-lg flex-1 text-center"
                style={{ fontFamily: 'Gabarito-SemiBold' }}
              >
                Ad-Free
              </Text>
              <AntDesign
                name="close"
                color="black"
                size={20}
                style={{ flex: 1, textAlign: 'center' }}
              />
              <AntDesign
                name="check"
                color="black"
                size={20}
                style={{ flex: 1, textAlign: 'center' }}
              />
            </View>

            <View
              className="flex-row justify-between self-center p-3 rounded-lg"
              style={{
                width: '95%',
                borderWidth: 1,
                borderColor: '#b0bec5',
                borderTopWidth: 0,
                borderTopRightRadius: 0,
                borderTopLeftRadius: 0,
              }}
            >
              <Text
                className="text-lg flex-1 text-center"
                style={{ fontFamily: 'Gabarito-SemiBold' }}
              >
                Get diagnosis based on reports
              </Text>
              <AntDesign
                name="close"
                color="black"
                size={20}
                style={{ flex: 1, textAlign: 'center' }}
              />
              <AntDesign
                name="check"
                color="black"
                size={20}
                style={{ flex: 1, textAlign: 'center' }}
              />
            </View>
          </View>
          <Text
            style={{ marginTop: -5, fontFamily: 'Gabarito-SemiBold' }}
            className="text-xl text-center"
          >
            Choose Your Plan
          </Text>
            <PriceTabView />        
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgb(243 244 246)',
    paddingHorizontal: 16,
    width: '96%',
    marginTop: '2%',
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
  },
  scrollViewContent: {
    alignItems: 'center', // Centers content horizontally
    justifyContent: 'center', // Centers content vertically
    paddingHorizontal: 10, // Optional: Adjust as needed for spacing
  },
  scrollView: {
    width: '100%',
  },
  scene: {
    alignItems: 'center',
    justifyContent: 'center',
    width: SCREEN_WIDTH, // Full width of the screen to center the view
  },
  card: {
    height: 250,
    width: 200,
    backgroundColor: 'gray',
    borderRadius: 20,
    marginHorizontal: 10, // Add margin to ensure spacing between cards
  },
  cardHeader: {
    height: '20%',
    width: '100%',
    backgroundColor: 'gray',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  cardBody: {
    height: '80%',
    width: '100%',
    backgroundColor: 'white',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
});

