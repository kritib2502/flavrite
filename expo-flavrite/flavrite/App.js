// import react-native-gesture-handler;
import React, {useEffect} from 'react';
import { 
  Linking,
  StyleSheet, 
  Text, 
  TouchableOpacity, 
  View,
  StatusBar,
  Image 
} from 'react-native';

import Ionicons from 'react-native-vector-icons/Ionicons';
import {SafeAreaProvider, SafeAreaView} from 'react-native-safe-area-context';

import {LogBox} from 'react-native';
LogBox.ignoreAllLogs(); //Hide all warning notifications on front-end

import {navigationRef} from './RootNavigation';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage for storing user token

import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createDrawerNavigator} from '@react-navigation/drawer';
import * as SecureStore from 'expo-secure-store';

import Async from './src/utils/Async';
;
import * as RootNavigation from './RootNavigation';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();
// // AUTHENTICATION


import Gate from './src/auth/gate';
import Login from './src/auth/login';
import Register from './src/auth/signup';
//MainStack with Bottom Tab Navigator

import Explore from './src/home/explore';
import NewExplore from './src/home/newExplore';
import Wishlist from './src/wishlist/index';
import Profile from './src/profile/';
import RateFlava from './src/product/rate';
import FinishFlava from './src/product/finish';
import TextSearch from './src/product/textSearch';
import ShowFlava from './src/product/show';
import Camera from './src/product/camera';
import UserProfile from './src/profile/show';
import People from './src/people/index';
// ONBOARDING
import OnBoarding from './src/onboarding/index3';
import OnBoardingCategory from './src/onboarding/category';

import PrivacyPolicy from './src/terms/PrivacyPolicy';
import TermsOfService from './src/terms/TOS';


function MainStack() {
  useEffect(_ => {
    async function getToken()
    {
      const token = await SecureStore.getItemAsync('token');

    }
    getToken();
  }, []); 

  
  return (
    <Tab.Navigator
    initialRouteName={'NewExplore'}

    screenOptions={({route}) => ({
      activeTintColor: '#000',
      headerShown: false,
      cardStyle: {backgroundColor: 'red'},
	  labelStyle: {fontFamily: 'Baloo2-Bold', fontSize: 11},
      tabBarIcon: ({focused, color, size}) => {
        let iconName;

        if (route.name === 'Add') {
          iconName = focused ? 'add-circle-sharp' : 'ios-add-circle-sharp';
          return (
            <>
              <View
                className='bg-white w-3 h-3 absolute bottom-7'></View>
              <Ionicons
                name={iconName}
                size={70}
                color={'#02BDD6'}
                className='mb-3'
              />
            </>
          );
        } else if (route.name === 'NewExplore') {
          iconName = focused ? 'heart-outline' : 'heart-outline';
        } else if (route.name === 'People') {
          iconName = focused ? 'people-outline' : 'people-outline';
        } else if (route.name === 'Faves') {
          iconName = focused ? 'heart-outline' : 'heart-outline';
        } else if (route.name === 'Wishlist') {
          iconName = focused ? 'bookmark-outline' : 'bookmark-outline';
        }

        // You can return any component that you like here!
        return <Ionicons name={iconName} size={size} color={color} />;
      },
      tabBarStyle: {
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
        paddingTop: 6,
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 6,
        },
        shadowOpacity: 0.37,
        shadowRadius: 7.49,
        elevation: 12,
      },
    })}
    >
		      <Tab.Screen
	  name="NewExplore"
	  component={NewExplore}
	  options={{
		title: 'Faves',
	  }}
	/>


      <Tab.Screen
        name="People"
        component={People}
        options={{
          title: 'People',
        }}
      />

      <Tab.Screen
        name="Camera"
        component={Camera}
        options={({navigation}) => {
          return {
            title: '',
            tabBarButton: () => (
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => navigation.navigate('Camera')}
                className= 'relative flex flex-col items-center justify-center mx-5'
                style={[
                  {
                    shadowColor: '#000',
                    shadowOffset: {
                      width: 0,
                      height: 3,
                    },
                    shadowOpacity: 0.15,
                    shadowRadius: 3.84,
                    elevation: 5,
                  },
                ]}>
                <View
                className='bg-white flex flex-col items-center justify-center -mt-7 w-14 h-14 rounded-full'
                  style={[
                    {backgroundColor: '#E76E50'},
                  ]}>
                  <Image
                    source={require('./src/assets/icons/plus-icon.png')}
                    style={{width: 20, height: 20}}
                    resizeMode="cover"
                  />
                </View>
                <Text
                  className='mt-1 text-center w-full text-gray-400'
                  style={[
                    {
                      fontSize: 11,
                      fontFamily: 'Baloo2-Bold',
                    },
                  ]}>
                  ADD FLAVOR
                </Text>
              </TouchableOpacity>
            ),
          };
        }}
        screenOptions={{
          activeTintColor: 'red',
        }}
      />


