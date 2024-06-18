import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import reusable from "../../components/Reusable/reusable.style";
import { ReusableText, HeightSpacer, Recommendations } from "../../components";
import Places from "../../components/Home/Places";
import { COLORS, SIZES, TEXT } from "../../constants/theme";
import { AntDesign, Feather } from "@expo/vector-icons";
import styles from "./home.style";
import BestHotels from "../../components/Home/BestHotels";
import checkUser from "../../hook/checkUser";

const Home = ({ navigation }) => {
  const { userLogin, userData, isLoading, time } = checkUser();
  return (
    <View style={reusable.container}>
      <HeightSpacer height={50} />
      <View>
        <View style={reusable.rowWithSpace("space-between")}>
          <ReusableText
            text={userLogin ? `${time} ${userData.username}` : `${time} User!`}
            family={"regular"}
            size={TEXT.large}
            color={COLORS.black}
          />

          <TouchableOpacity
            style={styles.box}
            onPress={() => navigation.navigate("Search")}
          >
            <AntDesign name="search1" size={26} />
          </TouchableOpacity>
        </View>

        <HeightSpacer height={SIZES.xLarge} />

        <ReusableText
          text={"Places"}
          family={"medium"}
          size={TEXT.large}
          color={COLORS.black}
        />

        <Places />

        <HeightSpacer height={35} />

        <View style={[reusable.rowWithSpace("space-between")]}>
          <ReusableText
            text={"Recommendations"}
            family={"medium"}
            size={TEXT.large}
            color={COLORS.black}
          />

          <TouchableOpacity onPress={() => navigation.navigate("Recommended")}>
            <Feather name="list" size={20} />
          </TouchableOpacity>
        </View>

        <Recommendations />

        <HeightSpacer height={30} />

        <BestHotels />
      </View>
    </View>
  );
};

export default Home;
