import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Modal,
  Button,
  Image,
  TextInput,
  StyleSheet,
  ScrollView,
} from "react-native";
import { COLORS, SIZES, TEXT } from "../../constants/theme";
import {
  ReusableDropdown,
  ReusableDatetime,
  ReusableDatetimeDisable,
  ReusableBtn,
  ReusableUploadImage,
  WidthSpacer,
  HeightSpacer,
} from "../../components";
import axios from "axios";
import * as ImagePicker from "expo-image-picker";
import reusable from "../../components/Reusable/reusable.style";
import { SafeAreaView } from "react-native-safe-area-context";
import NfcManager, { NfcTech, Ndef, NdefFormatable, NfcEvents } from 'react-native-nfc-manager';
import { date } from "yup";
import { useRoute } from "@react-navigation/native";

const moment = require('moment');


const EditchecklistPatrol = ({ navigation }) => {
  const route = useRoute();
  const [areas, setAreas] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedArea, setSelectedArea] = useState(null);
  const [temuan, setTemuan] = useState({ gambar: null, remarks: "" });
  const [startTime, setStartTime] = useState(new Date());
  const [criticalPoints, setCriticalPoints] = useState("");
  const [duration, setDuration] = useState(0);
  const [resetNfc, setResetNfc] = useState(0);
  const [nfcAddres, setNfcAddres] = useState();
  const [adaTemuan, setAdaTemuan] = useState(false);
  const [modalForDataTemuan, setModalForDataTemuan] = useState(false);
  const [selectedDataTemuan, setSelectedDataTemuan] = useState(null);
  const [sesi, setSesi] = useState("");


 
  
  const { recordPatrol } = route.params;
  // console.log('ini record Patrolnya',recordPatrol);




  const [currentTime, setCurrentTime] = useState(new Date());
  const [shift, setShift] = useState(null);

  const [dataCount, setDataCount] = useState(0);

  




  

  // Mendeklarasikan array kosong
  const [dataTemuan, setDataTemuan] = useState([]);

  //ID
  
  const { idProfile } = route.params;



  //FOR GET TEMUAN PATROL
  const fetchDataTemuanPatrolByIdRecordPatrol = async () => {
    try {
      const apiUrl = process.env.URL;
      const response = await axios.get(`${apiUrl}/temuanPatrolByIdRecordPatrol/${recordPatrol.id}`);
      console.log(response.data);
      setAdaTemuan(response.data);
    } catch (error) {
      console.error("Error fetching data Temuan Patroli:", error);
  
    }
  };



  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('ini record Patrolnya',recordPatrol.id);
        const urlApi = process.env.URL;
        const response = await fetch(`${urlApi}/areaPatrol`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setAreas(data);

        //console.log(data);
        const nextArea = data.find((area) => !area.status);
        if (nextArea) setCriticalPoints(nextArea.criticalPoints);

        const interval = setInterval(() => {
          setDuration(Math.round((new Date() - startTime) / 60000));
        }, 15000);

        console.log('startTime',startTime);

        return () => clearInterval(interval);
      } catch (error) {
        console.error('Error:', error);
      }
    };
    fetchData();
    fetchDataTemuanPatrolByIdRecordPatrol();
    

  }, []);



    //CURRENT TIME
    // useEffect(() => {
    //   const intervalId = setInterval(() => {
    //     setCurrentTime(new Date());
    //   }, 1000); // Interval setiap detik
    //   //
    //   setShift(determineShift(currentTime));
    //   console.log(shift);
    //   return () => clearInterval(intervalId); 
    // }, [currentTime]);


    useEffect(() => {
      const fetchData = async (currentShift) => {
        const currentDate = moment().format('YYYY-MM-DD');
        try {
          const urlApi = process.env.URL;
          const response = await fetch(`${urlApi}/recordPatrolByDate`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              date: currentDate,
              shift: currentShift
            })
          });
    
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
    
          const result = await response.json();
          // Assume the API response returns an array of data
          console.log("Data count:", result.length);
          setDataCount(result.length);
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };
    
      const intervalId = setInterval(async () => {
        const currentShift = determineShift(new Date());
        if (currentShift !== shift) {
          console.log("Current Shift:", currentShift);
          await fetchData(currentShift);  // Properly await the fetchData call
          setShift(currentShift);
        }
      }, 1000);
    
      return () => clearInterval(intervalId);
    }, [shift]);
    
    




  async function readNdef() {
    try {
      await NfcManager.requestTechnology(NfcTech.Ndef);
      const tag = await NfcManager.getTag();
      if (tag) {
        const scannedNfcId = tag.id;
        const areaWithScannedNfc = areas.find(area => area.nfc_address === scannedNfcId);
        if (areaWithScannedNfc) {
          setSelectedArea(areaWithScannedNfc);
          setModalVisible(true);
          console.log(tag);
        }
      }
    } catch (ex) {
      // No action needed if there's an error or no tag found
    } finally {
      NfcManager.cancelTechnologyRequest();
    }
  }

  useEffect(() => {
    const initializeNFC = async () => {
      try {
        await readNdef();
      } catch (error) {
        // No action needed
      }
    };

    initializeNFC();

    const intervalId = setInterval(() => {
      setResetNfc(prev => prev + 1);
    }, 1000); // Check every second

    return () => {
      clearInterval(intervalId);
      NfcManager.cancelTechnologyRequest();
    };
  }, [resetNfc]);

  const handleAreaPress = (area) => {
    setSelectedArea(area);
    setModalVisible(true);
  };

  const handleTemuan = (status) => {
    // Filter data temuan yang tidak sesuai dengan ID yang akan dihapus
    const updatedDataTemuan = dataTemuan.filter((item) => item.id !== selectedArea.id);
  
    const updatedAreas = areas.map((area) =>
      area.id === selectedArea.id
        ? {
            ...area,
            status: status === "Aman" ? "checked" : "issue",
            temuan: status === "Aman" ? null : temuan,
          }
        : area
    );
  
    setAreas(updatedAreas);
    setModalVisible(false);
  
    if (status === "Ada Temuan") {
      setAdaTemuan(true);
    }
  
    const nextArea = updatedAreas.find((area) => !area.status);
    if (nextArea) setCriticalPoints(nextArea.criticalPoints);
  
    // Set state dataTemuan dengan nilai updatedDataTemuan yang sudah difilter
    setDataTemuan(updatedDataTemuan);
  };
  


  //handle for show dataTemuan
  const handleShowDataTemuan = (item) => {
    const areaTemuan = dataTemuan.find((data) => data.id === item.id);
    if(areaTemuan){
      setSelectedDataTemuan(areaTemuan);
      setModalForDataTemuan(true);
    }
    // setSelectedDataTemuan(areaTemuan);
    // setModalForDataTemuan(true);
  };

  //HANDLE  SESI
  const handleInputSesi = (selectionOption) => {
    console.log(selectionOption)
    setSesi(selectionOption)
  };

  const [optionsSesi, setOptionsSesi] = useState([
    { label: "Auto", value: "Auto" },
    { label: "unscheduled", value: "unscheduled" },
  ]);

  useEffect(() => {
    if (dataCount === 1) {
      setOptionsSesi([
        { label: "Sesi 2", value: "Sesi 2" },
        { label: "unscheduled", value: "unscheduled" },
      ]);
    } else {
      setOptionsSesi([
        { label: "Sesi 1", value: "Sesi 1" },
        { label: "unscheduled", value: "unscheduled" },
      ]);
    }
  }, [dataCount]);
  
  
  // Fungsi handleSave
  const handleSave = () => {
    const updatedAreas = areas.map((area) =>
      area.id === selectedArea.id
        ? {
            ...area,
            status: temuan.gambar || temuan.remarks ? "issue" : "checked",
            temuan: temuan.gambar || temuan.remarks ? temuan : null,
          }
        : area
    );

  // Buat salinan dataTemuan yang telah ada
  const updatedDataTemuan = [...dataTemuan];

  // Periksa apakah data dengan id yang sama sudah ada di updatedDataTemuan
  const existingIndex = updatedDataTemuan.findIndex(item => item.id === selectedArea.id);

  if (existingIndex !== -1) {
    // Jika ada, replace data yang ada dengan data baru
    updatedDataTemuan[existingIndex] = {
      id: selectedArea.id,
      gambar: temuan.gambar,
      remarks: temuan.remarks
    };
  } else {
    // Jika tidak ada, tambahkan data baru
    updatedDataTemuan.push({
      id: selectedArea.id,
      gambar: temuan.gambar,
      remarks: temuan.remarks
    });
  }

  // Set state dataTemuan dengan nilai updatedDataTemuan
  setDataTemuan(updatedDataTemuan);

  setAreas(updatedAreas);
  setAdaTemuan(false);

  const nextArea = updatedAreas.find((area) => !area.status);
  if (nextArea) setCriticalPoints(nextArea.criticalPoints);

  // Set temuan kembali ke nilai awal
  setTemuan({ gambar: null, remarks: "" });
  };



  useEffect(() => {
    console.log("Data Temuan Updated:", dataTemuan);
    console.log(dataTemuan.length);
  }, [dataTemuan]);


  const determineShift = (currentTime) => {
    const hour = currentTime.getHours();

    if (hour >= 7 && hour < 15) {
      return 1; // Shift 1
    } else if (hour >= 15 && hour < 23) {
      return 2; // Shift 2
    } else {
      return 3; // Shift 3
    }
  };

  const handleSubmit = async () => {
    try {
      const endTime = new Date();
      const duration = Math.round((endTime - startTime) / 60000);
      const status = areas.every((area) => area.status) ? "selesai" : "draft";

      // Format startTime dan endTime menggunakan moment.js
      const formattedStartTime = moment(startTime).format('YYYY-MM-DDTHH:mm:ss');
      const formattedEndTime = moment(endTime).format('YYYY-MM-DDTHH:mm:ss');

      // Tentukan shift berdasarkan waktu saat ini
      const currentShift = determineShift(endTime);
      // Menentukan status berdasarkan panjang dataTemuan
      let statuss = dataTemuan.length === 0 ? 0 : 1;

      // Memeriksa apakah semua area memiliki status 'checked'
      if (areas.every(area => area.status != 'issue' || 'checked')) {
        statuss = 2;
      }

      console.log(statuss);


      // Data dummy untuk recordPatrol
      const recordPatrolData = {
        id_user: idProfile,
        jam_patroli_start: formattedStartTime,
        jam_patroli_end: formattedEndTime,
        kmPatroli: 0,
        shift: currentShift,
        jenis: sesi,
        status: statuss
      };

      // Lakukan POST ke recordPatrol
      const recordPatrolResponse = await fetch(`${process.env.URL}/recordPatrol`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(recordPatrolData)
      });

      if (!recordPatrolResponse.ok) {
        throw new Error('Failed to insert recordPatrol');
      }

      const recordPatrolResult = await recordPatrolResponse.json();
      console.log('recordPatrolResult =', recordPatrolResult);
      const recordPatrolId = recordPatrolResult.insertId;

      // Data dummy untuk temuanPatroli
      const temuanPatroliData = dataTemuan.map((temuan) => ({
        id_recordPatrol: recordPatrolId,
        id_areaPatrol: temuan.id,
        image: temuan.gambar,
        description: "",
        remarks: temuan.remarks,
        status: statuss.toString() // Menggunakan statuss() dan mengonversi ke string
      }));
      

      // Lakukan POST ke temuanPatrol untuk setiap temuan
      for (const data of temuanPatroliData) {
        const temuanPatrolResponse = await fetch(`${process.env.URL}/temuanPatrol`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
        });

        if (!temuanPatrolResponse.ok) {
          throw new Error('Failed to insert temuanPatrol');
        }
      }
      console.log('Data successfully inserted');
      navigation.replace("Bottom");
    } catch (error) {
      console.error('Error:', error);
    }
  };



  const handleImagePathChange = (path) => {
    setTemuan(prevTemuan => ({ ...prevTemuan, gambar: path }));
  };

  const handleRemarksChange = (remarks) => {
    setTemuan(prevTemuan => ({ ...prevTemuan, remarks }));
  };

  const renderItem = ({ item }) => {
    // Ambil data temuan sesuai dengan area yang dipilih
    //const areaTemuan = dataTemuan.find((data) => data.id === item.id);
    return (
      <TouchableOpacity onPress={() => handleShowDataTemuan(item)}>
        <View style={styles.item}>
          <Text
            style={
              item.status === "checked"
                ? styles.checked
                : item.status === "issue"
                ? styles.issue
                : styles.normal
            }
          >
          {item.name}
          </Text> 
          {item.status === "issue" && <Text style={styles.exclamation}>!!!</Text>}
          {item.status === "checked" && <Text style={styles.checkmark}>✔</Text>}
          
        </View>
      </TouchableOpacity>  
      
    );
  };
  
  


  const handlePressGoBack = () => {
    navigation.replace("Bottom");
  };

  return (
    <SafeAreaView style={reusable.container}>
      <FlatList
        data={areas}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={
          <>
            <HeightSpacer width={40} />

            <View style={styles.headers}>
              <TouchableOpacity
                onPress={handlePressGoBack}
                style={styles.touchableOpacity}
              >
                <Text style={styles.goBackLabel}>Go Back</Text>
              </TouchableOpacity>
              <Text style={styles.title}>Checklist Patroli As Draft</Text>
            </View>

                       
            <HeightSpacer height={16} />           
            <View style={styles.wrapper}>
              <Text style={styles.label}>Sesi</Text>
              <View>
                <View style={styles.inputWrapper(COLORS.lightGreen)}>
                  <ReusableDropdown
                    selectedValue={sesi}
                    onValueChange={handleInputSesi}
                    itemOptions={optionsSesi.map(option => option.value)}
                  />
                </View>
              </View>
            </View>

            {/* <Text>Waktu sekarang: {currentTime}</Text> */}

          </>
        }
        ListFooterComponent={
          <>
            <View style={styles.criticalPoints}>
              <Text style={styles.criticalHeader}>
                Critical points {selectedArea ? `area ${selectedArea.name}` : ""}
              </Text>
              <Text>{criticalPoints}</Text>
            </View>
            <Text>Total durasi patroli: {duration} menit</Text>
            <HeightSpacer height={20} />
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                borderColor: COLORS.lightBlue,
                borderWidth: 0,
                height: 100,
                borderRadius: 1,
                flexDirection: "row",
                paddingHorizontal: 3,
              }}
            >

              <ReusableBtn
                btnText={
                  areas.every((area) => area.status != 'active')
                    ? "Submit hasil Patroli"
                    : "Simpan sebagai Draft"
                }
                textColor={COLORS.white}
                width={SIZES.width - 100}
                backgroundColor={COLORS.green}
                borderColor={COLORS.green}
                borderWidth={0}
                onPress={handleSubmit}
              />
            </View>

            <Modal
              visible={modalVisible}
              transparent={true}
              animationType="slide"
              onRequestClose={() => {
                setModalVisible(false);
              }}
            >
              <TouchableOpacity
                style={styles.modalContainer}
                activeOpacity={1}
                onPressOut={() => setModalVisible(false)}
              >
                <View style={styles.modalView}>
                  <Text style={styles.centeredText}>
                    Apakah ada temuan negatif di {selectedArea?.name}?
                  </Text>
                  <View style={styles.rowContainer}>
                    <ReusableBtn
                      onPress={() => handleTemuan("Aman")}
                      btnText={'Aman'}
                      textColor={COLORS.black}
                      width={"50%"}
                      backgroundColor={'#95f0ce'}
                      borderWidth={1}
                      borderColor={COLORS.black}
                    />
                    <WidthSpacer width={10} />
                    <ReusableBtn
                      onPress={() => {
                        setAdaTemuan(true);
                        setModalVisible(false);
                      }}
                      btnText={'Ada Temuan'}
                      textColor={COLORS.black}
                      width={"50%"}
                      backgroundColor={'#F14B3D'}
                      borderWidth={1}
                      borderColor={COLORS.black}
                    />
                  </View>
                </View>
              </TouchableOpacity>
            </Modal>

            <Modal
              visible={adaTemuan}
              transparent={true}
              animationType="slide"
              onRequestClose={() => {
                setAdaTemuan(false);
              }}
            >
              <TouchableOpacity
                style={styles.modalContainerAdaTemuan}
                activeOpacity={1}
                onPressOut={() => setAdaTemuan(false)}
              >
                <View style={styles.modalView}>
                  <ReusableUploadImage
                    btnText={"Upload Image"}
                    textColor={COLORS.white}
                    backgroundColor={COLORS.primary}
                    borderColor={COLORS.primary}
                    onImagePathChange={handleImagePathChange}
                  />

                  <HeightSpacer height={10} />

                  <View style={styles.wrapper}>
                        <View>
                          <View style={styles.inputWrapper(COLORS.lightGreen)}>
                          <TextInput
                            style={styles.textInput}
                            value={temuan.remarks}
                            onChangeText={handleRemarksChange}
                            placeholder="Description.................................................."
                            multiline
                            numberOfLines={1}
                          />
                          </View>
                      </View>
                  </View>

                  <HeightSpacer height={10} />

                  <View style={styles.rowContainer}>
                    <ReusableBtn
                      onPress={handleSave}
                      btnText={'Save'}
                      textColor={COLORS.black}
                      width={"40%"}
                      backgroundColor={'#95f0ce'}
                      borderWidth={1}
                      borderColor={COLORS.black}
                    />
                  </View>
                </View>
              </TouchableOpacity>
            </Modal>


            <Modal
              visible={modalForDataTemuan}
              transparent={true}
              animationType="slide"
              onRequestClose={() => {
                setModalForDataTemuan(false);
              }}
            >
              <TouchableOpacity
                style={styles.modalContainerAdaTemuan}
                activeOpacity={1}
                onPressOut={() => setModalForDataTemuan(false)}
              >
                <View style={styles.modalView}>
                  {selectedDataTemuan && (
                    <>
                      {selectedDataTemuan.gambar && <Image source={{ uri: selectedDataTemuan.gambar }} style={styles.image} />}
                      <Text>{selectedDataTemuan.remarks}</Text>
                    </>
                  )}
                </View>
              </TouchableOpacity>
            </Modal>

          </>
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  headers: {
    paddingTop: 20,
    paddingBottom: 15,
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
  },
  item: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  checked: {
    color: "green",
    fontWeight: "bold",
    fontSize: 20,
  },
  issue: {
    color: "orange",
    fontWeight: "bold",
    fontSize: 20,
  },
  normal: {
    color: "black",
    fontSize: 20,
  },
  checkmark: {
    color: "green",
    fontSize: 30,
  },
  exclamation: {
    color: "orange",
    fontSize: 35,
  },
  temuan: {
    paddingLeft: 20,
    paddingBottom: 10,
  },
  temuanText: {
    color: "red",
    fontSize: 17,
  },
  criticalPoints: {
    backgroundColor: "#e0ffe0",
    padding: 10,
    marginTop: 20,
  },
  criticalHeader: {
    fontWeight: "bold",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContainerAdaTemuan: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
    height:10
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
  },
  image: {
    width: 300,
    height: 300,
    marginVertical: 10,
    borderRadius: 5
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    marginVertical: 10,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    //alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    alignItems: "center",
        // flexDirection:"row"
  },
  rowContainer: {
    flexDirection: "row",
  },
  centeredText: {
    textAlign: 'center',
    marginBottom:20,
    fontSize:20,
    fontWeight: "bold",
    
  },
  wrapper: {
    marginBottom: 25,
  },
  inputWrapper: (borderColor) => ({
    borderColor: borderColor,
    backgroundColor: COLORS.lightWhite,
    borderWidth: 1,
    height: 50,
    borderRadius: 12,
    flexDirection: "row",
    paddingHorizontal: 15,
    alignItems: "center",
  }),
  label: {
    fontFamily: "regular",
    fontSize: SIZES.medium,
    marginBottom: 5,
    marginStart: 5,
    textAlign: "left",
  },
  
});

export default EditchecklistPatrol;