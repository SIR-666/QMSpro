import { StyleSheet } from "react-native";
import { COLORS, SIZES } from "../../constants/theme";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: COLORS.lightWhite,
  },
  headers:{
    paddingTop:20,
    paddingBottom: 15,
    
  },
  goBackLabel: {
    color: 'blue',
    paddingBottom: 15

  },
  title:{
    fontSize:24,
    fontWeight: 'bold',
  },
  scrollViewContainer: {
    padding:20,
    paddingTop:30
  },
  inputWrapper: (borderColor) => ({
    borderColor: borderColor,
    backgroundColor: COLORS.lightWhite,
    borderWidth: 1,
    height: 50,
    borderRadius: 12,
    flexDirection: "row",
    paddingHorizontal: 15,
    alignItems: "center",
  }),
  inputWrapperTextArea: (borderColor) => ({
    borderColor: borderColor,
    backgroundColor: COLORS.lightWhite,
    borderWidth: 1,
    padding: 10,
    height: 235,
    borderRadius: 12,
    flexDirection: "row",
    paddingHorizontal: 15,
    //alignItems: "center",
  }),
  wrapper: {
    marginBottom: 25,
  },
  label: {
    fontFamily: "regular",
    fontSize: SIZES.medium,
    marginBottom: 5,
    marginStart: 5,
    textAlign: "left",
  },
  tagNumber: {
    fontFamily: "regular",
    fontSize: 13,
    marginBottom: 25,
    marginStart: 5,
    textAlign: "left",
    backgroundColor: "#95f0ce",
    borderRadius: 5,
    width: 140
  },
  tagNumberNumeric: {
    fontFamily: "regular",
    fontSize: SIZES.medium,
    fontWeight: 'bold',
    marginBottom: 5,
    marginStart: 50,
    textAlign: "left",
  },
  textArea: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    padding: 8,
    marginBottom: 16,
  },
    centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 50,
    //alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    // flexDirection:"row"
  },

  modalViewDisclaimer: {
    margin: 30,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 40,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },

  modalTextFailed: {
    marginTop:20,
    marginBottom: 15,    
    textAlign: 'center',
    fontWeight: 'bold'
  },
  camera: {
    width: 310,
    height: 300,
    borderRadius: 100,
    overflow: 'hidden',
  },
  Button: {
    borderRadius:20
  },
  openButton: {
    backgroundColor: '#f194ff',
    padding: 10,
    borderRadius: 5,
  },
  modalContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  closeButton: {
    marginTop: 10,
    color: 'blue',
  },
  rowContainer: {
    flexDirection: "row",
  },

});

export default styles;
