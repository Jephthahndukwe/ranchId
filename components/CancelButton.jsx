import { View, Text } from 'react-native'
import React from 'react'
import { TouchableOpacity } from 'react-native'

const CancelButton = ({ title, handlePress, containerStyles, textStyles, isLoading }) => {
  return (
   <TouchableOpacity onPress={handlePress} activeOpacity={0.7} className={`bg-[#fff] rounded-[10px] min-h-[64px] w-full justify-center items-center ${containerStyles} ${isLoading ? 'opacity-50' : ''}`} disabled={isLoading} >
        <Text className={`text-[#0829B3] font-medium text-center text-[16px] ${textStyles}`}>{title}</Text>
   </TouchableOpacity>
  )
}

export default CancelButton