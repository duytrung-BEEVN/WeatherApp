/* eslint-disable react-native/no-inline-styles */
import React, { useCallback, useEffect, useState } from 'react';
import {
  Text,
  ScrollView,
  ImageBackground,
  View,
  Image,
  TouchableOpacity,
} from 'react-native';
import styles from './styles';
import axios from 'axios';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { WeatherResponse, Hour } from '../../../responseAPIType';
import moment from 'moment';
import { RouteProp, useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Dimensions } from 'react-native';

type RootStackParamList = {
  HomeScreen: { item?: ItemProps };
  ListScreen: { city?: ItemProps } | undefined;
};
type ItemProps = {
  id: number;
  name: string;
  country: string;
  time: string;
  temp_c: number;
  min_temp: number;
  max_temp: number;
  note: string;
};

type NavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'HomeScreen'
>;
type HomeModalRouteProp = RouteProp<RootStackParamList, 'HomeScreen'>;

const HomeScreen = ({ navigation }: { navigation: NavigationProp }) => {
  // Hook
  const [weatherHour, setWeatherHour] = useState<Hour[]>();
  const [weather, setWeather] = useState<WeatherResponse>();
  const route = useRoute<HomeModalRouteProp>();
  const [cities, setCities] = useState<ItemProps[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const screenWidth = Dimensions.get('window').width;

  //Call API Weather by nameCity
  const fetchWeather = async (name: string) => {
    try {
      const cached = await AsyncStorage.getItem(`weather_${name}`);
      if (cached) {
        const parsed = JSON.parse(cached);
        setWeather(parsed.weather);
        setWeatherHour(parsed.weatherHour);
        return;
      }
      const res = await axios.get(
        `https://api.weatherapi.com/v1/forecast.json`,
        {
          params: {
            q: name,
            days: '10',
            lang: 'vi',
            key: 'ec1878bf2e944f7fb5584057252309',
          },
        },
      );
      const weather1 = res?.data?.forecast?.forecastday?.[0]?.hour ?? [];
      const weather2 = res?.data?.forecast?.forecastday?.[1]?.hour ?? [];
      const dataWeather = [...weather1, ...weather2];

      setWeatherHour(dataWeather);
      setWeather(res?.data);

      await AsyncStorage.setItem(
        `weather_${name}`,
        JSON.stringify({ weather: res.data, weatherHour: dataWeather }),
      );
    } catch (err) {
      console.error('Loi tai du lieu thoi tiet:', err);
    }
  };

  const loadNameCity = useCallback(() => {
    try {
      const nameCity = route?.params?.item?.name;
      const idx = cities.findIndex(c => c.name === route.params?.item?.name);
      if (!nameCity || nameCity === '') {
        setCurrentIndex(0);
        return fetchWeather('Hanoi');
      }
      setCurrentIndex(idx);
      return fetchWeather(nameCity);
    } catch (err) {
      console.error('Loi khi tai du lieu:', err);
    }
  }, [route?.params?.item?.name, cities]);

  useEffect(() => {
    loadNameCity();
  }, [loadNameCity]);

  // Load city from Async
  useEffect(() => {
    const loadCities = async () => {
      try {
        const storedCities = await AsyncStorage.getItem('cities');
        if (storedCities) {
          setCities(JSON.parse(storedCities));
        }
      } catch (err) {
        console.error('Lỗi khi load city:', err);
      }
    };
    loadCities();
  }, []);

  // Kiem tra thoi gian de hien thi thoi tiet theo thoi gian hien tai
  const checkDay = (day: string | number) => {
    const currenHour = moment(weather?.location?.localtime).format('HH');
    const currentDay = moment().format('L');
    if (moment(day).format('L') === currentDay) {
      if (moment(day).format('HH') >= currenHour) {
        return true;
      } else return false;
    } else {
      if (moment(day).format('HH') <= currenHour) {
        return true;
      }
    }
  };

  // Lam tron nhiet do
  const renderNumber = (value: number | undefined) => {
    if (value) return Math.round(value);
    return '--';
  };

  // Anh nen
  const imageBackground = require('../../../img/hinh-nen-bau-troi-xanh_(6).jpg');

  return (
    <ScrollView
      horizontal
      pagingEnabled
      showsHorizontalScrollIndicator={false}
      style={styles.scrollHorizontal}
      onMomentumScrollEnd={e => {
        const index = Math.round(e.nativeEvent.contentOffset.x / screenWidth);
        setCurrentIndex(index);
        fetchWeather(cities[index].name);
      }}
    >
      {cities.map(c => (
        <View key={c.id} style={styles.page}>
          <ImageBackground
            source={imageBackground}
            resizeMode="cover"
            style={styles.imageBackground}
          >
            <View style={styles.viewTitle}>
              {weather?.location?.name === 'Hanoi' ? (
                <View>
                  <Text style={styles.textAddress}>Vị trí của tôi</Text>
                  <Text
                    style={{
                      color: 'white',
                      textAlign: 'center',
                      fontWeight: 'bold',
                      fontSize: 20,
                    }}
                  >
                    Hanoi
                  </Text>
                </View>
              ) : (
                <Text style={styles.textAddress}>
                  {weather?.location?.name}
                </Text>
              )}
              <Text style={styles.textTemperature}>
                {renderNumber(weather?.current?.temp_c)}°
              </Text>
              <Text style={styles.textNote}>
                {weather?.current?.condition?.text}
              </Text>
              <Text style={styles.textNote}>
                C:
                {renderNumber(
                  weather?.forecast?.forecastday?.[0]?.day?.maxtemp_c,
                )}
                ° T:
                {renderNumber(
                  weather?.forecast?.forecastday?.[0]?.day?.mintemp_c,
                )}
                °
              </Text>
            </View>
            <ScrollView
              style={styles.container}
              showsVerticalScrollIndicator={false}
            >
              {/* Dự báo theo giờ */}
              <View style={styles.detail}>
                <Text style={styles.detailText}>
                  Dự báo có mây vài nơi vào khoảng 21:00.
                </Text>
                <View style={styles.line} />
                <ScrollView
                  horizontal={true}
                  showsHorizontalScrollIndicator={false}
                >
                  {weatherHour?.map((h, index) => {
                    const hour = moment(h?.time).format('HH');
                    if (checkDay(h?.time))
                      return (
                        <View style={styles.detailHour} key={index}>
                          <Text style={styles.textNote}>
                            {hour === moment().format('HH') ? 'Bây' : hour} giờ
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
                {weather?.forecast?.forecastday?.slice(0, 10).map((d, idx) => {
                  const day = moment(d?.date).format('dddd');
                  return (
                    <View style={styles.detailEveryDay} key={idx}>
                      <Text style={styles.textDay}>{day}</Text>
                      <Image
                        source={{ uri: `https:${d?.day?.condition?.icon}` }}
                        style={styles.icon}
                        resizeMode="cover"
                      />
                      <Text style={styles.minTemperature}>
                        {renderNumber(d?.day?.mintemp_c)}°
                      </Text>
                      <Text style={styles.line} />
                      <Text style={styles.maxTemperature}>
                        {renderNumber(d?.day?.maxtemp_c)}°
                      </Text>
                    </View>
                  );
                })}
              </View>
            </ScrollView>
            <View style={styles.footer}>
              <Image
                source={require('../../../img/map.png')}
                style={styles.iconFooterSelected}
              />
              <View style={{ flexDirection: 'row' }}>
                {cities.map((c, idx) => {
                  if (idx === 0) {
                    return (
                      <Image
                        key={idx}
                        source={require('../../../img/right-arrow.png')}
                        style={
                          idx === currentIndex
                            ? styles.iconFooterSelected
                            : styles.iconFooter ?? styles.iconFooter
                        }
                      />
                    );
                  } else {
                    return (
                      <Image
                        key={idx}
                        source={require('../../../img/dot.png')}
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
                  source={require('../../../img/list.png')}
                  style={styles.iconFooterSelected}
                />
              </TouchableOpacity>
            </View>
          </ImageBackground>
        </View>
      ))}
    </ScrollView>
  );
};

export default HomeScreen;
