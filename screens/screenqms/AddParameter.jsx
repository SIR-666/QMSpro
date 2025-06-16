import { MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Picker } from "@react-native-picker/picker";
import axios from "axios";
import * as ScreenOrientation from "expo-screen-orientation";
import moment from "moment-timezone";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Checkbox } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import ReusableDatetime2 from "../../components/Reusable/ReusableDatetime2";
import ReusableDatetime from "../../components/Reusable/ReusableDatetime3";
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

  formData.append("images", {
    uri: Platform.OS === "android" ? uri : uri.replace("file://", ""),
    type: "image/jpeg", // Adjust based on your image type
    name: uri.split("/").pop(), // This ensures the file has a name
  });

  try {
    // console.log("Uploading image:", uri); // Log the image path being uploaded

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
    // console.log("Uploaded image URL:", serverImageUrl);
    return serverImageUrl; // Return the server URL after upload
  } catch (error) {
    console.error("Image upload failed:", error);
    throw new Error("Image upload failed");
  }
};

// Get shift by hour
const getShiftByHour = (hour) => {
  const shift1 = ["06", "07", "08", "09", "10", "11", "12", "13"];
  const shift2 = ["14", "15", "16", "17", "18", "19", "20", "21"];
  const shift3 = ["22", "23", "00", "01", "02", "03", "04", "05"];

  if (shift1.includes(hour)) return "Shift 1";
  if (shift2.includes(hour)) return "Shift 2";
  if (shift3.includes(hour)) return "Shift 3";
  return "Unknown Shift";
};

