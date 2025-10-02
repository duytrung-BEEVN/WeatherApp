import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 8,
    paddingTop: 70,
    backgroundColor: 'black',
  },
  popoverContainer: {
    backgroundColor: 'grey',
    width: 200,
    marginLeft: 110,
    borderRadius: 16,
  },
  buttonDone: {
    marginLeft: 350,
    width: 50,
  },
  textDone: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  viewIcon: {
    paddingLeft: 360,
    width: 20,
  },
  icon: {
    width: 28,
    height: 28,
  },
  iconSearch: {
    width: 16,
    height: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: 700,
    marginTop: 16,
    color: 'white',
    marginLeft: 4,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 32,
    borderRadius: 8,
    backgroundColor: 'gray',
    color: 'white',
    paddingHorizontal: 8,
  },
  viewTextInput: {
    alignItems: 'center',
    flexDirection: 'row',
    height: 32,
    borderRadius: 8,
    backgroundColor: 'gray',
    color: 'white',
    paddingHorizontal: 8,
    flex: 10,
  },
  textInput: {
    flex: 1,
    marginLeft: 4,
    color: 'white',
  },
  cityListSearch: {
    flexDirection: 'column',
    marginTop: 4,
    paddingHorizontal: 12,
    height: 28,
  },
  viewList: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewListEdit: {
    paddingRight: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonDelete: {
    backgroundColor: 'red',
    color: 'white',
  },
  iconMenu: {
    marginLeft: 2,
    width: 20,
    height: 20,
  },
  listCity: {
    color: 'white',
    marginBottom: 4,
    fontSize: 20,
    height: 28,
  },
  textCancel: {
    color: 'white',
    marginHorizontal: 4,
  },
  listAddress: {
    marginTop: 10,
  },
  viewImageBackground: {
    width: '100%',
  },
  imageBackground: {
    flexDirection: 'row',
    borderRadius: 16,
    backgroundColor: 'transparent',
    overflow: 'hidden',
    height: 130,
    padding: 12,
    justifyContent: 'space-between',
  },
  detail: {
    justifyContent: 'space-between',
  },
  address: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  time: {
    fontSize: 12,
    color: 'white',
  },
  textNote: {
    height: 32,
    width: 250,
    marginRight: 20,
    flexWrap: 'wrap',
    color: 'white',
    fontSize: 12,
  },
  temperature: {
    fontSize: 52,
    fontWeight: 300,
    color: 'white',
  },
  viewPopover: {
    backgroundColor: 'grey',
    borderRadius: 16,
    padding: 4,
    height: 'auto',
  },
  popoverItem: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    padding: 4,
  },
  menuItem: {
    fontSize: 16,
    color: 'white',
    paddingLeft: 12,
  },
  iconPopover: {
    height: 20,
    width: 20,
    resizeMode: 'contain',
    marginLeft: 20,
  },
  iconTicked: {
    backgroundColor: 'red',
    height: 10,
    width: 10,
  },
});

export default styles;
