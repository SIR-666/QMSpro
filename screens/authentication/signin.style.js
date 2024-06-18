import { StyleSheet } from "react-native";
import { COLORS, SIZES } from "../../constants/theme";


const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: COLORS.lightWhite
    },
    inputWrapper: (borderColor)=> ({
        borderColor: borderColor,
        backgroundColor: COLORS.lightWhite,
        borderWidth: 1,
        height: 50,
        borderRadius: 12,
        flexDirection: "row",
        paddingHorizontal: 15,
        alignItems: "center"
        
    }),
    inputWrapperAuth: (borderColor)=> ({
        borderColor: borderColor,
        backgroundColor: COLORS.lightWhite,
        borderWidth:1.5,
        height: 45,
        borderRadius: 12,
        flexDirection: "row",
        paddingHorizontal: 15,
        alignItems: "center",
        justifyContent: "center", 
        
        
    }),  
    wrapper: {
        marginBottom: 20,
        
        
    },
    wrapperAuth: {
        marginBottom: 20,
        paddingTop: 25,  
        width: 150

    },
    label: {
        fontFamily: 'regular',
        fontSize: SIZES.small,
        marginBottom: 5,
        marginEnd: 5,
        textAlign: "right"
    },
    errorMessage: {
       color: COLORS.red,
       fontSize: SIZES.small,
       fontFamily: 'regular',
       marginTop: 5,
       marginLeft: 5,
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
      centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
      },

})


export default styles