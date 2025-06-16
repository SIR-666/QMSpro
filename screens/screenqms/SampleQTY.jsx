import { MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Picker } from "@react-native-picker/picker";
import * as ScreenOrientation from "expo-screen-orientation";
import moment from "moment-timezone";
import { useEffect, useState } from "react";
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
import { SafeAreaView } from "react-native-safe-area-context";
import { HeightSpacer } from "../../components";
import ReusableDatetime from "../../components/Reusable/ReusableDatetime3";
import ReusableDatetime3 from "../../components/Reusable/ReusableDatetime4";
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

const SampleQuantity = ({ route, navigation }) => {
  const { username, line_fil: initialLine } = route.params;
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

  // console.log("line :", initialLine);

  const [productType, setProductType] = useState(""); // ESL atau UHT
  const [productOptions, setProductOptions] = useState([]);
  const [product, setProduct] = useState("");
  const [productsize, setProductSize] = useState("");

  const [agreed, setAgreed] = useState(false);

  const [inspectionData, setInspectionData] = useState([]);
  const [timer, setTimer] = useState(new Date());
  const [selectedProduct, setSelectedProduct] = useState("");
  const [loadingDataInput, setloadingDataInput] = useState(true);
  const [batchNumber, setBatchNumber] = useState("");
  const [startProd, setStartProd] = useState(new Date());
  const [tableData, setTableData] = useState([]);

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
      // const response = await fetch(`http://10.24.0.82:5002/api/sku/${type}`);
      const response = await fetch(`http://10.24.0.82:5008/api/sku/${type}`);
      const data = await response.json();
      setloadingDataInput(false);
      setProductOptions(data);
      // console.log("data :", data);
    } catch (error) {
      console.error("Failed to fetch products:", error);
    }
  };

  useEffect(() => {
    if (selectedProduct) {
      fetch(
        `http://10.24.0.82:5008/api/getqc-inputed/${initialLine}/${selectedProduct}/${proddate}`
      )
        .then((res) => res.json())
        .then((data) => {
          const parsedData = data.map((item) => ({
            timer: new Date(item.Timer),
            ...JSON.parse(item.Data),
          }));
          setTableData(parsedData);
        })
        .catch((err) => console.error("Error fetching data:", err));
    }
  }, [selectedProduct, initialLine, proddate]);

  const handleLineChange = (selectedLine) => {
    setLine(selectedLine);
    const type = getProductType(selectedLine);
    setProductType(type);
    fetchProductOptions(type);
    // console.log("type", selectedLine);
  };

  useEffect(() => {
    if (initialLine) {
      console.log("initial line:", initialLine);
      setLine(initialLine);
      const type = getProductType(initialLine);
      setProductType(type);
      fetchProductOptions(type);
    }
  }, [initialLine]);

  const handleprodChange = (selectedProd, label) => {
    // setLine(selectedLine);
    // const type = getProductType(selectedLine);
    setProductSize(selectedProd);
    setSelectedProduct(label);
    // fetchInspectionData(selectedProd);
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

  const handleFieldChange = (fieldName, value) => {
    setInspectionData((prevData) => ({
      ...prevData,
      [fieldName]: value,
    }));
  };

  const fetchParameterInputed = async (inspectionResults, commonData) => {
    try {
      const payload = {
        bact_number: batchNumber || null,
        variant: productType,
        data: JSON.stringify(inspectionResults), // Pastikan ini format yang sesuai
        prod: selectedProduct,
        timer: commonData.timer,
        production_date: commonData.productionDate || null,
        expiry_date: commonData.expiredDate || null,
        filler: line || null,
        product_size: productsize || null, // Bisa disesuaikan jika ada status lain
      };
      console.log(payload);
      const response = await fetch("http://10.24.0.82:5008/api/post-sample2", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      // const response = await fetch("http://10.24.0.82:5008/api/post-param", {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify(payload),
      // });

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
    console.log(inspectionData);
    console.log("timer:", timer);
    // const isValidGNR = inspectionData.every((item) => item.gnr !== "");
    // let completed;

    // if (!isValidGNR) {
    //   Alert.alert("GNR Wajib", "Silakan isi semua pilihan GNR sebelum submit.");
    //   setisValidGNR(false);
    //   completed = true;
    //   // return; // penting: jangan lanjutkan submit kalau belum valid
    // } else {
    //   setisValidGNR(true);
    //   completed = false;
    // }

    const submit = () => {
      fetchParameterInputed(inspectionData, {
        batchNumber,
        selectedProduct,
        productionDate: proddate?.toISOString?.(),
        expiredDate: exdate?.toISOString?.(),
        line,
        timer: timer,
        selectedProduct,
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

  const HandleselectBatch = (Value) => {
    setBatchNumber(Value);
    // console.log("bact number :", Value);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>Input QTY Sample</Text>
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
              onChangeText={(text) => HandleselectBatch(text)}
              value={batchNumber}
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
              {/* <Picker
                selectedValue={line}
                style={styles.dropdown}
                onValueChange={handleLineChange}
              >
                <Picker.Item label="Select Line" value="" />
                {lineOptions.map((option, index) => (
                  <Picker.Item key={index} label={option} value={option} />
                ))}
              </Picker> */}
              <Picker
                selectedValue={line}
                style={styles.dropdown}
                onValueChange={handleLineChange}
                enabled={false} // disable input
              >
                <Picker.Item label={line || "Select Line"} value={line} />
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
                selectedValue={selectedProduct}
                style={styles.dropdown}
                onValueChange={(value) => {
                  const selectedItem = productOptions.find(
                    (item) => String(item.Prod) === String(value)
                  );

                  if (selectedItem) {
                    handleprodChange(selectedItem.Type, selectedItem.Prod); // Simpan Type & Prod
                  } else {
                    handleprodChange("", "");
                  }
                }}
                enabled={productOptions.length > 0}
              >
                <Picker.Item label="Select Product" value="" />
                {productOptions.map((product, index) => (
                  <Picker.Item
                    key={index}
                    label={String(product.Prod)} // Ditampilkan ke user
                    value={String(product.Prod)} // Value yang dikirim
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

        <HeightSpacer height={20} />
        <>
          <Text style={styles.title2}>Sample</Text>
          <View style={styles.wrapper}>
            <ScrollView horizontal={true} showsHorizontalScrollIndicator={true}>
              <View style={styles.table}>
                {/* Table Head */}
                <View style={styles.tableHead}>
                  <View style={{ width: 120 }}>
                    <Text style={styles.tableCaption}>Timer</Text>
                  </View>
                  <View style={{ width: 100 }}>
                    <Text style={styles.tableCaption}>No. Pallet</Text>
                  </View>
                  <View style={{ width: 100 }}>
                    <Text style={styles.tableCaption}>No. Carton</Text>
                  </View>
                  <View style={{ width: 100 }}>
                    <Text style={styles.tableCaption}>Start</Text>
                  </View>
                  <View style={{ width: 100 }}>
                    <Text style={styles.tableCaption}>Random</Text>
                  </View>
                  <View style={{ width: 100 }}>
                    <Text style={styles.tableCaption}>End</Text>
                  </View>
                  <View style={{ width: 100 }}>
                    <Text style={styles.tableCaption}>K4</Text>
                  </View>
                  <View style={{ width: 100 }}>
                    <Text style={styles.tableCaption}>K7</Text>
                  </View>
                  <View style={{ width: 100 }}>
                    <Text style={styles.tableCaption}>K21</Text>
                  </View>
                  <View style={{ width: 100 }}>
                    <Text style={styles.tableCaption}>K40</Text>
                  </View>
                  <View style={{ width: 100 }}>
                    <Text style={styles.tableCaption}>K50</Text>
                  </View>
                  <View style={{ width: 100 }}>
                    <Text style={styles.tableCaption}>K60</Text>
                  </View>
                  <View style={{ width: 100 }}>
                    <Text style={styles.tableCaption}>Direct</Text>
                  </View>
                </View>

                {/* Table Body */}
                <View style={styles.tableBody}>
                  <View style={{ width: 100 }}>
                    <ReusableDatetime3 date={timer} setDate={setTimer} />
                  </View>
                  <View style={{ width: 120 }}>
                    <TextInput
                      placeholder="0"
                      style={styles.tableData}
                      keyboardType="numeric"
                      onChangeText={(text) => handleFieldChange("carton", text)}
                    />
                  </View>
                  {[
                    "start",
                    "pallet",
                    "random",
                    "end",
                    "k4",
                    "k7",
                    "k21",
                    "k40",
                    "k50",
                    "k60",
                    "direct",
                  ].map((key) => (
                    <View style={{ width: 100 }} key={key}>
                      <TextInput
                        placeholder="0"
                        style={styles.tableData}
                        keyboardType="numeric"
                        onChangeText={(text) => handleFieldChange(key, text)}
                      />
                    </View>
                  ))}
                </View>
              </View>
            </ScrollView>
          </View>
        </>

        <HeightSpacer height={20} />
        <>
          <Text style={styles.title2}>History</Text>
          <View style={styles.wrapper}>
            <ScrollView horizontal={true} showsHorizontalScrollIndicator={true}>
              <View style={styles.table2}>
                {/* Table Head */}
                <View style={styles.tableHead2}>
                  {[
                    "Timer",
                    "No. Pallet",
                    "No. Carton",
                    "Start",
                    "Random",
                    "End",
                    "K4",
                    "K7",
                    "K21",
                    "K40",
                    "K50",
                    "K60",
                    "Direct",
                  ].map((label, index) => (
                    <View key={index} style={styles.cell}>
                      <Text style={styles.tableCaption}>{label}</Text>
                    </View>
                  ))}
                </View>

                {/* Table Body */}
                {tableData.map((row, index) => (
                  <View key={index} style={styles.tableBody}>
                    <View style={styles.cell}>
                      <ReusableDatetime3 date={row.timer} setDate={() => {}} />
                    </View>
                    <View style={styles.cell}>
                      <TextInput
                        placeholder="0"
                        style={styles.tableData2}
                        keyboardType="numeric"
                        value={row.carton}
                        editable={false}
                      />
                    </View>
                    {[
                      "start",
                      "pallet",
                      "random",
                      "end",
                      "k4",
                      "k7",
                      "k21",
                      "k40",
                      "k50",
                      "k60",
                      "direct",
                    ].map((key) => (
                      <View key={key} style={styles.cell}>
                        <TextInput
                          placeholder="0"
                          style={styles.tableData2}
                          keyboardType="numeric"
                          value={row[key]}
                          editable={false}
                        />
                      </View>
                    ))}
                  </View>
                ))}
              </View>
            </ScrollView>
          </View>
        </>

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
          onPress={() => handleSubmit(0)}
          disabled={!agreed} // <- ini dia yang penting
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
  title2: {
    fontSize: 20,
    fontWeight: "bold",
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
    margin: 10,
  },
  table2: {
    flexDirection: "column",
    width: "100%",
    flex: 1,
  },
  tableHead: {
    flexDirection: "row",
    backgroundColor: "#3bcd6b",
    paddingVertical: 20,
    width: "100%",
  },
  tableHead2: {
    flexDirection: "row",
    backgroundColor: "#A6AEBF",
    paddingVertical: 20,
    width: "100%",
  },
  tableBody: {
    flexDirection: "row",
    paddingVertical: 10,
    paddingHorizontal: 5,
    borderBottomWidth: 1,
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
    fontSize: 14,
    textAlign: "center",
    // borderWidth: 1,
    borderColor: "#ccc",
    paddingVertical: 4,
    width: "100%",
  },
  centeredContent: {
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 10,
  },
  cell: {
    flexBasis: 0,
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 2,
    width: 60,
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
  tableWrapper: {
    // maxHeight: 400, // batas tinggi agar scroll aktif
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    backgroundColor: "#fafafa",
  },
});

export default SampleQuantity;
