import React, { useCallback, useEffect, useState } from 'react';
import { ScrollView, ImageBackground, View, Dimensions } from 'react-native';
import styles from './styles';
import axios from 'axios';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { WeatherResponse, Hour } from '../../types/responseAPIType';
import moment from 'moment';
import { RouteProp, useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { cityList } from '../../types/Type';
import WeatherTitle from '../../components/WeatherTitle';
import HourlyForecast from '../../components/HourlyForecast';
import DailyForecast from '../../components/DailyForecast';
import Footer from '../../components/Footer';

type RootStackParamList = {
  HomeScreen: { item?: cityList };
  ListScreen: { city?: cityList } | undefined;
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
  const [cities, setCities] = useState<cityList[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [refresh, setRefresh] = useState(true);

  const screenWidth = Dimensions.get('window').width;

  //Get Weather by nameCity
  const fetchWeather = useCallback(
    async (name: string) => {
      try {
        if (!refresh) {
          const cached = await AsyncStorage.getItem(`weather_${name}`);
          if (cached) {
            const parsed = JSON.parse(cached);
            setWeather(parsed.weather);
            setWeatherHour(parsed.weatherHour);
            return;
          }
        }

        // Call API
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
        // Lưu cache
        await AsyncStorage.setItem(
          `weather_${name}`,
          JSON.stringify({
            weather: res.data,
            weatherHour: dataWeather,
          }),
        );
      } catch (err) {
        console.error('Lỗi tải dữ liệu thời tiết:', err);
      }
    },
    [refresh],
  );

  const scrollRef = React.useRef<ScrollView>(null);
  const loadNameCity = useCallback(() => {
    try {
      const nameCity = route?.params?.item?.name;
      const idx = cities.findIndex(c => c.name === route.params?.item?.name);

      if (!nameCity) {
        setCurrentIndex(0);
        return fetchWeather('Hanoi');
      }
      if (idx >= 0) {
        setCurrentIndex(idx);
        scrollRef.current?.scrollTo({
          x: idx * screenWidth,
          animated: false,
        });
        return fetchWeather(nameCity);
      }
    } catch (err) {
      console.error('Loi khi tai du lieu:', err);
    }
  }, [route.params?.item?.name, cities, fetchWeather, screenWidth]);

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
        } else
          setCities([
            {
              id: 2718413,
              name: 'Hanoi',
              country: 'Vietnam',
              temp_c: 36,
              temp_f: 126,
              mintemp_c: 30,
              maxtemp_c: 60,
              note: 'string',
              time: moment().toDate(),
            },
          ]);
      } catch (err) {
        console.error('Lỗi khi load city:', err);
      }
    };
    loadCities();
  }, []);

  // Lam tron nhiet do
  const renderNumber = (value: number | undefined) => {
    if (value) return Math.round(value);
    return '--';
  };

  // Anh nen
  const imageBackground = require('../../../img/hinh-nen-bau-troi-xanh_(6).jpg');

  return (
    <ScrollView
      ref={scrollRef}
      horizontal
      pagingEnabled
      showsHorizontalScrollIndicator={false}
      style={styles.scrollHorizontal}
      onMomentumScrollEnd={e => {
        const index = Math.round(e.nativeEvent.contentOffset.x / screenWidth);
        setCurrentIndex(index);
        setRefresh(false);
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
            <WeatherTitle weather={weather} renderNumber={renderNumber} />
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
            <Footer
              cities={cities}
              currentIndex={currentIndex}
              navigation={navigation}
            />
          </ImageBackground>
        </View>
      ))}
    </ScrollView>
  );
};

export default HomeScreen;
