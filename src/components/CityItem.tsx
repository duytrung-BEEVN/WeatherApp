import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ImageBackground,
} from 'react-native';
import styles from '../screens/ListScreen/styles';
import moment from 'moment';
import { cityList } from '../types/Type.tsx';

interface Props {
  item: cityList;
  isEditing?: boolean;
  onDelete: (id: number) => void;
  onPress: (item: cityList) => void;
  changeTemp: (tempC: number) => string;
}

const CityItem = ({
  item,
  isEditing,
  onDelete,
  onPress,
  changeTemp,
}: Props) => {
  // Background
  const imageBackground = require('../../img/hinh-nen-bau-troi-xanh_(6).jpg');

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
          onPress={() => onDelete(item.id)}
        >
          <Text style={styles.textCancel}>X</Text>
        </TouchableOpacity>
      )}
      <TouchableOpacity
        disabled={isEditing}
        onPress={() => onPress(item)}
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
            <Text style={styles.temperature}>{changeTemp(item.temp_c)}</Text>
            <Text style={styles.textNote}>
              C:{changeTemp(item.maxtemp_c)}
              T:{changeTemp(item.mintemp_c)}
            </Text>
          </View>
        </ImageBackground>
      </TouchableOpacity>
      {isEditing && item.name !== 'Hanoi' && (
        <TouchableOpacity style={styles.iconMenu}>
          <Image
            source={require('../../img/menu.png')}
            style={styles.iconMenu}
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default CityItem;
