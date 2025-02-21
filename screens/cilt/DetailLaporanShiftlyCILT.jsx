import moment from "moment";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  Image,
  Modal,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

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
    if (shift === "Shift 1") return [6, 7, 8, 9, 10, 11, 12, 13, 14];
    if (shift === "Shift 2") return [14, 15, 16, 17, 18, 19, 20, 21, 22];
    if (shift === "Shift 3") return [22, 23, 0, 1, 2, 3, 4, 5, 6];
    return [];
  };

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const formattedDate = item.date.split("T")[0];
      const response = await fetch(
        `http://10.0.2.2:8080/getReportCILTAll/CILT/${encodeURIComponent(
          item.plant
        )}/${encodeURIComponent(item.line)}/${encodeURIComponent(
          item.shift
        )}/${encodeURIComponent(item.machine)}/${formattedDate}`
      );
      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status}`);
      }
      const result = await response.json();

      console.log("result", result);

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

  const extractUniqueInspectionData = (records) => {
    const uniqueActivities = {};

    records.forEach((record) => {
      try {
        // Gunakan regex untuk menangkap semua JSON array dalam string
        const matches = record.CombinedInspectionData.match(/\[.*?\]/g);

        if (!matches || matches.length === 0) {
          console.error(
            "No valid JSON array found in:",
            record.CombinedInspectionData
          );
          return;
        }

        // Ambil JSON array yang terakhir
        const lastInspectionData = JSON.parse(matches[matches.length - 1]);

        lastInspectionData.forEach((inspection) => {
          const key = `${inspection.id}|${inspection.activity}`;
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
      } catch (error) {
        console.error("Error parsing JSON:", error);
      }
    });

    return Object.values(uniqueActivities);
  };

  // const extractUniqueInspectionData = (records) => {
  //   console.log("extractUniqueInspectionData", records);
  //   const uniqueActivities = {};
  //   records.forEach((record) => {
  //     const inspections = JSON.parse(record.CombinedInspectionData);
  //     console.log("inspections", inspections);
  //     inspections.forEach((inspection) => {
  //       const key = `${inspection.id}|${inspection.activity}`;
  //       if (!uniqueActivities[key]) {
  //         uniqueActivities[key] = {
  //           activity: inspection.activity,
  //           standard: inspection.standard,
  //           results: {},
  //           picture: {},
  //         };
  //       }
  //       uniqueActivities[key].results[record.HourGroup] = inspection.results;
  //       uniqueActivities[key].picture[record.HourGroup] = inspection.picture;
  //     });
  //   });
  //   return Object.values(uniqueActivities);
  // };

  const extractUniqueInspectionDataX = (records) => {
    const uniqueActivities = {};
    records.forEach((record) => {
      const inspections = JSON.parse(record.CombinedInspectionData);
      inspections.forEach((inspection) => {
        const key = `${inspection.id}|${inspection.standard}`;
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

  const isWithinRangeX = (standard, result) => {
    console.log("Standard:", standard);
    console.log("Result:", result);
    if (!standard || !result) return false;
    if (standard == "- - -") return false;
    const rangeMatch = standard.match(/(\d+)\s*-\s*(\d+)/); // Regex untuk menemukan range angka seperti "17 - 20"
    if (rangeMatch) {
      const [_, min, max] = rangeMatch.map(Number);
      return result >= min && result <= max;
    }
    return false;
  };

  const isWithinRange = (standard, result) => {
    if (!standard || !result || isNaN(result)) return null;
    const rangeMatch = standard.match(/(\d+)\s*-\s*(\d+)/); // Regex untuk range angka
    if (rangeMatch) {
      const [_, min, max] = rangeMatch.map(Number);
      return result >= min && result <= max;
    }
    return null;
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
                {moment(item.date, "YYYY-MM-DD HH:mm:ss.SSS").format(
                  "DD/MM/YY HH:mm:ss"
                )}
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
                        {data
                          .filter(
                            (item) =>
                              hour ==
                              moment.utc(item.LastRecordTime).format("HH")
                          )
                          .map((filteredItem, idx) => (
                            <Text key={idx} style={styles.tableCaption}>
                              {moment(filteredItem.LastRecordTime).format("mm")}
                            </Text>
                          ))}
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
                                    ? isWithinRange(
                                        item.standard,
                                        parseFloat(item.results[hour])
                                      ) === true
                                      ? "#d4edda" // Hijau jika dalam range
                                      : isWithinRange(
                                          item.standard,
                                          parseFloat(item.results[hour])
                                        ) === false
                                      ? "red" // Merah jika di luar range
                                      : "#f8f9fa" // Default jika bukan angka
                                    : "#f8f9fa",
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