<Tab.Screen
        name="Wishlist"
        component={Wishlist}
        options={{
          title: 'Wishlist',
        }}
      />

    </Tab.Navigator>
  )
}
function DrawerStack() {
  return (
	<SafeAreaProvider>
    <Drawer.Navigator
	initialRouteName='NewExplore'
      screenOptions={{
        headerShown: false,
		drawerPosition: "right",
        cardStyle: {backgroundColor: 'transparent'},
        drawerStyle: {backgroundColor: '#F3EEEA'},
		drawerActiveBackgroundColor: '#E76E50',
		drawerActiveTintColor: 'white',
      }}
      >
      <Drawer.Screen name="NewExplore" component={MainStack} />
      <Drawer.Screen name="Profile" component={Profile}  />
	  <Drawer.Screen name="Privacy Policy" component={PrivacyPolicy}  />
	  <Drawer.Screen name="Terms Of Service" component={TermsOfService}  />
    </Drawer.Navigator>
	</SafeAreaProvider>
  )
}
// const linking = {
//   prefixes: ['Flavrite://'],
//   subscribe(listener) {
//     // Listen to incoming links from Firebase Dynamic Links

//     // Listen to incoming links from deep linking
//     const linkingSubscription = Linking.addEventListener('url', ({url}) => {
//       let token = url.split('/');
//       if (token[3]) {
//         token = token[3].replace('%7C', '|');
//         Async.setUserToken(JSON.stringify(token));
//         // RootNavigation.navigate('OnBoarding');
//         RootNavigation.navigate('OnBoardingCategory');
//       }
//     });

//     return () => {
//       linkingSubscription.remove();
//     };
//   },
//   config: {
//     screens: {
//       FastGate: 'gate/:token',
//     },
//   },
// };

export default function App() {

  	return (
    	<SafeAreaProvider>
			<StatusBar backgroundColor="#F3EEEA" barStyle={'dark-content'} />
			<NavigationContainer ref={navigationRef}>
				<Stack.Navigator
					screenOptions={{
					headerShown: false,
					cardStyle: {backgroundColor: 'transparent'},
					}}
				>
					<Stack.Screen name="Gate" component={Gate} />
					<Stack.Screen name="Login" component={Login} />
					<Stack.Screen name="Register" component={Register} />
					{/* <Stack.Screen name="MainStack" component={MainStack} /> */}
					<Stack.Screen name="DrawerStack" component={DrawerStack} />
					<Stack.Screen name="RateFlava" component={RateFlava} />
					<Stack.Screen name="Profile" component={Profile} />
					<Stack.Screen name="ShowFlava" component={ShowFlava} />
					<Stack.Screen name="OnBoarding" component={OnBoarding} />
					<Stack.Screen
					name="OnBoardingCategory"
					component={OnBoardingCategory}
					/>
					<Stack.Screen name="FinishFlava" component={FinishFlava} />
					<Stack.Screen name="TextSearchFlava" component={TextSearch} />
					<Stack.Screen name="Camera" component={Camera} />
					<Stack.Screen name="UserProfile" component={UserProfile} />
      			</Stack.Navigator>
      		</NavigationContainer>
    	</SafeAreaProvider>
  	);
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});
