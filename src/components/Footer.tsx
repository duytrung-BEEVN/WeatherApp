/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { Image, TouchableOpacity, View } from 'react-native';
import styles from '../screens/HomeScreen/styles';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { cityList } from '../types/Type';

type RootStackParamList = {
  HomeScreen: { item?: cityList };
  ListScreen: { city?: cityList } | undefined;
};

type Props = {
  cities: cityList[];
  currentIndex: number;
  navigation: NativeStackNavigationProp<RootStackParamList, 'HomeScreen'>;
};

const Footer = ({ cities, currentIndex, navigation }: Props) => {
  return (
    <View style={styles.footer}>
      <Image
        source={require('../../img/map.png')}
        style={styles.iconFooterSelected}
      />
      <View style={{ flexDirection: 'row' }}>
        {cities.map((c, idx) => {
          if (idx === 0) {
            return (
              <Image
                key={idx}
                source={require('../../img/right-arrow.png')}
                style={
                  idx === currentIndex
                    ? styles.iconFooterSelected
                    : styles.iconFooter
                }
              />
            );
          } else {
            return (
              <Image
                key={idx}
                source={require('../../img/dot.png')}
                style={
                  idx === currentIndex
                    ? styles.iconFooterSelected
                    : styles.iconFooter
                }
              />
            );
          }
        })}
      </View>
      <TouchableOpacity
        onPress={() => {
          navigation.navigate('ListScreen');
        }}
      >
        <Image
          source={require('../../img/list.png')}
          style={styles.iconFooterSelected}
        />
      </TouchableOpacity>
    </View>
  );
};

export default Footer;
