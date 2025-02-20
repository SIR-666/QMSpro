import { View, Image, Dimensions } from "react-native";
import React from "react";
import styles from "./slides.style";
import {
  HeightSpacer,
  ReusableBtn,
  ReusableText,
} from "../../components/index";
import { COLORS, SIZES } from "../../constants/theme";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Slides = ({ item }) => {
  const navigation = useNavigation();

  const handlePress = () => {
    firstRun();
    // navigation.navigate("Bottom");
    navigation.replace("AuthTop");
  };

  const firstRun = async () => {
    await AsyncStorage.setItem("first", "false");
  };

  return (
    <View>
      <Image source={item.image} style={styles.image} />

      <View style={styles.stack}>
        <ReusableBtn
          onPress={handlePress}
          btnText={"Masuk CILT PRO"}
          width={(SIZES.width - 50) / 2.2}
          backgroundColor={COLORS.red}
          borderColor={COLORS.red}
          borderWidth={0}
          textColor={COLORS.white}
        />
        <ReusableText
          text={item.title}
          family={"medium"}
          size={SIZES.xxLarge}
          color={COLORS.white}
        />

        <HeightSpacer height={10} />
      </View>
    </View>
  );
};

export default Slides;
