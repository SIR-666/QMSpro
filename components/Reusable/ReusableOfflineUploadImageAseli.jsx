import React, { useState } from "react";
import { View, TouchableOpacity, Image, StyleSheet } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { COLORS } from "../../constants/theme";

const ReusableOfflineUploadImage = ({ onImageSelected }) => {
  const [imageUri, setImageUri] = useState(null);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
      onImageSelected(result.assets[0].uri);
    }
  };

  const takePhoto = async () => {
    const cameraPermission = await ImagePicker.requestCameraPermissionsAsync();
    if (!cameraPermission.granted) {
      alert("Permission to access camera was denied");
      return;
    }

    let cameraResult = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 1,
    });

    if (!cameraResult.canceled) {
      const newImageUri = cameraResult.assets[0].uri;
      setImageUri(newImageUri);
      onImageSelected(newImageUri);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={takePhoto} style={styles.iconButton}>
        <MaterialCommunityIcons
          name="camera"
          size={24}
          color={COLORS.lightBlue}
        />
      </TouchableOpacity>
      <TouchableOpacity onPress={pickImage} style={styles.iconButton}>
        {imageUri ? (
          <Image source={{ uri: imageUri }} style={styles.image} />
        ) : (
          <MaterialCommunityIcons
            name="file-upload"
            size={24}
            color={COLORS.lightBlue}
          />
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconButton: {
    marginHorizontal: 5,
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 5,
    resizeMode: "cover",
  },
});

export default ReusableOfflineUploadImage;
