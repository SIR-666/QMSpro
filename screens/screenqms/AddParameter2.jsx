import { MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Picker } from "@react-native-picker/picker";
import axios from "axios";
import * as ScreenOrientation from "expo-screen-orientation";
import moment from "moment-timezone";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Pressable,
  Modal,
} from "react-native";
import { Checkbox } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { ReusableOfflineUploadImage } from "../../components";
import ReusableDatetime2 from "../../components/Reusable/ReusableDatetime2";
import ReusableDatetime from "../../components/Reusable/ReusableDatetime3";
import { COLORS } from "../../constants/theme";
import URL from "../../components/url";
import { formatDateToJakarta } from "../../components/Reusable/FormatDate";
import { masterGroupOptions } from "../../components/mastergroup";

// Define uploadImageToServer function here
// Image upload function
// Image upload function with improved error handling

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

const Paraminspection2 = ({ route, navigation }) => {
  const { username, line_fil: initialLine } = route.params;
  const [processOrder, setProcessOrder] = useState("#Plant_Line_SKU");
  const [packageType, setPackageType] = useState("");
  const [plant, setPlant] = useState("");
  const [line, setLine] = useState("");
  const [date, setDate] = useState(new Date());
  const [proddate, setProdDate] = useState(null);
  const [exdate, setExDate] = useState(null);

  console.log("line :", initialLine);

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
  const [startProd, setStartProd] = useState(null);
  const [endProd, setEndProd] = useState(null);
  const [isValidGNR, setisValidGNR] = useState(false);
  const [timeinput, setTimeinput] = useState(new Date());
  const [isSelected, setIsSelected] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [warningitem, setWarningitem] = useState("");
  const [shift, setShift] = useState(
    getShiftByHour(moment(new Date()).tz("Asia/Jakarta").format("HH"))
  );
  const [selGroup, setselGroup] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);
  const options = ["1 Jam", "30 Menit"];

  // console.log("time input :", formatDateToJakarta(timeinput));

  const [prodverif, setProdverif] = useState(false);

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
      // const response = await fetch(`http://10.0.2.2:5002/api/sku/${type}`);
      const response = await fetch(`http://10.24.0.82:5008/api/sku/${type}`);
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

  useEffect(() => {
    if (initialLine) {
      console.log("initial line:", initialLine);
      setLine(initialLine);
      const type = getProductType(initialLine);
      setProductType(type);
      fetchProductOptions(type);
    }
  }, [initialLine]);

  const CheckProdverif = async (selectedProd) => {
    try {
      // Alert.alert(selectedProd);
      const existingData = await AsyncStorage.getItem("ProdVerif");
      console.log("data varian :", existingData);
      // console.log("data varian select :", selectedProd);
      if (selectedProd === existingData) {
        setProdverif(false);
        console.log("prodverif false");
      } else {
        setProdverif(true);
      }
    } catch (storageError) {
      console.error("Failed saving to AsyncStorage:", storageError);
    }
  };

  const HandleselectBatch = (Value) => {
    setBatchNumber(Value);
    // console.log("bact number :", Value);
  };

  const setSelectedGroup = (Value) => {
    console.log("selected group:", Value);
    setselGroup(Value);
  };

  const handlesubmitverif = async () => {
    try {
      await AsyncStorage.setItem("ProdVerif", selectedProduct);

      fetchverifinputed({
        batchNumber,
        selectedProduct,
        productionDate: proddate?.toISOString?.(),
        expiredDate:
          exdate instanceof Date && !isNaN(exdate)
            ? exdate.toISOString()
            : null,
        line,
        startProduction: startProd?.toISOString?.(),
        endProduction: endProd?.toISOString?.(),
        selectedProduct,
        isValidGNR: String(isValidGNR),
      });
      setProdverif(false);
    } catch (storageError) {
      console.error("Failed saving to AsyncStorage:", storageError);
    }
  };

  useEffect(() => {
    const checkShift = async () => {
      try {
        console.log("shift:", shift);
        const existingData = await AsyncStorage.getItem("shift");
        if (shift === existingData) {
          // setProdverif(false);
        } else {
          await AsyncStorage.setItem("shift", shift);
          setProdverif(true);
        }
      } catch (storageError) {
        console.error("Failed saving to AsyncStorage:", storageError);
      }
    };

    checkShift();
  }, [shift]);

  const handleprodChange = async (selectedProd, label) => {
    console.log("data varian select :", label);

    CheckProdverif(label);
    setProductSize(selectedProd);
    setSelectedProduct(label);
    fetchInspectionData(selectedProd);

    try {
      await AsyncStorage.setItem("prodname", label);
      await AsyncStorage.setItem("prodsize", selectedProd);
    } catch (error) {
      console.error("Failed to save prodname to AsyncStorage:", error);
    }
  };

  useEffect(() => {
    const saveProdDate = async () => {
      try {
        await AsyncStorage.setItem("proddate", proddate.toISOString());
      } catch (e) {
        console.error("Gagal menyimpan production date:", e);
      }
    };

    if (proddate) {
      saveProdDate();
    }
  }, [proddate]);

  useEffect(() => {
    const saveProdDate = async () => {
      try {
        await AsyncStorage.setItem("exdate", exdate.toISOString());
      } catch (e) {
        console.error("Gagal menyimpan production date:", e);
      }
    };

    if (exdate) {
      saveProdDate();
    }
  }, [exdate]);

  useEffect(() => {
    const saveProdDate = async () => {
      try {
        await AsyncStorage.setItem("startProd", startProd.toISOString());
      } catch (e) {
        console.error("Gagal menyimpan startProd:", e);
      }
    };

    if (startProd) {
      saveProdDate();
    }
  }, [startProd]);

  useEffect(() => {
    const saveProdDate = async () => {
      try {
        await AsyncStorage.setItem("endProd", endProd.toISOString());
      } catch (e) {
        console.error("Gagal menyimpan endProd:", e);
      }

      const stored = await AsyncStorage.getItem("endProd");
      console.log("endProd storage: ", stored);
    };

    if (endProd) {
      saveProdDate();
    }
  }, [endProd]);

  useEffect(() => {
    // Lock the screen orientation to portrait
    const lockOrientation = async () => {
      await ScreenOrientation.lockAsync(
        ScreenOrientation.OrientationLock.PORTRAIT
      );
    };
    lockOrientation();
  }, []);

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

  //   if (inspectionData[index].warning != null && column === "Reject") {
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
  useEffect(() => {
    const loadSelectedProduct = async () => {
      const storedProd = await AsyncStorage.getItem("prodname");

      if (storedProd) {
        setSelectedProduct(storedProd);
      }
    };

    const loadProdDate = async () => {
      const storedProddate = await AsyncStorage.getItem("proddate");
      console.log("proddate: ", storedProddate);
      if (storedProddate) {
        const parsedDate = new Date(storedProddate);
        if (!isNaN(parsedDate)) {
          setProdDate(parsedDate);
        }
      }
    };

    const loadexDate = async () => {
      const storedProddate = await AsyncStorage.getItem("exdate");
      console.log("exdate: ", storedProddate);

      if (!isNaN(storedProddate)) {
        setExDate(new Date(storedProddate)); // ubah string jadi Date
      }
    };

    const loadstartProd = async () => {
      const storedstartProd = await AsyncStorage.getItem("startProd");
      console.log("startProd: ", storedstartProd);

      const parsedDate = new Date(storedstartProd);
      if (storedstartProd && !isNaN(parsedDate.getTime())) {
        setStartProd(parsedDate);
      }
    };

    const loadendProd = async () => {
      const stored = await AsyncStorage.getItem("endProd");
      console.log("endProd (raw): ", stored);

      const parsedDate = new Date(stored);
      if (stored && !isNaN(parsedDate.getTime())) {
        setEndProd(parsedDate);
      }
    };

    const loadSelectedProdSize = async () => {
      const storedProdSize = await AsyncStorage.getItem("prodsize");
      fetchInspectionData(storedProdSize);
      if (storedProdSize) {
        setProductSize(storedProdSize);
      }
    };

    loadendProd();
    loadstartProd();
    loadexDate();
    loadProdDate();
    loadSelectedProdSize();
    loadSelectedProduct();

    console.log("startProd in UI:", startProd);
    console.log("endProd in UI:", endProd);
  }, []);

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

  const fetchInspectionData = async (selectedProduct) => {
    setIsLoading(true); // Start loading animation
    // setInspectionData([]); // Reset inspection data before fetching new data

    try {
      // const response = await axios.get(
      //   `http://10.0.2.2:5002/api/getlistparma/${selectedProduct}`
      // );
      const response = await axios.get(
        `http://10.24.0.82:5008/api/getlistparma/${selectedProduct}`
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
          // console.log(parsedGood);
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
          warning: item.Warning,
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

  const handleJenisPengukuran = (text) => {
    Alert.alert("Success!", text);
    console.log("jenis pengukuran : ", text);
    setSelectedItem(text);
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

  const fetchverifinputed = async (commonData) => {
    const checklistJson = {};

    isSelected.forEach((item) => {
      checklistJson[item] = true;
    });

    const jsonString = JSON.stringify(checklistJson);

    const payloadverif = {
      bact_number: batchNumber || null,
      variant: productType,
      param: JSON.stringify(checklistJson), // Pastikan ini format yang sesuai
      prod: selectedProduct,
      production_date: commonData.productionDate || null,
      expiry_date: commonData.expiredDate || null,
      input_at: formatDateToJakarta(timeinput),
      filler: line || null,
      start_production: formatDateToJakarta(commonData.startProduction) || null,
      last_production: formatDateToJakarta(commonData.endProduction) || null,
      product_size: productsize || null,
      completed: commonData.isValidGNR, // Bisa disesuaikan jika ada status lain
    };

    console.log("verif data:", payloadverif);
    // const response = await fetch("http://10.0.2.2:5002/api/post-verif", {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify(payloadverif),
    // });

    const response = await fetch("http://10.24.0.82:5008/api/post-verif", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payloadverif),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Gagal submit:", data.message);
      Alert.alert("Failed!", "Gagal submit:", data.message);
    } else {
      Alert.alert("Success!", "success, updated data!!!!");
      // await AsyncStorage.setItem("ProdVerif", selectedProduct);
    }
  };

  const fetchParameterInputed = async (inspectionResults, commonData) => {
    try {
      console.log(commonData);
      const payload = {
        bact_number: batchNumber || null,
        variant: productType,
        param: JSON.stringify(inspectionResults), // Pastikan ini format yang sesuai
        prod: selectedProduct,
        production_date: commonData.productionDate || null,
        expiry_date: commonData.expiredDate || null,
        input_at: formatDateToJakarta(timeinput),
        filler: line || null,
        start_production:
          formatDateToJakarta(commonData.startProduction) || null,
        last_production: formatDateToJakarta(commonData.endProduction) || null,
        product_size: productsize || null,
        completed: commonData.isValidGNR, // Bisa disesuaikan jika ada status lain
        group: selGroup,
      };
      const checklistJson = {};
      // if (prodverif === true) {
      //   isSelected.forEach((item) => {
      //     checklistJson[item] = true;
      //   });

      //   const jsonString = JSON.stringify(checklistJson);

      //   const payloadverif = {
      //     bact_number: commonData.bact_number || null,
      //     variant: productType,
      //     param: JSON.stringify(checklistJson), // Pastikan ini format yang sesuai
      //     prod: selectedProduct,
      //     production_date: commonData.productionDate || null,
      //     expiry_date: commonData.expiredDate || null,
      //     input_at: formatDateToJakarta(timeinput),
      //     filler: line || null,
      //     start_production:
      //       formatDateToJakarta(commonData.startProduction) || null,
      //     last_production:
      //       formatDateToJakarta(commonData.endProduction) || null,
      //     product_size: productsize || null,
      //     completed: commonData.isValidGNR, // Bisa disesuaikan jika ada status lain
      //   };

      //   // const response = await fetch("http://10.0.2.2:5002/api/post-verif", {
      //   //   method: "POST",
      //   //   headers: {
      //   //     "Content-Type": "application/json",
      //   //   },
      //   //   body: JSON.stringify(payloadverif),
      //   // });

      //   const response = await fetch("http://10.24.0.82:5008/api/post-verif", {
      //     method: "POST",
      //     headers: {
      //       "Content-Type": "application/json",
      //     },
      //     body: JSON.stringify(payloadverif),
      //   });

      //   const data = await response.json();

      //   if (!response.ok) {
      //     console.error("Gagal submit:", data.message);
      //   } else {
      //     // await AsyncStorage.setItem("ProdVerif", selectedProduct);
      //   }
      // }

      // const response = await fetch("http://10.0.2.2:5002/api/post-param", {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify(payload),
      // });

      const response = await fetch("http://10.24.0.82:5008/api/post-param", {
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
        console.log("Berhasil submit:", data.message);
        clearAllInputs();
        // Alert.alert("Warning!", "Failed, duplicate data!!!!");
        // await AsyncStorage.setItem("ProdVerif", selectedProduct);
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

    if (!isValidGNR && selectedItem === "1 Jam") {
      Alert.alert("GNR Wajib", "Silakan isi semua pilihan GNR sebelum submit.");
      setisValidGNR(false);
      completed = true;
      // return; // penting: jangan lanjutkan submit kalau belum valid
    } else {
      setisValidGNR(true);
      completed = false;
    }

    if (!selGroup) {
      Alert.alert("Grpup Wajib", "Silakan isi semua pilihan .");
    } else {
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
          expiredDate:
            exdate instanceof Date && !isNaN(exdate)
              ? exdate.toISOString()
              : null,

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

  const clearAllInputs = () => {
    const clearedData = inspectionData.map((item) => ({
      ...item,
      results: item.satuan !== null ? "" : {}, // empty string for input, empty object for checklist
      remarks: "",
      gnr: null,
      photo: null, // if you have photo input
    }));
    setInspectionData(clearedData);
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
              {/* <Picker
                selectedValue={String(productsize)} // pastikan string
                style={styles.dropdown}
                onValueChange={(value) => {
                  const selectedItem = productOptions.find(
                    (item) => String(item.Type) === String(value)
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
                    value={String(product.Type)} // pastikan string
                  />
                ))}
              </Picker> */}
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
              <ReusableDatetime
                date={proddate instanceof Date ? proddate : new Date()}
                setDate={setProdDate}
              />
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
              <ReusableDatetime2 date={startProd} setDate={setStartProd} />
            </View>
          </View>

          <View style={styles.halfInputGroup}>
            <Text style={styles.label}>Last Production *</Text>
            <View style={styles.dropdownContainer}>
              <ReusableDatetime2 date={endProd} setDate={setEndProd} />
            </View>
          </View>
        </View>

        <View style={styles.row}>
          {/* Select Date and Select Time */}
          <View style={styles.halfInputGroup}>
            <Text style={styles.label}>Time Input</Text>
            <View style={styles.dropdownContainer}>
              <ReusableDatetime2 date={timeinput} setDate={setTimeinput} />
            </View>
          </View>

          <View style={styles.halfInputGroup}>
            <Text style={styles.label}>Select Group *</Text>
            <View style={styles.dropdownContainer}>
              <MaterialCommunityIcons
                name="account-group"
                size={24}
                color={COLORS.lightBlue}
              />
              <Picker
                selectedValue={selGroup}
                style={styles.dropdown}
                onValueChange={(value) => setSelectedGroup(value)}
              >
                <Picker.Item label="Select Group" value="" />
                {masterGroupOptions.map((group, index) => (
                  <Picker.Item
                    key={index}
                    label={group.label}
                    value={group.value}
                  />
                ))}
              </Picker>
            </View>
          </View>
        </View>

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
            <>
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={[styles.submitButton2]}
                  onPress={() => handlesubmitverif()}
                >
                  <Text style={styles.submitButtonText}>SUBMIT</Text>
                </TouchableOpacity>
              </View>
            </>
          </>
        ) : (
          <Text></Text>
        )}

        <View>
          <Text>Jenis Pengukuran</Text>
          {options.map((item, index) => (
            <View
              key={index}
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 10,
              }}
            >
              <Checkbox
                status={selectedItem === item ? "checked" : "unchecked"}
                onPress={() => handleJenisPengukuran(item)}
              />
              <Text>{item}</Text>
            </View>
          ))}
        </View>

        {isLoading ? (
          <ActivityIndicator size="large" color={COLORS.blue} />
        ) : (
          <>
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
                            // placeholder={
                            //   item.parsedGood
                            //     ? Object.keys(item.parsedGood)
                            //         .map((key) => `- ${key}`)
                            //         .join(", ")
                            //     : "Fill Here First"
                            // }
                            placeholder={
                              item.parsedGood
                                ? JSON.stringify(item.parsedGood)
                                    .replace(/[{}"]/g, "")
                                    .replace(/:/g, " ")
                                    .replace(/,/g, " & ")
                                : "Fill Here First"
                            }
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
                            placeholder={
                              item.parsedGood
                                ? JSON.stringify(item.parsedNeed)
                                    .replace(/[{}"]/g, "")
                                    .replace(/:/g, " ")
                                    .replace(/,/g, " & ")
                                : "Fill Here First"
                            }
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
                            placeholder={
                              item.parsedGood
                                ? JSON.stringify(item.parsedReject)
                                    .replace(/[{}"]/g, "")
                                    .replace(/:/g, " ")
                                    .replace(/,/g, " & ")
                                : "Fill Here First"
                            }
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
            (!agreed || (!isValidGNR && selectedItem === "1 Jam")) &&
              styles.submitButtonDisabled,
          ]}
          onPress={() => handleSubmit(0)}
          disabled={!agreed || (!isValidGNR && selectedItem === "1 Jam")} // <- ini dia yang penting
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
    paddingBottom: 0,
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
  submitButton2: {
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

export default Paraminspection2;
