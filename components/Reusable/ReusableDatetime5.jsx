import { MaterialCommunityIcons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { COLORS } from "../../constants/theme";

const TimeOnlyPicker = ({ date, setDate }) => {
  const [showTimePicker, setShowTimePicker] = useState(false);
  const currentDate = date || new Date();

  const onChangeTime = (event, selectedTime) => {
    setShowTimePicker(false);
    if (selectedTime) {
      const now = new Date();
      if (selectedTime > now) {
        const updatedDate = new Date(date || now);
        updatedDate.setHours(now.getHours(), now.getMinutes());
        setDate(updatedDate);
      } else {
        const updatedDate = new Date(date || new Date());
        updatedDate.setHours(
          selectedTime.getHours(),
          selectedTime.getMinutes()
        );
        setDate(updatedDate);
      }
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
          name="clock-time-four-outline"
          size={20}
          color={COLORS.lightBlue}
        />
        <Text style={styles.text}>
          {currentDate.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </Text>
      </TouchableOpacity>

      {/* Time Picker */}
      {showTimePicker && (
        <DateTimePicker
          testID="timePicker"
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

export default TimeOnlyPicker;
