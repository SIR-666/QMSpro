import React from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ImageBackground,
} from "react-native";

export default function Home() {
  return (
    <View style={styles.home}>
      <ImageBackground
        style={styles.backgroundHeader}
        source={require("../../assets/images/bgHeader.png")}
      >
        <Text style={styles.headerText}>Hai, Riwono</Text>
      </ImageBackground>
      <ImageBackground
        style={styles.card}
        source={require("../../assets/images/simcard.png")}
      >
        <Text style={styles.largeNumber}>10040600</Text>
        <Text style={styles.largeNumber}>greenSHIELD</Text>
        <Text style={styles.mediumText}>Jam Patroli</Text>
        <Text style={styles.largeText}>345 Jam</Text>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Mulai Patroli</Text>
        </TouchableOpacity>
        <Text style={styles.smallText}>Data update per 25 April 2024</Text>
        <View style={styles.pointsContainer}>
          <Text style={styles.smallText}>greenSHIELD POIN</Text>
          <View style={styles.points}>
            <Text style={styles.pointsText}>172</Text>
          </View>
        </View>
      </ImageBackground>
      <View style={styles.stats}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>034</Text>
          <Text style={styles.statLabel}>Km</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>345</Text>
          <Text style={styles.statLabel}>Jam</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>23</Text>
          <Text style={styles.statLabel}>Kasus</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  home: {
    // flex: 1,
    backgroundColor: "#F8F8F8",
    // alignItems: "center",
    // paddingLeft: 20,
  },
  backgroundHeader: {
    width: "100%",
    height: 250,
    paddingVertical: 60,
    justifyContent: "center",
  },
  headerText: {
    color: "#FFFFFF",
    fontSize: 22,
    fontWeight: "bold",
    marginLeft: 30,
    // marginTop: 20,
    marginBottom: 80,
    textAlign: "left",
  },
  card: {
    // backgroundColor: "#21B366",
    width: "95%",
    position: "absolute",
    marginTop: 120,
    marginLeft: 20,
    // paddingVertical: 5,
    alignItems: "center",
  },
  stats: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "95%",
    marginTop: 160,
    padding: 10,
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  largeNumber: {
    fontSize: 28,
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  mediumText: {
    fontSize: 16,
    color: "#DDDDDD",
    marginVertical: 5,
  },
  largeText: {
    fontSize: 24,
    color: "#FFFFFF",
    fontWeight: "bold",
    marginBottom: 10,
  },
  smallText: {
    fontSize: 15,
    color: "#DDDDDD",
    marginBottom: 10,
  },
  pointsContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  points: {
    backgroundColor: "#F7B731",
    borderRadius: 5,
    paddingVertical: 3,
    paddingHorizontal: 7,
    marginLeft: 5,
  },
  pointsText: {
    color: "#1E2732",
    fontSize: 14,
    fontWeight: "bold",
  },
  button: {
    backgroundColor: "#18DE75",
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },

  statItem: {
    alignItems: "center",
    width: "30%",
  },
  statNumber: {
    fontSize: 22,
    color: "#EC2028",
    fontWeight: "bold",
  },
  statLabel: {
    fontSize: 16,
    color: "#747D8C",
  },
});
