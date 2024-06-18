// import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
// import React from "react";
import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Alert,
  FlatList,
  Dimensions,
} from "react-native";
// import { Image } from "expo-image";
import reusable from "../../components/Reusable/reusable.style";
import {
  AssetImage,
  ReusableText,
  HeightSpacer,
  Recommendations,
} from "../../components";
import Places from "../../components/Home/Places";
import { COLORS, SIZES, TEXT } from "../../constants/theme";
import { AntDesign, Feather } from "@expo/vector-icons";
// import styles from "./home.style";
import BestHotels from "../../components/Home/BestHotels";
import checkUser from "../../hook/checkUser";
import { Color, FontFamily, FontSize, Border } from "../../GlobalStyles";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Home = ({ navigation }) => {
  const { userLogin, userData, isLoading, time } = checkUser();

  const [username, setUsername] = useState("");
  const [profile, setProfile] = useState("");

  //Dimension
  const { width, height } = Dimensions.get("window");

  const data = [
    {
      id: 1,
      title: "Add Greentag",
      image: require("../../assets/icon1.png"),
      link: "AddGreenTag",
    },
    {
      id: 1,
      title: "GreenTAG List",
      image: require("../../assets/icon2.png"),
      link: "ListGreentag",
    },
    {
      id: 2,
      title: "Tag Scanner",
      image: require("../../assets/icon3.png"),
      link: "TagScanner",
    },
    {
      id: 3,
      title: "PENGATURAN",
      image: require("../../assets/icon4.png"),
      link: "Search",
    },
  ];

  const [options, setOptions] = useState(data);

  const showAlert = () => {
    Alert.alert("Option selected");
  };

  const fetchUserData = async () => {
    try {
      const urlApi = process.env.URL;
      console.log(urlApi);
      const email = await AsyncStorage.getItem("user");
      const url = `${urlApi}/getUser?email=${email}`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
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
          width="300%"
          // width={300}
          height={90}
          contentFit="cover"
          source={require("../../assets/images/bg4.png")}
        />
        {/* <Text style={styles.mainTitle}>greenSHIELD</Text> */}
      </View>

      <View style={styles.user}>
        <Text style={styles.driver}>{profile}</Text>
        <Text style={styles.userLogin}>{username}</Text>
        <Image
          style={styles.userChild}
          contentFit="cover"
          source={require("../../assets/ellipse-20.png")}
        />
      </View>
      <HeightSpacer height={150} />
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
                  navigation.navigate(add);
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
    height: 70,
    width: 70,
    alignSelf: "center",
  },
  cardImageTablet: {
    height: 185,
    width: 170,
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
    top: 50,
    backgroundColor: "#016243",
    height: 200,
    overflow: "hidden",
  },

  mainTitle: {
    top: 54,
    fontSize: 40,
    letterSpacing: -1,
    // fontFamily: FontFamily.timmana,
    color: Color.colorWhite,
    width: 285,
    height: 99,
    textAlign: "left",
    // textTransform: "uppercase",
    lineHeight: 38,
    left: 25,
    position: "absolute",
  },
  icon: {
    top: -33,
    width: 310,
    height: 292,
    left: 169,
    position: "absolute",
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
});

export default Home;
