import {
  ScrollView,
  TextInput,
  Text,
  View,
  TouchableOpacity,
  Alert,
  Button,
  Pressable,
  Platform,
  Image,
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
  ReusableText,
  ReusableUploadImage,
} from "../../components";
import axios from "axios";
import reusable from "../../components/Reusable/reusable.style";
import Timeline from "react-native-simple-timeline";
import { SafeAreaView } from "react-native-safe-area-context";
import moment from "moment-timezone";

const Registration = ({ navigation }) => {
  const [loader, setLoader] = useState(false);

  //  start of date of time picker
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const [dropdownLokMuat, setDropdownLokMuat] = useState([]);
  const [selectedLokMuat, setSelectedLokMuat] = useState("");
  const [selectedLokMuatID, setSelectedLokMuatID] = useState("");

  const [dropdownLokTujuan, setDropdownLokTujuan] = useState([]);
  const [selectedLokTujuan, setSelectedLokTujuan] = useState("");
  const [selectedLokTujuanID, setSelectedLokTujuanID] = useState("");

  const [dropdownJenKendar, setDropdownJenKendar] = useState([]);
  const [selectedJenKendar, setSelectedJenKendar] = useState("");
  const [selectedJenKendarID, setSelectedJenKendarID] = useState("");

  const [dropdownNopol, setDropdownNopol] = useState([]);
  const [selectedNopol, setSelectedNopol] = useState("");
  const [selectedNopolID, setSelectedNopolID] = useState("");

  const [nomor_surat_jalan, setNomor_surat_jalan] = useState("");

  const [quantity, setQuantity] = useState("");
  const [displayedQuantity, setDisplayedQuantity] = useState("");
  const [isEditingFinished, setIsEditingFinished] = useState(false);

  const [tarif, setTarif] = useState(0);

  const [uang_jalan, setUang_jalan] = useState(0);
  const [formattedUangJalan, setFormattedUangJalan] = useState("");

  const [biaya_tambahan, setBiaya_tambahan] = useState("");
  const [formattedBiayaTambahan, setFormattedBiayaTambahan] = useState("");

  const [tabungan, setTabungan] = useState("");
  const [formattedTabungan, setFormattedTabungan] = useState("");

  const [total_biaya, setTotal_biaya] = useState("");

  const apiUrl = process.env.URL;
  const apiUrl2 = process.env.URL2;
  const port3 = process.env.PORT_NO;

  const [imagePath, setImagePath] = useState("");
  const [fotoSuratJalan, setFotoSuratJalan] = useState("");
  const [fotoMuatan, setFotoMuatan] = useState("");

  // Gunakan useEffect untuk melihat perubahan imagePath
  useEffect(() => {
    // Ini akan dijalankan setelah imagePath diperbarui
    // console.log("image diterima dari komponent state fotoSuratJalan: ",fotoSuratJalan);
    // console.log("image diterima dari komponent state fotoMuatan: ", fotoMuatan);
    console.log(`
    foto surat jalan : ${fotoSuratJalan}
    
    `)
  }, [fotoSuratJalan, fotoMuatan]); // Dependency array, useEffect ini hanya dijalankan ketika imagePath berubah

  // State untuk menyimpan nilai yang divalidasi
  const [jumlahDrop, setJumlahDrop] = useState(1);
  // State untuk input sementara
  const [inputValue, setInputValue] = useState("1");

  const handleDropChange = (text) => {
    // Memperbarui nilai input sementara tanpa validasi
    setInputValue(text);
  };

  const handleDropEndEditing = () => {
    // Validasi ketika pengeditan selesai
    const validNumber = parseInt(inputValue);
    if (validNumber >= 1 && validNumber <= 4) {
      setJumlahDrop(inputValue);
    } else {
      // Jika nilai tidak valid, kembalikan ke nilai terakhir yang valid
      setInputValue(jumlahDrop);
    }
    setIsEditingFinished(true);
    setTarif(0);
  };

  const onDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    // const currentDate = selectedDate?.toUTCString();
    // if (currentDate === undefined) return;
    // setDate(currentDate);
    setShowDatePicker(Platform.OS === "ios"); // Close the picker on iOS immediately
    setDate(currentDate);
  };

  const handleInputChange = (text, setOriginalValue, setFormattedValue) => {
    // Hapus semua karakter non-angka
    const cleanedText = text.replace(/\D/g, "");

    // Konversi teks yang telah dibersihkan menjadi format mata uang dengan prefix "Rp"
    const formatted = "Rp " + cleanedText.replace(/\B(?=(\d{3})+(?!\d))/g, ".");

    // Perbarui state dengan nilai asli dan nilai yang telah diformat
    setOriginalValue(cleanedText);
    setFormattedValue(formatted);
  };

  const data = [
    {
      id: 0,
      status: "Data & Biaya",
      date: "\u2714",
    },
    {
      id: 1,
      status: "Upload Foto",
      date: "\u274C",
    },
    {
      id: 2,
      status: "Aproval",
      date: "\u274C",
    },
  ];

  const submitForm = async (
    date,
    selectedLokMuat,
    selectedJenKendar,
    selectedNopol,
    nomor_surat_jalan,
    selectedloktujuan,
    quantity,
    tarif,
    uang_jalan,
    biaya_tambahan,
    tabungan,
    total_biaya,
    fotoSuratJalan,
    fotoMuatan
  ) => {
    // const userId = await AsyncStorage.getItem("id");
    // const token = await AsyncStorage.getItem("token");
    // const accessToken = JSON.parse(token);
    // const id = JSON.parse(userId);

    // Mendapatkan tanggal saat ini dalam zona waktu Asia/Jakarta
    // (GMT + 7) dan mengatur jam, menit, dan detik menjadi 00:00:00
    const currentDate = moment(date).tz("Asia/Jakarta").startOf("day");

    // Format tanggal sesuai kebutuhan
    const formattedDate = currentDate.format("YYYY-MM-DD HH:mm:ss");
    // console.log(formattedDate);
    // console.log(selectedLokMuatID); // harus id
    // console.log(selectedJenKendarID); //harus id
    // console.log("selectedNopol", selectedNopolID);
    // console.log(selectedLokTujuanID); //harus id

    const data = JSON.stringify({
      tanggal: formattedDate,
      id_lokasi_muat: selectedLokMuatID,
      id_jenis_kendaraan: selectedJenKendarID,
      id_nopol_kendaraan: selectedNopolID,
      nomor_surat_jalan: nomor_surat_jalan,
      id_tujuan_kirim: selectedLokTujuanID,
      quantity: quantity,
      tarif: tarif,
      uang_jalan: uang_jalan,
      biaya_tambahan: biaya_tambahan,
      tabungan: tabungan,
      total_biaya: total_biaya,
      fotoSuratJalan: fotoSuratJalan,
      fotoMuatan: fotoMuatan,
    });

    const config = {
      method: "post",
      maxBodyLength: Infinity,
      // url: "http://10.24.5.40:3000/muatan",
      url: `${apiUrl2}:${port3}/muatan`,
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    };

    axios
      .request(config)
      .then((response) => {
        console.log(JSON.stringify(response.data));
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const formatInputQty = (input) => {
    const formatted = input
      .replace(/\D/g, "")
      .replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    setDisplayedQuantity(formatted);
    setQuantity(input.replace(/\D/g, ""));
    console.log(input);
    setTarif(0);
  };

  const formatCurrency = (value) => {
    // Convert the value to a string and format it as currency (Indonesian Rupiah in this case)
    const formattedValue = parseInt(value)
      .toFixed(0)
      .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.");
    return `Rp ${formattedValue}`;
  };

  const formattedTarif = formatCurrency(tarif);
  const formattedTotal = formatCurrency(total_biaya);
  const [typeAPI, setTypeAPI] = useState(1);

  const fetchOptionsLM = async () => {
    try {
      // console.log(apiUrl);
      const response = await fetch(`${apiUrl}/lokasi-muat`); // Ganti dengan URL API sesuai kebutuhan Anda
      const data = await response.json();

      // Ambil 'nama_lokasi' dari respons API
      // console.log("lokasi muat ", data);
      // setDropdownLokMuat(data);

      function getUniqueNamaLokasi(data) {
        const allNamaLokasi = data
          .filter((item) => item.nama_kendaraan === selectedJenKendar)
          .map((item) => item.nama_lokasi);
        // Convert the array of nama_lokasi to a Set to remove duplicates,
        // then spread the Set back into an array.
        const uniqueNamaLokasi = [...new Set(allNamaLokasi)];
        return uniqueNamaLokasi;
      }

      function getUniqueTujuanKirim(data) {
        const tujuan_kirim = data
          .filter((item) => item.nama_kendaraan === selectedJenKendar)
          .map((item) => item.tujuan_kirim);
        // Convert the array of nama_lokasi to a Set to remove duplicates,
        // then spread the Set back into an array.
        const uniqueTujuanKirim = [...new Set(tujuan_kirim)];
        return uniqueTujuanKirim;
      }

      const response2 = await fetch(`${apiUrl}/checkAsalTujuan`); // Ganti dengan URL API sesuai kebutuhan Anda
      const data2 = await response2.json();
      const uniqueNamaLokasiForAsal = getUniqueNamaLokasi(data2);
      const uniqueTujuanKirim = getUniqueTujuanKirim(data2);
      setDropdownLokMuat(uniqueNamaLokasiForAsal);
      setDropdownLokTujuan(uniqueTujuanKirim);
      setSelectedLokTujuan(null);
      setSelectedLokMuat(null);
      // console.log("asal tujuan ", uniqueNamaLokasiForAsal);
      // console.log("tujuan kirim ", uniqueTujuanKirim);
    } catch (error) {
      console.error("Error fetching data options:", error);
    }
  };

  useEffect(() => {
    fetchOptionsLM();
  }, [selectedJenKendar]);

  useEffect(() => {
    // Fungsi untuk mengambil opsi dari API

    const fetchOptionsJK = async () => {
      try {
        // console.log(apiUrl);
        const response = await fetch(`${apiUrl}/jenis-kendaraan`); // Ganti dengan URL API sesuai kebutuhan Anda
        const data = await response.json();
        setDropdownJenKendar(data);
      } catch (error) {
        console.error("Error fetching data options:", error);
      }
    };

    const fetchOptionsNP = async () => {
      try {
        console.log(apiUrl);
        const response = await fetch(`${apiUrl}/kendaraan`); // Ganti dengan URL API sesuai kebutuhan Anda
        const data = await response.json();

        // Ambil 'nama_lokasi' dari respons API
        // const options = data.map((item) => item.nopol);
        // console.log(options);
        setDropdownNopol(data);
      } catch (error) {
        console.error("Error fetching data options:", error);
      }
    };

    // fetchOptionsLM();
    // fetchOptionsLT();
    fetchOptionsJK();
    fetchOptionsNP();
  }, []);

  const showAlert = () => {
    Alert.alert(
      "Error", // Title of the alert
      "Periksa kembali data inputan anda!" // Message of the alert
      // [
      //   {
      //     text: "Cancel",
      //     onPress: () => console.log("Cancel Pressed"),
      //     style: "cancel",
      //   },
      //   { text: "OK", onPress: () => console.log("OK Pressed") },
      // ],
      // {
      //   cancelable: true, // Whether you can dismiss the alert by tapping outside of it
      //   onDismiss: () => console.log("Alert dismissed"), // Callback when alert is dismissed
      // }
    );
  };

  const hitungBiaya = async () => {
    try {
      const response = await axios.post(
        `${apiUrl2}:${port3}/checkKelipatan`,
        JSON.stringify({
          quantity: quantity,
          id_lokasi_muat: selectedLokMuatID,
          id_jenis_kendaraan: selectedJenKendarID,
          id_tujuan_kirim: selectedLokTujuanID,
          jumlah_drop: jumlahDrop,
        }),
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log("biaya kelipatan", response.data.kelipatan);
      // setTarif(response.data.kelipatan);
      if (response.data.kelipatan) {
        setTypeAPI(3);
        console.log("kelipatan 3 ");
      } else if (jumlahDrop > 1) {
        setTypeAPI(2);
        console.log("kelipatan 2 ");
      } else {
        setTypeAPI(1);
        console.log("kelipatan 1 ");
      }
    } catch (error) {
      console.error("Data Kelipatan tidak tersedia", error);
      // showAlert();
      // Alert.alert("Error", "Data Perhitungan tidak tersedia");
      // setTarif(0);
    }

    // const typeAPI = 1;

    try {
      const response = await axios.post(
        `${apiUrl2}:${port3}/hitung-biaya/${typeAPI}`,
        JSON.stringify({
          quantity: quantity,
          id_lokasi_muat: selectedLokMuatID,
          id_jenis_kendaraan: selectedJenKendarID,
          id_tujuan_kirim: selectedLokTujuanID,
          jumlah_drop: jumlahDrop,
        }),
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log(response.data.biaya.tarif);
      setTarif(response.data.biaya.tarif);
    } catch (error) {
      console.error("Error fetching data from API", error);
      // Alert.alert("Error", "Data Perhitungan tidak tersedia");
      showAlert();
    }
  };

  useEffect(() => {
    if (
      selectedLokMuatID &&
      selectedJenKendarID &&
      selectedLokTujuanID &&
      quantity &&
      jumlahDrop &&
      isEditingFinished
    ) {
      hitungBiaya();
      setIsEditingFinished(false); // reset the flag
    }
  }, [
    selectedLokMuatID,
    selectedJenKendarID,
    selectedLokTujuanID,
    quantity,
    jumlahDrop,
    isEditingFinished,
  ]);

  useEffect(() => {
    const total = () => {
      let x =
        (tarif | 0) + (uang_jalan | 0) + (biaya_tambahan | 0) - (tabungan | 0);
      setTotal_biaya(x);
      // console.log(x);
      // console.log(total);
    };
    total();
  }, [total_biaya, tarif, uang_jalan, biaya_tambahan, tabungan]); // Pastikan untuk menyertakan dependensi kosong agar permintaan hanya dilakukan sekali saat komponen dipasang

  // Rest of your component

  const handleLokAsal = (value) => {
    setSelectedLokMuat(value);
    // Gunakan .find() untuk mencari objek dengan nama_lokasi yang cocok
    const objekDitemukan = dropdownLokMuat.find(
      (item) => item.nama_lokasi == value
    );
    // Cek apakah objek ditemukan, lalu ambil id-nya
    const id = objekDitemukan ? objekDitemukan.id : null;
    // console.log(id);
    setSelectedLokMuatID(id);
    setTarif(0);
  };

  useEffect(() => {}, [formattedTarif]);

  const handleJenKendar = (value) => {
    setSelectedJenKendar(value);
    // Gunakan .find() untuk mencari objek dengan nama_lokasi yang cocok
    const objekDitemukan = dropdownJenKendar.find(
      (item) => item.nama_kendaraan == value
    );
    // Cek apakah objek ditemukan, lalu ambil id-nya
    const id = objekDitemukan ? objekDitemukan.id : null;
    // console.log(id);
    setSelectedJenKendarID(id);
    setTarif(0);
  };

  const handleLokTujuan = (value) => {
    setSelectedLokTujuan(value);
    // Gunakan .find() untuk mencari objek dengan nama_lokasi yang cocok
    const objekDitemukan = dropdownLokTujuan.find(
      (item) => item.nama_lokasi == value
    );
    // Cek apakah objek ditemukan, lalu ambil id-nya
    const id = objekDitemukan ? objekDitemukan.id : null;
    // console.log(id);
    setSelectedLokTujuanID(id);
    setTarif(0);
  };

  const handleNoPol = (value) => {
    setSelectedNopol(value);
    // Gunakan .find() untuk mencari objek dengan nama_lokasi yang cocok
    const objekDitemukan = dropdownNopol.find((item) => item.nopol == value);
    // Cek apakah objek ditemukan, lalu ambil id-nya
    const id = objekDitemukan ? objekDitemukan.id : null;
    // console.log(value);
    // console.log(id);
    setSelectedNopolID(id);
  };



  return (
    <SafeAreaView style={reusable.container}>
      <ScrollView>
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
          {/* <View style={{ marginTop: "10%", marginHorizontal: "3%" }}>
            <Timeline data={data} direction="horizontal" />
          </View> */}
          <View style={{ paddingTop: 5 }}>
            {/* start datetimepicker */}

            {/* start inputan date */}
            <View style={styles.wrapper}>
              <Text style={styles.label}>Date</Text>
              <View>
                <View style={styles.inputWrapper(COLORS.lightBlue)}>
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
                {/* {errors.lokasiMuat && (
                <Text style={styles.errorMessage}>{errors.lokasiMuat}</Text>
              )} */}
              </View>
            </View>
            {/* end inputan date */}

            <View style={{ alignitems: "center" }}></View>

            {/* start inputan dropdown Jenis Kendaraan */}
            <View style={styles.wrapper}>
              <Text style={styles.label}>Jenis Kendaraan</Text>
              {/* Component Picker untuk memilih Jenis Kendaraan */}
              <View>
                <View style={styles.inputWrapper(COLORS.lightBlue)}>
                  <MaterialCommunityIcons
                    name="truck-outline"
                    size={20}
                    color={COLORS.gray}
                  />
                  {/* <WidthSpacer width={10} /> */}
                  {/* Component Jenis Kendaraan untuk memilih Jenis Kendaraan */}
                  <ReusableDropdown
                    // label="Jenis Kendaraan"
                    selectedValue={selectedJenKendar}
                    onValueChange={handleJenKendar}
                    // onValueChange={setSelectedJenKendar}
                    // itemOptions={dropdownJenKendar}
                    itemOptions={dropdownJenKendar.map(
                      (item) => item.nama_kendaraan
                    )}
                  />
                </View>
              </View>
            </View>
            {/* end inputan dropdown Jenis Kendaraan */}

            {/* start inputan dropdown Lokasi Muat */}
            <View style={styles.wrapper}>
              <Text style={styles.label}>Lokasi Muat</Text>
              {/* Component Picker untuk memilih Lokasi Muat */}
              <View>
                <View style={styles.inputWrapper(COLORS.lightBlue)}>
                  <MaterialCommunityIcons
                    name="office-building-marker-outline"
                    size={20}
                    color={COLORS.gray}
                  />
                  {/* <WidthSpacer width={10} /> */}
                  {/* Component Lokasi Muat untuk memilih Lokasi Muat */}
                  <ReusableDropdown
                    // label="Lokasi Muat"
                    selectedValue={selectedLokMuat}
                    onValueChange={handleLokAsal}
                    // itemOptions={dropdownLokMuat.map(
                    //   (item) => item.nama_lokasi
                    // )}
                    itemOptions={dropdownLokMuat}
                    // onValueChange={setSelectedLokMuat}
                    // itemOptions={dropdownLokMuat}
                  />
                </View>
              </View>
            </View>
            {/* end inputan dropdown Lokasi Muat */}

            {/* start inputan dropdown Nopol */}
            <View style={styles.wrapper}>
              <Text style={styles.label}>Nopol</Text>
              {/* Component Picker untuk memilih Nopol */}
              <View>
                <View style={styles.inputWrapper(COLORS.lightBlue)}>
                  <MaterialCommunityIcons
                    name="numeric"
                    size={20}
                    color={COLORS.gray}
                  />
                  {/* <WidthSpacer width={10} /> */}
                  {/* Component Nopol untuk memilih Nopol */}
                  <ReusableDropdown
                    // label="Nopol"
                    selectedValue={selectedNopol}
                    onValueChange={handleNoPol}
                    itemOptions={dropdownNopol.map((item) => item.nopol)}
                    // onValueChange={setSelectedNopol}
                    // itemOptions={dropdownNopol}
                  />
                </View>
              </View>
            </View>
            {/* end inputan dropdown Nopol */}

            {/* start inputan */}
            <View style={styles.wrapper}>
              <Text style={styles.label}>Nomor Surat Jalan</Text>
              <View>
                <View style={styles.inputWrapper(COLORS.lightBlue)}>
                  <MaterialCommunityIcons
                    name="note-outline"
                    size={20}
                    color={COLORS.gray}
                  />

                  <WidthSpacer width={10} />
                  <TextInput
                    style={styles.input}
                    value={nomor_surat_jalan}
                    onChangeText={setNomor_surat_jalan}
                    placeholder="Nomor Surat Jalan"
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                </View>
              </View>
            </View>
            {/* end inputan */}

            {/* Component Picker untuk memilih Lokasi Tujuan */}
            <View style={styles.wrapper}>
              <Text style={styles.label}>Lokasi Tujuan</Text>
              <View>
                <View style={styles.inputWrapper(COLORS.lightBlue)}>
                  <MaterialCommunityIcons
                    name="office-building-marker-outline"
                    size={20}
                    color={COLORS.gray}
                  />
                  {/* <WidthSpacer width={10} /> */}
                  {/* Component Lokasi Tujuan untuk memilih Lokasi Tujuan */}
                  <ReusableDropdown
                    // label="Lokasi Tujuan"
                    selectedValue={selectedLokTujuan}
                    onValueChange={handleLokTujuan}
                    // itemOptions={dropdownLokTujuan.map(
                    //   (item) => item.nama_lokasi
                    // )}
                    itemOptions={dropdownLokTujuan}
                  />
                </View>
              </View>
            </View>
            {/* end inputan dropdown Lokasi Tujuan */}

            {/* start inputan */}
            <View style={styles.wrapper}>
              <Text style={styles.label}>Quantity</Text>
              <View>
                <View style={styles.inputWrapper(COLORS.lightBlue)}>
                  <MaterialCommunityIcons
                    name="segment"
                    size={20}
                    color={COLORS.gray}
                  />

                  <WidthSpacer width={10} />
                  <TextInput
                    style={styles.input}
                    // value={quantity}
                    value={displayedQuantity}
                    // keyboardType="numeric"
                    keyboardType="decimal-pad"
                    onChangeText={formatInputQty}
                    placeholder="Quantity"
                    autoCapitalize="none"
                    autoCorrect={false}
                    onEndEditing={() => {
                      setIsEditingFinished(true);
                      setTarif(0);
                    }}
                  />
                </View>
              </View>
            </View>
            {/* end inputan */}

            {/* start inputan */}
            <View style={styles.wrapper}>
              <Text style={styles.label}>Jumlah Drop</Text>
              <View>
                <View style={styles.inputWrapper(COLORS.lightBlue)}>
                  <MaterialCommunityIcons
                    name="segment"
                    size={20}
                    color={COLORS.gray}
                  />

                  <WidthSpacer width={10} />
                  <TextInput
                    style={styles.input}
                    value={inputValue}
                    keyboardType="numeric"
                    onChangeText={handleDropChange}
                    onEndEditing={handleDropEndEditing}
                    placeholder="Jumlah Drop"
                    maxLength={1} // Batasi panjang input agar hanya 1 karakter
                    // onEndEditing={() => setIsEditingFinished(true)}
                  />
                </View>
              </View>
            </View>
            {/* end inputan */}

            {/* start inputan */}
            <View style={styles.wrapper}>
              <Text style={styles.label}>Tarif</Text>
              <View>
                <View style={styles.inputWrapper(COLORS.lightBlue)}>
                  <MaterialCommunityIcons
                    name="hand-coin-outline"
                    size={20}
                    color={COLORS.gray}
                  />

                  <WidthSpacer width={10} />

                  <Text style={styles.input}>{formattedTarif}</Text>
                </View>
              </View>
            </View>
            {/* end inputan */}

            {/* start inputan */}
            <View style={styles.wrapper}>
              {/* <Text style={styles.label}>Tarif</Text> */}
              <View>
                <View
                  style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                    borderColor: COLORS.lightBlue,
                    backgroundColor: COLORS.lightWhite,
                    borderWidth: 0,
                    height: 100,
                    borderRadius: 1,
                    flexDirection: "row",
                    paddingHorizontal: 3,
                  }}
                >
                  <ReusableBtn
                    onPress={() => {
                      // setIsEditingFinished(false);
                      hitungBiaya();
                    }}
                    btnText={"HITUNG TARIF"}
                    width={SIZES.width - 250}
                    backgroundColor={COLORS.green}
                    borderColor={COLORS.green}
                    borderWidth={0}
                    textColor={COLORS.white}
                  />
                  {/* <WidthSpacer width={10} /> */}
                  {/* <Text style={styles.input}>{formattedTarif}</Text> */}
                </View>
              </View>
            </View>
            {/* end inputan */}

            {/* start inputan uang jalan */}
            {/* <View style={styles.wrapper}>
              <Text style={styles.label}>Uang Jalan</Text>
              <View>
                <View style={styles.inputWrapper(COLORS.lightBlue)}>
                  <MaterialCommunityIcons
                    name="hand-coin-outline"
                    size={20}
                    color={COLORS.gray}
                  />

                  <WidthSpacer width={10} />
                  <TextInput
                    style={styles.input}
                    // value={uang_jalan}
                    value={formattedUangJalan}
                    keyboardType="numeric"
                    // onChangeText={setUang_jalan}
                    onChangeText={(text) =>
                      handleInputChange(
                        text,
                        setUang_jalan,
                        setFormattedUangJalan
                      )
                    }
                    placeholder="Uang Jalan"
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                </View>
              </View>
            </View> */}
            {/* end inputan uang jalan */}

            {/* start inputan */}
            <View style={styles.wrapper}>
              <Text style={styles.label}>Biaya Tambahan</Text>
              <View>
                <View style={styles.inputWrapper(COLORS.lightBlue)}>
                  <MaterialCommunityIcons
                    name="hand-coin-outline"
                    size={20}
                    color={COLORS.gray}
                  />

                  <WidthSpacer width={10} />
                  <TextInput
                    style={styles.input}
                    // value={biaya_tambahan}
                    value={formattedBiayaTambahan}
                    keyboardType="numeric"
                    // onChangeText={setBiaya_tambahan}
                    onChangeText={(text) =>
                      handleInputChange(
                        text,
                        setBiaya_tambahan,
                        setFormattedBiayaTambahan
                      )
                    }
                    placeholder="Biaya Tambahan"
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                </View>
              </View>
            </View>
            {/* end inputan */}

            {/* start inputan */}
            <View style={styles.wrapper}>
              <Text style={styles.label}>Tabungan</Text>
              <View>
                <View style={styles.inputWrapper(COLORS.lightBlue)}>
                  <MaterialCommunityIcons
                    name="sack-percent"
                    size={20}
                    color={COLORS.gray}
                  />

                  <WidthSpacer width={10} />
                  <TextInput
                    style={styles.input}
                    // value={tabungan}
                    value={formattedTabungan}
                    keyboardType="numeric"
                    onChangeText={(text) =>
                      handleInputChange(text, setTabungan, setFormattedTabungan)
                    }
                    // onChangeText={setTabungan}
                    placeholder="Tabungan"
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                </View>
              </View>
            </View>
            {/* end inputan */}

            {/* start inputan */}
            <View style={styles.wrapper}>
              <Text style={styles.label}>Total Biaya</Text>
              <View>
                <View style={styles.inputWrapper(COLORS.lightBlue)}>
                  <MaterialCommunityIcons
                    name="sack"
                    size={20}
                    color={COLORS.gray}
                  />

                  <WidthSpacer width={10} />
                  <Text style={styles.label}>{formattedTotal}</Text>
                </View>
              </View>
            </View>
            {/* end inputan */}

            {/* start inputan */}
            <View style={styles.wrapper}>
              <Text style={styles.label}>Foto Surat Jalan</Text>
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
                    onImagePathChange={(imageUrl) => {
                      console.log("Image URL:", imageUrl);
                    }}
                    title="UPLOAD FOTO SURAT JALAN"
                    color={COLORS.green}
                  />


                </View>
              </View>
            </View>
            {/* end inputan */}

            {/* start inputan */}
            <View style={styles.wrapper}>
              <Text style={styles.label}>Foto Muatan</Text>
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
                  {/* <MaterialCommunityIcons
                    name="sack"
                    size={20}
                    color={COLORS.gray}
                  /> */}

                  <WidthSpacer width={10} />

                  <ReusableUploadImage
                    onImagePathChange={(path) => setFotoMuatan(path)}
                    title="UPLOAD FOTO MUATAN"
                    color={COLORS.green}
                  />
                </View>
              </View>
            </View>
            {/* end inputan */}

            <HeightSpacer height={20} />

            <ReusableBtn
              // onPress={isValid ? handleSubmit : errorLogin}
              onPress={() => {
                submitForm(
                  date,
                  selectedLokMuat,
                  selectedJenKendar,
                  selectedNopol,
                  nomor_surat_jalan,
                  selectedLokTujuan,
                  quantity,
                  tarif,
                  uang_jalan,
                  biaya_tambahan,
                  tabungan,
                  total_biaya,
                  fotoSuratJalan,
                  fotoMuatan
                );
              }}
              btnText={"KIRIM DATA"}
              width={SIZES.width - 80}
              backgroundColor={COLORS.green}
              borderColor={COLORS.green}
              borderWidth={0}
              textColor={COLORS.white}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Registration;
