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
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import axios from "axios";
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
import reusable from "../../components/Reusable/reusable.style";
import { SafeAreaView } from "react-native-safe-area-context";
import NfcManager, {
  NfcTech,
  Ndef,
  NdefFormatable,
  NfcEvents,
} from "react-native-nfc-manager";
import { date } from "yup";
import { useRoute } from "@react-navigation/native";

import { Searchbar } from "react-native-paper";
import { fi } from "date-fns/locale/fi";
// const route = useRoute();
const moment = require("moment");

const ListTemuanPatrol = ({ navigation }) => {
  const route = useRoute();
  //const {tagNo} = route.params;
  const { recordPatrol } = route.params;
  console.log("haloo", recordPatrol.id);

  const [recordPatroliTemuan, setRecordPatroliTemuan] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const fetchDataFromAPI = async () => {
    try {
      const apiUrl = process.env.URL;
      const response = await axios.get(
        `${apiUrl}/temuanPatrolByIdRecordPatrol/${recordPatrol.id}`
      );
      console.log(response.data);
      setRecordPatroliTemuan(response.data);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching data Temuan Patroli:", error);
      setIsLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchDataFromAPI();
    setRefreshing(false);
  };

  useEffect(() => {
    fetchDataFromAPI();
  }, []);

  const handlePress = (image) => {
    setSelectedImage(image);
    setModalVisible(true);
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <Searchbar
          placeholder="Search Tag Number"
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchBar}
          theme={{ colors: { primary: "green" } }}
          rippleColor={COLORS.green}
        />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.green} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.content}>
          {recordPatroliTemuan
            .filter((item) => item.status === "1")
            .reverse()
            .map((item, index) => (
              <View key={index} style={styles.infoBox}>
                <View style={styles.section}>
                  <Text style={styles.infoText}>Area</Text>
                  <Text style={styles.infoText}>{item.name}</Text>
                </View>

                <View style={styles.section}>
                  <Text style={styles.infoText}>Foto</Text>
                  <TouchableOpacity onPress={() => handlePress(item.image)}>
                    <Text style={styles.linkText}>Link_Gambar</Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.section}>
                  <Text style={styles.infoText}>Remarks</Text>
                  <Text style={styles.infoText}>{item.remarks}</Text>
                </View>
              </View>
            ))}
        </View>
      </ScrollView>

      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => {
          setModalVisible(false);
        }}
      >
        <TouchableOpacity
          style={styles.modalContainerAdaTemuan}
          activeOpacity={1}
          onPressOut={() => setModalVisible(false)}
        >
          <View style={styles.modalView}>
            {selectedImage && (
              <Image
                source={{ uri: selectedImage }}
                style={styles.image}
                resizeMode="contain"
              />
            )}
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  content: {
    padding: 10,
  },
  infoBox: {
    borderRadius: 7,
    padding: 15,
    borderWidth: 1,
    borderColor: "#ddd",
    marginBottom: 20,
    borderColor: COLORS.green,
  },
  infoText: {
    fontSize: 16,
    marginBottom: 5,
  },
  linkText: {
    fontSize: 16,
    marginBottom: 5,
    color: COLORS.blue,
    fontWeight: "bold",
  },
  infoTagNo: {
    fontSize: 30,
    marginBottom: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  searchBar: {
    marginVertical: 10,
    marginHorizontal: 5,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  section: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "#EAEAEA",
    alignItems: "center",
    marginBottom: 20,
  },
  modalContainerAdaTemuan: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    alignItems: "center",
  },
  image: {
    width: 300,
    height: 300,
    marginVertical: 10,
    borderRadius: 5,
  },
});

export default ListTemuanPatrol;
