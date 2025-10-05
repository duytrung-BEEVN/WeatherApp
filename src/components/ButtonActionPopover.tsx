import {
  Image,
  ImageSourcePropType,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

interface Props {
  title: string;
  icon?: ImageSourcePropType;
  onPressItem?: () => void;
  textRight?: string;
  isTick?: boolean;
}

const ButtonActionPopover = (props: Props) => {
  const { title, icon, onPressItem, textRight, isTick } = props;
  return (
    <TouchableOpacity style={styles.popoverItem} onPress={onPressItem}>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        {isTick ? (
          <Image
            style={{ width: 12, height: 12 }}
            source={require('../../img/tick.png')}
          />
        ) : (
          <View style={{ width: 12 }} />
        )}
        <Text style={styles.menuItem}>{title}</Text>
      </View>

      {!!textRight ? (
        <Text style={styles.menuItem}>{textRight}</Text>
      ) : (
        <Image style={styles.iconPopover} source={icon} />
      )}
    </TouchableOpacity>
  );
};

export default ButtonActionPopover;

const styles = StyleSheet.create({
  popoverItem: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    padding: 4,
  },
  menuItem: {
    fontSize: 16,
    color: 'white',
    marginLeft: 4,
  },
  iconPopover: {
    color: 'white',
    height: 20,
    width: 20,
    resizeMode: 'contain',
    marginLeft: 20,
  },
});
