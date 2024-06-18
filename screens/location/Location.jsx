import React from 'react';
import { StyleSheet } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import fetchUserLocation from '../../hook/fetchLocation';

const Location = () => {
  const {location, errorMsg} = fetchUserLocation();
  
  const coordinates = {
    latitude: 35.6855,
    longitude: 139.68884,  
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
    title: "My Location"
  };

  return (
    <MapView initialRegion={coordinates} style={styles.mapStyle}>
      {location === null && (
         <Marker coordinate={coordinates} title={coordinates.title}/>
      )}
        <Marker coordinate={location} title={"My location"}/>
    </MapView>
  );
}

export default Location;

const styles = StyleSheet.create({
  mapStyle: {
    width: "100%",
    height: "100%"
  }
});