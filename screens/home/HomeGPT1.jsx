import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";

const HomeScreen = () => {
  const [user, setUser] = useState({
    name: "Riwono",
    patrolHours: 345,
    points: 172,
    patrolDistance: 34,
    patrolDuration: 345,
    findings: 23,
    updateDate: "25 April 2024",
  });

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.greeting}>Hai, {user.name}</Text>
      </View>

      <View style={styles.card}>
        <View style={styles.info}>
          <Text style={styles.patrolHours}>{user.patrolHours} Jam</Text>
          <Text style={styles.infoLabel}>Jam Patroli</Text>
          <Text style={styles.updateDate}>
            Data update per {user.updateDate}
          </Text>
          <Text style={styles.points}>greenSHIELD POIN {user.points}</Text>
        </View>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Mulai Patrol</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.stats}>
        <View style={styles.stat}>
          <Text style={styles.statValue}>{user.patrolDistance} Km</Text>
          <Text style={styles.statLabel}>Jarak patrol</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statValue}>{user.patrolDuration} Jam</Text>
          <Text style={styles.statLabel}>Durasi patroli</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statValue}>{user.findings} Kasus</Text>
          <Text style={styles.statLabel}>Temuan (-)</Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#004400",
  },
  header: {
    padding: 20,
    backgroundColor: "#004400",
    alignItems: "center",
  },
  greeting: {
    color: "#ffffff",
    fontSize: 24,
  },
  card: {
    margin: 20,
    backgroundColor: "#028257",
    borderRadius: 10,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  info: {
    marginBottom: 20,
  },
  patrolHours: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#ffffff",
  },
  infoLabel: {
    fontSize: 18,
    color: "#ffffff",
    marginBottom: 5,
  },
  updateDate: {
    fontSize: 16,
    color: "#ffffff",
    marginBottom: 5,
  },
  points: {
    fontSize: 16,
    color: "#ffffff",
    fontWeight: "bold",
  },
  button: {
    backgroundColor: "#00A550",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    alignItems: "center",
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "bold",
  },
  stats: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 20,
  },
  stat: {
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 10,
    width: 110,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  statValue: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  statLabel: {
    fontSize: 14,
    color: "#666",
  },
});

export default HomeScreen;
