import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { Image } from "expo-image";
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

const Home = ({ navigation }) => {
  const { userLogin, userData, isLoading, time } = checkUser();
  return (
    // <View style={styles.home}>
    <View style={reusable.container}>
      {/* <HeightSpacer height={50} /> */}

      <View style={[styles.header, styles.barPosition]}>
        <Image
          style={styles.icon}
          width={"100%"}
          height={350}
          contentFit="cover"
          source={require("../../assets/6174260-1.png")}
        />
        <Text style={styles.title}>greenTAG</Text>
      </View>
      {/* <HeightSpacer height={50} /> */}
      <View style={styles.user}>
        <Text style={styles.driver}>Driver</Text>
        <Text style={styles.userlogin}>SLAMET RAHARJO</Text>
        <Image
          style={styles.userChild}
          contentFit="cover"
          source={require("../../assets/ellipse-20.png")}
        />
      </View>

      <View style={styles.menu}>
        <View style={[styles.inputMuatanParent, styles.parentLayout1]}>
          <Text style={[styles.inputMuatan, styles.text]}>INPUT MUATAN</Text>
          <View style={[styles.wrapper, styles.wrapperLayout]}>
            <Image
              style={styles.icon1}
              contentFit="cover"
              source={require("../../assets/icon1.png")}
            />
          </View>
        </View>
        <View style={[styles.persetujuanRevisiParent, styles.parentLayout1]}>
          <Text style={styles.persetujuanRevisi}>Persetujuan & Revisi</Text>
          <View style={[styles.container, styles.wrapperLayout]}>
            <Image
              style={styles.icon2}
              contentFit="cover"
              source={require("../../assets/10746-1.png")}
            />
          </View>
        </View>
        <View style={[styles.biayaOperasionalParent, styles.parentLayout]}>
          <Text style={[styles.inputMuatan, styles.text]}>
            BIAYA OPERASIONAL
          </Text>
          <View style={[styles.wrapper, styles.wrapperLayout]}>
            <Image
              style={styles.icon1}
              contentFit="cover"
              source={require("../../assets/icon3.png")}
            />
          </View>
        </View>
        <View style={[styles.pengaturanParent, styles.parentLayout]}>
          <Text style={[styles.pengaturan, styles.text]}>PENGATURAN</Text>
          <View style={[styles.frameView, styles.wrapperLayout]}>
            <Image
              style={styles.icon1}
              contentFit="cover"
              source={require("../../assets/14370-1.png")}
            />
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  barPosition: {
    width: "100%",
    // height: "100%",
    left: 0,
    position: "absolute",
  },
  // berandaaLayout: {
  //   height: 56,
  //   width: 68,
  //   top: 16,
  //   position: "absolute",
  //   overflow: "hidden",
  // },
  // tabungan1Typo: {
  //   height: 11,
  //   width: 62,
  //   color: Color.colorSilver,
  //   left: 3,
  //   textAlign: "center",
  //   fontFamily: FontFamily.poppinsRegular,
  //   textTransform: "capitalize",
  //   fontSize: FontSize.size_2xs,
  //   position: "absolute",
  // },
  parentLayout1: {
    height: 210,
    width: 151,
    borderWidth: 2,
    borderColor: Color.colorLightsteelblue,
    borderStyle: "solid",
    top: 50,
    borderRadius: Border.br_3xs,
    position: "absolute",
    overflow: "hidden",
  },
  text: {
    width: 138,
    lineHeight: 16,
    top: 154,
    fontFamily: FontFamily.poppinsBold,
    fontWeight: "700",
    fontSize: FontSize.size_base,
    textAlign: "center",
    color: Color.colorBlack,
    height: 56,
    textTransform: "uppercase",
    position: "absolute",
  },
  wrapperLayout: {
    height: 116,
    position: "absolute",
    overflow: "hidden",
  },
  parentLayout: {
    top: 277,
    height: 210,
    width: 151,
    borderWidth: 2,
    borderColor: Color.colorLightsteelblue,
    borderStyle: "solid",
    borderRadius: Border.br_3xs,
    position: "absolute",
    overflow: "hidden",
  },
  statusBarIcon: {
    height: 32,
    top: 0,
  },
  icon: {
    top: -33,
    width: 329,
    height: 232,
    left: 169,
    position: "absolute",
  },
  title: {
    top: 24,
    fontSize: 40,
    letterSpacing: -1,
    fontFamily: FontFamily.timmana,
    color: Color.colorWhite,
    width: 285,
    height: 99,
    textAlign: "left",
    textTransform: "uppercase",
    lineHeight: 38,
    left: 25,
    position: "absolute",
  },
  header: {
    top: 50,
    backgroundColor: Color.colorLightsteelblue,
    height: 179,
    overflow: "hidden",
  },
  home1Icon: {
    width: 24,
    height: 24,
    left: 22,
    top: 4,
    position: "absolute",
    overflow: "hidden",
  },
  beranda: {
    marginLeft: -28,
    top: 36,
    left: "50%",
    width: 57,
    height: 20,
    textAlign: "center",
    color: Color.colorBlack,
    fontFamily: FontFamily.poppinsRegular,
    textTransform: "capitalize",
    fontSize: FontSize.size_2xs,
    position: "absolute",
  },
  berandaa: {
    left: 20,
    backgroundColor: Color.colorWhite,
  },
  tabungan1: {
    top: 37,
  },
  tabungan: {
    left: 104,
  },
  notifikasi1: {
    top: 38,
  },
  notifikasi: {
    left: 188,
  },
  profilParent: {
    left: 272,
  },
  bottomBar: {
    top: 712,
    height: 88,
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
    fontFamily: FontFamily.poppinsRegular,
    textAlign: "left",
    textTransform: "uppercase",
    lineHeight: 38,
    position: "absolute",
  },
  userlogin: {
    fontFamily: FontFamily.poppinsBold,
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
  user: {
    top: 172,
    width: 309,
    height: 68,
    borderRadius: Border.br_3xs,
    left: 25,
    position: "absolute",
    overflow: "hidden",
    backgroundColor: Color.colorWhite,
  },
  inputMuatan: {
    left: 6,
  },
  icon1: {
    top: -9,
    left: -5,
    width: 117,
    height: 135,
    position: "absolute",
  },
  wrapper: {
    width: 106,
    top: 27,
    height: 116,
    left: 22,
  },
  inputMuatanParent: {
    left: 0,
  },
  persetujuanRevisi: {
    lineHeight: 16,
    top: 154,
    width: 151,
    fontFamily: FontFamily.poppinsBold,
    fontWeight: "700",
    fontSize: FontSize.size_base,
    textAlign: "center",
    color: Color.colorBlack,
    height: 56,
    textTransform: "uppercase",
    left: 0,
    position: "absolute",
  },
  icon2: {
    width: 98,
    height: 102,
    left: 6,
    top: 0,
    position: "absolute",
  },
  container: {
    top: 30,
    left: 21,
    width: 110,
  },
  persetujuanRevisiParent: {
    left: 169,
  },
  biayaOperasionalParent: {
    left: 0,
  },
  pengaturan: {
    left: 7,
  },
  frameView: {
    left: 23,
    width: 106,
    top: 27,
    height: 116,
  },
  pengaturanParent: {
    left: 169,
  },
  menu: {
    top: 236,
    width: "100%",
    height: "100%",
    // flexDirection: "column",
    alignItems: "center",
    // justifyContent: "justifyContent",
    // flex: 1,
    marginHorizontal: 30,
    // position: "absolute",
    // overflow: "hidden",
  },
  home: {
    flex: 1,
    width: "100%",
    height: 800,
    overflow: "hidden",
    backgroundColor: Color.colorWhite,
  },
});

export default Home;
