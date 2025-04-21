import { MaterialCommunityIcons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import moment from "moment";
import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { COLORS } from "../../constants/theme";

const ReusableDatetime3 = ({ date, setDate }) => {
  const [showTimePicker, setShowTimePicker] = useState(false);

  const currentDate = date || new Date();

  const onChangeTime = (event, selectedTime) => {
    setShowTimePicker(false);
    if (selectedTime) {
      const updatedDate = new Date(currentDate);
      updatedDate.setHours(selectedTime.getHours(), selectedTime.getMinutes());
      setDate(updatedDate);
    }
  };

  return (
    <View style={styles.container}>
      {/* Pilih Jam */}
      <TouchableOpacity
        onPress={() => setShowTimePicker(true)}
        style={styles.inputBox}
      >
        <MaterialCommunityIcons
          name="clock-outline"
          size={20}
          color={COLORS.lightBlue}
        />
        <Text style={styles.text}>{moment(currentDate).format("HH:mm")}</Text>
      </TouchableOpacity>

      {/* Time Picker */}
      {showTimePicker && (
        <DateTimePicker
          value={currentDate}
          mode="time"
          is24Hour={true}
          display="default"
          onChange={onChangeTime}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  inputBox: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 5,
    flex: 1,
  },
  text: {
    marginLeft: 10,
    fontSize: 16,
  },
});

export default ReusableDatetime3;
