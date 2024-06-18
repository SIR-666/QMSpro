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
  ActivityIndicator
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
import * as ImagePicker from "expo-image-picker";
import reusable from "../../components/Reusable/reusable.style";
import { SafeAreaView } from "react-native-safe-area-context";
import NfcManager, { NfcTech, Ndef, NdefFormatable, NfcEvents } from 'react-native-nfc-manager';
import { date } from "yup";
import { useRoute } from "@react-navigation/native";

import { Searchbar } from "react-native-paper";
import { fi } from "date-fns/locale/fi";
// const route = useRoute();
const moment = require('moment');


const ListRecordPatrol = ({ navigation }) => {

  const [recordPatroliTemuan, setRecordPatroliTemuan] = useState ([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);


  const fetchDataFromAPI = async () => {
    // setIsLoading(true);
    try {
      const apiUrl = process.env.URL;
      console.log(apiUrl)
      const response = await axios.get(`${apiUrl}/getAllRecordPatrolWithUser`);
      console.log(response.data);
      setRecordPatroliTemuan(response.data);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching data Record Ptaroli:", error);
      //setIsLoading(false);  // Ensure isLoading is set to false on error
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchDataFromAPI();
    setRefreshing(false);
  };

  const filteredData = recordPatroliTemuan.filter((item) =>
    item.username.toString().toLowerCase().includes(searchQuery.toLowerCase())
  );


  const handleDetailPress = (item) => {
    navigation.navigate("ListTemuanPatrol", { recordPatrol: item });
  };
  



  useEffect(() => {
    fetchDataFromAPI();
  }, []);


  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
      <View style={styles.header}>
      <Text style={styles.title}>Record Patroli</Text>
      <Searchbar
        placeholder="Search Username"
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={styles.searchBar}
        theme={{ colors: { primary: 'green' } }}
        rippleColor={COLORS.green}
      />
      </View>
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.green} />
      </View>
      </SafeAreaView>
    );
  };

  return (
    <SafeAreaView style={styles.container}>

      <View style={styles.header}>
      <Text style={styles.title}>Record Patroli</Text>
      <Searchbar
        placeholder="Search Username"
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={styles.searchBar}
        theme={{ colors: { primary: 'green' } }}
        rippleColor={COLORS.green}
      />
      </View>

      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.content}>

          {filteredData.reverse().map((item, index) => (

            <TouchableOpacity
              key={index}
              style={styles.infoBox}
              onPress={() => handleDetailPress(item)}
              rippleColor={COLORS.green}
            >

              {/* <Text style={styles.infoTagNo}>{item.username}</Text> */}

              <View style={styles.section}>
                <Text style={styles.infoText}>Username</Text>
                <Text style={styles.infoText}>{item.username}</Text>
              </View>
              
              <View style={styles.section}>
                <Text style={styles.infoText}>Shift</Text>
                <Text style={styles.infoText}>{item.shift}</Text>
              </View>

              <View style={styles.section}>
                <Text style={styles.infoText}>Sesi</Text>
                <Text style={styles.infoText}>{item.jenis}</Text>
              </View>

              <View style={styles.section}>
                <Text style={styles.infoText}>Start Patrol</Text>
                <Text style={styles.infoText}>{ moment(item.jam_patroli_start).format("YYYY-MM-DD / HH:mm")}</Text>
              </View>

              <View style={styles.section}>
                <Text style={styles.infoText}>End Patrol</Text>
                <Text style={styles.infoText}>{moment(item.jam_patroli_end).format("YYYY-MM-DD / HH:mm")}</Text>
              </View>

            </TouchableOpacity>
          ))}
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
    marginBottom:20
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
  },
  header: {
    alignItems: 'center',
    marginTop:20
  }
  
});

export default ListRecordPatrol;





