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
import React, { useState, useEffect } from "react";
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
  ReusableDropdown,
} from "../../components";
import axios from "axios";
import reusable from "../../components/Reusable/reusable.style";
import Timeline from "react-native-simple-timeline";
import { SafeAreaView } from "react-native-safe-area-context";
import { Picker } from "@react-native-picker/picker";

const validationSchema = Yup.object().shape({
  tanggal: Yup.string()
    .min(8, "Tanggal must be at least 8 characters")
    .required("Required"),

  lokasiMuat: Yup.string()
    .min(3, "lokasiMuat must be at least 3 characters")
    .required("Required"),

  // email: Yup.string().email("Provide a valid email").required("Required"),
});

const Registration = ({ navigation }) => {
  const [loader, setLoader] = useState(false);
  const [responseData, setResponseData] = useState(null);
  const [obsecureText, setObsecureText] = useState(false);

  //  start of date of time picker
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [dropdownItems1, setDropdownItems1] = useState([]);

  const apiUrl = process.env.URL;

  const onDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    // const currentDate = selectedDate?.toUTCString();
    // if (currentDate === undefined) return;
    // setDate(currentDate);
    setShowDatePicker(Platform.OS === "ios"); // Close the picker on iOS immediately
    setDate(currentDate);
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

  // useEffect(() => {
  //   // Fetch fruit options from API
  //   fetch("http://192.168.1.8:3000/lokasi-muat")
  //     .then((response) => response.json())
  //     .then((data) => {
  //       // setDropdownItems1(data.nama_lokasi);
  //       console.log("lokasi ", data[0].nama_lokasi);
  //     })
  //     .catch((error) => console.error("Error fetching DropdownItems1:", error));
  // }, []);

  useEffect(() => {
    // Fungsi untuk mengambil opsi dari API
    const fetchOptions1 = async () => {
      try {
        console.log(apiUrl);
        const response = await fetch(`${apiUrl}/lokasi-muat`); // Ganti dengan URL API sesuai kebutuhan Anda
        const data = await response.json();

        // Ambil 'nama_lokasi' dari respons API
        const options = data.map((item) => item.nama_lokasi);
        // console.log(options);
        setDropdownItems1(options);
      } catch (error) {
        console.error("Error fetching data options:", error);
      }
    };

    fetchOptions1();
  }, []); // Pastikan untuk menyertakan dependensi kosong agar permintaan hanya dilakukan sekali saat komponen dipasang

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
          initialValues={{ tanggal: "", lokasiMuat: "" }}
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
                      touched.lokasiMuat ? COLORS.lightBlue : COLORS.lightGrey
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
                  {touched.lokasiMuat && errors.lokasiMuat && (
                    <Text style={styles.errorMessage}>{errors.lokasiMuat}</Text>
                  )}
                </View>
              </View>
              {/* end inputan date */}

              <View style={{ alignitems: "center" }}></View>

              {/* start inputan dropdown */}
              <View style={styles.wrapper}>
                <Text style={styles.label}>Lokasi Muat</Text>
                {/* Component Picker untuk memilih buah */}

                <View>
                  <View
                    style={styles.inputWrapper(
                      touched.lokasiMuat ? COLORS.lightBlue : COLORS.lightGrey
                    )}
                  >
                    <MaterialCommunityIcons
                      name="face-man-profile"
                      size={20}
                      color={COLORS.gray}
                    />

                    {/* <WidthSpacer width={10} /> */}
                    {/* Component FruitPicker untuk memilih buah */}
                    <ReusableDropdown
                      label="Buah"
                      items={dropdownItems1}
                      // selectedFruit={selectedFruit}
                      // onFruitChange={setSelectedFruit}
                    />
                  </View>
                </View>
              </View>
              {/* end inputan dropdown */}

              <HeightSpacer height={20} />

              <ReusableBtn
                // onPress={isValid ? handleSubmit : errorLogin}
                onPress={handleSubmit}
                btnText={"KIRIM DATA"}
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
