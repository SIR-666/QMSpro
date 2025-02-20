import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
  Button,
  Pressable,
  Platform,
} from "react-native";
import styles from "./signin.style";
import React, { useState } from "react";
import DateTimePicker from "@react-native-community/datetimepicker";
import { COLORS, SIZES, TEXT } from "../../constants/theme";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import {
  WidthSpacer,
  HeightSpacer,
  ReusableBtn,
  AppBar,
} from "../../components";

const ReusableDatetime = ({
  date,
  showDatePicker,
  setShowDatePicker,
  onDateChange,
}) => {
  const currentDate = date || new Date(); // Use current date if 'date' is null

  return (
    <View>
      {/* Component Text yang dapat diklik */}
      <TouchableOpacity onPress={() => setShowDatePicker(true)}>
        <View
          style={{
            padding: 10,
            //   backgroundColor: "#e0e0e0",
            borderRadius: 5,
          }}
        >
          <Text>{`${currentDate.toDateString()}`}</Text>
          {/* <Text>{`Selected Date: `}</Text> */}
        </View>
      </TouchableOpacity>

      {/* Component DateTimePicker yang muncul saat di-klik */}
      {showDatePicker && (
        <DateTimePicker
          testID="dateTimePicker"
          value={currentDate}
          mode="date"
          is24Hour={true}
          display="default"
          onChange={onDateChange}
        />
      )}
    </View>
  );
};

export default ReusableDatetime;
