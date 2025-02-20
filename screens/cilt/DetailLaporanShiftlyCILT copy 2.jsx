import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Modal,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import moment from "moment";

const DetailLaporanShiftly = ({ route }) => {
  const { item } = route.params;
  const [data, setData] = useState([]);
  const [uniqueData, setUniqueData] = useState([]);
  const [shiftHours, setShiftHours] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const { width } = Dimensions.get("window");
  const modalImageSize = width * 0.8;

  const getShiftHours = (shift) => {
    if (shift === "Shift 1") return [7, 8, 9, 10, 11, 12, 13, 14];
    if (shift === "Shift 2") return [14, 15, 16, 17, 18, 19, 20, 21, 22];
    if (shift === "Shift 3") return [22, 23, 0, 1, 2, 3, 4, 5, 6];
    return [];
  };

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const formattedDate = item.date.split("T")[0];
      const response = await fetch(
        `http://10.24.7.70:8080/getReportCILTAll/CILT/${encodeURIComponent(
          item.plant
        )}/${encodeURIComponent(item.line)}/${encodeURIComponent(
          item.shift
        )}/${encodeURIComponent(item.machine)}/${formattedDate}`
      );
      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status}`);
      }
      const result = await response.json();

      if (Array.isArray(result) && result.length > 0) {
        setData(result);
        setShiftHours(getShiftHours(item.shift));
        setUniqueData(extractUniqueInspectionData(result));
      } else {
        setData([]);
        setUniqueData([]);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const extractUniqueInspectionDataX = (records) => {
    const uniqueActivities = {};
    records.forEach((record) => {
      const inspections = JSON.parse(record.CombinedInspectionData);
      inspections.forEach((inspection) => {
        const key = `${inspection.activity}|${inspection.standard}`;
        if (!uniqueActivities[key]) {
          uniqueActivities[key] = {
            activity: inspection.activity,
            standard: inspection.standard,
            results: {},
            picture: {},
          };
        }
        uniqueActivities[key].results[record.HourGroup] = inspection.results;
        uniqueActivities[key].picture[record.HourGroup] = inspection.picture;
      });
    });
    return Object.values(uniqueActivities);
  };

  const extractUniqueInspectionData = (records) => {
    const uniqueActivities = {};
    records.forEach((record) => {
      const inspections = JSON.parse(record.CombinedInspectionData);
      inspections.forEach((inspection) => {
        const key = `${inspection.activity}|${inspection.standard}`;
        if (!uniqueActivities[key]) {
          uniqueActivities[key] = {
            activity: inspection.activity,
            standard: inspection.standard,
            results: {},
            picture: {},
          };
        }
        uniqueActivities[key].results[record.HourGroup] = inspection.results;
        uniqueActivities[key].picture[record.HourGroup] = inspection.picture;
      });
    });

    const uniqueData = Object.values(uniqueActivities);
    console.log("Extracted Unique Inspection Data: ", uniqueData);
    return uniqueData;
  };

  useEffect(() => {
    fetchData();
  }, [item]);

  const handlePress = (image) => {
    setSelectedImage(image);
    setModalVisible(true);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView horizontal>
        <ScrollView>
          <View style={styles.header}>
            <Text style={styles.title}>Detail Data Shiftly</Text>
            <Text style={styles.infoTextBold}>
              Date:{"                         "}
              <Text style={styles.infoText}>
                {moment(item.date).format("DD/MM/YY HH:mm")}
              </Text>
            </Text>
            <Text style={styles.infoTextBold}>
              Process Order:{"       "}
              <Text style={styles.infoText}>{item.processOrder}</Text>
            </Text>
            <Text style={styles.infoTextBold}>
              Package: {"                 "}{" "}
              <Text style={styles.infoText}>{item.packageType}</Text>
            </Text>
            <Text style={styles.infoTextBold}>
              Plant: {"                       "}{" "}
              <Text style={styles.infoText}>{item.plant}</Text>
            </Text>
            <Text style={styles.infoTextBold}>
              Line: {"                          "}
              <Text style={styles.infoText}>{item.line}</Text>
            </Text>
            <Text style={styles.infoTextBold}>
              Shift: {"                         "}
              <Text style={styles.infoText}>{item.shift}</Text>
            </Text>
            <Text style={styles.infoTextBold}>
              Machine: {"                 "}{" "}
              <Text style={styles.infoText}>{item.machine}</Text>
            </Text>
          </View>

          {isLoading ? (
            <ActivityIndicator size="large" color="#3bcd6b" />
          ) : (
            <View style={styles.wrapper}>
              <ScrollView horizontal>
                <View style={styles.table}>
                  <View style={styles.tableHead}>
                    <View style={{ width: 60 }}>
                      <Text style={styles.tableCaption}>No</Text>
                    </View>
                    <View style={{ width: 200 }}>
                      <Text style={styles.tableCaption}>Activity</Text>
                    </View>
                    <View style={{ width: 100 }}>
                      <Text style={styles.tableCaption}>Standard</Text>
                    </View>
                    {shiftHours.map((hour, index) => (
                      <View key={index} style={{ width: 60 }}>
                        <Text style={styles.tableCaption}>{hour}</Text>
                      </View>
                    ))}
                  </View>

                  {uniqueData.map((item, index) => (
                    <View key={index} style={styles.tableBody}>
                      <View style={{ width: 60 }}>
                        <Text style={styles.tableData}>{index + 1}</Text>
                      </View>
                      <View style={{ width: 200 }}>
                        <Text style={styles.tableData}>{item.activity}</Text>
                      </View>
                      <View style={{ width: 100 }}>
                        <Text style={styles.tableData}>{item.standard}</Text>
                      </View>
                      {shiftHours.map((hour, idx) => (
                        <View key={idx} style={{ width: 60 }}>
                          <TouchableOpacity
                            onPress={() =>
                              item.picture[hour] &&
                              handlePress(item.picture[hour])
                            }
                            disabled={!item.picture[hour]}
                          >
                            <Text
                              style={[
                                styles.tableData,
                                {
                                  backgroundColor: item.results[hour]
                                    ? "#d4edda"
                                    : "#f8d7da",
                                },
                              ]}
                            >
                              {item.results[hour] || ""}
                            </Text>
                          </TouchableOpacity>
                        </View>
                      ))}
                    </View>
                  ))}
                </View>
              </ScrollView>
            </View>
          )}
        </ScrollView>
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
                style={{
                  width: modalImageSize,
                  height: modalImageSize,
                  marginVertical: 10,
                  borderRadius: 5,
                }}
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
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  table: {
    flexDirection: "column",
    width: "100%",
  },
  tableHead: {
    flexDirection: "row",
    backgroundColor: "#3bcd6b",
    paddingVertical: 10,
  },
  tableBody: {
    flexDirection: "row",
    paddingVertical: 10,
  },
  tableCaption: {
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
  },
  tableData: {
    textAlign: "center",
    fontSize: 14,
  },
});

export default DetailLaporanShiftly;
