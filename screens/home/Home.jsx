import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ImageBackground,
} from "react-native";
import { ReusableText, HeightSpacer, Recommendations,ReusableBtn } from "../../components";
import { useNavigation } from "@react-navigation/native";
import { COLORS, SIZES, TEXT } from "../../constants/theme";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Home() {
  const navigation = useNavigation();

  const [username, setUsername] = useState('');
  const [idProfile, setIdProfile] = useState(null);

  const handleMulaiPatroli = async () => {
    navigation.navigate("ChecklistScreen", { idProfile });
  }

  const fetchUserData = async () => {
    try {
      const urlApi = process.env.URL;
      console.log(urlApi);
      const email = await AsyncStorage.getItem('user');
      const url = `${urlApi}/users?email=${email}`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      console.log(data)
      setIdProfile(data.id);
      setUsername(data.username);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  return (
    <View style={styles.home}>
      <ImageBackground
        style={styles.backgroundHeader}
        source={require("../../assets/images/bgHeader.png")}
      >
        <View style={styles.headerTextContainer}>
          <Text style={styles.headerText}>
            Hai, <Text style={styles.boldText}>{username}</Text>
          </Text>
        </View>
      </ImageBackground>
      <ImageBackground
        style={styles.card}
        source={require("../../assets/images/simcard.png")}
      >
        <HeightSpacer height={10} />
        <View style={styles.atas}>
          <View style={styles.atasItem}>
            <Text style={styles.largeText}>10040600</Text>
          </View>
          <View style={styles.atasItem}>
            <View>
              <Text style={styles.headerText}>
                green<Text style={styles.boldText}>SHIELD</Text>
              </Text>
            </View>
          </View>
        </View>
        <HeightSpacer height={10} />

        <View style={styles.atas}>
          <View style={styles.atasItem}>
            <Text style={styles.mediumText}>Jam Patroli</Text>
            <Text style={styles.largeText}>345 Jam</Text>
          </View>
          <View style={styles.atasItem}>
            <TouchableOpacity style={styles.button} onPress={handleMulaiPatroli}>
              <Text style={styles.buttonText}>Mulai Patroli</Text>
            </TouchableOpacity>
          </View>
        </View>
        <HeightSpacer height={10} />

        <View style={styles.atas}>
          <View style={styles.atasItem}>
            <Text style={styles.smallText}>Update 14 Mei 2024</Text>
          </View>
          <View style={styles.atasItem}>
            <View style={styles.pointsContainer}>
              <View style={styles.points}>
                <Text style={styles.pointsText}>172</Text>
              </View>
            </View>
          </View>
        </View>
      </ImageBackground>
      <View style={styles.stats}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>034</Text>
          <Text style={styles.statLabel}>Km</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>95%</Text>
          <Text style={styles.statLabel}>Close</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>23</Text>
          <Text style={styles.statLabel}>Kasus</Text>
        </View>
      </View>

      <HeightSpacer height={35} />

      <View style={styles.listPatrol}>
        <TouchableOpacity style={styles.buttonPatrol} onPress={() => navigation.navigate("ListRecordPatrol") }>
          <Text style={styles.buttonText}>Patrol</Text>
        </TouchableOpacity>

        <HeightSpacer height={20} />

        <TouchableOpacity style={styles.buttonPatrol} onPress={() => navigation.navigate("ListRecordPatrolAsDarft")}>
          <Text style={styles.buttonText}>Draft</Text>
        </TouchableOpacity>
      </View>

 

      {/* <View style={styles.listPatrol}>
        <ReusableBtn
          onPress={() => handleTemuan("Aman")}
          btnText={'Patrol'}
          textColor={COLORS.black}
          width={"95%"}
          backgroundColor={'#18DE75'}
          // borderWidth={0.5}
          // borderColor={COLORS.black}
        />
            
        <HeightSpacer height={20} />

        <ReusableBtn
          onPress={() => handleTemuan("Aman")}
          btnText={'Draft'}
          textColor={COLORS.black}
          width={"95%"}
          backgroundColor={'#18DE75'}
          // borderWidth={0.5}
          // borderColor={COLORS.black}
        />
    
      </View> */}



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
  headerTextX: {
    color: "#FFFFFF",
    fontSize: 22,
    fontWeight: "bold",
    marginLeft: 20,
    fontFamily: "GoogleSans-Regular", // Ensure you have this font loaded
    // marginTop: 20,
    marginBottom: 100,
    textAlign: "left",
  },
  headerTextContainer: {
    marginLeft: 20,
    marginBottom: 80,
  },
  headerText: {
    color: "#FFFFFF",
    fontSize: 22,
    fontFamily: "GoogleSans-Regular", // Ensure you have this font loaded
    textAlign: "left",
  },
  boldText: {
    fontWeight: "bold",
    fontFamily: "GoogleSans-Bold", // Ensure you have this font loaded
  },
  card: {
    // backgroundColor: "#21B366",
    width: "95%",
    height: 200,
    position: "absolute",
    marginTop: 120,
    marginLeft: 20,
    // paddingVertical: 5,
    alignItems: "center",
  },
  atas: {
    flexDirection: "row",
    justifyContent: "center",
    // borderWidth: 1,
    // borderColor: "#FFFFFF",
    marginRight: 20,
  },
  atasItem: {
    alignItems: "center",
    // borderWidth: 1,
    // borderColor: "#FFFFFF",
    width: "50%",
    justifyContent: "center",
  },
  stats: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "95%",
    marginTop: 100,
    marginLeft: 10,
    marginRight: 10,
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
    fontWeight: "bold",
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
    // marginLeft: 5,
    alignItems: "center",
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
  listPatrol : {
    alignItems: "center",
    width: "100%",
    
  },buttonPatrol: {
    backgroundColor: "#18DE75",
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 20,
    width: "95%",
    height: 70,
    alignItems: 'center',
    alignSelf: 'center',  // Menengahkan tombol secara horizontal
  },
  buttonPatrol: {
    backgroundColor: "#18DE75",
    borderRadius: 5,
    paddingTop: 25,
    width: "95%",
    height: 70,
    alignItems: 'center',
    alignSelf: 'center',  
  },
});
