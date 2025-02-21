import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useFonts } from "expo-font";
import * as ScreenOrientation from "expo-screen-orientation";
import * as Splashscreen from "expo-splash-screen";
import { useCallback, useEffect, useState } from "react";
import {
  AddCilt,
  AllReviews,
  ChecklistScreen,
  CountryDetails,
  DetailLaporanCILT,
  DetailLaporanCILTGIGR,
  DetailLaporanShiftlyCILT,
  EditCilt,
  EditShiftHandOver,
  Failed,
  HomeCILT,
  HomeHO,
  HotelDetails,
  HotelList,
  HotelSearch,
  ListCILT,
  ListCILTDraft,
  ListShiftHandOver,
  Onboarding,
  PaymentMethod,
  PlaceDetails,
  PopularDestinations,
  PopularHotels,
  Recommended,
  Search,
  SelectedRoom,
  SelectRoom,
  Settings,
  ShiftHandOver,
  Successful,
} from "./screens";

import AsyncStorage from "@react-native-async-storage/async-storage";
import messaging from "@react-native-firebase/messaging";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { StatusBar } from "expo-status-bar";
import { Alert } from "react-native";
import AuthTopTab from "./navigation/AuthTopTab";
import BottomTabNavigation from "./navigation/BottomTabNavigation";
import AddCard from "./screens/setttings/AddCard";
//import PushNotification from 'react-native-push-notification';

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
  //const [modalWarning, setModalWarning] = useState(false);

  //lock orientation to portrait
  useEffect(() => {
    const lockOrientation = async () => {
      try {
        await ScreenOrientation.lockAsync(
          ScreenOrientation.OrientationLock.PORTRAIT
        );
        console.log("Screen orientation locked to portrait.");
      } catch (error) {
        console.error("Failed to lock screen orientation:", error);
      }
    };
    lockOrientation();
  }, []);

  // Lock orientation before rendering
  ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT)
    .then(() => console.log("Orientation locked globally."))
    .catch((err) => console.error("Failed to lock orientation:", err));

  //CHEK IF USER CONNECT IN COMPANY NETWORK
  useEffect(() => {
    const checkNetworkConnection = async () => {
      try {
        const apiUrl = process.env.URL;
        const response = await fetch(`${apiUrl}/getgreenTAGallOpen/open`); // or your API endpoint
        if (response.ok) {
          // Connection is active, you can proceed with API calls or data retrieval
          console.log("Connected to the office network");
        } else {
          // Not connected to the office network, show a warning
          Alert.alert(
            "Warning",
            "You are not connected to the office network. Please connect to use this feature."
          );
        }
      } catch (error) {
        // Handle network errors
        console.error("Error checking network connection:", error);
        Alert.alert(
          "Error",
          "There was an error checking your network connection. Please try again later."
        );
      }
    };

    checkNetworkConnection();
  }, []);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     console.log('ini anjg')

  //     try {
  //       const apiUrl = process.env.URL;
  //       const response = await axios.get(`${apiUrl}/getgreenTAGallOpen/open`);
  //       if (response.status === 200) {
  //         console.log('berhasil');
  //         Alert.alert(
  //           'Warning',
  //           'You are not connected to the office network. Please connect to use this App.',
  //         );
  //       } else {
  //         console.log('tidak berhasil');
  //         Alert.alert(
  //           'Warning',
  //           'You are not connected to the office network. Please connect to use this App.',
  //         );
  //       }
  //     } catch (error) {
  //       console.error("Error fetching data:", error);
  //     }
  //   };
  //   fetchData();
  // }, []);

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

  useEffect(() => {
    const requestPermissionAndGetToken = async () => {
      const authStatus = await messaging().requestPermission();
      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

      if (enabled) {
        console.log("Authorization status:", authStatus);

        // Mendapatkan token FCM
        const fcmToken = await messaging().getToken();
        console.log("FCM Token:", fcmToken);
        await AsyncStorage.setItem("fcmToken", fcmToken);
        // TODO: Kirim token ke server Anda disini
        // Kirim token ke server
        sendTokenToServer(fcmToken);
      } else {
        console.log("Failed to get the permission to notify.");
      }
    };

    requestPermissionAndGetToken();

    // Menangani pemberitahuan saat aplikasi dibuka dari keadaan tertutup
    messaging()
      .getInitialNotification()
      .then(async (remoteMessage) => {
        if (remoteMessage) {
          console.log(
            "Notification caused app to open from quit state:",
            remoteMessage.notification
          );
        }
      });

    // Menangani pemberitahuan saat aplikasi berada di latar belakang dan dibuka
    messaging().onNotificationOpenedApp(async (remoteMessage) => {
      console.log(
        "Notification caused app to open from background state:",
        remoteMessage.notification
      );
    });

    // Menangani pemberitahuan saat aplikasi berada di latar depan
    const unsubscribe = messaging().onMessage(async (remoteMessage) => {
      const { title, body } = remoteMessage.notification;
      Alert.alert(title, body);
    });

    // Menangani pesan di latar belakang
    messaging().setBackgroundMessageHandler(async (remoteMessage) => {
      console.log(
        "Message handled in the background:",
        remoteMessage.notification
      );
    });
    return unsubscribe; // Bersihkan langganan saat komponen dilepas
  }, []);

  // CHEK IF USER WAS LOGIN
  useEffect(() => {
    const checkLogin = async () => {
      const user = await AsyncStorage.getItem("user");
      if (user) {
        await GoogleSignin.hasPlayServices();
        setFirstLaunch(false);
      }
    };
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
      <Stack.Navigator
        screenOptions={{
          headerShown: true,
          animationEnabled: true, // Optional, for smooth transitions
          orientation: "portrait", // Enforce portrait in React Navigation
        }}
      >
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
          name="ChecklistScreen"
          component={ChecklistScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="AddCilt"
          component={AddCilt}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="EditCilt"
          component={EditCilt}
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
        <Stack.Screen
          name="ShiftHandOver"
          component={ShiftHandOver}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ListShiftHandOver"
          component={ListShiftHandOver}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="ListCILT"
          component={ListCILT}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ListCILTDraft"
          component={ListCILTDraft}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="DetailLaporanShiftlyCILT"
          component={DetailLaporanShiftlyCILT}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="DetailLaporanCILT"
          component={DetailLaporanCILT}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="DetailLaporanCILTGIGR"
          component={DetailLaporanCILTGIGR}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="HomeHO"
          component={HomeHO}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="HomeCILT"
          component={HomeCILT}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="EditShiftHandOver"
          component={EditShiftHandOver}
          options={{ headerShown: false }}
        />
        {/* 
    
       
        <Stack.Screen
          name="EditShiftHandOver"
          component={EditShiftHandOver}
          options={{ headerShown: false }}
        /> */}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
