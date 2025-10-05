import React, { useCallback, useEffect, useState } from 'react';
import {
  Text,
  ScrollView,
  ImageBackground,
  View,
  Image,
  TouchableOpacity,
} from 'react-native';
import styles from '../HomeScreen/styles';
import axios from 'axios';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useRoute, RouteProp } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment';
import { WeatherResponse, Hour } from '../../types/responseAPIType';
import { cityList } from '../../types/Type';

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

  // Kiem tra de hien thi thoi tiet theo gio
  const checkDay = (day: string | number) => {
    const currenHour = moment(weather?.location?.localtime).format('HH'); //gio cua thanh pho hien tai
    const currentDay = moment(weather?.location?.localtime).format('L'); //ngay cua thanh pho hien tai
    if (moment(day).format('L') === currentDay) {
      if (moment(day).format('HH') >= currenHour) {
        return true;
      } else return false;
    } else {
      if (moment(day).format('HH') < currenHour) {
        return true;
      }
    }
  };

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

  // Vi tri cua nhiet do va do dai thanh nhiet do hien tai
  const minTemp = weather?.forecast?.forecastday
    ? Math.min(...weather?.forecast?.forecastday?.map(d => d.day.mintemp_c))
    : 0;
  const maxTemp = weather?.forecast?.forecastday
    ? Math.max(...weather?.forecast?.forecastday?.map(d => d.day.maxtemp_c))
    : 0;

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
      <View style={styles.viewTitle}>
        <Text style={styles.textAddress}>{weather?.location?.name}</Text>
        <Text style={styles.textTemperature}>
          {renderNumber(weather?.current?.temp_c)}°
        </Text>
        <Text style={styles.textNote}>{weather?.current?.condition?.text}</Text>
        <Text style={styles.textNote}>
          C:{renderNumber(weather?.forecast?.forecastday[0].day.maxtemp_c)}° T:
          {renderNumber(weather?.forecast?.forecastday[0].day.mintemp_c)}°
        </Text>
      </View>
      {/* Details */}
      <ScrollView
        stickyHeaderIndices={[0]}
        style={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {/* Dự báo theo giờ */}
        <View style={styles.detail}>
          <Text style={styles.detailText}>
            Dự báo có mây vào khoảng 14:00. Gió giật lên đến 5m/s.
          </Text>
          <View style={styles.line} />
          <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
            {weatherHour?.map((h, index) => {
              if (checkDay(h?.time))
                return (
                  <View style={styles.detailHour} key={index}>
                    <Text style={styles.textNote}>
                      {moment(h?.time).isSame(
                        moment(weather?.location?.localtime),
                        'hour',
                      )
                        ? 'Bây '
                        : moment(h?.time).format('HH')}
                      giờ
                    </Text>
                    <Image
                      source={{
                        uri: `https:${h?.condition?.icon}`,
                      }}
                      style={styles.icon}
                      resizeMode="cover"
                    />
                    <Text style={styles.textNote}>
                      {renderNumber(h?.temp_c)}°
                    </Text>
                  </View>
                );
            })}
          </ScrollView>
        </View>
        {/* Dự báo 10 ngày */}
        <View style={styles.detailDay}>
          <Text style={styles.detailText}>DỰ BÁO TRONG 10 NGÀY</Text>
          <Text style={styles.line} />
          {weather?.forecast?.forecastday?.map((d, idx) => {
            const day = moment(d?.date).format('dddd');
            const isDay =
              moment(d?.date).format('L') ===
              moment(weather?.location?.localtime).format('L');
            return (
              <View style={styles.detailEveryDay} key={idx}>
                <Text style={styles.textDay}>{day}</Text>
                <Image
                  source={{ uri: `https:${d?.day?.condition?.icon}` }}
                  style={styles.icon}
                  resizeMode="cover"
                />
                <Text style={styles.minTemperature}>
                  {renderNumber(
                    isDay
                      ? weather?.current?.temp_c < d?.day?.mintemp_c
                        ? weather?.current?.temp_c
                        : d?.day?.mintemp_c
                      : d?.day?.mintemp_c,
                  )}
                  °
                </Text>
                <View style={styles.tempBarMax}>
                  <View
                    style={[
                      styles.tempBar,
                      {
                        marginLeft:
                          ((d?.day?.mintemp_c - minTemp) /
                            (maxTemp - minTemp)) *
                          100,
                        width:
                          ((d?.day?.maxtemp_c - d?.day?.mintemp_c) /
                            (maxTemp - minTemp)) *
                          100,
                      },
                    ]}
                  >
                    {moment(d?.date).format('L') ===
                    moment(weather?.location?.localtime).format('L') ? (
                      <Image
                        source={require('../../../img/dot.png')}
                        style={[
                          styles.curTempIcon,
                          {
                            marginLeft:
                              ((weather?.current?.temp_c - minTemp) /
                                (maxTemp - minTemp)) *
                              100,
                          },
                        ]}
                      />
                    ) : null}
                  </View>
                </View>
                <Text style={styles.maxTemperature}>
                  {renderNumber(
                    isDay
                      ? weather?.current?.temp_c > d?.day?.maxtemp_c
                        ? weather?.current?.temp_c
                        : d?.day?.maxtemp_c
                      : d?.day?.maxtemp_c,
                  )}
                  °
                </Text>
              </View>
            );
          })}
        </View>
      </ScrollView>
    </ImageBackground>
  );
};

export default HomeModal;
