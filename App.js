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
  ChecklistScreen,
  ListRecordPatrol,
  ListTemuanPatrol,
  ListRecordPatrolAsDarft,
  EditchecklistPatrol
} from "./screens";
//import listGreentag from "./screens/list_greentag/listGreentag";
//import AddGreenTag from "./screens/greentag/addGreentag";
import BottomTabNavigation from "./navigation/BottomTabNavigation";
import AuthTopTab from "./navigation/AuthTopTab";
import { StatusBar } from "expo-status-bar";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AddCard from "./screens/setttings/AddCard";
import { StyleSheet, Text, View, Alert } from "react-native";
import messaging from "@react-native-firebase/messaging";
import { GoogleSignin, GoogleSigninButton, statusCodes } from '@react-native-google-signin/google-signin';
const Stack = createNativeStackNavigator();


// Fungsi untuk mengirim token ke server
const sendTokenToServer = async (token) => {
  console.log("registrasi Token:", token);
  const apiUrl2 = process.env.URL2;
  const port3 = process.env.PORT_NO;
  const endpoint = `${apiUrl2}:${port3}/notification/registerToken`;

  console.log("endpoint ", endpoint);

  try {
    let response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token }),
      // body: token,
    });

    // let responseJson = await response.json();
    let responseJson = await response.text();
    console.log("Server response:", responseJson);
  } catch (error) {
    console.error("error ", error);
  }
};

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
    const onboarding = await AsyncStorage.getItem("user");
    if (onboarding !== null) {
      setFirstLaunch(false);
    } else {
      setFirstLaunch(true);
    }
  };

  // useEffect(() => {
  //   const requestPermissionAndGetToken = async () => {
  //     const authStatus = await messaging().requestPermission();
  //     const enabled =
  //       authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
  //       authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  //     if (enabled) {
  //       console.log("Authorization status:", authStatus);

  //       // Mendapatkan token FCM
  //       const fcmToken = await messaging().getToken();
  //       console.log("FCM Token:", fcmToken);

  //       // TODO: Kirim token ke server Anda disini
  //       // Kirim token ke server
  //       sendTokenToServer(fcmToken);
  //     } else {
  //       console.log("Failed to get the permission to notify.");
  //     }
  //   };

  //   requestPermissionAndGetToken();

  //   // Menangani pemberitahuan saat aplikasi dibuka dari keadaan tertutup
  //   messaging()
  //     .getInitialNotification()
  //     .then(async (remoteMessage) => {
  //       if (remoteMessage) {
  //         console.log(
  //           "Notification caused app to open from quit state:",
  //           remoteMessage.notification
  //         );
  //       }
  //     });

  //   // Menangani pemberitahuan saat aplikasi berada di latar belakang dan dibuka
  //   messaging().onNotificationOpenedApp(async (remoteMessage) => {
  //     console.log(
  //       "Notification caused app to open from background state:",
  //       remoteMessage.notification
  //     );
  //   });

  //   // Menangani pemberitahuan saat aplikasi berada di latar depan
  //   const unsubscribe = messaging().onMessage(async (remoteMessage) => {
  //     const { title, body } = remoteMessage.notification;
  //     Alert.alert(title, body);
  //   });

  //   // Menangani pesan di latar belakang
  //   messaging().setBackgroundMessageHandler(async (remoteMessage) => {
  //     console.log(
  //       "Message handled in the background:",
  //       remoteMessage.notification
  //     );
  //   });


  //   return unsubscribe; // Bersihkan langganan saat komponen dilepas
  // }, []);


  // CHEK IF USER Connect Network Greendfields 
  // useEffect(() => {
  //   const checkPing = async () => {
  //     try {
  //       const response = await fetch('http://10.24.19.51:3000/checkPing', {
  //         method: 'POST',
  //         headers: {
  //           'Content-Type': 'application/json',
  //         },
  //         // Body kosong karena endpoint tidak memerlukan data dalam body
  //         body: JSON.stringify({}),
  //       });
  //       const data = await response.json();
  //       console.log('Response:', data);
  //     } catch (error) {
  //       Alert.alert('error')
  //       console.error('Error:', error);
  //     }
  //   };
  //   checkPing();

  // }, []);




  // CHEK IF USER WAS LOGIN 
  useEffect(() => {
    const checkLogin = async () => {
      const user = await AsyncStorage.getItem('user');
      if(user){
        await GoogleSignin.hasPlayServices();
        setFirstLaunch(false);
      }
    }
    checkLogin();

    // Menghapus semua data dari AsyncStorage setelah sebulan (30 hari)
    const thirtyDaysInMillis = 30 * 24 * 60 * 60 * 1000;
    const removeAfterThirtyDays = setTimeout(async () => {
      await AsyncStorage.clear();
    }, thirtyDaysInMillis);

    // Cleanup function untuk membersihkan timeout jika komponen di-unmount atau di-update
    return () => {
      clearTimeout(removeAfterThirtyDays);
    };
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
        {/* <Stack.Screen
          name="ListGreentag"
          component={ListGreentag}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="AddGreenTag"
          component={AddGreenTag}
          options={{ headerShown: false }}
        /> */}
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
          name="ChecklistScreen"
          component={ChecklistScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ListRecordPatrol"
          component={ListRecordPatrol}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ListTemuanPatrol"
          component={ListTemuanPatrol}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ListRecordPatrolAsDarft"
          component={ListRecordPatrolAsDarft}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="EditchecklistPatrol"
          component={EditchecklistPatrol}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}


