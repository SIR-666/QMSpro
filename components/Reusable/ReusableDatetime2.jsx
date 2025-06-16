import { MaterialCommunityIcons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { COLORS } from "../../constants/theme";

const ReusableDatetime2 = ({ date, setDate, onChange }) => {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const currentDate = date || new Date();

  const onChangeDate = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      const oldDate = date || new Date();
      const updatedDate = new Date(selectedDate);
      updatedDate.setHours(oldDate.getHours(), oldDate.getMinutes());
      setDate(updatedDate);
      onChange?.(updatedDate); // panggil onChange dan kirim updatedDate
    }
  };

  const onChangeTime = (event, selectedTime) => {
    setShowTimePicker(false);
    if (selectedTime) {
      const oldDate = date || new Date();
      const updatedDate = new Date(oldDate);
      updatedDate.setHours(selectedTime.getHours(), selectedTime.getMinutes());
      setDate(updatedDate);
      onChange?.(updatedDate); // panggil onChange dan kirim updatedDate
    }
  };

  return (
    <View style={styles.container}>
      {/* Pilih Tanggal */}
      <TouchableOpacity
        onPress={() => setShowDatePicker(true)}
        style={styles.inputBox}
      >
        <MaterialCommunityIcons
          name="calendar-range"
          size={20}
          color={COLORS.lightBlue}
        />
        <Text style={styles.text}>{currentDate.toLocaleDateString()}</Text>
      </TouchableOpacity>

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
            hour12: false,
          })}
        </Text>
      </TouchableOpacity>

      {/* Date Picker */}
      {showDatePicker && (
        <DateTimePicker
          testID="datePicker"
          value={currentDate}
          mode="date"
          is24Hour={true}
          display="default"
          onChange={onChangeDate}
        />
      )}

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

export default ReusableDatetime2;
