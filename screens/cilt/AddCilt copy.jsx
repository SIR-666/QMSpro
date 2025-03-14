import { MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Picker } from "@react-native-picker/picker";
import axios from "axios";
import moment from "moment-timezone";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Checkbox } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { ReusableDatetime, ReusableOfflineUploadImage } from "../../components";
import { COLORS } from "../../constants/theme";

// Define uploadImageToServer function here

// Image upload function
// Image upload function with improved error handling
const uploadImageToServer = async (uri) => {
  const apiUrl2 = process.env.URL2;
  const port33 = process.env.PORT_IMAGE_UPLOAD;
  const apiUrl = "http://10.24.0.39:3003/upload"; // Image server URL
  // const filename = localUri.split("/").pop();
  const formData = new FormData();

  // formData.append("file", {
  //   uri: localUri,
  //   name: filename,
  //   type: "image/jpeg", // Adjust if your image type differs
  // });

  formData.append("images", {
    uri: Platform.OS === "android" ? uri : uri.replace("file://", ""),
    type: "image/jpeg", // Adjust based on your image type
    name: uri.split("/").pop(), // This ensures the file has a name
  });

  try {
    console.log("Uploading image:", uri); // Log the image path being uploaded

    const response = await fetch(`${apiUrl2}:${port33}/upload`, {
      method: "POST",
      body: formData,
      // headers: {
      //   "Content-Type": "multipart/form-data",
      // },
    });

    if (!response.ok) {
      // If the response is not OK, log the full response and throw an error
      console.error(
        "Failed to upload image",
        response.status,
        response.statusText
      );
      const responseText = await response.text(); // Get the raw response text for debugging
      console.error("Response text:", responseText);
      throw new Error(`Failed to upload image: ${response.statusText}`);
    }

    const responseJson = await response.json();
    let serverImageUrl = responseJson.uploadedFiles[0];

    // const serverImageUrl = `${apiUrl2}:${port33}/${responseJson.uploadedFiles[0]}`;
    console.log("Uploaded image URL:", serverImageUrl);
    return serverImageUrl; // Return the server URL after upload
  } catch (error) {
    console.error("Image upload failed:", error);
    throw new Error("Image upload failed");
  }
};

