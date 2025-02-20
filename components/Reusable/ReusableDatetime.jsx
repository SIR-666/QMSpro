import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import DateTimePicker from "@react-native-community/datetimepicker";

const ReusableDatetime = ({
  date,
  showDatePicker,
  setShowDatePicker,
  onDateChange,
}) => {
  const currentDate = date || new Date(); // Use current date if 'date' is null
  const [showTimePicker, setShowTimePicker] = useState(false); // For time picker

  const onChange = (event, selectedDate) => {
    setShowDatePicker(false); // Hide date picker after selection
    if (selectedDate) {
      onDateChange(event, selectedDate);
      setShowTimePicker(true); // Open time picker after selecting date
    }
  };

  const onTimeChange = (event, selectedTime) => {
    setShowTimePicker(false); // Hide time picker after selection
    if (selectedTime) {
      onDateChange(event, selectedTime); // Pass the updated time back
    }
  };

  return (
    <View>
      <TouchableOpacity onPress={() => setShowDatePicker(true)}>
        <View
          style={{
            padding: 10,
            borderRadius: 5,
          }}
        >
          <Text>{`${currentDate.toLocaleDateString()} ${currentDate.toLocaleTimeString()}`}</Text>
        </View>
      </TouchableOpacity>

      {/* Date Picker */}
      {showDatePicker && (
        <DateTimePicker
          testID="datePicker"
          value={currentDate}
          mode="date"
          is24Hour={true}
          display="default"
          onChange={onChange}
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
          onChange={onTimeChange}
        />
      )}
    </View>
  );
};

export default ReusableDatetime;
