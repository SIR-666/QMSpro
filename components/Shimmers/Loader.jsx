import { View, Text } from 'react-native'
import React from 'react'
import AssetImage from '../Reusable/AssetImage'
import { SIZES , COLORS} from '../../constants/theme'

const Loader = () => {
  return (
    <View style={{ backgroundColor: COLORS.lightWhite,width: "100%", height: SIZES.height,justifyContent: "center" }}>
    <AssetImage 
    data={require('../../assets/images/loader.gif')}
    mode={'contain'}
    width={"100%"} height={"100%"} />
  </View>
  )
}

export default Loader