import { View, Text, TouchableOpacity } from 'react-native';
import React from 'react';
import { router } from 'expo-router';
import { AntDesign } from '@expo/vector-icons';

const SuccessScreen = ({ title, message, buttonText }) => {
  return (
    <View className="flex-1 bg-[#FAF7F1] justify-center items-center px-4">
      <View className="w-[96px] h-[96px] justify-center items-center mb-6">
        <Image
          source={require('../assets/images/Group (3).png')}
          className="w-[96px] h-[96px]"
        />
      </View>
      <Text className="text-2xl font-semibold text-center mb-2">
        {title || "Congratulations!"}
      </Text>
      <Text className="text-gray-500 text-center mb-8">
        {message || "Livestock owner added successfully"}
      </Text>
      <TouchableOpacity
        className="bg-blue-600 py-4 px-6 rounded-lg"
        onPress={() => router.push('/(dashboard)/dashboard')}
      >
        <Text className="text-white text-center">
          {buttonText || "Go back to dashboard"}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default SuccessScreen;
