import moment from "moment";
import React, { useState } from "react";
import {
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
  const [selectedImage, setSelectedImage] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const { width } = Dimensions.get("window");
  const modalImageSize = width * 0.8; // 80% of screen width

  // Parse the inspection data (string to object)
  const inspectionData = JSON.parse(item.inspectionData);

  const handlePress = (image) => {
    setSelectedImage(image);
    setModalVisible(true);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {/* Header Information */}
        <View style={styles.header}>
          <Text style={styles.title}>Detail Data</Text>
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
            Product: {"                   "}
            <Text style={styles.infoText}>{item.product}</Text>
          </Text>
          <Text style={styles.infoTextBold}>
            Machine: {"                 "}{" "}
            <Text style={styles.infoText}>{item.machine}</Text>
          </Text>
        </View>

        <View style={styles.wrapper}>
          {/* Table Container */}
          <View style={styles.table}>
            {/* Table Head */}
            <View style={styles.tableHead}>
              {/* Header Caption */}
              <View style={{ width: "10%" }}>
                <Text style={styles.tableCaption}>No</Text>
              </View>
              <View style={{ width: "25%" }}>
                <Text style={styles.tableCaption}>Activity</Text>
              </View>
              <View style={{ width: "15%" }}>
                <Text style={styles.tableCaption}>Standard</Text>
              </View>
              <View style={{ width: "20%" }}>
                <Text style={styles.tableCaption}>Periode</Text>
              </View>
              <View style={{ width: "10%" }}>
                <Text style={styles.tableCaption}>Result</Text>
              </View>
              <View style={{ width: "20%" }}>
                <Text style={styles.tableCaption}>Picture</Text>
              </View>
            </View>

            {/* Table Body */}
            {inspectionData.map((item, index) => {
              const resultValue = parseFloat(item.results);
              const standard1Value = parseFloat(item.standard.split("-")[0]);
              const standard2Value = parseFloat(item.standard.split("-")[1]);

              const isInStandard =
                resultValue >= standard1Value && resultValue <= standard2Value;
              return (
                <View key={index} style={styles.tableBody}>
                  {/* Header Caption */}
                  <View style={{ width: "10%" }}>
                    {/* <Text style={styles.tableData}>Done</Text> */}
                    <View style={[styles.tableData, styles.centeredContent]}>
                      <Text style={styles.tableData}>{index + 1}</Text>
                    </View>
                  </View>
                  <View style={{ width: "25%" }}>
                    <Text style={styles.tableData}>{item.activity}</Text>
                  </View>
                  <View style={{ width: "15%" }}>
                    <Text style={styles.tableData}>{item.standard}</Text>
                  </View>
                  <View style={{ width: "20%" }}>
                    <Text style={styles.tableData}>{item.periode}</Text>
                  </View>
                  <View style={{ width: "10%" }}>
                    {/* <Text style={styles.tableData}>Hasil</Text> */}
                    <View style={[styles.tableData, styles.centeredContent]}>
                      {/* <TextInput
                        style={styles.tableData}
                        value={item.results}
                        onChangeText={(text) => handleInputChange(text, index)}
                      /> */}

                      <Text
                        style={[
                          styles.tableData,
                          isInStandard ? styles.green : styles.red,
                        ]}
                      >
                        {item.results}
                      </Text>
                    </View>
                  </View>
                  <View style={{ width: "20%" }}>
                    {item.picture !== null && item.picture !== "" ? (
                      <TouchableOpacity
                        onPress={() => handlePress(item.picture)} // Set the image in the modal
                      >
                        <Text style={[styles.tableData, styles.linkText]}>
                          gambar
                        </Text>
                      </TouchableOpacity>
                    ) : (
                      <Text style={styles.tableData}>N/A</Text>
                    )}
                  </View>
                </View>
              );
            })}
          </View>
        </View>

        {/* Image Modal (Show if Image is Clicked) */}
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
                // style={styles.imageModal}
                // resizeMode="contain"
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
  infoTextBold: {
    fontSize: 16,
    marginBottom: 5,
  },
  infoText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  tableContainer: {
    borderWidth: 1,
    borderColor: "#EAEAEA",
    borderRadius: 5,
    overflow: "hidden",
    marginTop: 20,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#f8f8f8",
    borderBottomWidth: 1,
    borderBottomColor: "#EAEAEA",
    paddingVertical: 10,
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#EAEAEA",
    backgroundColor: "#fff",
    paddingVertical: 10, // Added to match the header's padding
  },
  tableCell: {
    flex: 1, // Ensures each cell takes up equal width
    textAlign: "center",
    paddingVertical: 10, // Adjust for vertical alignment
    paddingHorizontal: 5, // Adjust for horizontal padding
    borderLeftWidth: 1,
    borderLeftColor: "#EAEAEA",
  },
  tableCellHeader: {
    flex: 1, // Same as the content cells to ensure equal width
    textAlign: "center",
    fontWeight: "bold",
    paddingVertical: 10, // Ensure the same padding as in the content cells
    paddingHorizontal: 5,
    borderLeftWidth: 1,
    borderLeftColor: "#EAEAEA",
  },
  green: {
    backgroundColor: "#d4edda", // Light green background
    color: "#155724", // Dark green text
    paddingVertical: 10,
  },
  red: {
    backgroundColor: "#f8d7da", // Light red background
    color: "#721c24", // Dark red text
    paddingVertical: 10,
  },

  // tableCSS
  wrapper: {
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
  tableBody: {
    flexDirection: "row",
    // backgroundColor: "#3bcd6b",
    padding: 20,
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
  centeredContent: {
    justifyContent: "center",
    alignItems: "center",
  },
  // tableCSS end
  linkText: {
    color: "#007bff", // Blue color for links
    textDecorationLine: "underline", // Underline to indicate it's clickable
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
  // imageModal: {
  //   // width: 600,
  //   // height: 600,
  //   width: modalImageSize,
  //   height: modalImageSize,
  //   marginVertical: 10,
  //   borderRadius: 5,
  // },
});

export default DetailLaporanShiftly;
