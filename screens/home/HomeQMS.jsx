// import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
// import React from "react";
import { useEffect, useState } from "react";
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
import { COLORS } from "../../constants/theme";
// import styles from "./home.style";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { Border, Color, FontSize } from "../../GlobalStyles";
import checkUser from "../../hook/checkUser";

const { width } = Dimensions.get("window");

const HomeQMS = ({ route, navigation }) => {
  const { userLogin, userData, isLoading, time } = checkUser();
  const { username_, line_fil: initialLine } = route.params;
  const [username, setUsername] = useState("");
  const [profile, setProfile] = useState("");

  //Dimension
  const { width, height } = Dimensions.get("window");

  const data = [
    {
      id: 1,
      title: "INPUT PARAMETER",
      image: require("../../assets/param.jpg"),
      link: "Paraminspection2",
    },
    {
      id: 1,
      title: "SAMPLE QTY",
      image: require("../../assets/sample.png"),
      link: "SampleQuantity",
    },
    {
      id: 2,
      title: "SUBMITED HISTORY",
      image: require("../../assets/submited.png"),
      link: "QMSsubmited",
      // link: "ShiftHandOver",
    },
    {
      id: 3,
      title: "DRAFT",
      image: require("../../assets/draft.png"),
      link: "QMSdraft",
      // link: "ShiftHandOver",
    },
    {
      id: 4,
      title: "ADD BATCH NUMBER",
      image: require("../../assets/batch-number.png"),
      link: "AddBatchNumber",
      // link: "ShiftHandOver",
    },
  ];

  const [options, setOptions] = useState(data);

  const showAlert = () => {
    Alert.alert("Option selected");
  };

  const fetchUserData = async () => {
    try {
      const urlApi = process.env.URL4;
      // console.log(urlApi);
      const email = await AsyncStorage.getItem("user");
      const fcmToken = await AsyncStorage.getItem("fcmToken");

      // const profile = await AsyncStorage.getItem("profile");

      // console.log("fetchUserData email", email);
      // console.log("fetchUserData fcmToken", fcmToken);
      // console.log("profile", profile);

      const response1 = await fetch(`${urlApi}/getUser?email=${email}`);
      const response2 = await fetch(`${urlApi}/findIdByTokenFcm/${fcmToken}`);

      // console.log("response1", response1);
      // console.log("response2", response2);

      if (!response1.ok && !response2) {
        throw new Error("Network response was not ok");
      }

      const data = await response1.json();
      const idToken = await response2.json();

      // console.log("data :", data);
      // console.log("idToken :", idToken);
      // console.log("id Token :", idToken.id, "id User :", data.id);
      const url = `${urlApi}/greenTAGuserFcm`; // Sesuaikan dengan URL endpoint Anda
      const userData = {
        id_greenTAGuser: data.id, // Ganti dengan ID pengguna yang sesuai
        id_greenTAGfcm: idToken.id, // Ganti dengan FCM ID yang sesuai
      };
      const response = await axios.post(url, userData);
      // console.log("Response:", response.data);

      setUsername(data.username);
      setProfile(data.profile);
    } catch (error) {
      console.error("Error username:", error);
    }
  };

  // Panggil fungsi fetchUserData pada saat komponen di-mount
  useEffect(() => {
    fetchUserData();
    // console.log("width :", width, "height", height);
  }, []);

  return (
    // <View style={styles.home}>
    <View style={styles.container}>
      <View style={styles.header2}>
        <Image
          style={styles.icon}
          source={require("../../assets/images/MS.png")}
        />
        {/* <Text style={styles.mainTitle}>Greenfields</Text> */}
      </View>

      <View style={styles.user}>
        <Image
          style={styles.userChild}
          contentFit="cover"
          source={require("../../assets/ellipse-20.png")}
        />
        <Text style={styles.driver}>{profile}</Text>
        <Text style={styles.userLogin}>{username}</Text>
        {/* <Text style={styles.driver}>Operator</Text>
        <Text style={styles.userLogin}>Purnomo</Text> */}
      </View>

      <HeightSpacer height={80} />
      <Text style={styles.headText}>{initialLine}</Text>
      <HeightSpacer height={40} />
      <FlatList
        style={styles.list}
        contentContainerStyle={styles.listContainer}
        data={options}
        horizontal={false}
        numColumns={2}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => {
          return (
            <TouchableOpacity
              style={width < 720 ? styles.card : styles.cardTablet}
              onPress={() => {
                var add = item.link;
                // console.log(add);
                if (add == "Search") {
                  Alert.alert(
                    "Menu belum tersedia",
                    "Fitur ini sedang dipersiapkan, tunggu tanggal mainnya..."
                  );
                } else {
                  navigation.navigate(add, {
                    username,
                    line_fil: initialLine || "", // kirim 'Line A' jika tersedia
                  });
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
      <Text style={styles.versionStyle}>{process.env.VERSION ?? "v1.0.0"}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 1,
  },
  list: {
    paddingHorizontal: 5,
    // backgroundColor: "#E6E6E6",
  },
  listContainer: {
    alignItems: "center",
  },
  /******** card **************/
  cardX: {
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

  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    marginVertical: 10,
    marginHorizontal: 20,
    paddingRight: 100,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    width: width - 50, // Subtract 40 from the total width to account for padding
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
    height: 330,
    overflow: "hidden",
    borderBottomLeftRadius: 50,
    borderBottomRightRadius: 50,
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
    position: "absolute",
    top: -20,
    left: -110, // Ganti nilai ini sesuai kebutuhan agar icon terlihat
    width: "130%",
    height: "130%",
  },
  user: {
    top: 300,
    width: 309,
    height: 68,
    borderRadius: Border.br_3xs,
    position: "absolute",
    overflow: "hidden",
    backgroundColor: Color.colorWhite,
    borderColor: Color.colorSilver,
    // borderWidth: 2,
    alignSelf: "center", // Menengahkan secara horizontal
  },
  driver: {
    top: 26,
    fontSize: 14,
    height: 40,
    width: 169,
    left: 100,
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
    left: 100,
    color: Color.colorBlack,
    top: 4,
    textAlign: "left",
    textTransform: "uppercase",
    lineHeight: 38,
    position: "absolute",
  },
  userChild: {
    top: 10,
    left: 40,
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
  headText: {
    textAlign: "center",
    textTransform: "uppercase",
    fontSize: 36,
    fontWeight: "bold",
    marginBottom: 0,
    color: COLORS.blue,
    fontFamily: "tahoma",
    shadowColor: "#000", // Optional: shadow for better visibility
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
    elevation: 3, // For Android shadow ef
  },
});

export default HomeQMS;
