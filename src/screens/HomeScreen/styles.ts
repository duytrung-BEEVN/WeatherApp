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
    marginTop: 115,
    alignItems: 'center',
    height: 200,
  },
  textAddress: {
    height: 50,
    fontSize: 30,
    color: 'white',
    textAlign: 'center',
  },
  textMyLocation: {
    color: 'white',
    textAlign: 'center',
    fontWeight: '500',
    fontSize: 16,
    marginTop: -15,
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
    marginHorizontal: 10,
    marginTop: 4,
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
    opacity: 0.6,
  },
  iconFooterSelected: {
    alignItems: 'center',
    width: 20,
    height: 20,
    opacity: 1,
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
    fontWeight: '500',
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
    marginTop: 8,
    fontSize: 20,
    // paddingRight: 8,
  },
  textDay: {
    fontSize: 18,
    color: 'white',
    marginLeft: 12,
    width: 100,
  },
  minTemperature: {
    marginLeft: 20,
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
    marginLeft: 20,
  },
  tempBarMax: {
    backgroundColor: '#696967e1',
    marginBottom: 4,
    marginLeft: 8,
    alignSelf: 'center',
    height: 4,
    width: 100,
    borderRadius: 4,
  },
  tempBar: {
    backgroundColor: '#e7ba3ee1',
    height: 4,
    borderRadius: 4,
  },
  curTempIcon: {
    backgroundColor: 'white',
    borderRadius: 4,
    width: 4,
    height: 4,
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
