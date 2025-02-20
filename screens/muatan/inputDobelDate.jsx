import {
  TextInput,
  Text,
  View,
  TouchableOpacity,
  Alert,
  Button,
  Pressable,
  Platform,
} from "react-native";
import React, { useState } from "react";
import styles from "./signin.style";
import { Formik } from "formik";
import * as Yup from "yup";
import { COLORS, SIZES, TEXT } from "../../constants/theme";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import {
  WidthSpacer,
  HeightSpacer,
  ReusableBtn,
  AppBar,
  ReusableDatetime,
} from "../../components";
import axios from "axios";
import reusable from "../../components/Reusable/reusable.style";
import Timeline from "react-native-simple-timeline";
import { SafeAreaView } from "react-native-safe-area-context";

const validationSchema = Yup.object().shape({
  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .required("Required"),

  username: Yup.string()
    .min(3, "Username must be at least 3 characters")
    .required("Required"),
  email: Yup.string().email("Provide a valid email").required("Required"),
});

const Registration = ({ navigation }) => {
  const [loader, setLoader] = useState(false);
  const [responseData, setResponseData] = useState(null);
  const [obsecureText, setObsecureText] = useState(false);

  //  start of date of time picker
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const onDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    // const currentDate = selectedDate?.toUTCString();
    // if (currentDate === undefined) return;
    // setDate(currentDate);
    setShowDatePicker(Platform.OS === "ios"); // Close the picker on iOS immediately
    setDate(currentDate);
  };

  const [date2, setDate2] = useState(new Date());
  const [showDatePicker2, setShowDatePicker2] = useState(false);

  const onDateChange2 = (event, selectedDate) => {
    const currentDate = selectedDate || date2;
    setShowDatePicker2(Platform.OS === "ios"); // Sesuaikan dengan kebutuhan Anda
    setDate2(currentDate);
  };

  const data = [
    {
      id: 0,
      status: "Data",
      date: "\u2714",
    },
    {
      id: 1,
      status: "Biaya",
      date: "\u274C",
    },
    {
      id: 3,
      status: "Foto",
      date: "\u274C",
    },
    {
      id: 3,
      status: "Aproval",
      date: "\u274C",
    },
  ];

  const errorLogin = () => {
    Alert.alert("Invalid Form", "Please provide all required fields", [
      {
        text: "Cancel",
        onPress: () => {},
      },
      {
        text: "Continue",
        onPress: () => {},
      },
      { defaultIndex: 1 },
    ]);
  };

  const register = async (values) => {
    setLoader(true);

    try {
      const endpoint = "http://localhost:5003/api/register";
      const data = values;

      const response = await axios.post(endpoint, data);
      if (response.status === 201) {
        setLoader(false);
        Alert.alert(
          "Registration Successful ",
          "Please provide to login your account ",
          [
            {
              text: "Cancel",
              onPress: () => {},
            },
            {
              text: "Continue",
              onPress: () => {},
            },
            { defaultIndex: 1 },
          ]
        );
      } else {
        Alert.alert("Error Signing in ", "Please provide valid credentials ", [
          {
            text: "Cancel",
            onPress: () => {},
          },
          {
            text: "Continue",
            onPress: () => {},
          },
          { defaultIndex: 1 },
        ]);
      }
    } catch (error) {
      Alert.alert(
        "Error ",
        "Oops, Error logging in try again with correct credentials",
        [
          {
            text: "Cancel",
            onPress: () => {},
          },
          {
            text: "Continue",
            onPress: () => {},
          },
          { defaultIndex: 1 },
        ]
      );
    } finally {
      setLoader(false);
    }
  };

  return (
    <SafeAreaView style={reusable.container}>
      <View style={{ height: 50 }}>
        <AppBar
          top={5}
          left={20}
          right={20}
          title={"Input Muatan"}
          color={COLORS.white}
          onPress={() => navigation.goBack()}
        />
      </View>
      <View style={styles.container}>
        <View style={{ marginTop: "10%", marginHorizontal: "3%" }}>
          <Timeline data={data} direction="horizontal" />
        </View>

        <Formik
          initialValues={{ email: "", password: "", username: "" }}
          validationSchema={validationSchema}
          onSubmit={(values) => {
            register(values);
          }}
        >
          {({
            handleChange,
            touched,
            handleSubmit,
            values,
            errors,
            isValid,
            setFieldTouched,
          }) => (
            <View style={{ paddingTop: 5 }}>
              {/* start datetimepicker */}

              {/* start inputan date */}
              <View style={styles.wrapper}>
                <Text style={styles.label}>Date</Text>
                <View>
                  <View
                    style={styles.inputWrapper(
                      touched.username ? COLORS.lightBlue : COLORS.lightGrey
                    )}
                  >
                    <MaterialCommunityIcons
                      name="calendar-range"
                      size={20}
                      color={COLORS.gray}
                    />

                    <ReusableDatetime
                      date={date}
                      showDatePicker={showDatePicker}
                      setShowDatePicker={setShowDatePicker}
                      onDateChange={onDateChange}
                    />

                    <WidthSpacer width={10} />
                  </View>
                  {touched.username && errors.username && (
                    <Text style={styles.errorMessage}>{errors.username}</Text>
                  )}
                </View>
              </View>
              {/* end inputan date */}

              {/* start inputan date */}
              <View style={styles.wrapper}>
                <Text style={styles.label}>Date</Text>
                <View>
                  <View
                    style={styles.inputWrapper(
                      touched.username ? COLORS.lightBlue : COLORS.lightGrey
                    )}
                  >
                    <MaterialCommunityIcons
                      name="calendar-range"
                      size={20}
                      color={COLORS.gray}
                    />

                    <ReusableDatetime
                      date={date2}
                      showDatePicker={showDatePicker2}
                      setShowDatePicker={setShowDatePicker2}
                      onDateChange={onDateChange2}
                    />

                    <WidthSpacer width={10} />
                  </View>
                  {touched.username && errors.username && (
                    <Text style={styles.errorMessage}>{errors.username}</Text>
                  )}
                </View>
              </View>
              {/* end inputan date */}

              {/* start inputan */}
              <View style={styles.wrapper}>
                <Text style={styles.label}>Username</Text>
                <View>
                  <View
                    style={styles.inputWrapper(
                      touched.username ? COLORS.lightBlue : COLORS.lightGrey
                    )}
                  >
                    <MaterialCommunityIcons
                      name="face-man-profile"
                      size={20}
                      color={COLORS.gray}
                    />

                    <WidthSpacer width={10} />

                    <TextInput
                      placeholder="Enter username"
                      onFocus={() => {
                        setFieldTouched("username");
                      }}
                      onBlur={() => {
                        setFieldTouched("username", "");
                      }}
                      value={values.username}
                      onChangeText={handleChange("username")}
                      autoCapitalize="none"
                      autoCorrect={false}
                      style={{ flex: 1 }}
                    />
                  </View>
                  {touched.username && errors.username && (
                    <Text style={styles.errorMessage}>{errors.username}</Text>
                  )}
                </View>
              </View>
              {/* end inputan */}

              <HeightSpacer height={20} />

              <ReusableBtn
                onPress={isValid ? handleSubmit : errorLogin}
                btnText={"REGISTER"}
                width={SIZES.width - 80}
                backgroundColor={COLORS.green}
                borderColor={COLORS.green}
                borderWidth={0}
                textColor={COLORS.white}
              />
            </View>
          )}
        </Formik>
      </View>
    </SafeAreaView>
  );
};

export default Registration;
