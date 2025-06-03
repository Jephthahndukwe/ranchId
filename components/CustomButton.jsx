import { View, Text } from 'react-native'
import React from 'react'
import { TouchableOpacity } from 'react-native'

const CustomButton = ({ title, handlePress, containerStyles, textStyles, isLoading }) => {
  return (
   <TouchableOpacity onPress={handlePress} activeOpacity={0.7} className={`bg-[#0829B3] rounded-[10px] min-h-[64px] w-full justify-center items-center ${containerStyles} ${isLoading ? 'opacity-50' : ''}`} disabled={isLoading} >
        <Text className={`text-white font-medium text-center text-[16px] ${textStyles}`}>{title}</Text>
   </TouchableOpacity>
  )
}

export default CustomButton