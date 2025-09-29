import { StyleSheet, Dimensions } from 'react-native';

const screenWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
  page: {
    width: screenWidth,
    flex: 1,
  },
  scrollHorizontal: {
    flex: 1,
    backgroundColor: 'transparent',
  },

  imageBackground: {
    flex: 1,
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    paddingHorizontal: 12,
    backgroundColor: 'transparent',
  },
  viewTitle: {
    marginTop: 135,
    alignItems: 'center',
  },
  textAddress: {
    fontSize: 30,
    color: 'white',
  },
  textTemperature: {
    fontSize: 80,
    color: 'white',
    fontWeight: 200,
    marginLeft: 25,
  },
  textNote: {
    fontSize: 15,
    color: 'white',
    fontWeight: 500,
    marginLeft: 10,
    marginRight: 10,
  },
  icon: {
    alignItems: 'center',
    width: 30,
    height: 30,
  },
  iconFooter: {
    alignItems: 'center',
    width: 20,
    height: 20,
  },
  detail: {
    marginTop: 50,
    paddingTop: 8,
    paddingBottom: 8,
    backgroundColor: '#3779b9',
    borderRadius: 12,
    height: 'auto',
  },
  detailHour: {
    marginLeft: 8,
    alignItems: 'center',
  },
  detailText: {
    marginHorizontal: 12,
    color: 'white',
  },
  line: {
    height: 0.5,
    backgroundColor: '#c39696ff',
    marginVertical: 10,
    marginLeft: 8,
  },
  detailDay: {
    marginTop: 8,
    paddingVertical: 8,
    backgroundColor: '#3771abff',
    borderRadius: 12,
    height: 'auto',
  },
  detailEveryDay: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    fontSize: 20,
    paddingRight: 8,
  },
  textDay: {
    fontSize: 18,
    color: 'white',
    marginLeft: 12,
    width: 100,
  },
  minTemperature: {
    marginLeft: 50,
    fontSize: 16,
    color: 'white',
    fontWeight: 300,
    width: 30,
  },
  maxTemperature: {
    fontSize: 16,
    color: 'white',
    width: 30,
    fontWeight: 600,
  },
  headerModal: {
    paddingHorizontal: 4,
    flexDirection: 'row',
  },
  textHeaderModal: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    width: 356,
  },
  footer: {
    flexDirection: 'row',
    backgroundColor: '#3779b9',
    justifyContent: 'space-between',
    height: 70,
    paddingTop: 8,
    paddingHorizontal: 12,
  },
});

export default styles;
