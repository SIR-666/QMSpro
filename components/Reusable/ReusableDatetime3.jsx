import { MaterialCommunityIcons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { COLORS } from "../../constants/theme";

const ReusableDatetime2 = ({ date, setDate }) => {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const currentDate = date || new Date();

  useEffect(() => {
    const hour = moment(currentDate).tz("Asia/Jakarta").format("HH");
    
    
  }, [currentDate]);

  const onChangeDate = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      const updatedDate = new Date(selectedDate);
      updatedDate.setHours(currentDate.getHours(), currentDate.getMinutes());
      setDate(updatedDate);
    }
  };

  const onChangeTime = (event, selectedTime) => {
    setShowTimePicker(false);
    if (selectedTime) {
      const now = new Date();
      const selectedHour = moment(selectedTime).format("HH");

     

      if (selectedTime > now || selectedShift !== currentShift) {
        // Jika waktu melebihi sekarang atau tidak sesuai shift, reset ke batas yang benar
        const updatedDate = new Date(date || now);
        updatedDate.setHours(now.getHours(), now.getMinutes());
        setDate(updatedDate);
      } else {
        // Waktu valid, set tanggal dengan waktu yang dipilih
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
