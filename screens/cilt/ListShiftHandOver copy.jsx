import React, { useState, useEffect } from "react";
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  RefreshControl,
  Image,
  Button,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Searchbar } from "react-native-paper";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { COLORS } from "../../constants/theme";
import moment from "moment";

const ListSHO = ({ navigation }) => {
  const [dataGreentag, setDataGreentag] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchDataFromAPI();

    const unsubscribe = navigation.addListener("focus", () => {
      fetchDataFromAPI();
    });

    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    fetchDataFromAPI();
  }, []);

  const fetchDataFromAPI = async () => {
    setIsLoading(true);
    try {
      const apiUrl = process.env.URL;
      const response = await axios.get(`${apiUrl}/sho`);
      setDataGreentag(response.data);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setIsLoading(false);
    }
  };

  const handleDetailPress = (item) => {
    if (item.status === "2") {
      navigation.navigate("EditShiftHandOver", {
        id: item.id,
        fromBottom: true,
      });
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchDataFromAPI();
    setRefreshing(false);
  };

  const filteredData = dataGreentag.filter((item) =>
    item.date.toString().includes(searchQuery)
  );

  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <Searchbar
          placeholder="Search Tanggal Serah Terima"
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

  const drafts = paginatedData.filter((item) => item.status === "2");
  const nonDrafts = paginatedData.filter((item) => item.status !== "2");

  return (
    <SafeAreaView style={styles.container}>
      <Searchbar
        placeholder="Cari Tanggal Serah Terima"
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={styles.searchBar}
        theme={{ colors: { primary: "green" } }}
        rippleColor={COLORS.green}
      />
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.content}>
          <View style={styles.paginationContainer}>
            <Button
              title="Previous"
              onPress={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            />
            <Text style={styles.pageInfo}>
              Page {currentPage} of {totalPages}
            </Text>
            <Button
              title="Next"
              onPress={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
            />
          </View>
          <Text style={styles.sectionTitle}>Draft Serah Terima</Text>
          {drafts.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.infoBox}
              onPress={() => handleDetailPress(item)}
              rippleColor={COLORS.green}
            >
              <Text style={styles.infoTagNo}>{item.id}</Text>
              <View style={styles.section}>
                <Text style={styles.infoText}>Nama</Text>
                <Text style={styles.infoText}>{item.nama}</Text>
              </View>
              <View style={styles.section}>
                <Text style={styles.infoText}>Email</Text>
                <Text style={styles.infoText}>{item.userEmail}</Text>
              </View>
              <View style={styles.section}>
                <Text style={styles.infoText}>Date</Text>
                <Text style={styles.infoText}>
                  {moment(item.date).format("YYYY-MM-DD")}
                </Text>
              </View>
              <View style={styles.section}>
                <Text style={styles.infoText}>Jabatan</Text>
                <Text style={styles.infoText}>{item.jabatan}</Text>
              </View>
              <View style={styles.section}>
                <Text style={styles.infoText}>Plant</Text>
                <Text style={styles.infoText}>{item.plant}</Text>
              </View>
              <View style={styles.section}>
                <Text style={styles.infoText}>Line</Text>
                <Text style={styles.infoText}>{item.line}</Text>
              </View>
              <View style={styles.section}>
                <Text style={styles.infoText}>Machine</Text>
                <Text style={styles.infoText}>{item.machine}</Text>
              </View>
              <View style={styles.section}>
                <Text style={styles.infoText}>Shift</Text>
                <Text style={styles.infoText}>{item.shift}</Text>
              </View>
              <View style={styles.section}>
                <Text style={styles.infoText}>Group</Text>
                <Text style={styles.infoText}>{item.group}</Text>
              </View>
              <View style={styles.section}>
                <Text style={styles.infoText}>Problems</Text>
                <Text style={styles.infoText}>{item.problems}</Text>
              </View>
              <View style={styles.section}>
                <Text style={styles.infoText}>Action</Text>
                <Text style={styles.infoText}>{item.action}</Text>
              </View>
              <View style={styles.section}>
                <Text style={styles.infoText}>Remarks</Text>
                <Text style={styles.infoText}>{item.remarks1}</Text>
              </View>

              <View style={styles.sectionP}>
                <Text style={styles.infoText}>Foto</Text>
                {item.image2 &&
                  item.image2.split(",").map((imageUri, index) =>
                    imageUri ? (
                      <Image
                        key={index}
                        source={{ uri: imageUri }}
                        style={styles.image}
                      />
                    ) : (
                      <Text key={index} style={styles.errorText}>
                        No Image Available
                      </Text>
                    )
                  )}
              </View>
              <View style={styles.sectionP}>
                <Text style={styles.label}>Foto Serah Terima</Text>
                {item.image ? (
                  <Image source={{ uri: item.image }} style={styles.image} />
                ) : (
                  <Text style={styles.errorText}>No Image Available</Text>
                )}
              </View>
            </TouchableOpacity>
          ))}

          <Text style={styles.sectionTitle}>Data Serah Terima</Text>
          {nonDrafts.map((item, index) => (
            <View key={index}>
              <Text style={styles.infoTagNo}>{item.id}</Text>
              <View style={styles.section}>
                <Text style={styles.infoText}>Nama</Text>
                <Text style={styles.infoText}>{item.nama}</Text>
              </View>
              <View style={styles.section}>
                <Text style={styles.infoText}>Email</Text>
                <Text style={styles.infoText}>{item.userEmail}</Text>
              </View>
              <View style={styles.section}>
                <Text style={styles.infoText}>Date</Text>
                <Text style={styles.infoText}>
                  {moment(item.date).format("YYYY-MM-DD")}
                </Text>
              </View>
              <View style={styles.section}>
                <Text style={styles.infoText}>Jabatan</Text>
                <Text style={styles.infoText}>{item.jabatan}</Text>
              </View>
              <View style={styles.section}>
                <Text style={styles.infoText}>Plant</Text>
                <Text style={styles.infoText}>{item.plant}</Text>
              </View>
              <View style={styles.section}>
                <Text style={styles.infoText}>Line</Text>
                <Text style={styles.infoText}>{item.line}</Text>
              </View>
              <View style={styles.section}>
                <Text style={styles.infoText}>Machine</Text>
                <Text style={styles.infoText}>{item.machine}</Text>
              </View>
              <View style={styles.section}>
                <Text style={styles.infoText}>Shift</Text>
                <Text style={styles.infoText}>{item.shift}</Text>
              </View>
              <View style={styles.section}>
                <Text style={styles.infoText}>Group</Text>
                <Text style={styles.infoText}>{item.group}</Text>
              </View>
              <View style={styles.section}>
                <Text style={styles.infoText}>Problems</Text>
                <Text style={styles.infoText}>{item.problems}</Text>
              </View>
              <View style={styles.section}>
                <Text style={styles.infoText}>Action</Text>
                <Text style={styles.infoText}>{item.action}</Text>
              </View>
              <View style={styles.section}>
                <Text style={styles.infoText}>Remarks</Text>
                <Text style={styles.infoText}>{item.remarks1}</Text>
              </View>
              {/* <View style={styles.sectionP}>
                <Text style={styles.infoText}>Foto</Text>
                {item.image2 &&
                  item.image2.split(",").map((imageUri, index) => (
                    <TouchableOpacity onPress={() => handlePress(item.image)}>
                      <Image
                        key={index}
                        source={{ uri: imageUri }}
                        style={styles.image}
                      />
                    </TouchableOpacity>
                  ))}
              </View>
              <View style={styles.sectionP}>
                <Text style={styles.label}>Foto Serah Terima</Text>
                <Image source={{ uri: item.image }} style={styles.image} />
              </View> */}
              <View style={styles.sectionP}>
                <Text style={styles.infoText}>Foto</Text>
                {item.image2 &&
                  item.image2.split(",").map((imageUri, index) =>
                    imageUri ? (
                      <Image
                        key={index}
                        source={{ uri: imageUri }}
                        style={styles.image}
                      />
                    ) : (
                      <Text key={index} style={styles.errorText}>
                        No Image Available
                      </Text>
                    )
                  )}
              </View>
              <View style={styles.sectionP}>
                <Text style={styles.label}>Foto Serah Terima</Text>
                {item.image ? (
                  <Image source={{ uri: item.image }} style={styles.image} />
                ) : (
                  <Text style={styles.errorText}>No Image Available</Text>
                )}
              </View>
            </View>
          ))}

          <View style={styles.paginationContainer}>
            <Button
              title="Previous"
              onPress={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            />
            <Text style={styles.pageInfo}>
              Page {currentPage} of {totalPages}
            </Text>
            <Button
              title="Next"
              onPress={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
            />
          </View>
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
    borderColor: COLORS.green,
    marginBottom: 20,
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
    marginBottom: 20,
  },
  paginationContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
  },
  pageInfo: {
    fontSize: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginVertical: 10,
  },
  image: {
    width: "95%",
    height: 300,
    margin: 5,
  },
  sectionP: {
    flexDirection: "column",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "#EAEAEA",
    alignItems: "flex-start",
    marginBottom: 20,
  },
  errorText: {
    color: "red",
    fontStyle: "italic",
  },
});

export default ListSHO;
