import * as Print from "expo-print";
import { shareAsync } from "expo-sharing";
import moment from "moment";
import React, { useEffect, useState } from "react";
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
import { COLORS } from "../../constants/theme";

const DetailLaporanShiftly = ({ route, navigation }) => {
  const { item } = route.params;
  const [selectedImage, setSelectedImage] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [totalGood, setTotalGood] = useState(0);
  const [totalNeed, setTotalNeed] = useState(0);
  const [totalRed, setTotalRed] = useState(0);

  const { width } = Dimensions.get("window");
  const modalImageSize = width * 0.8; // 80% of screen width

  // Parse the inspection data (string to object)
  const inspectionData = JSON.parse(item.inspectionData);

  useEffect(() => {
    let goodCount = 0;
    let needCount = 0;
    let redCount = 0;

    inspectionData.forEach((item) => {
      let resultValue;

      if (item.results !== "OK" && item.results !== "NOT OK") {
        resultValue = parseFloat(item.results);
      }

      if (item.results === "OK") {
        goodCount++;
      } else if (item.results === "NOT OK") {
        redCount++;
      } else {
        if (resultValue >= item.good && resultValue < item.need) {
          goodCount++;
        }
        if (
          item.need !== null &&
          resultValue >= item.need &&
          resultValue < item.red
        ) {
          needCount++;
        }
        if (resultValue >= item.red || resultValue < item.good) {
          redCount++;
        }
      }
    });

    // Update state setelah iterasi selesai
    setTotalGood(goodCount);
    setTotalNeed(needCount);
    setTotalRed(redCount);
  }, [inspectionData]);

  const handlePress = (image) => {
    setSelectedImage(image);
    setModalVisible(true);
  };

  const handleLanjutkanDraft = (item) => {
    navigation.navigate("EditCilt", { item });
  };

  const printToFile = async () => {
    // Format Data Tambahan dengan layout dua kolom
    const formattedData = `
      <p><strong>Process Order:</strong> ${item.processOrder}</p>
      <div class="row">
        <p><strong>Total Good:</strong> ${totalGood}</p>
        <p><strong>Total Need:</strong> ${totalNeed}</p>
        <p><strong>Total Red:</strong> ${totalRed}</p>
      </div>
      <table class="general-info-table">
        <tr>
          <td><strong>Date:</strong> ${moment(
            item.date,
            "YYYY-MM-DD HH:mm:ss.SSS"
          ).format("DD/MM/YY HH:mm:ss")}</td>
          <td><strong>Product:</strong> ${item.product}</td>
        </tr>
        <tr>
          <td><strong>Plant:</strong> ${item.plant}</td>
          <td><strong>Line:</strong> ${item.line}</td>
        </tr>
        <tr>
          <td><strong>Machine:</strong> ${item.machine}</td>
          <td><strong>Shift:</strong> ${item.shift}</td>
        </tr>
        <tr>
          <td><strong>Package:</strong> ${item.packageType}</td>
          <td><strong>Group:</strong>  </td>
        </tr>
      </table>
    `;

    // Mapping inspectionData ke dalam tabel
    const inspectionRows = inspectionData
      .map((item, index) => {
        // Tentukan warna berdasarkan jumlah good, need, dan red
        let resultColor = "black"; // Default warna hitam
        let resultValue;
        if (item.results !== "OK" && item.results !== "NOT OK") {
          resultValue = parseFloat(item.results);
        }

        if (item.results === "OK") {
          resultColor = "green"; // Warna hijau untuk OK
        } else if (item.results === "NOT OK") {
          resultColor = "red"; // Warna merah untuk NOT OK
        } else {
          if (resultValue >= item.good && resultValue < item.need) {
            resultColor = "green";
          }
          if (
            item.need !== null &&
            resultValue >= item.need &&
            resultValue < item.red
          ) {
            resultColor = "yellow";
          }
          if (resultValue >= item.red || resultValue < item.good) {
            resultColor = "red";
          }
        }

        return `
        <tr>
          <td>${index + 1}</td>
          <td>${item.activity}</td>
          <td>${item.good ?? "-"}</td>
          <td>${item.need ?? "-"}</td>
          <td>${item.red ?? "-"}</td>
          <td>${item.periode}</td>
          <td style="color: ${resultColor}; font-weight: bold;">${
          item.results
        }</td>
          <td>${
            item.picture
              ? `<img src="${item.picture}" width="50" height="50" />`
              : "N/A"
          }</td>
          <td>${item.user}</td>
          <td>${item.time}</td>
        </tr>
      `;
      })
      .join("");

    // HTML untuk file yang akan dicetak
    const html = `
      <html>
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no" />
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            h2 { text-align: center; }
            .report-info { text-align: left; margin-bottom: 12px; }
            
            p {
              margin-bottom: 0; /* Hilangkan margin bawah dari paragraf */
            }

            .row {
              display: flex;
              gap: 10px; /* Jarak antar elemen dalam row */
              margin-top: 0; /* Hilangkan margin atas agar lebih dekat */
            }
  
            .general-info-table {
              width: 100%; 
              border-collapse: collapse; 
              margin-top: 3px;
            }
  
            .general-info-table td { 
              border: 1px solid black; 
              padding: 5px; 
              text-align: left; 
              vertical-align: top; 
            }
  
            table { 
              width: 100%; 
              border-collapse: collapse; 
              margin-top: 10px; 
            }
  
            th, td { 
              border: 1px solid black; 
              padding: 8px; 
              text-align: left; 
            }
  
            th { 
              background-color: #f2f2f2; 
            }
  
            img { 
              display: block; 
              margin: auto; 
            }
          </style>
        </head>
        <body>
          <h2>PT. GREENFIELDS INDONESIA</h2>
          <div class="report-info">
            ${formattedData}
          </div>
          <table>
            <thead>
              <tr>
                <th>No</th>
                <th>Activity</th>
                <th>G</th>
                <th>N</th>
                <th>R</th>
                <th>Periode</th>
                <th>Result</th>
                <th>Picture</th>
                <th>User</th>
                <th>Time</th>
              </tr>
            </thead>
            <tbody>
              ${inspectionRows}
            </tbody>
          </table>
        </body>
      </html>
    `;

    try {
      const { uri } = await Print.printToFileAsync({ html });
      console.log("File has been saved to:", uri);
      await shareAsync(uri, { UTI: ".pdf", mimeType: "application/pdf" });
    } catch (error) {
      console.error("Error generating PDF:", error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {/* Header Information */}
        <View style={styles.header}>
          <Text style={styles.title}>Detail Data</Text>
          <Text style={styles.infoTextBold}>
            Date:{"                          "}
            <Text style={styles.infoText}>
              {moment(item.date, "YYYY-MM-DD HH:mm:ss.SSS").format(
                "DD/MM/YY HH:mm:ss"
              )}
            </Text>
          </Text>
          <Text style={styles.infoTextBold}>
            Process Order:{"        "}
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
          <Text style={styles.infoTextBold}>
            Created At: {"            "}{" "}
            <Text style={styles.infoText}>
              {" "}
              {moment(item.createdAt, "YYYY-MM-DD HH:mm:ss.SSS").format(
                "DD/MM/YY HH:mm:ss"
              )}
            </Text>
          </Text>
          <Text style={styles.infoTextBold}>
            Updated At: {"           "}{" "}
            <Text style={styles.infoText}>
              {" "}
              {moment(item.updatedAt, "YYYY-MM-DD HH:mm:ss.SSS").format(
                "DD/MM/YY HH:mm:ss"
              )}
            </Text>
          </Text>
          <Text style={styles.infoTextBold}>
            Total Good: {"            "}{" "}
            <Text style={styles.infoText}>{totalGood}</Text>
          </Text>
          <Text style={styles.infoTextBold}>
            Total Need: {"            "}{" "}
            <Text style={styles.infoText}>{totalNeed}</Text>
          </Text>
          <Text style={styles.infoTextBold}>
            Total Red: {"               "}{" "}
            <Text style={styles.infoText}>{totalRed}</Text>
          </Text>
        </View>

        {item.status === 1 ? (
          <>
            <View>
              <TouchableOpacity
                style={[styles.submitButton]}
                onPress={() => handleLanjutkanDraft(item)}
              >
                <Text style={styles.submitButtonText}>LANJUTKAN DRAFT</Text>
              </TouchableOpacity>
            </View>
          </>
        ) : (
          <>
            <View>
              <TouchableOpacity
                style={[styles.submitButton]}
                onPress={printToFile}
              >
                <Text style={styles.submitButtonText}>DOWNLOAD REPORT</Text>
              </TouchableOpacity>
            </View>
          </>
        )}

        <View style={styles.wrapper}>
          {/* Table Container */}
          <View style={styles.table}>
            {/* Table Head */}
            <View style={styles.tableHead}>
              {/* Header Caption */}
              <View style={{ width: "5%" }}>
                <Text style={styles.tableCaption}>No</Text>
              </View>
              <View style={{ width: "20%" }}>
                <Text style={styles.tableCaption}>Activity</Text>
              </View>
              <View style={{ width: "5%" }}>
                <Text style={styles.tableCaption}>G</Text>
              </View>
              <View style={{ width: "5%" }}>
                <Text style={styles.tableCaption}>N</Text>
              </View>
              <View style={{ width: "5%" }}>
                <Text style={styles.tableCaption}>R</Text>
              </View>
              <View style={{ width: "15%" }}>
                <Text style={styles.tableCaption}>Periode</Text>
              </View>
              <View style={{ width: "10%" }}>
                <Text style={styles.tableCaption}>Result</Text>
              </View>
              <View style={{ width: "15%" }}>
                <Text style={styles.tableCaption}>Picture</Text>
              </View>
              <View style={{ width: "10%" }}>
                <Text style={styles.tableCaption}>User</Text>
              </View>
              <View style={{ width: "10%" }}>
                <Text style={styles.tableCaption}>Time</Text>
              </View>
            </View>

            {/* Table Body */}
            {inspectionData.map((item, index) => {
              let resultValue =
                item.results === "OK"
                  ? 1
                  : item.results === "NOT OK"
                  ? 2
                  : parseFloat(item.results);

              let colorStyle = styles.black; // Default warna hitam

              if (item.results === "OK") {
                colorStyle = styles.green;
              } else if (item.results === "NOT OK") {
                colorStyle = styles.red;
              } else {
                if (resultValue >= item.good && resultValue < item.need) {
                  colorStyle = styles.green;
                }
                if (
                  item.need !== null &&
                  resultValue >= item.need &&
                  resultValue < item.red
                ) {
                  colorStyle = styles.yellow;
                }
                if (resultValue >= item.red || resultValue < item.good) {
                  colorStyle = styles.red;
                }
              }

              return (
                <View key={index} style={styles.tableBody}>
                  {/* Header Caption */}
                  <View style={{ width: "5%" }}>
                    {/* <Text style={styles.tableData}>Done</Text> */}
                    <View style={[styles.tableData, styles.centeredContent]}>
                      <Text style={styles.tableData}>{index + 1}</Text>
                    </View>
                  </View>
                  <View style={{ width: "20%" }}>
                    <Text style={styles.tableData}>{item.activity}</Text>
                  </View>
                  <View style={{ width: "5%" }}>
                    <Text style={styles.tableData}>{item.good ?? "-"}</Text>
                  </View>
                  <View style={{ width: "5%" }}>
                    <Text style={styles.tableData}>{item.need ?? "-"}</Text>
                  </View>
                  <View style={{ width: "5%" }}>
                    <Text style={styles.tableData}>{item.red ?? "-"}</Text>
                  </View>
                  <View style={{ width: "15%" }}>
                    <Text style={styles.tableData}>{item.periode}</Text>
                  </View>
                  <View style={{ width: "10%" }}>
                    <View style={[styles.tableData, styles.centeredContent]}>
                      {/* <TextInput
                        style={styles.tableData}
                        value={item.results}
                        onChangeText={(text) => handleInputChange(text, index)}
                      /> */}
                      <Text
                        style={[
                          styles.tableData,
                          styles.infoText,
                          item.packageType === "GI/GR"
                            ? { color: "black" }
                            : colorStyle,
                        ]}
                      >
                        {item.results}
                      </Text>
                    </View>
                  </View>
                  <View style={{ width: "15%" }}>
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
                  <View style={{ width: "10%" }}>
                    <Text style={styles.tableData}>{item.user}</Text>
                  </View>
                  <View style={{ width: "10%" }}>
                    <Text style={styles.tableData}>{item.time}</Text>
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
  submitButton: {
    backgroundColor: COLORS.blue,
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 8,
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  red: {
    color: "red",
    fontWeight: "bold",
  },
  yellow: {
    color: "orange",
    fontWeight: "bold",
  },
  green: {
    color: "green",
    fontWeight: "bold",
  },
  black: {
    color: "black",
    fontWeight: "bold",
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
