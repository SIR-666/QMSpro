import { View, Text } from 'react-native'
import React from 'react'
import { ProfileBar } from '../../components'
import { COLORS } from '../../constants/theme'

const Booking = ({navigation}) => {
  return (
    <View style={{ backgroundColor: COLORS.lightWhite, flex: 1 }}>
    <View style={{ height: 120 }}>
      <ProfileBar
      title={"Booking Details"}
        icon={"left"}
        onPress={() => navigation.goBack()}
        icon2={""}
        onPress1={() => {}}
      />
    </View>
    </View>
  )
}

export default Booking