import React, { useState, useEffect } from "react";
import {
  ScrollView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Switch,
  Alert,
  ActivityIndicator, // Import ActivityIndicator for loading animation
} from "react-native";
import { Checkbox } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { Picker } from "@react-native-picker/picker";
import { COLORS, SIZES, TEXT } from "../../constants/theme";
import {
  ReusableBtn,
  ReusableDatetime,
  ReusableOfflineUploadImage,
} from "../../components";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import moment from "moment-timezone";

const CILTinspection = ({ navigation }) => {
  const [processOrder, setProcessOrder] = useState("#Plant_Line_SKU");
  const [packageType, setPackageType] = useState("Start Up");
  const [plant, setPlant] = useState("");
  const [line, setLine] = useState("");
  const [date, setDate] = useState(new Date());
  const [shift, setShift] = useState("");
  const [product, setProduct] = useState("");
  const [machine, setMachine] = useState("");
  const [batch, setBatch] = useState("2");
  const [remarks, setRemarks] = useState("Catatan");
  const [agreed, setAgreed] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // State to manage loading animation
  const [formOpenTime, setFormOpenTime] = useState(null);
  const [hideDateInput, setHideDateInput] = useState(false);

  const [inspectionData, setInspectionData] = useState([]);
  const [areas, setAreas] = useState([]);
  const [lineOptions, setLineOptions] = useState([]);
  const [machineOptions, setMachineOptions] = useState([]);

  const packageOptions = [
    { label: "Start Up", value: "Start Up" },
    { label: "CILT Shiftly", value: "CILT Shiftly" },
    { label: "CIP/COP/SIP", value: "CIP/COP/SIP" },
    { label: "Change Over", value: "Change Over" },
  ];

  const shiftOptions = [
    { label: "Shift 1", value: "Shift 1" },
    { label: "Shift 2", value: "Shift 2" },
    { label: "Shift 3", value: "Shift 3" },
    { label: "Long shift Pagi", value: "Long shift Pagi" },
    { label: "Long shift Malam", value: "Long shift Malam" },
    { label: "Start shift", value: "Start shift" },
    { label: "End shift", value: "End shift" },
  ];

  const productOptions = [
    { label: "ESL", value: "ESL" },
    { label: "UHT", value: "UHT" },
    { label: "Whipping Cream", value: "Whipping Cream" },
  ];

  useEffect(() => {
    fetchAreaData();
    fetchInspectionData(); // Fetch inspection data from mastercilt API
    setFormOpenTime(moment().tz("Asia/Jakarta").format()); // Record the time the form is opened
  }, [packageType]);

  useEffect(() => {
    if (packageType === "CILT Shiftly") {
      setHideDateInput(true); // Hide date input for CILT Shiftly
    } else {
      setHideDateInput(false); // Show date input for other types
    }

    filterOptions();
    updateProcessOrder();
  }, [plant, line, product, packageType]);

  const onDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(Platform.OS === "ios"); // Close the picker on iOS immediately
    setDate(currentDate);
    updateProcessOrder(); // Update process order based on the new date
  };

  const fetchAreaData = async () => {
    try {
      const response = await axios.get(
        "http://10.24.7.70:8080/getgreenTAGarea"
      );
      setAreas(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const fetchInspectionData = async () => {
    setIsLoading(true); // Start loading animation
    try {
      const response = await axios.get("http://10.24.7.70:8080/mastercilt");
      // console.log("Inspection data:", response.data);

      const filteredData = response.data.filter(
        (item) => item.type === packageType
      );
      // console.log("item.type:", item.type);
      console.log("packageType:", packageType);
      // console.log("Filtered data:", filteredData);

      const formattedData = filteredData.map((item) => ({
        activity: item.activity,
        standard: `${item.min} - ${item.max}`,
        periode: item.frekwensi,
        picture: item.image === "Y" ? "" : null, // If "Y", allow image upload
        results: "",
        done: false,
        content: item.content,
      }));
      setInspectionData(formattedData);
    } catch (error) {
      console.error("Error fetching inspection data:", error);
    } finally {
      setIsLoading(false); // Stop loading animation
    }
  };

  const filterOptions = () => {
    const filteredLines = areas
      .filter((area) => area.observedArea === plant)
      .map((area) => area.line)
      .filter((value, index, self) => self.indexOf(value) === index);

    setLineOptions(filteredLines);

    const filteredMachines = areas
      .filter((area) => area.observedArea === plant && area.line === line)
      .map((area) => area.subGroup)
      .filter((value, index, self) => self.indexOf(value) === index);

    setMachineOptions(filteredMachines);
  };

  const updateProcessOrder = () => {
    const formattedPlant = plant.replace(/\s+/g, "-");
    const formattedLine = line.replace(/\s+/g, "-");
    const formattedProduct = product.replace(/\s+/g, "-");
    const formattedDate = moment(date).tz("Asia/Jakarta").format("YYYY-MM-DD");
    const formattedTime = moment(date).tz("Asia/Jakarta").format("HH-mm-ss");

    setProcessOrder(
      `#${formattedPlant}_${formattedLine}_${formattedProduct}_${formattedDate}_${formattedTime}`
    );
  };

  const toggleSwitch = (index) => {
    let data = [...inspectionData];
    data[index].done = !data[index].done;
    setInspectionData(data);
  };

  const handleImageSelected = (uri, index) => {
    let data = [...inspectionData];
    data[index].picture = uri;
    setInspectionData(data);
  };

  const handleInputChange = (text, index) => {
    let data = [...inspectionData];
    data[index].results = text;
    setInspectionData(data);
  };

  const handleSubmit = async () => {
    const submitTime = moment().tz("Asia/Jakarta").format(); // Record submit time
    console.log("Submit time:", submitTime);
    console.log("date:", moment(date).tz("Asia/Jakarta").format());
    const order = {
      processOrder,
      packageType,
      plant,
      line,
      // date: moment(date).tz("Asia/Jakarta").format(),
      date: hideDateInput
        ? undefined
        : moment(date).tz("Asia/Jakarta").format(),
      shift,
      product,
      machine,
      batch,
      remarks,
      inspectionData,
      formOpenTime, // Add formOpenTime
      submitTime, // Add submitTime
    };

    console.log("Simpan data order:", order);

    try {
      const response = await axios.post("http://your-api-url/cilt", order);
      if (response.status === 201) {
        Alert.alert("Success", "Data submitted successfully!");
        await clearOfflineData(); // Clear offline data after successful submission
      }
    } catch (error) {
      console.error("Submit failed, saving offline data:", error);
      await saveOfflineData(order);
      Alert.alert(
        "Offline",
        "No network connection. Data has been saved locally and will be submitted when you are back online."
      );
    }
  };

  const saveOfflineData = async (order) => {
    try {
      console.log("Saving offline data:", order);
      let offlineData = await AsyncStorage.getItem("offlineData");
      offlineData = offlineData ? JSON.parse(offlineData) : [];
      offlineData.push(order);
      await AsyncStorage.setItem("offlineData", JSON.stringify(offlineData));
    } catch (error) {
      console.error("Failed to save offline data:", error);
    }
  };

  const clearOfflineData = async () => {
    try {
      await AsyncStorage.removeItem("offlineData");
    } catch (error) {
      console.error("Failed to clear offline data:", error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>New Inspection Schedule</Text>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Process Order *</Text>
          <View style={styles.dropdownContainer}>
            <MaterialCommunityIcons
              name="identifier"
              size={20}
              color={COLORS.lightBlue}
            />
            <TextInput
              style={styles.input}
              value={processOrder}
              editable={false}
            />
          </View>
        </View>

        <View style={styles.row}>
          <View style={styles.halfInputGroup}>
            <Text style={styles.label}>Package *</Text>
            <View style={styles.dropdownContainer}>
              <MaterialCommunityIcons
                name="package-variant-closed"
                size={24}
                color={COLORS.lightBlue}
              />
              <Picker
                selectedValue={packageType}
                style={styles.dropdown}
                onValueChange={(itemValue) => {
                  setPackageType(itemValue);
                  fetchInspectionData(); // Fetch data based on the selected package type
                }}
              >
                <Picker.Item label="Select option" value="" />
                {packageOptions.map((option) => (
                  <Picker.Item
                    key={option.value}
                    label={option.label}
                    value={option.value}
                  />
                ))}
              </Picker>
            </View>
          </View>

          <View style={styles.halfInputGroup}>
            <Text style={styles.label}>Plant *</Text>
            <View style={styles.dropdownContainer}>
              <MaterialCommunityIcons
                name="factory"
                size={24}
                color={COLORS.lightBlue}
              />
              <Picker
                selectedValue={plant}
                style={styles.dropdown}
                onValueChange={(itemValue) => {
                  setPlant(itemValue);
                  filterOptions();
                }}
              >
                <Picker.Item label="Select option" value="" />
                {[...new Set(areas.map((area) => area.observedArea))].map(
                  (option, index) => (
                    <Picker.Item key={index} label={option} value={option} />
                  )
                )}
              </Picker>
            </View>
          </View>
        </View>

        {isLoading ? (
          <ActivityIndicator size="large" color={COLORS.blue} />
        ) : (
          <>
            <View style={styles.row}>
              <View style={styles.halfInputGroup}>
                <Text style={styles.label}>Line *</Text>
                <View style={styles.dropdownContainer}>
                  <MaterialCommunityIcons
                    name="line-scan"
                    size={24}
                    color={COLORS.lightBlue}
                  />
                  <Picker
                    selectedValue={line}
                    style={styles.dropdown}
                    onValueChange={(itemValue) => {
                      setLine(itemValue);
                      filterOptions();
                    }}
                  >
                    <Picker.Item label="Select option" value="" />
                    {lineOptions.map((option, index) => (
                      <Picker.Item key={index} label={option} value={option} />
                    ))}
                  </Picker>
                </View>
              </View>

              {!hideDateInput && (
                <View style={styles.halfInputGroup}>
                  <Text style={styles.label}>Date *</Text>
                  <View style={styles.dropdownContainer}>
                    <MaterialCommunityIcons
                      name="calendar-range"
                      size={24}
                      color={COLORS.lightBlue}
                    />
                    <ReusableDatetime
                      date={date}
                      showDatePicker={showDatePicker}
                      setShowDatePicker={setShowDatePicker}
                      onDateChange={onDateChange}
                    />
                  </View>
                </View>
              )}
            </View>

            <View style={styles.row}>
              <View style={styles.halfInputGroup}>
                <Text style={styles.label}>Shift *</Text>
                <View style={styles.dropdownContainer}>
                  <MaterialCommunityIcons
                    name="clock-outline"
                    size={24}
                    color={COLORS.lightBlue}
                  />
                  <Picker
                    selectedValue={shift}
                    style={styles.dropdown}
                    onValueChange={(itemValue) => setShift(itemValue)}
                  >
                    <Picker.Item label="Select option" value="" />
                    {shiftOptions.map((option) => (
                      <Picker.Item
                        key={option.value}
                        label={option.label}
                        value={option.value}
                      />
                    ))}
                  </Picker>
                </View>
              </View>

              <View style={styles.halfInputGroup}>
                <Text style={styles.label}>Product *</Text>
                <View style={styles.dropdownContainer}>
                  <MaterialCommunityIcons
                    name="cup-water"
                    size={24}
                    color={COLORS.lightBlue}
                  />
                  <Picker
                    selectedValue={product}
                    style={styles.dropdown}
                    onValueChange={(itemValue) => {
                      setProduct(itemValue);
                      updateProcessOrder();
                    }}
                  >
                    <Picker.Item label="Select option" value="" />
                    {productOptions.map((option) => (
                      <Picker.Item
                        key={option.value}
                        label={option.label}
                        value={option.value}
                      />
                    ))}
                  </Picker>
                </View>
              </View>
            </View>

            <View style={styles.row}>
              <View style={styles.halfInputGroup}>
                <Text style={styles.label}>Machine *</Text>
                <View style={styles.dropdownContainer}>
                  <MaterialCommunityIcons
                    name="robot-industrial"
                    size={24}
                    color={COLORS.lightBlue}
                  />
                  <Picker
                    selectedValue={machine}
                    style={styles.dropdown}
                    onValueChange={(itemValue) => setMachine(itemValue)}
                  >
                    <Picker.Item label="Select option" value="" />
                    {machineOptions.map((option, index) => (
                      <Picker.Item key={index} label={option} value={option} />
                    ))}
                  </Picker>
                </View>
              </View>

              <View style={styles.halfInputGroup}>
                <Text style={styles.label}>Batch *</Text>
                <View style={styles.inputContainer}>
                  <MaterialCommunityIcons
                    name="numeric"
                    size={20}
                    color={COLORS.lightBlue}
                  />
                  <TextInput
                    style={styles.input}
                    value={batch}
                    onChangeText={(text) => setBatch(text)}
                  />
                </View>
              </View>
            </View>

            <View style={styles.inputGroupBawah}>
              <Text style={styles.label}>Remarks *</Text>
              <View style={styles.inputContainer}>
                <MaterialCommunityIcons
                  name="card-text"
                  size={20}
                  color={COLORS.lightBlue}
                />
                <TextInput
                  style={styles.input}
                  value={remarks}
                  onChangeText={(text) => setRemarks(text)}
                />
              </View>
            </View>

            <View style={styles.tableHeader}>
              <Text style={styles.tableHeaderText}>Done</Text>
              <Text style={styles.tableHeaderText}>Activity</Text>
              <Text style={styles.tableHeaderText}>Standard</Text>
              <Text style={styles.tableHeaderText}>Periode</Text>
              <Text style={styles.tableHeaderText}>Hasil</Text>
              <Text style={styles.tableHeaderText}>Picture</Text>
            </View>

            {inspectionData.map((item, index) => (
              <View key={index} style={styles.tableRow}>
                <Switch
                  value={item.done}
                  onValueChange={() => toggleSwitch(index)}
                />
                <Text style={styles.tableCell}>{item.activity}</Text>
                <Text style={styles.tableCell}>{item.standard}</Text>
                <Text style={styles.tableCell}>{item.periode}</Text>
                <TextInput
                  style={styles.tableCell}
                  value={item.results}
                  onChangeText={(text) => handleInputChange(text, index)}
                />
                {item.picture !== null ? (
                  <ReusableOfflineUploadImage
                    onImageSelected={(uri) => handleImageSelected(uri, index)}
                  />
                ) : (
                  <Text style={styles.tableCell}>N/A</Text>
                )}
              </View>
            ))}
          </>
        )}

        <View style={styles.checkboxContainer}>
          <Checkbox
            status={agreed ? "checked" : "unchecked"}
            onPress={() => setAgreed(!agreed)}
          />
          <Text style={styles.checkboxLabel}>
            Saya menyatakan telah memasukkan data dengan benar.
          </Text>
        </View>

        <TouchableOpacity
          style={[styles.submitButton, !agreed && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={!agreed}
        >
          <Text style={styles.submitButtonText}>SUBMIT</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollContainer: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    alignSelf: "center",
    color: COLORS.blue,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputGroupBawah: {
    marginBottom: 30,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  halfInputGroup: {
    flex: 1,
    marginRight: 10,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    borderColor: COLORS.lightBlue,
    padding: 10,
    borderRadius: 5,
    backgroundColor: "#ffffff",
  },
  dropdownContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.lightBlue,
    borderRadius: 5,
    height: 40,
    paddingHorizontal: 10,
    backgroundColor: "#ffffff",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.lightBlue,
    borderRadius: 5,
    height: 40,
    paddingHorizontal: 10,
    backgroundColor: "#ffffff",
  },
  dropdown: {
    flex: 1,
    marginLeft: 10,
  },
  tableHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightBlue,
    marginBottom: 10,
    paddingBottom: 5,
  },
  tableHeaderText: {
    fontWeight: "bold",
    fontSize: 16,
    textAlign: "center",
  },
  tableRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightBlue,
    marginBottom: 10,
    paddingBottom: 5,
  },
  tableCell: {
    flex: 1,
    textAlign: "center",
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
    backgroundColor: COLORS.blue,
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

export default CILTinspection;
