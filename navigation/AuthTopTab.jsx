import { View, Text, ScrollView, TouchableOpacity, Image } from "react-native";
import React from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { Registration, Signin } from "../screens";
import { COLORS } from "../constants/theme";
import { AssetImage, HeightSpacer, AppBar } from "../components";

const Tab = createMaterialTopTabNavigator();

const AuthTopTab = ({ navigation }) => {
  return (
    <View style={{ flex: 1, backgroundColor: COLORS.lightWhite }}>
      <ScrollView style={{ flex: 1, backgroundColor: COLORS.lightWhite }}>
        <HeightSpacer height={10} />

        {/* <AssetImage
          data={require("../assets/images/bg3.jpg")}
          width={"100%"}
          height={350}
          mode={"contain"}
        /> */}
        <Image
          source={require("../assets/images/bg3.png")}
          style={{ width: "100%", height: 390 }}
        />

        <View style={{ height: 600 }}>
          <Tab.Navigator
            screenOptions={{
              tabBarLabelStyle: { fontSize: 16, fontFamily: "medium" },
              tabBarIndicatorStyle: { backgroundColor: COLORS.green },
              tabBarActiveTintColor: COLORS.green,
              tabBarInactiveTintColor: COLORS.gray,
            }}
          >
            <Tab.Screen name="Signin" component={Signin} />
            <Tab.Screen name="Registration" component={Registration} />
          </Tab.Navigator>
        </View>
      </ScrollView>
    </View>
  );
};

export default AuthTopTab;
