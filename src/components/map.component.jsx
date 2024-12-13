import React, { useState } from 'react';
import MapView, { Marker } from 'react-native-maps';
import { StyleSheet, View } from 'react-native';
import MapViewDirections from 'react-native-maps-directions';
import { GOOGLE_MAPS_KEY } from '@env'


export default function MapComponent() {

  const [origin, setOrigin] = useState(
    {
      latitude:  -17.3789891,
      longitude: -66.1836978,
    }
  ) 

  const [destination, setDestination] = useState(
    {
      latitude:  -17.378351,
      longitude: -66.183721,
    }
  ) 


  return (
    <View style={styles.container}>
      <MapView 
        style={styles.map} 
        cameraZoomRange={5}
        initialRegion={
          {
            latitude:  -17.3789781,
            longitude: -66.1836868,
            latitudeDelta: 0.09,
            longitudeDelta: 0.04
          }
        }
      >
        <Marker
            coordinate={origin}
            pinColor = {"purple"} // any color
        />
  
        <Marker
            coordinate={destination}
        />
        <MapViewDirections
            origin={origin}
            destination={destination}
            apikey={GOOGLE_MAPS_KEY}
            strokeWidth={8}
        >

        </MapViewDirections>
    </MapView>      
      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: '100%',
  },
});
