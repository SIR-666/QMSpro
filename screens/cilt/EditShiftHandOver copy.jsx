import { Ionicons } from "@expo/vector-icons";
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

const EditShiftHandOver = ({ navigation, route }) => {
  const [name, setName] = useState("");
  const [emailuser, setEmailuser] = useState("");
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
  const [photo2, setPhoto2] = useState([]);
  const [photoFields, setPhotoFields] = useState([0]);

  const { id } = route.params;

  useEffect(() => {
    fetchUserData();
    fetchSHOData();
  }, []);

  const fetchUserData = async () => {
    try {
      const urlApi = process.env.URL;
      const email = await AsyncStorage.getItem("user");
      const fcmToken = await AsyncStorage.getItem("fcmToken");

      const response1 = await fetch(`${urlApi}/getUser?email=${email}`);
      const data = await response1.json();

      setName(data.username);
      setPosition(data.level);
      setEmailuser(data.email);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const fetchSHOData = async () => {
    try {
      const urlApi = process.env.URL;
      const response = await axios.get(`${urlApi}/sho/${id}`);
      const data = response.data[0];
      setName(data.nama);
      setPosition(data.jabatan);
      setEmailuser(data.userEmail);
      setDate(data.date);
      setLine(data.line);
      setShift(data.shift);
      setGroup(data.group);
      setProblems(data.problems);
      setActions(data.action);
      setRemarks(data.remarks1);
      setPhoto(data.image);
      setPhoto2(data.image2.split(","));
      setPhotoFields(data.image2.split(",").map((_, index) => index));
    } catch (error) {
      console.error("Error fetching SHO data:", error);
    }
  };

  const handleAddPhotoField = () => {
    setPhotoFields([...photoFields, photoFields.length]);
  };

  const handleRemovePhotoField = (index) => {
    const newPhotoFields = photoFields.filter((_, i) => i !== index);
    const newPhoto2 = photo2.filter((_, i) => i !== index);
    setPhotoFields(newPhotoFields);
    setPhoto2(newPhoto2);
  };

  const handlePhotoChange = (index, path) => {
    const newPhoto2 = [...photo2];
    newPhoto2[index] = path;
    setPhoto2(newPhoto2);
  };

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
      photo2.length === 0
    ) {
      Alert.alert("Error", "Pastikan semua diisi dengan lengkap");
      return;
    }

    if (!checked) {
      Alert.alert("Error", "Pastikan semua data diisi dengan benar.");
      return;
    }

    try {
      const response = await axios.put(`http://10.0.2.2:8080/sho/${id}`, {
        nama: name,
        date: date,
        jabatan: position,
        line: line,
        shift: shift,
        group: group,
        problems: problems,
        action: actions,
        remarks1: remarks,
        userEmail: emailuser, // Replace with actual user email
        image: photo, // Replace with actual image URL
        image2: photo2.join(","),
        status: 0, // status for submit
      });

      if (response.status === 200) {
        Alert.alert("Submitted Success", "Data submitted successfully!");
        navigation.replace("ListShiftHandOver");
      } else {
        Alert.alert("Error", "Failed to submit data.");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "An error occurred while submitting data.");
    }
  };

  const handleSaveAsDraft = async () => {
    try {
      const response = await axios.put(`http://10.0.2.2:8080/sho/${id}`, {
        nama: name,
        date: date,
        jabatan: position,
        line: line,
        shift: shift,
        group: group,
        problems: problems,
        action: actions,
        remarks1: remarks,
        userEmail: emailuser, // Replace with actual user email
        image: photo, // Replace with actual image URL
        image2: photo2.join(","),
        status: 2, // status for draft
      });

      if (response.status === 200) {
        Alert.alert("Draft Success", "Data saved as draft!");
        navigation.replace("ListShiftHandOver");
      } else {
        Alert.alert("Error", "Failed to save draft.");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "An error occurred while saving draft.");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Edit Shift Hand Over</Text>

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
            "Long shift Pagi",
            "Long shift Malam",
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

      {photoFields.map((field, index) => (
        <View key={index} style={styles.wrapper}>
          <Text style={styles.label}>Foto {index + 1}</Text>
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
                onImagePathChange={(path) => handlePhotoChange(index, path)}
                title="UNGGAH FOTO"
                color={COLORS.green}
              />
              {index > 0 && (
                <TouchableOpacity
                  style={styles.removeButton}
                  onPress={() => handleRemovePhotoField(index)}
                >
                  <Ionicons
                    name="remove-circle-outline"
                    size={24}
                    color="red"
                  />
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
      ))}

      <TouchableOpacity style={styles.addButton} onPress={handleAddPhotoField}>
        <Ionicons name="add-circle-outline" size={24} color="green" />
        <Text style={styles.addButtonText}>Tambah Foto</Text>
      </TouchableOpacity>

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

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.draftButton}
          onPress={handleSaveAsDraft}
        >
          <Text style={styles.submitButtonText}>Save as Draft</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.submitButton, !checked && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={!checked}
        >
          <Text style={styles.submitButtonText}>SUBMIT</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
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
    padding: 10,
    borderRadius: 5,
    backgroundColor: "#ffffff",
  },
  textArea: {
    borderWidth: 1,
    borderColor: COLORS.lightBlue,
    padding: 10,
    borderRadius: 5,
    height: 100,
    backgroundColor: "#ffffff",
  },
  wrapper: {
    marginBottom: 20,
  },
  addButton: {
    alignItems: "center",
    marginVertical: 10,
    flexDirection: "row",
    justifyContent: "center",
  },
  addButtonText: {
    marginLeft: 10,
    color: "green",
    fontSize: 16,
  },
  removeButton: {
    marginLeft: 10,
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
    flex: 1,
    marginHorizontal: 5,
  },
  draftButton: {
    backgroundColor: "gray",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    flex: 1,
    marginHorizontal: 5,
  },
  submitButtonDisabled: {
    backgroundColor: "#aaa",
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
});

export default EditShiftHandOver;
