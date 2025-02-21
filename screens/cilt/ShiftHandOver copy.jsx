import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Checkbox } from "react-native-paper";
import {
  ReusableDropdown,
  ReusablePhotoImage,
  ReusableUploadImage,
  WidthSpacer,
} from "../../components";
import { COLORS } from "../../constants/theme";

export default ShiftHandOver = ({ navigation }) => {
  const [name, setName] = useState("");
  const [position, setPosition] = useState("");
  const [shift, setShift] = useState("");
  const [line, setLine] = useState("");
  const [group, setGroup] = useState("");
  const [problems, setProblems] = useState("");
  const [actions, setActions] = useState("");
  const [remarks, setRemarks] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]); // Date format in YYYY-MM-DD
  const [checked, setChecked] = useState(false);
  const [photo, setPhoto] = useState("");
  const [photo2, setPhoto2] = useState("");

  const fetchUserData = async () => {
    try {
      const urlApi = process.env.URL;
      const email = await AsyncStorage.getItem("user");
      const fcmToken = await AsyncStorage.getItem("fcmToken");

      console.log("fetchUserData email", email);
      console.log("fetchUserData fcmToken", fcmToken);

      const response1 = await fetch(`${urlApi}/getUser?email=${email}`);
      console.log("response1", response1);
      const data = await response1.json();
      console.log("data :", data);

      setName(data.username);
      setPosition(data.level);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const handleSubmit = async () => {
    if (
      !name ||
      !date ||
      !position ||
      !line ||
      !shift ||
      !group ||
      !problems ||
      !actions ||
      !remarks ||
      !photo ||
      !photo2
    ) {
      Alert.alert("Error", "Pastikan semua diisi dengan lengkap");
      return;
    }

    if (!checked) {
      Alert.alert("Error", "Pastikan semua data diisi dengan benar.");
      return;
    }

    try {
      const response = await axios.post("http://10.0.2.2:8080/sho", {
        nama: name,
        date: date,
        jabatan: position,
        line: line,
        shift: shift,
        group: group,
        problems: problems,
        action: actions,
        remarks1: remarks,
        userEmail: "", // Replace with actual user email
        image: photo, // Replace with actual image URL
        image2: photo2,
      });

      // console.log(
      //   name,
      //   date,
      //   position,
      //   line,
      //   shift,
      //   group,
      //   problems,
      //   actions,
      //   remarks
      // );

      if (response.status === 201) {
        Alert.alert("Success", "Data submitted successfully!");
        // navigation.replace("Bottom");
        navigation.replace("ListShiftHandOver");
        //ListShiftHandOver
      } else {
        Alert.alert("Error", "Failed to submit data.");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "An error occurred while submitting data.");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Shift Hand Over</Text>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Nama</Text>
        <TextInput style={styles.input} value={name} editable={false} />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Date</Text>
        <TextInput style={styles.input} value={date} editable={false} />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Posisi / Jabatan</Text>
        <ReusableDropdown
          selectedValue={position}
          style={styles.input}
          onValueChange={(itemValue, itemIndex) => setPosition(itemValue)}
          itemOptions={[
            "Operator",
            "Teknisi",
            "Operasional Support",
            "Koordinator",
          ]}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Line</Text>
        <ReusableDropdown
          selectedValue={line}
          style={styles.input}
          onValueChange={(itemValue, itemIndex) => setLine(itemValue)}
          itemOptions={[
            "Line A",
            "Line B",
            "Line C",
            "Line D",
            "Line E",
            "Line F",
            "Line G",
            "General",
          ]}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Shift</Text>
        <ReusableDropdown
          selectedValue={shift}
          style={styles.input}
          onValueChange={(itemValue, itemIndex) => setShift(itemValue)}
          itemOptions={[
            "Shift 1",
            "Shift 2",
            "Shift 3",
            "Long shift 1",
            "Long shift 3",
            "Start shift",
            "End shift",
          ]}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Group</Text>
        <ReusableDropdown
          selectedValue={group}
          style={styles.input}
          onValueChange={(itemValue, itemIndex) => setGroup(itemValue)}
          itemOptions={["Bromo", "Semeru", "Krakatau"]}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Problems</Text>
        <TextInput
          style={styles.textArea}
          value={problems}
          onChangeText={setProblems}
          multiline
          numberOfLines={4}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Action</Text>
        <TextInput
          style={styles.textArea}
          value={actions}
          onChangeText={setActions}
          multiline
          numberOfLines={4}
        />
      </View>

      <View style={styles.wrapper}>
        <Text style={styles.label}>Picture</Text>
        <View>
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              borderColor: COLORS.lightBlue,
              backgroundColor: COLORS.lightWhite,
              borderWidth: 1,
              height: 450,
              borderRadius: 12,
              flexDirection: "row",
              paddingHorizontal: 3,
            }}
          >
            <WidthSpacer width={10} />

            <ReusableUploadImage
              onImagePathChange={(path) => setPhoto2(path)}
              title="UNGGAH FOTO"
              color={COLORS.green}
            />
          </View>
        </View>
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Remarks</Text>
        <TextInput
          style={styles.textArea}
          value={remarks}
          onChangeText={setRemarks}
          multiline
          numberOfLines={4}
        />
      </View>

      <View style={styles.wrapper}>
        <Text style={styles.label}>Foto Serah Terima</Text>
        <View>
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              borderColor: COLORS.lightBlue,
              backgroundColor: COLORS.lightWhite,
              borderWidth: 1,
              height: 450,
              borderRadius: 12,
              flexDirection: "row",
              paddingHorizontal: 3,
            }}
          >
            <WidthSpacer width={10} />

            <ReusablePhotoImage
              onImagePathChange={(path) => setPhoto(path)}
              title="UPLOAD FOTO SERAH TERIMA"
              color={COLORS.green}
            />
          </View>
        </View>
      </View>

      <View style={styles.checkboxContainer}>
        <Checkbox
          status={checked ? "checked" : "unchecked"}
          onPress={() => {
            setChecked(!checked);
          }}
        />
        <Text style={styles.checkboxLabel}>
          Saya menyatakan telah memasukkan data dengan benar.
        </Text>
      </View>

      <TouchableOpacity
        style={[styles.submitButton, !checked && styles.submitButtonDisabled]}
        onPress={handleSubmit}
        disabled={!checked}
      >
        <Text style={styles.submitButtonText}>SUBMIT</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    // backgroundColor: "#f5f5f5",
    backgroundColor: "#ffffff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    alignSelf: "center",
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.lightBlue,
    // borderColor: "#ccc",
    padding: 10,
    borderRadius: 5,
    // backgroundColor: "#e9ecef",
    backgroundColor: "#ffffff",
  },
  textArea: {
    borderWidth: 1,
    // borderColor: "#ccc",
    borderColor: COLORS.lightBlue,
    padding: 10,
    borderRadius: 5,
    height: 100,
    // backgroundColor: "#e9ecef",
    backgroundColor: "#ffffff",
  },
  imageUpload: {
    alignItems: "center",
    marginBottom: 20,
  },
  imageUploadText: {
    color: "#007bff",
    fontSize: 16,
  },
  image: {
    width: 200,
    height: 100,
    resizeMode: "cover",
    marginTop: 10,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  checkboxLabel: {
    marginLeft: 8,
  },
  submitButton: {
    backgroundColor: "#007bff",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
  },
  submitButtonDisabled: {
    backgroundColor: "#aaa",
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
