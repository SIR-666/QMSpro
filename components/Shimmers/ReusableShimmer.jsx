import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { LinearGradient } from 'expo-linear-gradient'
import { createShimmerPlaceholder } from 'react-native-shimmer-placeholder'
import { COLORS } from '../../constants/theme';
const ShimmerPlaceHolder = createShimmerPlaceholder(LinearGradient);

const ReusableShimmer = ({width, height, radius}) => {
  return (
    <ShimmerPlaceHolder style={{width: width, height: height, borderRadius: radius}} shimmerColors={[  COLORS.lightWhite,COLORS.lightGrey, COLORS.lightWhite]}>
        
    </ShimmerPlaceHolder>
  )
}

export default ReusableShimmer
