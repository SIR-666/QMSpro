import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Location from "expo-location";
import { useState, useEffect } from "react";


const fetchUserLocation = () => {
    const [location, setLocation] = useState(null);
    const [errorMsg, setErrorMsg] = useState(null);

    const getPermisions = async () => {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
            setErrorMsg("Permission to access location was denied");
            return;
        }
    };

    const getLocation = async () => {
        getPermisions();
        let location = await Location.getCurrentPositionAsync({});
        let newLocation = {
            id: 442,
            title: "Your Current Location",
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
        };
        setLocation(newLocation);
        // await AsyncStorage.setItem(
        //     'location',
        //     JSON.stringify(newLocation)
        //   );
    };

    useEffect(() => {
        getLocation();
    }, []);

    let text = "Waiting..";
    if (errorMsg) {
      text = errorMsg;
    } else if (location) {
      text = JSON.stringify(location);
    }

    return {location, errorMsg}
} 

export default fetchUserLocation