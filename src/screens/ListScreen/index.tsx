/* eslint-disable @typescript-eslint/no-shadow */
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  TextInput,
  FlatList,
} from 'react-native';
import styles from './styles';
import Popover from 'react-native-popover-view';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import axios from 'axios';
import { debounce } from 'lodash';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ButtonActionPopover from '../../components/ButtonActionPopover';
import { cityList, citySearchList } from '../../types/Type';
import CityItem from '../../components/CityItem';

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

  // Get cities from AsyncStorage
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

  // Edit List
  const editListCity = () => {
    setIsEditing(prev => !prev);
  };

  // Change temperature C-F
  const changeTemp = (tempC: number) => {
    if (unit === 'C') {
      return `${Math.round(tempC)}°`;
    } else {
      return `${Math.round((tempC * 9) / 5 + 32)}°`;
    }
  };

  // Clear Text on TextInput
  const clearText = () => {
    setKeyword('');
    setSearchCity([]);
  };

  // Delete City
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

  // Action Popover
  const onEditList = () => {
    setShowPopover(false);
    editListCity();
  };

  const onSetCelsius = () => {
    setUnit('C');
    setShowPopover(false);
  };
  const onSetF = () => {
    setUnit('F');
    setShowPopover(false);
  };

  const popoverActionItems = [
    {
      title: 'Sửa danh sách',
      onPressItem: onEditList,
      icon: require('../../../img/pencil.png'),
    },
    {
      title: 'Thông báo',
      icon: require('../../../img/notification.png'),
      onPressItem: () => setShowPopover(false),
    },
    {
      title: 'Độ C',
      onPressItem: onSetCelsius,
      textRight: '°C',
      isTick: unit === 'C',
    },
    {
      title: 'Độ F',
      onPressItem: onSetF,
      textRight: '°F',
      isTick: unit === 'F',
    },
    {
      title: 'Báo cáo sự cố',
      onPressItem: () => setShowPopover(false),
      icon: require('../../../img/warning.png'),
    },
  ];

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
            {popoverActionItems?.map(item => (
              <ButtonActionPopover
                title={item.title}
                icon={item.icon}
                onPressItem={item.onPressItem}
                textRight={item.textRight}
                isTick={item.isTick}
              />
            ))}
          </View>
        </Popover>
      )}
      <Text style={styles.title}>Thời tiết</Text>
      {/* Box Search */}
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
        <TouchableOpacity onPress={clearText}>
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
        keyExtractor={item => item.id.toString()}
        // eslint-disable-next-line react/no-unstable-nested-components
        ItemSeparatorComponent={() => (
          <View style={styles.distanceItemFlatList} />
        )}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <CityItem
            item={item}
            isEditing={isEditing}
            onDelete={deleteCity}
            onPress={cityItem =>
              navigation.navigate('HomeScreen', { item: cityItem })
            }
            changeTemp={changeTemp}
          />
        )}
      />
    </View>
  );
};

export default ListScreen;