const Paraminspection = ({ route, navigation }) => {
  const { username } = route.params;
  const [processOrder, setProcessOrder] = useState("#Plant_Line_SKU");
  const [packageType, setPackageType] = useState("");
  const [plant, setPlant] = useState("");
  const [line, setLine] = useState("");
  const [date, setDate] = useState(new Date());
  const [proddate, setProdDate] = useState(new Date());
  const [exdate, setExDate] = useState(new Date());
  const [shift, setShift] = useState(
    getShiftByHour(moment(new Date()).tz("Asia/Jakarta").format("HH"))
  );

  const [productType, setProductType] = useState(""); // ESL atau UHT
  const [productOptions, setProductOptions] = useState([]);
  const [product, setProduct] = useState("");
  const [productsize, setProductSize] = useState("");

  const [machine, setMachine] = useState("");
  const [batch, setBatch] = useState("2");
  const [remarks, setRemarks] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // State to manage loading animation
  const [formOpenTime, setFormOpenTime] = useState(null);
  const [hideDateInput, setHideDateInput] = useState(false);

  const [inspectionData, setInspectionData] = useState([]);
  const [areas, setAreas] = useState([]);
  const [machineOptions, setMachineOptions] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState("");
  const [loadingDataInput, setloadingDataInput] = useState(true);
  const [batchNumber, setBatchNumber] = useState("");
  const [startProd, setStartProd] = useState(new Date());
  const [endProd, setEndProd] = useState(new Date());
  const [isValidGNR, setisValidGNR] = useState(false);

  const lineOptions = [
    "Line A",
    "Line B",
    "Line C",
    "Line D",
    "Line E",
    "Line F",
    "Line G",
    "Line H",
  ];

  const getProductType = (selectedLine) => {
    const eslLines = ["Line A", "Line B", "Line C", "Line D"];
    return eslLines.includes(selectedLine) ? "ESL" : "UHT";
  };

  const fetchProductOptions = async (type) => {
    try {
      console.log("type :", type);
      const response = await fetch(`http://10.24.0.82:5002/api/sku/${type}`);
      const data = await response.json();
      setloadingDataInput(false);
      setProductOptions(data);
      // console.log("data :", data);
    } catch (error) {
      console.error("Failed to fetch products:", error);
    }
  };

  const handleLineChange = (selectedLine) => {
    setLine(selectedLine);
    const type = getProductType(selectedLine);
    setProductType(type);
    fetchProductOptions(type);
    // console.log("type", selectedLine);
  };

  const handleprodChange = (selectedProd, label) => {
    // setLine(selectedLine);
    // const type = getProductType(selectedLine);
    setProductSize(selectedProd);
    setSelectedProduct(label);
    fetchInspectionData(selectedProd);
  };

  useEffect(() => {
    // Lock the screen orientation to portrait
    const lockOrientation = async () => {
      await ScreenOrientation.lockAsync(
        ScreenOrientation.OrientationLock.PORTRAIT
      );
    };
    lockOrientation();
  }, []);

  // Fetch product options from API

  const toggleChecklist = (index, key) => {
    const updatedData = [...inspectionData];

    if (
      !updatedData[index].results ||
      typeof updatedData[index].results !== "object"
    ) {
      updatedData[index].results = {};
    }

    updatedData[index].results[key] = !updatedData[index].results[key];
    setInspectionData(updatedData);
  };

  useEffect(() => {
    filterOptions();
    updateProcessOrder();
  }, [plant, line, product, packageType, date, shift, machine]);

  const onDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(Platform.OS === "ios"); // Close the picker on iOS immediately
    setDate(currentDate);
    setShift(
      getShiftByHour(moment(currentDate).tz("Asia/Jakarta").format("HH"))
    );
    updateProcessOrder(); // Update process order based on the new date
  };

  const parseGood = (goodValue) => {
    try {
      const parsed = JSON.parse(goodValue);
      if (typeof parsed === "object" && parsed !== null) {
        return Object.keys(parsed).join(", ");
      }
      return goodValue;
    } catch (e) {
      // Kalau bukan JSON valid, tampilkan original value
      return goodValue.replace(/[{}"]/g, "").trim();
    }
  };

  const handleGNRChange = (value, index) => {
    const updatedData = [...inspectionData];
    updatedData[index].gnr = value;
    handleFieldChange(index, "gnr", value);

    // Optional: Reset value results kalau GNR jadi Good
    if (value === "Good") {
      updatedData[index].results = "";
    }

    setInspectionData(updatedData);
  };

  const fetchInspectionData = async (selectedProduct) => {
    setIsLoading(true); // Start loading animation
    // setInspectionData([]); // Reset inspection data before fetching new data

    try {
      const response = await axios.get(
        `http://10.24.0.82:5002/api/getlistparma/${selectedProduct}`
      );

      if (!response.data || !Array.isArray(response.data)) {
        throw new Error("Invalid response format");
      }

      const formattedData = response.data.map((item) => {
        let parsedGood = {};
        let parsedNeed = {};
        let parsedReject = {};
        try {
          parsedGood = JSON.parse(item.Good);
          if (typeof parsedGood !== "object" || Array.isArray(parsedGood)) {
            parsedGood = {};
          }
        } catch (e) {
          parsedGood = {};
        }

        try {
          parsedNeed = JSON.parse(item.Need);
          if (typeof parsedNeed !== "object" || Array.isArray(parsedNeed)) {
            parsedNeed = {};
          }
        } catch (e) {
          parsedNeed = {};
        }

        try {
          parsedReject = JSON.parse(item.Reject);
          if (typeof parsedReject !== "object" || Array.isArray(parsedReject)) {
            parsedReject = {};
          }
        } catch (e) {
          parsedReject = {};
        }

        return {
          code: item.Code,
          variant: item.Variant,
          parameter: item.Parameter,
          good: item.Good, // keep raw for display
          parsedGood, // for rendering checklist
          parsedNeed,
          parsedReject,
          need: item.Need,
          reject: item.Reject,
          result: item.Hasil,
          remark: item.Remark,
          productName: item.Product_Name,
          productSize: item.Product_Size,
          batch: item.Batch_Number,
          productionDate: new Date(item.Production_Date).toLocaleDateString(),
          expiryDate: new Date(item.Expiry_Date).toLocaleDateString(),
          filler: item.Filler,
          satuan: item.Satuan,
          gnr: "", // default value
          results: item.Satuan !== null ? "" : {}, // default sesuai jenis input
        };
      });

      // console.log(formattedData);
      setInspectionData(formattedData);
    } catch (error) {
      console.error("Error fetching inspection data parameter:", error);
    } finally {
      setIsLoading(false); // Stop loading animation
    }
  };

  const filterOptions = () => {
    const filteredLines = areas
      .filter((area) => area.observedArea === plant)
      .map((area) => area.line)
      .filter((value, index, self) => self.indexOf(value) === index);

    // setLineOptions(filteredLines);

    const filteredMachines = areas
      .filter((area) => area.observedArea === plant && area.line === line)
      .map((area) => area.subGroup)
      .filter(
        (value, index, self) =>
          self.indexOf(value) === index &&
          value !== "Straw Applicator" &&
          value !== "Cap Applicator" &&
          value !== "Code Pack" &&
          value !== "Helix" &&
          value !== "Weight Checker"
      );

    setMachineOptions(filteredMachines);

    // fetchProductOptions();
  };

  const updateProcessOrder = () => {
    const formattedPlant = plant.replace(/\s+/g, "-");
    const formattedLine = line.replace(/\s+/g, "-");
    const formattedProduct = product.replace(/\s+/g, "-");
    const formattedDate = moment(date).tz("Asia/Jakarta").format("YYYY-MM-DD");
    const formattedTime = moment(date).tz("Asia/Jakarta").format("HH-mm-ss");
    const formattedShift = shift.replace(/\s+/g, "-");
    const formattedMachine = machine.replace(/\s+/g, "-");

    // setProcessOrder(
    //   `#${formattedPlant}_${formattedLine}_${formattedProduct}_${formattedDate}_${formattedTime}_${formattedShift}_${formattedMachine}`
    // );

    setProcessOrder(
      `#${formattedPlant}_${formattedLine}_${formattedDate}_${formattedShift}_${formattedMachine}`
    );
  };

  const evaluateGNR = (value, goodJson, needJson, rejectJson) => {
    console.log(value);
    console.log("good: ", goodJson);
    console.log("need: ", needJson);
    console.log("reject: ", rejectJson);
    const val = parseFloat(value);
    if (isNaN(val)) return "";

    const isWithin = (jsonString) => {
      try {
        const rules = JSON.parse(jsonString);
        const ruleArray = Array.isArray(rules) ? rules : [rules];

        return ruleArray.some((range) => {
          return Object.entries(range).every(([op, targetVal]) => {
            const target = parseFloat(targetVal);
            if (op === "=") return val === target;
            if (op === ">") return val > target;
            if (op === ">=") return val >= target;
            if (op === "<") return val < target;
            if (op === "<=") return val <= target;
            return false;
          });
        });
      } catch (e) {
        console.error("Invalid JSON range:", e);
        return false;
      }
    };

    if (isWithin(goodJson)) return "Good";
    if (isWithin(needJson)) return "Need";
    if (isWithin(rejectJson)) return "Reject";
    return "";
  };

  const handleOthersNoteChange = (index, text) => {
    setInspectionData((prevData) => {
      const updatedData = [...prevData];
      const currentItem = updatedData[index];

      updatedData[index] = {
        ...currentItem,
        results: {
          ...(currentItem.results || {}),
          OthersNote: text,
        },
      };

      return updatedData;
    });
  };

  const handleInputChange = (text, index) => {
    let data = [...inspectionData];

    const now = new Date();
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const formattedTime = `${hours}:${minutes}`;

    data[index].results = text;
    data[index].user = username;
    data[index].time = formattedTime;
    data[index].done = !!text;

    if (data[index].satuan !== null) {
      const newGNR = evaluateGNR(
        text,
        data[index].good,
        data[index].need,
        data[index].reject
      );
      if (newGNR) {
        data[index].gnr = newGNR;
      }
    }
    handleFieldChange(index, "results", text);
    setInspectionData(data);
  };

  const handleFieldChange = (index, fieldName, value) => {
    setInspectionData((prevData) => {
      const updatedData = [...prevData];
      const item = updatedData[index];

      if (fieldName === "results" && item.satuan !== null) {
        // Untuk input numerik
        updatedData[index] = {
          ...item,
          results: value,
        };
      } else {
        // General
        updatedData[index] = {
          ...item,
          [fieldName]: value,
        };
      }

      return updatedData;
    });
  };

  const fetchParameterInputed = async (inspectionResults, commonData) => {
    try {
      console.log(commonData);
      const payload = {
        bact_number: commonData.bact_number || null,
        variant: productType,
        param: JSON.stringify(inspectionResults), // Pastikan ini format yang sesuai
        prod: selectedProduct,
        production_date: commonData.productionDate || null,
        expiry_date: commonData.expiredDate || null,
        filler: line || null,
        start_production: commonData.startProduction || null,
        last_production: commonData.endProduction || null,
        product_size: commonData.productsize || null,
        completed: commonData.isValidGNR, // Bisa disesuaikan jika ada status lain
      };

      const response = await fetch("http://10.24.0.82:5002/api/post-param", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error("Gagal submit:", data.message);
      } else {
        console.log("Berhasil submit:");
      }
    } catch (error) {
      console.error("Terjadi kesalahan saat kirim data QC:", error);
    }
  };

  // Submit form and handle image upload
  const handleSubmit = (status) => {
    // Format inspection rows
    const isValidGNR = inspectionData.every((item) => item.gnr !== "");
    let completed;

    if (!isValidGNR) {
      Alert.alert("GNR Wajib", "Silakan isi semua pilihan GNR sebelum submit.");
      setisValidGNR(false);
      completed = true;
      // return; // penting: jangan lanjutkan submit kalau belum valid
    } else {
      setisValidGNR(true);
      completed = false;
    }

    const submit = () => {
      const inspectionResults = inspectionData.map((item) => {
        let resultsOutput = {};

        if (item.satuan !== null) {
          // Input numerik
          resultsOutput = item.results;
        } else if (item.gnr === "Need" || item.gnr === "Reject") {
          resultsOutput = {};
          Object.entries(item.results || {}).forEach(([key, val]) => {
            if (key === "OthersNote") {
              resultsOutput["OthersNote"] = val;
            } else {
              resultsOutput[key] = val === true;
            }
          });
        }

        return {
          parameter: item.parameter,
          gnr: item.gnr,
          results: resultsOutput,
          remarks: item.remarks || "",
        };
      });

      fetchParameterInputed(inspectionResults, {
        batchNumber,
        selectedProduct,
        productionDate: proddate?.toISOString?.(),
        expiredDate: exdate?.toISOString?.(),
        line,
        startProduction: startProd?.toISOString?.(),
        endProduction: endProd?.toISOString?.(),
        selectedProduct,
        isValidGNR: String(isValidGNR),
      });
    };

    // Jika status 0, munculkan konfirmasi terlebih dahulu
    if (status === 0) {
      Alert.alert(
        "Konfirmasi Submit",
        "Apakah Anda yakin ingin submit data ini?",
        [
          {
            text: "Batal",
            style: "cancel",
          },
          {
            text: "Yakin",
            onPress: submit,
          },
        ]
      );
    } else {
      submit();
      Alert.alert("Draft", "Parameter input akan disimpan di draft");
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
        <Text style={styles.title}>Input Parameter Quality</Text>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Batch Number</Text>
          <View style={styles.dropdownContainer}>
            <MaterialCommunityIcons
              name="numeric"
              size={20}
              color={COLORS.lightBlue}
            />
            <TextInput
              style={styles.input2}
              onChangeText={setBatchNumber}
              // value={processOrder}
              // editable={true}
            />
          </View>
        </View>

        <View style={styles.row}>
          <View style={styles.halfInputGroup}>
            <Text style={styles.label}>Filler *</Text>
            <View style={styles.dropdownContainer}>
              <MaterialCommunityIcons
                name="line-scan"
                size={24}
                color={COLORS.lightBlue}
              />
              <Picker
                selectedValue={line}
                style={styles.dropdown}
                onValueChange={handleLineChange}
              >
                <Picker.Item label="Select Line" value="" />
                {lineOptions.map((option, index) => (
                  <Picker.Item key={index} label={option} value={option} />
                ))}
              </Picker>
            </View>
          </View>

          <View style={styles.halfInputGroup}>
            <Text style={styles.label}>Product Order *</Text>
            <View style={styles.dropdownContainer}>
              <MaterialCommunityIcons
                name="identifier"
                size={24}
                color={COLORS.lightBlue}
              />
              <Picker
                selectedValue={productsize}
                style={styles.dropdown}
                onValueChange={(value) => {
                  const selectedItem = productOptions.find(
                    (item) => item.Type === value
                  );
                  const selectedLabel = selectedItem?.Prod || "";
                  handleprodChange(value, selectedLabel);
                }}
                enabled={productOptions.length > 0}
              >
                <Picker.Item label="Select Product" value="" />
                {productOptions.map((product, index) => (
                  <Picker.Item
                    key={index}
                    label={product.Prod}
                    value={product.Type}
                  />
                ))}
              </Picker>
            </View>
          </View>
        </View>

        <View style={styles.row}>
          {/* Select Date and Select Time */}
          <View style={styles.halfInputGroup}>
            <Text style={styles.label}>Production Date*</Text>
            <View style={styles.dropdownContainer}>
              <ReusableDatetime date={proddate} setDate={setProdDate} />
            </View>
          </View>

          <View style={styles.halfInputGroup}>
            <Text style={styles.label}>Expiry Date *</Text>
            <View style={styles.dropdownContainer}>
              {/* <ReusableDatetime
                    date={date}
                    setDate={setDate}
                    setShift={setShift}
                    getShiftByHour={getShiftByHour}
                  /> */}
              <ReusableDatetime date={exdate} setDate={setExDate} />
            </View>
          </View>
        </View>

        <View style={styles.row}>
          {/* Select Date and Select Time */}
          <View style={styles.halfInputGroup}>
            <Text style={styles.label}>Start Production*</Text>
            <View style={styles.dropdownContainer}>
              <ReusableDatetime2
                date={startProd}
                setDate={setStartProd}
                setShift={setShift}
                getShiftByHour={getShiftByHour}
              />
            </View>
          </View>

          <View style={styles.halfInputGroup}>
            <Text style={styles.label}>Last Production *</Text>
            <View style={styles.dropdownContainer}>
              <ReusableDatetime2
                date={endProd}
                setDate={setEndProd}
                setShift={setShift}
                getShiftByHour={getShiftByHour}
              />
            </View>
          </View>
        </View>

        {isLoading ? (
          <ActivityIndicator size="large" color={COLORS.blue} />
        ) : (
          <>
            <View style={styles.wrapper}>
              {/* Table Container */}
              <View style={styles.table}>
                {/* Table Head */}
                <View style={styles.tableHead}>
                  {/* Header Caption */}
                  {/* <View style={{ width: "10%" }}>
                        <Text style={styles.tableCaption}>Done</Text>
                      </View> */}
                  <View style={{ width: "20%" }}>
                    <Text style={styles.tableCaption}>Parameter</Text>
                  </View>

                  <View style={{ width: "20%" }}>
                    <Text style={styles.tableCaption}>GNR</Text>
                  </View>
                  <View style={{ width: "40%" }}>
                    <Text style={styles.tableCaption}>Parameter Input</Text>
                  </View>
                  <View style={{ width: "21%" }}>
                    <Text style={styles.tableCaption}>Remarks</Text>
                  </View>
                  {/* <View style={{ width: "20%" }}>
                        <Text style={styles.tableCaption}>Picture</Text>
                      </View> */}
                </View>
                {/* Table Body */}
                {loadingDataInput ? (
                  <ActivityIndicator size="large" color={COLORS.blue} />
                ) : (
                  inspectionData.map((item, index) => (
                    <View key={index} style={styles.tableBody}>
                      {/* Header Caption */}
                      {/* <View style={{ width: "10%" }}>
                          <View
                            style={[styles.tableData, styles.centeredContent]}
                          >
                            <Switch
                              style={styles.tableData}
                              value={item.done}
                              onValueChange={() => toggleSwitch(index)}
                            />
                          </View>
                        </View> */}
                      <View style={{ width: "20%" }}>
                        <Text style={styles.tableDataParam}>
                          {item.parameter}
                        </Text>
                      </View>

                      <View style={{ width: "20%" }}>
                        <View
                          style={[styles.tableData, styles.centeredContent]}
                        >
                          <Picker
                            selectedValue={item.gnr}
                            onValueChange={(value) =>
                              handleGNRChange(value, index)
                            }
                            style={[
                              styles.picker2,
                              {
                                backgroundColor:
                                  item.gnr === "Good"
                                    ? "#c8e6c9"
                                    : item.gnr === "Need"
                                    ? "#fff9c4"
                                    : item.gnr === "Reject"
                                    ? "#ffcdd2"
                                    : "#f8f9fa",
                              },
                            ]}
                          >
                            <Picker.Item label="Select" value="" />
                            <Picker.Item label="Good" value="Good" />
                            <Picker.Item label="Need" value="Need" />
                            <Picker.Item label="Reject" value="Reject" />
                          </Picker>
                        </View>
                      </View>

                      {item.satuan !== null ? (
                        <TextInput
                          // placeholder={`Batas: ${item.good}`}
                          placeholder={`Fill Here First`}
                          style={styles.tableData2}
                          value={item.results}
                          keyboardType="numeric"
                          onChangeText={(text) =>
                            handleInputChange(text, index)
                          }
                          // editable={item.gnr === "Need" || item.gnr === "Reject"|| item.gnr === "Good"}
                        />
                      ) : Object.keys(item.parsedGood).length === 0 ? (
                        <Text style={{ fontStyle: "italic", color: "gray" }}>
                          Tidak ada parameter checklist
                        </Text>
                      ) : item.gnr === "Need" || item.gnr === "Reject" ? (
                        // CASE 2: Checklist hanya jika GNR = Need / Reject
                        Object.keys(item.parsedGood).length === 0 ? (
                          <Text style={{ fontStyle: "italic", color: "gray" }}>
                            Tidak ada parameter checklist
                          </Text>
                        ) : item.gnr === "Need" ? (
                          <View
                            style={{
                              alignItems: "flex-start",
                              width: "40%",
                              marginLeft: 10,
                            }}
                          >
                            {Object.entries(item.parsedNeed).map(
                              ([label], i) => (
                                <View
                                  key={i}
                                  style={{
                                    flexDirection: "row",
                                    alignItems: "center",
                                  }}
                                >
                                  <Checkbox
                                    status={
                                      item.results?.[label]
                                        ? "checked"
                                        : "unchecked"
                                    }
                                    onPress={() =>
                                      toggleChecklist(index, label)
                                    }
                                  />
                                  <Text>{label}</Text>
                                </View>
                              )
                            )}

                            {/* Checklist Others */}
                            <View
                              style={{
                                flexDirection: "row",
                                alignItems: "center",
                              }}
                            >
                              <Checkbox
                                status={
                                  item.results?.Others ? "checked" : "unchecked"
                                }
                                onPress={() => toggleChecklist(index, "Others")}
                              />
                              <Text>Others</Text>
                            </View>

                            {/* TextInput hanya muncul jika Others dicentang */}
                            {item.results?.Others && (
                              <TextInput
                                placeholder="Tulis lainnya..."
                                value={item.results?.OthersNote || ""}
                                onChangeText={(text) =>
                                  handleOthersNoteChange(index, text)
                                }
                                style={{
                                  borderWidth: 1,
                                  borderColor: "#ccc",
                                  padding: 5,
                                  width: "100%",
                                  marginTop: 5,
                                  borderRadius: 5,
                                }}
                              />
                            )}
                          </View>
                        ) : (
                          <View
                            style={{
                              alignItems: "flex-start",
                              width: "40%",
                              marginLeft: 10,
                            }}
                          >
                            {Object.entries(item.parsedReject).map(
                              ([label], i) => (
                                <View
                                  key={i}
                                  style={{
                                    flexDirection: "row",
                                    alignItems: "center",
                                  }}
                                >
                                  <Checkbox
                                    status={
                                      item.results?.[label]
                                        ? "checked"
                                        : "unchecked"
                                    }
                                    onPress={() =>
                                      toggleChecklist(index, label)
                                    }
                                  />
                                  <Text>{label}</Text>
                                </View>
                              )
                            )}

                            {/* Checklist Others */}
                            <View
                              style={{
                                flexDirection: "row",
                                alignItems: "center",
                              }}
                            >
                              <Checkbox
                                status={
                                  item.results?.Others ? "checked" : "unchecked"
                                }
                                onPress={() => toggleChecklist(index, "Others")}
                              />
                              <Text>Others</Text>
                            </View>

                            {/* TextInput hanya muncul jika Others dicentang */}
                            {item.results?.Others && (
                              <TextInput
                                placeholder="Tulis lainnya..."
                                value={item.results?.OthersNote || ""}
                                onChangeText={(text) =>
                                  handleOthersNoteChange(index, text)
                                }
                                style={{
                                  borderWidth: 1,
                                  borderColor: "#ccc",
                                  padding: 5,
                                  width: "100%",
                                  marginTop: 5,
                                  borderRadius: 5,
                                }}
                              />
                            )}
                          </View>
                        )
                      ) : (
                        // CASE 3: Saat GNR = Good atau belum dipilih
                        <Text
                          style={{
                            justifyContent: "center",
                            alignItems: "center",
                            fontStyle: "italic",
                            color: "gray",
                            marginLeft: 10,
                            width: "40%",
                          }}
                        >
                          Parameter Input Can't Be Selected
                        </Text>
                      )}

                      <View style={{ width: "21%" }}>
                        <TextInput
                          placeholder="Fill Here"
                          style={styles.tableData}
                          value={item.remarks || ""}
                          onChangeText={(text) =>
                            handleFieldChange(index, "remarks", text)
                          }
                          multiline
                          numberOfLines={2}
                        />
                      </View>
                    </View>
                  ))
                )}
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

        <>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[
                styles.submitButton,
                !agreed && styles.submitButtonDisabled,
              ]}
              onPress={() => handleSubmit(1)}
              disabled={!agreed}
            >
              <Text style={styles.submitButtonText}>SAVE AS DRAFT</Text>
            </TouchableOpacity>
          </View>
        </>

        <View>
          <TouchableOpacity
            style={[
              styles.submitButton,
              (!agreed || !isValidGNR) && styles.submitButtonDisabled,
            ]}
            onPress={() => handleSubmit(0)}
            disabled={!agreed}
          >
            <Text style={styles.submitButtonText}>SUBMIT</Text>
          </TouchableOpacity>
        </View>
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
  input2: {
    flex: 1, // <<< ini kunci utama
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
    paddingHorizontal: 5,
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
  tableDataParam: {
    // color: "#fff",
    // fontWeight: "bold",
    fontSize: 14,
    textAlign: "left", // Center-align text in cells
  },
  tableData2: {
    // color: "#fff",
    // fontWeight: "bold",
    fontSize: 16,
    textAlign: "center", // Center-align text in cells
    marginLeft: 10,
    width: "40%",
  },
  centeredContent: {
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 10,
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
  buttonContainer: {
    paddingBottom: 16,
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
  picker2: {
    width: "100%",
    height: 40,
    // backgroundColor: "#f8f9fa",
  },
  picker: {
    width: "100%",
    height: 40,
    backgroundColor: "#f8f9fa",
  },
});

export default Paraminspection;
