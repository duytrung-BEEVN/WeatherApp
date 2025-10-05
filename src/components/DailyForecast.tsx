import moment from 'moment';
import React from 'react';
import { Image, Text, View } from 'react-native';
import styles from '../screens/HomeScreen/styles';
import { WeatherResponse } from '../types/responseAPIType';

type WeatherDailyProps = {
  weather?: WeatherResponse;
  renderNumber: (value: number | undefined) => number | string;
};

const DailyForecast = ({ weather, renderNumber }: WeatherDailyProps) => {
  // Vi tri cua nhiet do va do dai thanh nhiet do hien tai
  const minTemp = weather?.forecast?.forecastday
    ? Math.min(...weather?.forecast?.forecastday?.map(d => d.day.mintemp_c))
    : 0;
  const maxTemp = weather?.forecast?.forecastday
    ? Math.max(...weather?.forecast?.forecastday?.map(d => d.day.maxtemp_c))
    : 0;

  return (
    <View style={styles.detailDay}>
      <Text style={styles.detailText}>DỰ BÁO TRONG 10 NGÀY</Text>
      <Text style={styles.line} />
      {weather?.forecast?.forecastday?.map((d, idx) => {
        let day = moment(d?.date).format('dddd');
        switch (day) {
          case 'Monday':
            day = 'Thứ 2';
            break;
          case 'Tuesday':
            day = 'Thứ 3';
            break;
          case 'Wednesday':
            day = 'Thứ 4';
            break;
          case 'Thursday':
            day = 'Thứ 5';
            break;
          case 'Friday':
            day = 'Thứ 6';
            break;
          case 'Saturday':
            day = 'Thứ 7';
            break;
          case 'Sunday':
            day = 'Chủ Nhật';
            break;
        }
        const isDay =
          moment(d?.date).format('L') ===
          moment(weather?.location?.localtime).format('L');
        const widthTempBar =
          ((d?.day?.maxtemp_c - d?.day?.mintemp_c) / (maxTemp - minTemp)) * 100;
        const positionMinTemp =
          ((d?.day?.mintemp_c - minTemp) / (maxTemp - minTemp)) * 100;
        const positionTemp =
          ((weather?.current?.temp_c - d?.day?.mintemp_c) /
            (maxTemp - minTemp)) *
          100;
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
                    marginLeft: positionMinTemp,
                    width: widthTempBar,
                  },
                ]}
              >
                {isDay ? (
                  <Image
                    source={require('../../img/dot.png')}
                    style={[
                      styles.curTempIcon,
                      {
                        marginLeft: positionTemp,
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
  );
};

export default DailyForecast;
