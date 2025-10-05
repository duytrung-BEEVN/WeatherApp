import React, { useCallback, useEffect, useState } from 'react';
import {
  Text,
  ScrollView,
  ImageBackground,
  View,
  TouchableOpacity,
} from 'react-native';
import styles from '../HomeScreen/styles';
import axios from 'axios';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useRoute, RouteProp } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { WeatherResponse, Hour } from '../../types/responseAPIType';
import { cityList } from '../../types/Type';
import WeatherTitle from '../../components/WeatherTitle';
import HourlyForecast from '../../components/HourlyForecast';
import DailyForecast from '../../components/DailyForecast';

type RootStackParamList = {
  ListScreen: { city: cityList };
  HomeModal: { city: cityList };
};

type MainScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'HomeModal'
>;

// HomeModal
const HomeModal = ({
  navigation,
}: {
  navigation: MainScreenNavigationProp;
}) => {
  // Hook
  const [weatherHour, setWeatherHour] = useState<Hour[]>();
  const [weather, setWeather] = useState<WeatherResponse>();
  const route = useRoute<HomeModalRouteProp>();

  // Hien thi Modal
  type HomeModalRouteProp = RouteProp<RootStackParamList, 'HomeModal'>;
  const { city } = route.params;

  //Call API Weather
  const fetchWeather = useCallback(async () => {
    try {
      const res = await axios.get(
        `https://api.weatherapi.com/v1/forecast.json`,
        {
          params: {
            q: city.name,
            days: '10',
            lang: 'vi',
            key: 'ec1878bf2e944f7fb5584057252309',
          },
        },
      );
      const data = res?.data?.forecast?.forecastday;
      const weather_today = data?.[0]?.hour ?? [];
      const weather_nextday = data?.[1]?.hour ?? [];
      const dataWeather = [...weather_today, ...weather_nextday];

      setWeatherHour(dataWeather);
      setWeather(res?.data);
    } catch (err) {
      console.error('Loi tai du lieu thoi tiet:', err);
    }
  }, [city.name]);

  useEffect(() => {
    fetchWeather();
  }, [fetchWeather]);

  // Lam tron sau dau phay
  const renderNumber = (value: number | undefined) => {
    if (value) return Math.round(value);
    return '--';
  };

  // Them du lieu thoi tiet cua thanh pho
  const addCityWeather = async () => {
    try {
      const storedCities = await AsyncStorage.getItem('cities');
      // eslint-disable-next-line @typescript-eslint/no-shadow
      const cityList: cityList[] = storedCities ? JSON.parse(storedCities) : [];
      const exists = cityList.some(c => c.name === city.name);
      if (!exists) {
        cityList.push(city);
        await AsyncStorage.setItem('cities', JSON.stringify(cityList));
        navigation.navigate('ListScreen', { city });
      }
      navigation.goBack();
    } catch (error) {
      console.error('Lỗi khi thêm city:', error);
    }
  };

  // Anh nen cua tung thanh pho
  const imageBackground = require('../../../img/hinh-nen-bau-troi-xanh_(6).jpg');

  return (
    <ImageBackground
      source={imageBackground}
      resizeMode="cover"
      style={styles.imageBackground}
    >
      {/* Modal */}
      <View style={styles.headerModal}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.textHeaderModal}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={async () => await addCityWeather()}>
          <Text style={styles.textHeaderModal}>Add</Text>
        </TouchableOpacity>
      </View>
      {/* Tittle */}
      <WeatherTitle weather={weather} renderNumber={renderNumber} />
      {/* Details */}
      <ScrollView
        // stickyHeaderIndices={[0]}
        style={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {/* Dự báo theo giờ */}
        <HourlyForecast weather={weather} weatherHour={weatherHour} />
        {/* Dự báo 10 ngày */}
        <DailyForecast weather={weather} renderNumber={renderNumber} />
      </ScrollView>
    </ImageBackground>
  );
};

export default HomeModal;
