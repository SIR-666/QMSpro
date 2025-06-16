import { MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import * as ScreenOrientation from "expo-screen-orientation";
import moment from "moment-timezone";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Checkbox } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import ReusableDatetime from "../../components/Reusable/ReusableDatetime3";
import TimeOnlyPicker from "../../components/Reusable/ReusableDatetime5";
import { COLORS } from "../../constants/theme";

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

const ParaminspectionDraft = ({ route, navigation }) => {
  const {
    username,
    sku_fill: sku_id,
    filler: Line,
    input_date: input_id,
    dataAll: inputAll,
  } = route.params;
  const [processOrder, setProcessOrder] = useState("#Plant_Line_SKU");
  const [packageType, setPackageType] = useState("");
  const [plant, setPlant] = useState("");
  const [line, setLine] = useState("");
  const [date, setDate] = useState(new Date());
  const [proddate, setProdDate] = useState(new Date());
  const [exdate, setExDate] = useState(new Date());

  console.log("input_id :", input_id);

  const [productType, setProductType] = useState(""); // ESL atau UHT
  const [productOptions, setProductOptions] = useState([]);
  const [product, setProduct] = useState("");
  const [productsize, setProductSize] = useState("");
  const [productOrder, setProductOrder] = useState("");

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
  const [timeinput, setTimeinput] = useState(new Date());
  const [group, setGroup] = useState("");
  const [isSelected, setIsSelected] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [warningitem, setWarningitem] = useState("");
  const [shift, setShift] = useState(
    getShiftByHour(moment(new Date()).tz("Asia/Jakarta").format("HH"))
  );

  const [prodverif, setProdverif] = useState(false);

  const loadDraftData = (draftData) => {
    if (!draftData || draftData.length === 0) return;

    const parsedDraft = JSON.parse(draftData[0].Parameter_Input);

    const updatedInspectionData = inspectionData.map((item) => {
      const draftItem = parsedDraft.find((d) => d.parameter === item.parameter);

      if (!draftItem) return item; // kalau ga ada draft skip

      return {
        ...item,
        gnr: draftItem.gnr || "",
        remarks: draftItem.remarks || "",
        results:
          draftItem.results && typeof draftItem.results === "object"
            ? draftItem.results
            : draftItem.results || {},
      };
    });

    setInspectionData(updatedInspectionData);
  };

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

  const fetchDraft = async () => {
    try {
      // const response = await fetch(
      //   "http://10.24.0.82:5002/api/getdraf-details/2025-05-03%2009:00:34.103"
      // );
      const response = await fetch(
        "http://10.24.0.82:5008/api/getdraf-details/2025-05-03%2009:00:34.103"
      );
      const data = await response.json();

      if (data && data.length > 0) {
        loadDraftData(data);
      }
    } catch (error) {
      console.error("Failed fetch draft", error);
    }
  };

  useEffect(() => {
    fetchInspectionData(sku_id);
    // fetchDraft();
  }, [sku_id]);

  const CheckProdverif = async (selectedProd) => {
    try {
      Alert.alert(selectedProd);
      const existingData = await AsyncStorage.getItem("ProdVerif");

      if (selectedProd === existingData) {
        setProdverif(false);
      } else {
        await AsyncStorage.setItem("ProdVerif", selectedProd);

        setProdverif(true);
      }
    } catch (storageError) {
      console.error("Failed saving to AsyncStorage:", storageError);
    }
  };

  // useEffect(async () => {
  //   try {
  //     console.log("shift:", shift);
  //     const existingData = await AsyncStorage.getItem("shift");
  //     if (shift === existingData) {
  //       setProdverif(false);
  //     } else {
  //       await AsyncStorage.setItem("shift", shift);
  //       setProdverif(true);
  //     }
  //   } catch (storageError) {
  //     console.error("Failed saving to AsyncStorage:", storageError);
  //   }
  // }, [shift]);

  const handleprodChange = (selectedProd, label) => {
    // setLine(selectedLine);
    // const type = getProductType(selectedLine);
    CheckProdverif(label);
    setProductSize(selectedProd);
    setSelectedProduct(label);
    fetchInspectionData(selectedProd);
  };

  // useEffect(() => {
  //   // Lock the screen orientation to portrait
  //   const lockOrientation = async () => {
  //     await ScreenOrientation.lockAsync(
  //       ScreenOrientation.OrientationLock.PORTRAIT
  //     );
  //   };
  //   lockOrientation();
  // }, []);

  useEffect(() => {
    const allGNRFilled =
      inspectionData.length > 0 &&
      inspectionData.every((item) => item.gnr !== "");
    setisValidGNR(allGNRFilled);
  }, [inspectionData]);

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

  // const toggleChecklist_New = (index, selectedLabel, column) => {
  //   const updatedData = [...inspectionData];
  //   const currentItem = updatedData[index];

  //   if (inspectionData[index].warning != null) {
  //     console.log(inspectionData[index].warning);
  //     setModalVisible(true);
  //     setWarningitem(inspectionData[index].warning);
  //   }
  //   // Pastikan results ada
  //   if (!currentItem.results || typeof currentItem.results !== "object") {
  //     currentItem.results = {};
  //   }

  //   // Toggle selected label (centang/uncentang)
  //   currentItem.results[selectedLabel] = !currentItem.results[selectedLabel];

  //   // Hapus OthersNote kalau Others tidak dicentang
  //   if (selectedLabel === "Others" && !currentItem.results["Others"]) {
  //     delete currentItem.results["OthersNote"];
  //   }

  //   // GNR di-set ke kolom saat ini
  //   currentItem.gnr = column;

  //   // Hapus checklist dari kolom lain (mutually exclusive antar kolom)
  //   const clearOtherColumns = (keys) => {
  //     keys.forEach((label) => {
  //       if (label !== selectedLabel) {
  //         delete currentItem.results[label];
  //       }
  //     });
  //   };

  //   if (column === "Reject") {
  //     clearOtherColumns([
  //       ...Object.keys(currentItem.parsedGood || {}),
  //       ...Object.keys(currentItem.parsedNeed || {}),
  //     ]);
  //   } else if (column === "Need") {
  //     clearOtherColumns([
  //       ...Object.keys(currentItem.parsedGood || {}),
  //       ...Object.keys(currentItem.parsedReject || {}),
  //     ]);
  //   } else if (column === "Good") {
  //     clearOtherColumns([
  //       ...Object.keys(currentItem.parsedNeed || {}),
  //       ...Object.keys(currentItem.parsedReject || {}),
  //     ]);
  //   }

  //   updatedData[index] = currentItem;
  //   setInspectionData(updatedData);
  // };

  const toggleChecklist_New = (index, selectedLabel, column) => {
    const updatedData = [...inspectionData];
    const currentItem = updatedData[index];

    // Warning khusus untuk Reject
    if (currentItem.warning != null && column === "Reject") {
      setModalVisible(true);
      setWarningitem(currentItem.warning);
    }

    // Pastikan results adalah objek checklist
    if (!currentItem.results || typeof currentItem.results !== "object") {
      currentItem.results = {};
    }

    // Jika GNR sama → toggle checklist
    if (currentItem.gnr === column) {
      currentItem.results[selectedLabel] = !currentItem.results[selectedLabel];

      // Jika Others di-uncheck → hapus catatan
      if (selectedLabel === "Others" && !currentItem.results["Others"]) {
        delete currentItem.results["OthersNote"];
      }

      // Cek apakah semua checkbox tidak dicentang → reset GNR dan results
      const isEmpty = Object.values(currentItem.results).every((v) => !v);
      if (isEmpty) {
        currentItem.gnr = null;
        currentItem.results = {};
      }
    } else {
      // Kalau pindah ke GNR baru
      currentItem.gnr = column;
      currentItem.results = {
        [selectedLabel]: true,
      };
    }

    // Hapus checklist dari kolom lain (mutually exclusive)
    const clearOtherColumns = (keys) => {
      keys.forEach((label) => {
        if (label !== selectedLabel) {
          delete currentItem.results[label];
        }
      });
    };

    if (column === "Reject") {
      clearOtherColumns([
        ...Object.keys(currentItem.parsedGood || {}),
        ...Object.keys(currentItem.parsedNeed || {}),
      ]);
    } else if (column === "Need") {
      clearOtherColumns([
        ...Object.keys(currentItem.parsedGood || {}),
        ...Object.keys(currentItem.parsedReject || {}),
      ]);
    } else if (column === "Good") {
      clearOtherColumns([
        ...Object.keys(currentItem.parsedNeed || {}),
        ...Object.keys(currentItem.parsedReject || {}),
      ]);
    }

    updatedData[index] = currentItem;
    setInspectionData(updatedData);
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

  // const handleGNRChange = (value, index) => {
  //   const updatedData = [...inspectionData];
  //   updatedData[index].gnr = value;
  //   handleFieldChange(index, "gnr", value);

  //   // Optional: Reset value results kalau GNR jadi Good
  //   if (value === "Good") {
  //     updatedData[index].results = "";
  //   }

  //   setInspectionData(updatedData);
  // };

  // useEffect(() => {
  //   if (inputAll?.Batch_Number) {
  //     setBatchNumber(String(inputAll.Batch_Number));
  //   }
  // }, [inputAll]);

  const handleGNRChange = (value, index) => {
    const updatedData = [...inspectionData];
    const currentItem = updatedData[index];

    if (currentItem.gnr === value) {
      // Jika tombol GNR diklik dua kali → reset
      currentItem.gnr = null;
      currentItem.results = currentItem.satuan !== null ? "" : {};
    } else {
      // Pilih GNR baru
      currentItem.gnr = value;
      currentItem.results = currentItem.satuan !== null ? "" : {};
    }

    handleFieldChange(index, "gnr", currentItem.gnr);
    setInspectionData(updatedData);
  };

  const HandleselectBatch = (Value) => {
    setBatchNumber(Value);
    // console.log("bact number :", Value);
  };
  const fetchInspectionData = async (selectedProduct) => {
    setIsLoading(true);

    try {
      // const response = await axios.get(
      //   `http://10.24.0.82:5002/api/getlistparma/${selectedProduct}`
      // );

      // const draftResponse = await fetch(
      //   `http://10.24.0.82:5002/api/getdraf-details/${input_id}`
      // );

      const response = await axios.get(
        `http://10.24.0.82:5008/api/getlistparma/${selectedProduct}`
      );

      const draftResponse = await fetch(
        `http://10.24.0.82:5008/api/getdraf-details/${input_id}`
      );

      // ===> DISINI TARUHNYA (setelah data berhasil diformat)

      setProdDate(
        inputAll?.Production_Date
          ? new Date(inputAll.Production_Date)
          : new Date()
      );

      setExDate(
        inputAll?.Expiry_Date ? new Date(inputAll.Expiry_Date) : new Date()
      );

      setStartProd(
        inputAll?.Start_Production
          ? new Date(inputAll.Start_Production)
          : new Date()
      );

      setEndProd(
        inputAll?.Last_Production
          ? new Date(inputAll.Last_Production)
          : new Date()
      );

      const draftData = await draftResponse.json();

      // const batchNumbers = draftData.map((item) => item.Batch_Number);
      console.log("draft data :", draftData[0].Batch_Number);
      setBatchNumber(draftData[0].Batch_Number);
      const parsedDraft =
        draftData && draftData.length > 0
          ? JSON.parse(draftData[0].Parameter_Input)
          : [];

      setLine(draftData[0].Filler);
      setProductOrder(draftData[0].Product_Name);
      setTimeinput(new Date(draftData[0].Input_At));
      setGroup(draftData[0].Group);

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

        const draftItem = parsedDraft.find(
          (d) => d.parameter === item.Parameter
        );

        return {
          code: item.Code,
          variant: item.Variant,
          parameter: item.Parameter,
          good: item.Good,
          parsedGood,
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
          warning: item.Warning,
          gnr: draftItem?.gnr || "",
          results:
            draftItem?.results && typeof draftItem?.results === "object"
              ? draftItem.results
              : draftItem?.results || (item.Satuan !== null ? "" : {}),
          remarks: draftItem?.remarks || "",
        };
      });

      setInspectionData(formattedData);
    } catch (error) {
      console.error("Error fetching inspection data parameter:", error);
    } finally {
      setIsLoading(false);
      setloadingDataInput(false);
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

  const handleOthersNoteChange = (index, text, column) => {
    setInspectionData((prevData) => {
      const updatedData = [...prevData];
      const currentItem = updatedData[index];

      if (!currentItem.results) currentItem.results = {};
      if (!currentItem.results[column]) currentItem.results[column] = {};

      currentItem.results[column]["OthersNote"] = text;
      updatedData[index] = currentItem;
      return updatedData;
    });
  };

  const handleInputChange = (text, index, gnr) => {
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
        bact_number: batchNumber || null,
        param: JSON.stringify(inspectionResults), // Pastikan ini format yang sesuai
        prod: inputAll.Product_Name,
        production_date: commonData.productionDate || null,
        expiry_date: commonData.expiredDate || null,
        input_at: inputAll.Input_At || null,
        filler: inputAll.Filler || null,
        start_production: commonData.startProduction || null,
        last_production: commonData.endProduction || null,
        product_size: inputAll.Product_Size || null,
        completed: commonData.isValidGNR, // Bisa disesuaikan jika ada status lain
      };

      // const response = await fetch("http://10.24.0.82:5002/api/update-param", {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify(payload),
      // });

      const response = await fetch("http://10.24.0.82:5008/api/update-param", {
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
        productionDate: proddate?.toISOString?.(),
        expiredDate: exdate?.toISOString?.(),
        line,
        startProduction: startProd?.toISOString?.(),
        endProduction: endProd?.toISOString?.(),
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

  const checklistItems = [
    "Paper/Sleeve (Filling)",
    "Product (Filling)",
    "Pack Kosong (Filling)",
    "Product (Packing)",
    "Carton Box",
    "Camera Vision Kode & Rejector",
    "Cam Vision Helicap/Straw & Rejector",
    "Weight Checker & Rejector",
  ];

  const toggleChecklistVerif = (item) => {
    if (isSelected.includes(item)) {
      setIsSelected(isSelected.filter((i) => i !== item));
    } else {
      setIsSelected([...isSelected, item]);
    }
  };

  // console.log(isSelected);
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <TouchableOpacity
          onPress={async () => {
            const orientation = await ScreenOrientation.getOrientationAsync();
            if (
              orientation === ScreenOrientation.Orientation.PORTRAIT_UP ||
              orientation === ScreenOrientation.Orientation.PORTRAIT_DOWN
            ) {
              await ScreenOrientation.lockAsync(
                ScreenOrientation.OrientationLock.LANDSCAPE
              );
            } else {
              await ScreenOrientation.lockAsync(
                ScreenOrientation.OrientationLock.PORTRAIT
              );
            }
          }}
          style={{
            backgroundColor: COLORS.blue,
            padding: 10,
            marginBottom: 20,
            borderRadius: 8,
            alignItems: "center",
            width: 200,
            alignSelf: "center",
          }}
        >
          <Text style={{ color: "#fff", fontWeight: "bold" }}>
            Rotate Screen
          </Text>
        </TouchableOpacity>

        <Text style={styles.title}>Input Parameter Quality</Text>

        {prodverif ? (
          <>
            <View style={styles.wrapper2}>
              <Text style={styles.label}>PRODUCTION VERIFICATION</Text>
              <ScrollView style={styles.tableWrapper2}>
                <View style={styles.tableHead2}>
                  <View style={{ width: "30%" }}>
                    {checklistItems.map((item, index) =>
                      index < 3 ? (
                        <View
                          key={index}
                          style={{
                            flexDirection: "row",
                            alignItems: "center",
                            paddingVertical: 5,
                          }}
                        >
                          <Checkbox
                            status={
                              isSelected.includes(item)
                                ? "checked"
                                : "unchecked"
                            }
                            onPress={() => toggleChecklistVerif(item)}
                          />
                          <Text>{item}</Text>
                        </View>
                      ) : null
                    )}
                  </View>
                  <View style={{ width: "30%" }}>
                    {checklistItems.map((item, index) =>
                      index > 2 && index < 6 ? (
                        <View
                          key={index}
                          style={{
                            flexDirection: "row",
                            alignItems: "center",
                            paddingVertical: 5,
                          }}
                        >
                          <Checkbox
                            status={
                              isSelected.includes(item)
                                ? "checked"
                                : "unchecked"
                            }
                            onPress={() => toggleChecklistVerif(item)}
                          />
                          <Text>{item}</Text>
                        </View>
                      ) : null
                    )}
                  </View>
                  <View style={{ width: "40%" }}>
                    {checklistItems.map((item, index) =>
                      index > 5 ? (
                        <View
                          key={index}
                          style={{
                            flexDirection: "row",
                            alignItems: "center",
                            paddingVertical: 5,
                          }}
                        >
                          <Checkbox
                            status={
                              isSelected.includes(item)
                                ? "checked"
                                : "unchecked"
                            }
                            onPress={() => toggleChecklistVerif(item)}
                          />
                          <Text>{item}</Text>
                        </View>
                      ) : null
                    )}
                  </View>
                </View>
              </ScrollView>
            </View>
          </>
        ) : (
          <Text></Text>
        )}

        {isLoading ? (
          <ActivityIndicator size="large" color={COLORS.blue} />
        ) : (
          <>
            <View style={styles.inputGroup}>
              <Text style={styles.labelsub}>Batch Number</Text>
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
                  <Text style={{ marginLeft: 8 }}>{line}</Text>
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
                  <Text style={{ marginLeft: 8 }}>{productOrder}</Text>
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
                  <TimeOnlyPicker date={startProd} setDate={setStartProd} />
                </View>
              </View>

              <View style={styles.halfInputGroup}>
                <Text style={styles.label}>Last Production *</Text>
                <View style={styles.dropdownContainer}>
                  <TimeOnlyPicker date={endProd} setDate={setEndProd} />
                </View>
              </View>
            </View>

            <View style={styles.row}>
              <View style={styles.halfInputGroup}>
                <Text style={styles.label}>Time Input</Text>
                <View style={styles.dropdownContainer}>
                  <MaterialCommunityIcons
                    name="calendar-range"
                    size={20}
                    color={COLORS.lightBlue}
                  />
                  <Text style={{ marginLeft: 8 }}>
                    {moment(timeinput).format("DD-MM-YYYY HH:mm")}
                  </Text>
                </View>
              </View>

              <View style={styles.halfInputGroup}>
                <Text style={styles.label}>Group *</Text>
                <View style={styles.dropdownContainer}>
                  <MaterialCommunityIcons
                    name="account-group"
                    size={24}
                    color={COLORS.lightBlue}
                  />
                  <Text style={{ marginLeft: 8 }}>{group}</Text>
                </View>
              </View>
            </View>

            <View style={styles.wrapper}>
              <Text style={styles.label}>PARAMETER INPUT</Text>
              <ScrollView style={styles.tableWrapper} horizontal>
                {/* Table Container */}
                <View style={styles.table}>
                  {/* Table Head */}
                  <View style={styles.tableHead}>
                    {/* Header Caption */}
                    {/* <View style={{ width: "10%" }}>
                        <Text style={styles.tableCaption}>Done</Text>
                      </View> */}
                    <View style={{ width: 200 }}>
                      <Text style={styles.tableCaption}>Parameter</Text>
                    </View>

                    <View style={{ width: 300 }}>
                      <Text style={styles.tableCaption}>Good</Text>
                    </View>
                    <View style={{ width: 250 }}>
                      <Text style={styles.tableCaption}>Need</Text>
                    </View>
                    <View style={{ width: 280 }}>
                      <Text style={styles.tableCaption}>Reject</Text>
                    </View>
                    <View style={{ width: 330 }}>
                      <Text style={styles.tableCaption}>Remark</Text>
                    </View>
                    <View style={{ width: 150 }}>
                      <Text style={styles.tableCaption}>Photo</Text>
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
                      <View
                        key={index}
                        style={[
                          styles.tableBody,
                          {
                            backgroundColor:
                              index % 2 === 0 ? "#ffffff" : "#f2f2f2",
                          }, // selang-seling
                        ]}
                      >
                        <View style={{ width: 200 }}>
                          <Text style={styles.tableDataParam}>
                            {item.parameter}
                          </Text>
                        </View>

                        {item.satuan !== null ? (
                          <TextInput
                            // placeholder={`Batas: ${item.good}`}
                            placeholder={`Fill Here First`}
                            style={[
                              styles.tableData2,
                              {
                                backgroundColor:
                                  item.gnr === "Good"
                                    ? "#d1e7dd"
                                    : item.gnr === "Need"
                                    ? "#fff3cd"
                                    : item.gnr === "Reject"
                                    ? "#f8d7da"
                                    : "transparent",
                              },
                            ]}
                            value={item.results}
                            keyboardType="numeric"
                            width={300}
                            onChangeText={(text) =>
                              handleInputChange(text, index, "Good")
                            }
                            // editable={item.gnr === "Need" || item.gnr === "Reject"|| item.gnr === "Good"}
                          />
                        ) : Object.keys(item.parsedGood || {}).length === 0 ? (
                          <Text style={{ fontStyle: "italic", color: "gray" }}>
                            Tidak ada parameter checklist
                          </Text>
                        ) : (
                          <TouchableOpacity
                            onPress={() => handleGNRChange("Good", index)}
                            style={{
                              alignItems: "center",
                              justifyContent: "center",
                              width: 300,
                              height: "auto",
                              marginLeft: 10,
                              backgroundColor:
                                item.gnr === "Good" ? "#059212" : COLORS.gray, // Hijau kalau aktif
                              borderRadius: 8,
                            }}
                          >
                            {Object.entries(item.parsedGood || {}).map(
                              ([key, value], i) => (
                                <View
                                  key={i}
                                  style={{
                                    flexDirection: "row",
                                    alignItems: "left",
                                    marginBottom: 2,
                                  }}
                                >
                                  <Text style={{ color: "#fff" }}>- {key}</Text>
                                </View>
                              )
                            )}
                          </TouchableOpacity>
                        )}

                        {item.satuan !== null ? (
                          <TextInput
                            // placeholder={`Batas: ${item.good}`}
                            placeholder={`Fill Here First`}
                            style={[
                              styles.tableData2,
                              {
                                backgroundColor:
                                  item.gnr === "Good"
                                    ? "#d1e7dd"
                                    : item.gnr === "Need"
                                    ? "#fff3cd"
                                    : item.gnr === "Reject"
                                    ? "#f8d7da"
                                    : "transparent",
                              },
                            ]}
                            value={item.results}
                            keyboardType="numeric"
                            width={250}
                            marginLeft={10}
                            onChangeText={(text) =>
                              handleInputChange(text, index, "Need")
                            }
                            // editable={item.gnr === "Need" || item.gnr === "Reject"|| item.gnr === "Good"}
                          />
                        ) : Object.keys(item.parsedNeed).length === 0 ? (
                          <Text
                            style={{
                              fontStyle: "italic",
                              color: "gray",
                              width: 250,
                              marginLeft: 10,
                            }}
                          >
                            No parameter checklist
                          </Text>
                        ) : (
                          <View
                            style={{
                              alignItems: "flex-start",
                              width: 250,
                              marginLeft: 10,
                              backgroundColor:
                                item.gnr === "Need" ? "#fff3cd" : "transparent", // Kuning kalau aktif
                              padding: 4,
                              borderRadius: 5,
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
                                      toggleChecklist_New(index, label, "Need")
                                    }
                                  />
                                  <Text>{label}</Text>
                                </View>
                              )
                            )}
                          </View>
                        )}

                        {item.satuan !== null ? (
                          <TextInput
                            // placeholder={`Batas: ${item.good}`}
                            placeholder={`Fill Here First`}
                            style={[
                              styles.tableData2,
                              {
                                backgroundColor:
                                  item.gnr === "Good"
                                    ? "#d1e7dd"
                                    : item.gnr === "Need"
                                    ? "#fff3cd"
                                    : item.gnr === "Reject"
                                    ? "#f8d7da"
                                    : "transparent",
                              },
                            ]}
                            value={item.results}
                            keyboardType="numeric"
                            width={250}
                            marginLeft={30}
                            onChangeText={(text) =>
                              handleInputChange(text, index, "Reject")
                            }
                            // editable={item.gnr === "Need" || item.gnr === "Reject"|| item.gnr === "Good"}
                          />
                        ) : Object.keys(item.parsedReject).length === 0 ? (
                          <Text style={{ fontStyle: "italic", color: "gray" }}>
                            Tidak ada parameter checklist
                          </Text>
                        ) : (
                          <View
                            style={{
                              alignItems: "flex-start",
                              width: 250,
                              marginLeft: 30,
                              backgroundColor:
                                item.gnr === "Reject"
                                  ? "#FF204E"
                                  : "transparent", // Kuning kalau aktif
                              padding: 4,
                              borderRadius: 5,
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
                                      toggleChecklist_New(
                                        index,
                                        label,
                                        "Reject"
                                      )
                                    }
                                  />
                                  <Text>{label}</Text>
                                </View>
                              )
                            )}
                          </View>
                        )}

                        <View style={{ width: 300 }}>
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

                        <TouchableOpacity
                          style={[
                            styles.submitButton,
                            {
                              alignItems: "flex-start",
                              width: 100,
                              height: 50,
                              marginLeft: 30,
                            },
                          ]}
                        >
                          <Text style={styles.submitButtonText}>Capture</Text>
                        </TouchableOpacity>
                      </View>
                    ))
                  )}
                </View>
                <Modal
                  animationType="slide"
                  transparent={true}
                  visible={modalVisible}
                  onRequestClose={() => {
                    Alert.alert("Modal has been closed.");
                    setModalVisible(!modalVisible);
                  }}
                >
                  <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                      <Text style={styles.labelmodal}>WARNING!!</Text>

                      <Text style={styles.modalText}>{warningitem}</Text>
                      <Pressable
                        style={[styles.button, styles.buttonClose]}
                        onPress={() => setModalVisible(!modalVisible)}
                      >
                        <Text style={styles.textStyle}>CLOSE</Text>
                      </Pressable>
                    </View>
                  </View>
                </Modal>
              </ScrollView>
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

        <TouchableOpacity
          style={[
            styles.submitButton,
            (!agreed || !isValidGNR) && styles.submitButtonDisabled,
          ]}
          onPress={() => handleSubmit(0)}
          disabled={!agreed || !isValidGNR} // <- ini dia yang penting
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
    marginTop: 12,
    marginBottom: 5,
  },
  labelsub: {
    fontSize: 16,
    marginTop: 20,
    marginBottom: 5,
  },
  labelmodal: {
    fontSize: 20,
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
  wrapper2: {
    paddingBottom: 30,
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
  tableHead2: {
    flexDirection: "row",
    padding: 20,
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
    // color: "#fff",
    // fontWeight: "bold",
    fontSize: 16,
    textAlign: "center", // Center-align text in cells
    marginLeft: 10,
    // width: "40%",
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
  tableWrapper: {
    // maxHeight: 400, // batas tinggi agar scroll aktif
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    backgroundColor: "#fafafa",
  },
  tableWrapper2: {
    // maxHeight: 400, // batas tinggi agar scroll aktif
    width: "100%",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    backgroundColor: "#FADA7A",
    paddingVertical: 10,
  },

  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalView: {
    margin: 20,
    backgroundColor: "#FFE700",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: "#F194FF",
  },
  buttonClose: {
    backgroundColor: "#2196F3",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    paddingVertical: 20,
    marginBottom: 15,
    textAlign: "center",
  },
});

export default ParaminspectionDraft;
