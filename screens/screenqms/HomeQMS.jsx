// import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
// import React from "react";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
// import { Image } from "expo-image";
import { HeightSpacer } from "../../components";
// import styles from "./home.style";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { Border, Color, FontSize } from "../../GlobalStyles";
import checkUser from "../../hook/checkUser";

const HomeQMS = ({ navigation }) => {
  const { userLogin, userData, isLoading, time } = checkUser();

  const [username, setUsername] = useState("");
  const [profile, setProfile] = useState("");

  //Dimension
  const { width, height } = Dimensions.get("window");

  const data = [
    {
      id: 0,
      title: "ADD CILT",
      // image: require("../../assets/startup.png"),
      image: require("../../assets/ciltproblack.png"),
      link: "AddCilt",
      // link: "Search",
    },
    // {
    //   id: 1,
    //   title: "CILT SHIFTLY",
    //   image: require("../../assets/shiftly.png"),
    //   link: "Search",
    // },
    // {
    //   id: 2,
    //   title: "CIP / COP / SIP",
    //   image: require("../../assets/cip.png"),
    //   link: "Search",
    // },
    // {
    //   id: 3,
    //   title: "CHANGE OVER",
    //   image: require("../../assets/changeover3.png"),
    //   link: "Search",
    // },
    {
      id: 4,
      title: "LIST CILT",
      image: require("../../assets/handover.png"),
      link: "ListCILT",
    },
    {
      id: 5,
      title: "LIST SAVE AS DRAFT",
      image: require("../../assets/listHO.png"),
      link: "ListCILTDraft",
    },
    // {
    //   id: 5,
    //   title: "PENGATURAN",
    //   image: require("../../assets/pengaturan.png"),
    //   link: "Search",
    // },
  ];

  const [options, setOptions] = useState(data);

  const showAlert = () => {
    Alert.alert("Option selected");
  };

  const fetchUserData = async () => {
    try {
      const urlApi = process.env.URL;
      // console.log(urlApi);
      const email = await AsyncStorage.getItem("user");
      const fcmToken = await AsyncStorage.getItem("fcmToken");

      // const profile = await AsyncStorage.getItem("profile");

      console.log("fetchUserData email", email);
      console.log("fetchUserData fcmToken", fcmToken);
      // console.log("profile", profile);

      const response1 = await fetch(`${urlApi}/getUser?email=${email}`);
      const response2 = await fetch(`${urlApi}/findIdByTokenFcm/${fcmToken}`);

      console.log("response1", response1);
      console.log("response2", response2);

      if (!response1.ok && !response2) {
        throw new Error("Network response was not ok");
      }

      const data = await response1.json();
      const idToken = await response2.json();

      console.log("data :", data);
      console.log("idToken :", idToken);
      // console.log("id Token :", idToken.id, "id User :", data.id);
      const url = `${urlApi}/greenTAGuserFcm`; // Sesuaikan dengan URL endpoint Anda
      const userData = {
        id_greenTAGuser: data.id, // Ganti dengan ID pengguna yang sesuai
        id_greenTAGfcm: idToken.id, // Ganti dengan FCM ID yang sesuai
      };
      const response = await axios.post(url, userData);
      console.log("Response:", response.data);

      setUsername(data.username);
      setProfile(data.profile);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  // Panggil fungsi fetchUserData pada saat komponen di-mount
  useEffect(() => {
    fetchUserData();
    console.log("width :", width, "height", height);
  }, []);

  return (
    // <View style={styles.home}>
    <View style={styles.container}>
      <View style={styles.header2}>
        <Image
          style={styles.icon}
          // width="100%"
          // height="100%"
          contentFit="cover"
          source={require("../../assets/images/bgLong.png")}
        />
        {/* <Text style={styles.mainTitle}>Greenfields</Text> */}
      </View>

      <View style={styles.user}>
        <Text style={styles.driver}>{profile}</Text>
        <Text style={styles.userLogin}>{username}</Text>
        {/* <Text style={styles.driver}>Operator</Text>
        <Text style={styles.userLogin}>Purnomo</Text> */}

        <Image
          style={styles.userChild}
          contentFit="cover"
          source={require("../../assets/ellipse-20.png")}
        />
      </View>

      <HeightSpacer height={80} />

      <FlatList
        style={styles.list}
        contentContainerStyle={styles.listContainer}
        data={options}
        horizontal={false}
        numColumns={2}
        keyExtractor={(item) => {
          return item.id;
        }}
        renderItem={({ item }) => {
          return (
            <TouchableOpacity
              style={width < 720 ? styles.card : styles.cardTablet}
              onPress={() => {
                var add = item.link;
                console.log(add);
                if (add == "Search") {
                  Alert.alert(
                    "Not Available",
                    "The feature is still not available."
                  );
                } else {
                  navigation.navigate(add, { username });
                }
              }}
            >
              <View style={styles.cardFooter}></View>
              <Image
                style={width < 720 ? styles.cardImage : styles.cardImageTablet}
                source={item.image}
              />
              <View style={styles.cardHeader}>
                <View
                  style={{ alignItems: "center", justifyContent: "center" }}
                >
                  <Text style={styles.title}>{item.title}</Text>
                </View>
              </View>
            </TouchableOpacity>
          );
        }}
      />
      <Text style={styles.versionStyle}>{process.env.VERSION}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 20,
  },
  list: {
    paddingHorizontal: 5,
    // backgroundColor: "#E6E6E6",
  },
  listContainer: {
    alignItems: "center",
  },
  /******** card **************/
  card: {
    shadowColor: "#00000021",
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.37,
    shadowRadius: 7.49,

    elevation: 12,
    marginVertical: 10,
    backgroundColor: "white",
    flexBasis: "42%",
    marginHorizontal: 10,
  },

  cardTablet: {
    shadowColor: "#00000021",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.37,
    shadowRadius: 7.49,
    elevation: 12,
    marginVertical: 10,
    backgroundColor: "white",
    flexBasis: "42%",
    marginHorizontal: 10,
    borderRadius: 20,
  },
  cardHeader: {
    paddingVertical: 17,
    paddingHorizontal: 16,
    borderTopLeftRadius: 1,
    borderTopRightRadius: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  cardContent: {
    paddingVertical: 12.5,
    paddingHorizontal: 16,
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: 12.5,
    paddingBottom: 25,
    paddingHorizontal: 16,
    borderBottomLeftRadius: 1,
    borderBottomRightRadius: 1,
  },
  cardImage: {
    height: 50,
    width: 50,
    alignSelf: "center",
  },
  cardImageTablet: {
    height: 90,
    width: 90,
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 18,
    flex: 1,
    alignSelf: "center",
    color: "#696969",
  },
  header: {
    top: 50,
    backgroundColor: Color.colorLightsteelblue,
    height: 179,
    overflow: "hidden",
  },
  /******** header **************/
  barPosition: {
    width: "100%",
    // height: "100%",
    left: 0,
    position: "absolute",
  },
  header2: {
    top: 10,
    backgroundColor: Color.colorLightsteelblue,
    height: 230,
    overflow: "hidden",
  },
  mainTitle: {
    top: 54,
    fontSize: 40,
    letterSpacing: -1,
    // fontFamily: FontFamily.timmana,
    color: Color.colorBlack,
    width: 285,
    height: 99,
    textAlign: "left",
    textTransform: "uppercase",
    lineHeight: 38,
    left: 25,
    position: "absolute",
  },
  icon: {
    top: -113,
    // right: -10,
    // width: 329,
    // height: 232,
    left: -350,
    // position: "absolute",
  },
  user: {
    top: 212,
    width: 309,
    height: 68,
    borderRadius: Border.br_3xs,
    left: 25,
    position: "absolute",
    overflow: "hidden",
    backgroundColor: Color.colorWhite,
    borderColor: Color.colorSilver,
    borderWidth: 2,
  },
  driver: {
    top: 26,
    fontSize: 14,
    height: 40,
    width: 169,
    left: 28,
    color: Color.colorBlack,
    // fontFamily: FontFamily.poppinsRegular,
    textAlign: "left",
    textTransform: "uppercase",
    lineHeight: 38,
    position: "absolute",
  },
  userLogin: {
    // fontFamily: FontFamily.poppinsBold,
    fontWeight: "700",
    fontSize: FontSize.size_base,
    height: 40,
    width: 169,
    left: 28,
    color: Color.colorBlack,
    top: 4,
    textAlign: "left",
    textTransform: "uppercase",
    lineHeight: 38,
    position: "absolute",
  },
  userChild: {
    top: 12,
    left: 240,
    width: 44,
    height: 44,
    position: "absolute",
  },
  versionStyle: {
    paddingLeft: 25,
    paddingBottom: 110,
    fontSize: 20,
    opacity: 0.3,
  },
});

export default HomeQMS;
