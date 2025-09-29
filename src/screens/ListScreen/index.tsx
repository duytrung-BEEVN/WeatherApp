/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable react-native/no-inline-styles */
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ImageBackground,
  TextInput,
  FlatList,
} from 'react-native';
import styles from './styles';
import Popover from 'react-native-popover-view';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import axios from 'axios';
import { debounce } from 'lodash';
import moment from 'moment';
import AsyncStorage from '@react-native-async-storage/async-storage';

type citySearchList = {
  id: number;
  name: string;
  region: string;
  country: string;
};
type cityList = {
  id: number;
  name: string;
  country: string;
  time: Date;
  temp_c: number;
  temp_f: number;
  maxtemp_c: number;
  mintemp_c: number;
  note: string;
};
type RootStackParamList = {
  HomeScreen: { item: cityList };
  ListScreen: { city: cityList };
  HomeModal: { city: citySearchList };
};
type NavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'ListScreen'
>;
const ListScreen = () => {
  //Hook
  const [searchCity, setSearchCity] = useState<citySearchList[]>([]);
  const [city, setCity] = useState<cityList[]>([]);
  const [showPopover, setShowPopover] = useState(false);
  const [unit, setUnit] = useState('C');
  const [keyword, setKeyword] = useState('');
  const navigation = useNavigation<NavigationProp>();
  const [isEditing, setIsEditing] = useState(false);

  // Call API Search
  const fetchSearchCity = async (key: string) => {
    if (key === '') {
      setSearchCity([]);
      return null;
    }
    try {
      const res = await axios.get(`https://api.weatherapi.com/v1/search.json`, {
        params: {
          q: key,
          key: 'ec1878bf2e944f7fb5584057252309',
        },
      });
      setSearchCity(res?.data);
    } catch (err) {
      console.error('Loi tai du lieu thoi tiet:', err);
    }
  };
  const searchText = (text: string) => {
    setKeyword(text);
    debounceDropDown(text);
  };
  const debounceDropDown = useRef(
    debounce(nextValue => fetchSearchCity(nextValue), 300),
  ).current;

  // Lay cities tu AsyncStorage
  const loadCitiesFromStorage = useCallback(async () => {
    try {
      const storedCities = await AsyncStorage.getItem('cities');
      let cities: cityList[] = storedCities ? JSON.parse(storedCities) : [];

      if (cities.length === 0) {
        const response = await axios.get(
          `https://api.weatherapi.com/v1/forecast.json`,
          {
            params: {
              q: 'Hanoi',
              days: '1',
              lang: 'vi',
              key: 'ec1878bf2e944f7fb5584057252309',
            },
          },
        );

        const data = response?.data;
        const hanoiCity: cityList = {
          id: Date.now(),
          name: data?.location?.name,
          country: data?.location?.country,
          time: new Date(data?.location?.localtime),
          temp_c: data?.current?.temp_c,
          temp_f: data?.current?.temp_f,
          maxtemp_c: data?.forecast?.forecastday?.[0]?.day.maxtemp_c,
          mintemp_c: data?.forecast?.forecastday?.[0]?.day.mintemp_c,
          note: data?.current?.condition?.text,
        };

        cities = [hanoiCity];
        await AsyncStorage.setItem('cities', JSON.stringify(cities));
      }

      setCity([]);
      for (const c of cities) {
        await fetchListCityWeather(c.name);
      }
    } catch (err) {
      console.error('Lỗi khi load cities từ storage:', err);
    }
  }, []);

  // Call API Weather
  const fetchListCityWeather = async (name: string) => {
    try {
      const response = await axios.get(
        `https://api.weatherapi.com/v1/forecast.json`,
        {
          params: {
            q: name,
            days: '1',
            lang: 'vi',
            key: 'ec1878bf2e944f7fb5584057252309',
          },
        },
      );
      const data = response?.data;
      const newCity: cityList = {
        id: Date.now(),
        name: data.location.name,
        country: data.location.country,
        time: new Date(data.location.localtime),
        temp_c: data.current.temp_c,
        temp_f: data.current.temp_f,
        maxtemp_c: data.forecast.forecastday[0].day.maxtemp_c,
        mintemp_c: data.forecast.forecastday[0].day.mintemp_c,
        note: data.current.condition.text,
      };
      setCity(prev => [...prev, newCity]);
    } catch (err) {
      console.error('Loi load du lieu: ', err);
    }
  };

  // Sua danh sach
  const editListCity = () => {
    setIsEditing(prev => !prev);
  };

  // Chuyen doi nhiet do C-F
  const convertTemperature = (tempC: number) => {
    if (unit === 'C') {
      return `${Math.round(tempC)}°`;
    } else {
      return `${Math.round((tempC * 9) / 5 + 32)}°`;
    }
  };

  // Anh nen
  const imageBackground = require('../../../img/hinh-nen-bau-troi-xanh_(6).jpg');

  const clearText = () => {
    setKeyword('');
    setSearchCity([]);
  };

  // Xoa thanh pho
  const deleteCity = async (id: number) => {
    try {
      const updated = city.filter(item => item.id !== id);
      setCity(updated);
      await AsyncStorage.setItem('cities', JSON.stringify(updated));
    } catch (err) {
      console.error('Loi tai du lieu: ', err);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      setCity([]);
      loadCitiesFromStorage();
    });
    return unsubscribe;
  }, [loadCitiesFromStorage, navigation]);

  // eslint-disable-next-line react/no-unstable-nested-components
  const Item = (item: cityList) => {
    return (
      <View
        style={
          isEditing && item.name !== 'Hanoi'
            ? styles.viewListEdit
            : styles.viewList
        }
      >
        {isEditing && item.name !== 'Hanoi' && (
          <TouchableOpacity
            style={styles.buttonDelete}
            onPress={() => deleteCity(item.id)}
          >
            <Text style={styles.textCancel}>X</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          disabled={isEditing}
          onPress={() => navigation.navigate('HomeScreen', { item })}
          style={styles.viewImageBackground}
        >
          <ImageBackground
            source={imageBackground}
            resizeMode="cover"
            style={styles.imageBackground}
          >
            <View style={styles.detail}>
              <View>
                <Text style={styles.address}>{item?.name}</Text>
                <Text style={styles.time}>
                  {moment(item?.time).format('HH:mm')}
                </Text>
              </View>
              <Text style={styles.textNote}>{item?.note}</Text>
            </View>
            <View style={styles.detail}>
              <Text style={styles.temperature}>
                {convertTemperature(item.temp_c)}
              </Text>
              <Text style={styles.textNote}>
                C:{convertTemperature(item.maxtemp_c)}
                T:{convertTemperature(item.mintemp_c)}
              </Text>
            </View>
          </ImageBackground>
        </TouchableOpacity>
        {isEditing && item.name !== 'Hanoi' && (
          <TouchableOpacity style={styles.iconMenu}>
            <Image
              source={require('../../../img/menu.png')}
              style={styles.iconMenu}
            />
          </TouchableOpacity>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {isEditing ? (
        <TouchableOpacity
          style={styles.buttonDone}
          onPress={() => setIsEditing(false)}
        >
          <Text style={styles.textDone}>Xong</Text>
        </TouchableOpacity>
      ) : (
        <Popover
          popoverStyle={styles.popoverContainer}
          isVisible={showPopover}
          onRequestClose={() => setShowPopover(false)}
          arrowSize={{ width: 0, height: 0 }}
          from={
            <TouchableOpacity
              style={styles.viewIcon}
              onPress={() => setShowPopover(true)}
            >
              <Image
                source={require('../../../img/more.png')}
                style={styles.icon}
              />
            </TouchableOpacity>
          }
        >
          <View style={styles.viewPopover}>
            <TouchableOpacity
              style={styles.popoverItem}
              onPress={() => {
                setShowPopover(false);
                editListCity();
              }}
            >
              <Text style={styles.menuItem}>Sửa danh sách</Text>
              <Image
                source={require('../../../img/pencil.png')}
                style={styles.iconPopover}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.popoverItem}
              onPress={() => setShowPopover(false)}
            >
              <Text style={styles.menuItem}>Thông báo</Text>
              <Image
                style={styles.iconPopover}
                source={require('../../../img/notification.png')}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.popoverItem}
              onPress={() => {
                setUnit('C');
                setShowPopover(false);
              }}
            >
              <Text style={styles.menuItem}>Độ C</Text>
              <Text style={styles.menuItem}>°C</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.popoverItem}
              onPress={() => {
                setUnit('F');
                setShowPopover(false);
              }}
            >
              <Text style={styles.menuItem}>Độ F</Text>
              <Text style={styles.menuItem}>F</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.popoverItem}
              onPress={() => setShowPopover(false)}
            >
              <Text style={styles.menuItem}>Báo cáo sự cố</Text>
              <Image
                style={styles.iconPopover}
                source={require('../../../img/warning.png')}
              />
            </TouchableOpacity>
          </View>
        </Popover>
      )}
      <Text style={styles.title}>Thời tiết</Text>
      <View style={styles.searchContainer}>
        {/* Icon Search */}
        <TouchableOpacity>
          <Image
            source={require('../../../img/search-interface-symbol.png')}
            style={styles.iconSearch}
          />
        </TouchableOpacity>
        {/* Text Input */}
        <TextInput
          style={styles.textInput}
          value={keyword}
          onChangeText={text => searchText(text)}
          placeholder="Tìm tên thành phố/sân bay"
          placeholderTextColor="#dfdbdbff"
        />
        {/* Icon Cancel */}
        <TouchableOpacity
          style={{ backgroundColor: 'red' }}
          onPress={clearText}
        >
          <Text style={styles.textCancel}>X</Text>
        </TouchableOpacity>
      </View>
      {searchCity?.map((city, index) => (
        <View style={styles.cityListSearch} key={index}>
          <TouchableOpacity
            onPress={() => {
              // eslint-disable-next-line no-sequences
              navigation.navigate('HomeModal', { city }), clearText();
            }}
          >
            <Text style={styles.listCity}>
              {city?.name}, {city?.country}
            </Text>
          </TouchableOpacity>
        </View>
      ))}
      <FlatList
        style={styles.listAddress}
        data={city}
        renderItem={({ item }) => Item(item)}
        keyExtractor={item => item.id.toString()}
        // eslint-disable-next-line react/no-unstable-nested-components
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

export default ListScreen;
