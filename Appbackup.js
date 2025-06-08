import { useFonts } from "expo-font";
import * as Splashscreen from "expo-splash-screen";
import { useCallback, useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import {
  inputMuatan,
  Onboarding,
  Search,
  CountryDetails,
  AllReviews,
  AddReviews,
  Recommended,
  PlaceDetails,
  HotelDetails,
  HotelList,
  HotelSearch,
  SelectRoom,
  Payments,
  Settings,
  SelectedRoom,
  Successful,
  Failed,
  PopularDestinations,
  PaymentMethod,
  PopularHotels,
} from "./screens";
import AddGreenTag from "./screens/greentag/addGreentag";
import BottomTabNavigation from "./navigation/BottomTabNavigation";
import AuthTopTab from "./navigation/AuthTopTab";
import { StatusBar } from "expo-status-bar";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AddCard from "./screens/setttings/AddCard";
import { StyleSheet, Text, View, Alert } from "react-native";
import messaging from "@react-native-firebase/messaging";
const Stack = createNativeStackNavigator();

export default function App() {
  const [firstLaunch, setFirstLaunch] = useState(true);

  const requestPermmission = async () => {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      console.log("Authorization status:", authStatus);
    }
  };

  const appFirstLaunch = async () => {
    const onboarding = await AsyncStorage.getItem("first");
    if (onboarding !== null) {
      setFirstLaunch(false);
    } else {
      setFirstLaunch(true);
    }
  };

  useEffect(() => {
    if (requestPermmission()) {
      // return fcm token
      messaging()
        .getToken()
        .then((token) => {
          console.log(token);
        });
    } else {
      console.log("Failed Token", authStatus);
    }

    messaging()
      .getInitialNotification()
      .then(async (remoteMessage) => {
        if (remoteMessage) {
          console.log(
            "Notificatio  app to open from quit state:",
            remoteMessage.notification
          );
        }
      });

    messaging().onNotificationOpenedApp(async (remoteMessage) => {
      console.log(
        "Notification caused app to open from background state",
        remoteMessage.notification
      );
    });

    //register background handlerr
    messaging().setBackgroundMessageHandler(async (remoteMessage) => {
      console.log("Message handled in the background", remoteMessage);
    });

    const unsubscribe = messaging().onMessage(async (remoteMessage) => {
      const { title, body } = remoteMessage.notification;
      Alert.alert(title, body);
    });
    return unsubscribe;
  }, []);

  const [fontsLoaded] = useFonts({
    regular: require("./assets/fonts/regular.otf"),
    medium: require("./assets/fonts/medium.otf"),
    bold: require("./assets/fonts/bold.otf"),
    light: require("./assets/fonts/light.otf"),
    xtrabold: require("./assets/fonts/xtrabold.otf"),
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await Splashscreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <NavigationContainer>
      <StatusBar />
      <Stack.Navigator>
        {firstLaunch && (
          <Stack.Screen
            name="Onboard"
            component={Onboarding}
            options={{ headerShown: false }}
          />
        )}

        <Stack.Screen
          name="Bottom"
          component={BottomTabNavigation}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Search"
          component={Search}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="CountryDetails"
          component={CountryDetails}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Recommended"
          component={Recommended}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="AddReviews"
          component={AddReviews}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="inputMuatan"
          component={AddGreenTag}
          options={{ headerShown: false }}
        />
        {/* inputMuatan */}
        <Stack.Screen
          name="AllReviews"
          component={AllReviews}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="PlaceDetails"
          component={PlaceDetails}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="HotelDetails"
          component={HotelDetails}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="HotelList"
          component={HotelList}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="HotelSearch"
          component={HotelSearch}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="SelectRoom"
          component={SelectRoom}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="PlacesByCountry"
          component={PopularDestinations}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Payments"
          component={PaymentMethod}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Success"
          component={Successful}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="AuthTop"
          component={AuthTopTab}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Fail"
          component={Failed}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Settings"
          component={Settings}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="SelectedRoom"
          component={SelectedRoom}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="AddCard"
          component={AddCard}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="PopularHotels"
          component={PopularHotels}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// import { StyleSheet, Text, View, Alert } from 'react-native';
// import React, {useEffect} from 'react';
// import messaging from '@react-native-firebase/messaging';

// export default function App() {

//   const requestPermmission = async () => {

//     const authStatus = await messaging().requestPermission();
//     const enabled =
//       authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
//       authStatus === messaging.AuthorizationStatus.PROVISIONAL;

//     if (enabled) {
//       console.log('Authorization status:', authStatus);
//     }
//   }

//   useEffect(() => {
//     if(requestPermmission()){
//       // return fcm token
//       messaging().getToken().then(token => {
//         console.log(token);
//       })
//     } else{
//       console.log('Failed Token', authStatus);
//     }

//     messaging()
//       .getInitialNotification()
//       .then( async (remoteMessage) => {
//         if(remoteMessage){
//           console.log('Notificatio  app to open from quit state:', remoteMessage.notification);
//         }
//       });

//       messaging().onNotificationOpenedApp( async (remoteMessage) => {
//         console.log('Notification caused app to open from background state', remoteMessage.notification);
//       });

//       //register background handlerr
//       messaging().setBackgroundMessageHandler(async remoteMessage => {
//         console.log('Message handled in the background', remoteMessage)
//       })

//       const unsubscribe = messaging().onMessage(async remoteMessage => {
//         Alert.alert('A new FCM message arrived!', JSON.stringify(remoteMessage));
//       });
//       return unsubscribe
//   }, []);

//   return (
//     <View style={styles.container}>
//       <Text>Open up App.js to start working on your app!</Text>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
// });
