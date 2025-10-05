import moment from 'moment';
import React from 'react';
import { Image, ScrollView, Text, View } from 'react-native';
import styles from '../screens/HomeScreen/styles';
import { Hour, WeatherResponse } from '../types/responseAPIType';

type WeatherHourlyProps = {
  weather?: WeatherResponse;
  weatherHour?: Hour[];
};

const HourlyForecast = ({ weather, weatherHour }: WeatherHourlyProps) => {
  // Kiem tra thoi gian de hien thi thoi tiet theo thoi gian hien tai
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
  return (
    <View style={styles.detail}>
      <Text style={styles.detailText}>
        Dự báo có mây vài nơi vào khoảng 21:00.
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
                    : moment(h?.time).format('HH ')}
                  giờ
                </Text>
                <Image
                  source={{
                    uri: `https:${h?.condition?.icon}`,
                  }}
                  style={styles.icon}
                  resizeMode="cover"
                />
                <Text style={styles.textNote}>{Math.round(h?.temp_c)}°</Text>
              </View>
            );
        })}
      </ScrollView>
    </View>
  );
};

export default HourlyForecast;