const CILTinspection = ({ navigation }) => {
  const [processOrder, setProcessOrder] = useState("#Plant_Line_SKU");
  const [packageType, setPackageType] = useState("START UP");
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

  // const packageOptions = [
  //   { label: "Start Up", value: "Start Up" },
  //   { label: "CILT Shiftly", value: "CILT Shiftly" },
  //   { label: "CIP/COP/SIP", value: "CIP/COP/SIP" },
  //   { label: "Change Over", value: "Change Over" },
  // ];

  const packageOptions = [
    { label: "END CYCLE", value: "END CYCLE" },
    { label: "CHANGE OVER", value: "CHANGE OVER" },
    { label: "CLEANING", value: "CLEANING" },
    { label: "GI/GR", value: "GI/GR" },
    // { label: "Paper Usage Report", value: "Paper Usage Report" },
    { label: "CILT", value: "CILT" },
    // { label: "Shiftly", value: "Shiftly" },
    { label: "START UP", value: "START UP" },
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
    // fetchInspectionData(); // Fetch inspection data from mastercilt API
    fetchInspectionData(packageType); // Pass the updated packageType to fetchInspectionData
    setFormOpenTime(moment().tz("Asia/Jakarta").format()); // Record the time the form is opened
  }, [packageType]);

  useEffect(() => {
    // if (packageType === "Shiftly") {
    //   setHideDateInput(true); // Hide date input for CILT Shiftly
    // } else {
    //   setHideDateInput(false); // Show date input for other types
    // }

    filterOptions();
    updateProcessOrder();
  }, [plant, line, product, packageType, date, shift, machine]);

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

  const fetchInspectionData = async (selectedPackageType) => {
    setIsLoading(true); // Start loading animation
    setInspectionData([]); // Reset inspection data before fetching new data

    try {
      const response = await axios.get("http://10.24.7.70:8080/mastercilt");

      const filteredData = response.data.filter(
        (item) => item.type === selectedPackageType
      );

      const formattedData = filteredData.map((item) => ({
        activity: item.activity,
        standard: `${item.min} - ${item.max}`,
        periode: item.frekwensi,
        picture: item.image === "Y" ? "" : null, // If "Y", allow image upload
        results: "",
        done: false,
        content: item.content,
      }));

      setInspectionData(formattedData); // Set the new inspection data
      // console.log("Updated inspectionData:", formattedData); // Debugging log
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
    const formattedShift = shift.replace(/\s+/g, "-");
    const formattedMachine = machine.replace(/\s+/g, "-");

    setProcessOrder(
      `#${formattedPlant}_${formattedLine}_${formattedProduct}_${formattedDate}_${formattedTime}_${formattedShift}_${formattedMachine}`
    );
  };

  const toggleSwitch = (index) => {
    let data = [...inspectionData];
    data[index].done = !data[index].done;
    setInspectionData(data);
  };

  const handleImageSelected = (uri, index) => {
    let data = [...inspectionData];
    data[index].picture = uri; // Update picture field with uploaded image URI or local URI
    setInspectionData(data);
  };

  const handleInputChange = (text, index) => {
    let data = [...inspectionData];
    data[index].results = text;
    setInspectionData(data);
  };

  // Submit form and handle image upload
  const handleSubmit = async () => {
    const submitTime = moment().tz("Asia/Jakarta").format(); // Record submit time
    // const submitDate = moment(submitTime).utc().toISOString();
    // console.log("Submit time:", submitTime);
    // console.log("Submit date iso:", submitDate);
    /*
     {"AbnormalityDescription": "Wri", "AbnormalityType": "Safety",
    "ExpectedDate": "2024-10-10", "IssuedDate": "2024-10-07",
      "Line": "Motor", "Machine": "Suspension System", "MaintenanceType": "Autonomous Maintenance",
      "ObservedArea": "AM PM",
      "Picture": "http://10.24.7.70:3003/uploads/4ad6c148-7bcc-4656-b23c-703ce61aaf03_20241007_112249_comp.jpeg",
      "ProposedSolution": "Pro", "TagNo": "2", "TaggerName": "marjhy",
      "datesystem": "2024-10-07T04:22:25.000Z",
      "footprint": "marjhy@gmail.com", "info1": "Open", "info2": "marjhy@gmail.com"
  }
  */

    let order = {}; // Declare the order object to ensure it's always available

    try {
      // First, handle the image upload process
      const updatedInspectionData = await Promise.all(
        inspectionData.map(async (item) => {
          if (item.picture && item.picture.startsWith("file://")) {
            // Only upload if the picture is a local file path
            const serverImageUrl = await uploadImageToServer(item.picture);
            return {
              ...item,
              picture: serverImageUrl, // Replace local URI with server URL
            };
          }
          return item; // If no image or already a server URL, return the item as-is
        })
      );

      // Prepare the order object with updated inspectionData
      order = {
        processOrder,
        packageType,
        plant,
        line,
        date: hideDateInput
          ? undefined
          : // : moment(date).tz("Asia/Jakarta").format(),
            moment(date).utc().toISOString(),
        shift,
        product,
        machine,
        batch,
        remarks,
        inspectionData: updatedInspectionData, // Updated inspectionData with server URLs
        formOpenTime: moment(formOpenTime).utc().toISOString(),
        submitTime: moment(submitTime).utc().toISOString(),
      };

      console.log("Simpan data order:", order);

      // Send the form data to the server
      const response = await axios.post("http://10.24.7.70:8080/cilt", order);
      // const response = await axios.post("http://your-api-url/cilt", order);
      if (response.status === 201) {
        Alert.alert("Success", "Data submitted successfully!");
        await clearOfflineData(); // Clear offline data after successful submission
      }
    } catch (error) {
      console.error("Submit failed, saving offline data:", error);
      await saveOfflineData(order); // Save offline if failed
      Alert.alert(
        "Offline",
        "No network connection. Data has been saved locally and will be submitted when you are back online."
      );
    }
  };

  // Save offline data when API submission fails
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

        {isLoading ? (
          <ActivityIndicator size="large" color={COLORS.blue} />
        ) : (
          <>
            <View style={styles.row}>
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
            </View>

            <View style={styles.row}>
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
                        <Picker.Item
                          key={index}
                          label={option}
                          value={option}
                        />
                      )
                    )}
                  </Picker>
                </View>
              </View>

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
                      // fetchInspectionData(); // Fetch data based on the selected package type
                      fetchInspectionData(itemValue); // Fetch data based on the selected package type
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

            <View style={styles.wrapper}>
              {/* Table Container */}
              <View style={styles.table}>
                {/* Table Head */}
                <View style={styles.tableHead}>
                  {/* Header Caption */}
                  <View style={{ width: "10%" }}>
                    <Text style={styles.tableCaption}>Done</Text>
                  </View>
                  <View style={{ width: "25%" }}>
                    <Text style={styles.tableCaption}>Activity</Text>
                  </View>
                  <View style={{ width: "15%" }}>
                    <Text style={styles.tableCaption}>Standard</Text>
                  </View>
                  <View style={{ width: "20%" }}>
                    <Text style={styles.tableCaption}>Periode</Text>
                  </View>
                  <View style={{ width: "10%" }}>
                    <Text style={styles.tableCaption}>Hasil</Text>
                  </View>
                  <View style={{ width: "20%" }}>
                    <Text style={styles.tableCaption}>Picture</Text>
                  </View>
                </View>

                {/* Table Body */}
                {inspectionData.map((item, index) => (
                  <View key={index} style={styles.tableBody}>
                    {/* Header Caption */}
                    <View style={{ width: "10%" }}>
                      {/* <Text style={styles.tableData}>Done</Text> */}
                      <View style={[styles.tableData, styles.centeredContent]}>
                        <Switch
                          style={styles.tableData}
                          value={item.done}
                          onValueChange={() => toggleSwitch(index)}
                        />
                      </View>
                    </View>
                    <View style={{ width: "25%" }}>
                      <Text style={styles.tableData}>{item.activity}</Text>
                    </View>
                    <View style={{ width: "15%" }}>
                      <Text style={styles.tableData}>{item.standard}</Text>
                    </View>
                    <View style={{ width: "20%" }}>
                      <Text style={styles.tableData}>{item.periode}</Text>
                    </View>
                    <View style={{ width: "10%" }}>
                      {/* <Text style={styles.tableData}>Hasil</Text> */}
                      <View style={[styles.tableData, styles.centeredContent]}>
                        <TextInput
                          style={styles.tableData}
                          value={item.results}
                          onChangeText={(text) =>
                            handleInputChange(text, index)
                          }
                        />
                      </View>
                    </View>
                    <View style={{ width: "20%" }}>
                      {/* <Text style={styles.tableData}>Picture</Text> */}

                      {item.picture !== null ? (
                        <View
                          style={[styles.tableData, styles.centeredContent]}
                        >
                          <ReusableOfflineUploadImage
                            onImageSelected={(uri) =>
                              handleImageSelected(uri, index)
                            }
                            uploadImage={uploadImageToServer} // Pass upload function here
                          />
                        </View>
                      ) : (
                        <Text style={styles.tableData}>N/A</Text>
                      )}
                    </View>
                  </View>
                ))}
              </View>
            </View>
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
    marginBottom: 10,
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
  // tableCSS
  wrapper: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
  table: {
    width: "100%", // Make table take the full width

    margin: 15,
  },
  tableHead: {
    flexDirection: "row",
    backgroundColor: "#3bcd6b",
    padding: 20,
    width: "100%",
  },
  tableBody: {
    flexDirection: "row",
    // backgroundColor: "#3bcd6b",
    padding: 20,
    width: "100%",
  },
  tableCaption: {
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
  },
  tableData: {
    // color: "#fff",
    // fontWeight: "bold",
    fontSize: 16,
    textAlign: "center", // Center-align text in cells
  },
  centeredContent: {
    justifyContent: "center",
    alignItems: "center",
  },

  // tableCSS end

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
