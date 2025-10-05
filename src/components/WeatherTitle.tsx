/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { View, Text } from 'react-native';
import styles from '../screens/HomeScreen/styles';
import { WeatherResponse } from '../types/responseAPIType';

type WeatherTitleProps = {
  weather?: WeatherResponse;
  renderNumber: (value: number | undefined) => number | string;
};

const WeatherTitle = ({ weather, renderNumber }: WeatherTitleProps) => {
  return (
    <View style={styles.viewTitle}>
      {weather?.location?.name === 'Hanoi' ? (
        <View style={{ height: 50 }}>
          <Text style={styles.textAddress}>Vị trí của tôi</Text>
          <Text style={styles.textMyLocation}>Hanoi</Text>
        </View>
      ) : (
        <Text style={styles.textAddress}>{weather?.location?.name}</Text>
      )}
      <Text style={styles.textTemperature}>
        {renderNumber(weather?.current?.temp_c)}°
      </Text>
      <Text style={styles.textNote}>{weather?.current?.condition?.text}</Text>
      <Text style={styles.textNote}>
        C: {renderNumber(weather?.forecast?.forecastday?.[0]?.day?.maxtemp_c)}°
        T: {renderNumber(weather?.forecast?.forecastday?.[0]?.day?.mintemp_c)}°
      </Text>
    </View>
  );
};

export default WeatherTitle;
