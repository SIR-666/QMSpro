// import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
// import React from "react";
import { useEffect, useState } from "react";
import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
// import { Image } from "expo-image";
import { HeightSpacer } from "../../components";
// import styles from "./home.style";
import axios from "axios";
import { ListItem } from "react-native-elements";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { COLORS } from "../../constants/theme";
import { Border, Color, FontSize } from "../../GlobalStyles";
import checkUser from "../../hook/checkUser";

const { width, height } = Dimensions.get("window");

const QMSsubmited = ({ navigation }) => {
  const { userLogin, userData, isLoading, time } = checkUser();

  const [username, setUsername] = useState("");
  const [profile, setProfile] = useState("");
  const [draft, setDraft] = useState([]);
  const [filteredData, setFilteredData] = useState([]);

  //Dimension
  const { width, height } = Dimensions.get("window");

  const fetchDraft = async () => {
    try {
      // const response = await axios.get("http://10.24.0.82:5002/api/getdrafr");
      const response = await axios.get(
        "http://10.24.0.82:5008/api/getsubmited"
      );
      const data = response.data;
      // console.log(data);
      setDraft(data);
      // alert(options);
    } catch (error) {
      console.error("Failed to fetch cost centers:", error);
    }
  };

  useEffect(() => {
    fetchDraft();
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
          source={require("../../assets/images/MS.png")}
        />
        {/* <Text style={styles.mainTitle}>Greenfields</Text> */}
      </View>

      <HeightSpacer height={20} />
      <Text style={styles.headText}>SUBMITED HISTORY</Text>
      <HeightSpacer height={10} />
      <SafeAreaProvider style={styles.containerdrop}>
        <ScrollView>
          {draft.map((item, index) => (
            <ListItem
              key={index}
              containerStyle={styles.listItem}
              bottomDivider
              onPress={() =>
                navigation.navigate("ParaminspectionDraft", {
                  sku_fill: item["Product_Size"],
                  filler: item["Filler"],
                  input_date: item["Input_At"],
                  dataAll: item,
                })
              }
            >
              {/* <Avatar source={require("../../image/iconasset.png")} rounded /> */}
              <ListItem.Content>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    paddingVertical: 4,
                  }}
                >
                  <ListItem.Title style={{ width: "50%" }}>
                    {item["Product_Name"]}
                  </ListItem.Title>

                  <ListItem.Title style={{ width: "20%" }}>
                    {item["Product_Size"]}
                  </ListItem.Title>

                  <ListItem.Title style={{ width: "30%" }}>
                    Prod Date: {item["Production_Date"]?.split("T")[0]}
                  </ListItem.Title>
                </View>

                <ListItem.Subtitle>
                  <View style={styles.subtitleView}>
                    <Text style={styles.ratingText} numberOfLines={0}>
                      Input Date:{" "}
                      {item["Input_At"]?.replace("T", " ").replace("Z", "")}
                    </Text>
                  </View>
                </ListItem.Subtitle>
              </ListItem.Content>
            </ListItem>
          ))}
        </ScrollView>
      </SafeAreaProvider>

      <HeightSpacer height={80} />

      <Text style={styles.versionStyle}>{process.env.VERSION}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  headText: {
    textAlign: "center",
    textTransform: "uppercase",
    fontSize: 24,
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
  container: {
    flex: 1,
    marginTop: 20,
  },
  containerdrop: {
    width: width,
    height: height,
    flex: 1,
    alignItems: "center",
    padding: 20,
    // backgroundColor: "rgba(225, 225, 225, 0.7)",
    paddingTop: 50,
  },
  listItem: {
    backgroundColor: "white",
    width: width * 0.98,
    borderRadius: 10,
    marginTop: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },

  dropdownContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  dropdownLabel: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 6,
    color: "#333",
  },
  dropdown: {
    width: "100%",
    height: 50,
    borderRadius: 8,
    backgroundColor: "#fff",
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  formSection: {
    width: "100%",
    marginBottom: 15,
  },
  searchInput: {
    width: width * 0.9,
    height: 40,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 10,
    backgroundColor: "#fff",
    marginBottom: 10,
  },
  subtitleView: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 0,
    flex: 1,
  },
  ratingText: {
    paddingLeft: 0,
    color: "grey",
    flex: 1,
    flexWrap: "wrap", // untuk multiline
    fontSize: 14,
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

export default QMSsubmited;
