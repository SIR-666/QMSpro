import { useState, useEffect } from "react";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const checkUser = () => {
  const [userData, setUserData] = useState(null);
  const [time, setTime] = useState(null);
  const [userLogin, setUserLogin] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const getTimeOfDay = () => {
    const now = new Date();
    const hour = now.getHours();

    if (hour >= 0 && hour < 12) {
      return "☀️ ";
    } else if (hour >= 12 && hour < 17) {
      return "🌤️ ";
    } else {
      return "🌙 ";
    }
  };

  const checkExistingUser = async () => {
    const id = await AsyncStorage.getItem("id");
    const token = await AsyncStorage.getItem("token");
    const userId = JSON.parse(id);
    const accessToken = JSON.parse(token);
    const greeting = getTimeOfDay();

    setTime(greeting);

    try {
      if (userId !== null) {
        try {
          const response = await axios.get("http://localhost:5003/api/users", {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          });

          if (response.status === 200) {
            setUserData(response.data);
            if (userId === response.data._id) {
              setUserLogin(true);
              setUserData(response.data);
            } else {
              Alert.alert(
                "Incorrect Account ",
                "Please login with your own account ",
                [
                  {
                    text: "Cancel",
                    onPress: () => {},
                  },
                  {
                    text: "Continue",
                    onPress: () => navigation.navigate("AuthTop"),
                  },
                  { defaultIndex: 1 },
                ]
              );
            }
          }
        } catch (error) {
          console.log("Failed to get products", error);
        }
      } else {
      }
    } catch (error) {
      console.log("Error retrieving the data:", error);
    }
  };

  useEffect(() => {
    checkExistingUser();
  }, []);

  return { userLogin, userData, isLoading, time };
};

export default checkUser;
