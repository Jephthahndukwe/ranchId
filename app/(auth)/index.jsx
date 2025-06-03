import { View, Text, ScrollView, TouchableOpacity } from 'react-native'
import React, { useEffect } from 'react'
import { router, useNavigation } from 'expo-router';
import { AntDesign, Ionicons, SimpleLineIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function index() {
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, []);

  return (
    <SafeAreaView className="h-full bg-[#FAF7F1]">
      <ScrollView className="my-8">
        <TouchableOpacity className='flex-row items-center gap-3 bg-[#fff] p-5'  onPress={() => router.back()}>
          <AntDesign name="left" size={10} color="black" />
          <Text className='text-[#282828] text-[24px] font-normal'>Register</Text>
        </TouchableOpacity>
        <View className='mt-5'>
          <TouchableOpacity className='flex-row items-center gap-3 mt-7 px-7' onPress={() => router.push('/addLiveStockOwner')}>
            <Ionicons name="add-circle-outline" size={20} color="black" />
            <Text className='text-[#282828] text-[18px] font-semibold'>Add Livestock Owner</Text>
          </TouchableOpacity>
          <View className='border border-[#EDEBE7] w-full mt-5' />
          <TouchableOpacity className='flex-row items-center gap-3 mt-7 px-7' onPress={() => router.push('/addLiveStockKeeper')}>
            <Ionicons name="add-circle-outline" size={20} color="black" />
            <Text className='text-[#282828] text-[18px] font-semibold'>Add Livestock Keeper</Text>
          </TouchableOpacity>
          <View className='border border-[#EDEBE7] w-full mt-5' />
          <TouchableOpacity className='flex-row items-center gap-3 mt-7 px-7' onPress={() => router.push('/addLocation')}>
            <Ionicons name="add-circle-outline" size={20} color="black" />
            <Text className='text-[#282828] text-[18px] font-semibold'>Locations</Text>
          </TouchableOpacity>
          <View className='border border-[#EDEBE7] w-full mt-5' />
          <TouchableOpacity className='flex-row items-center gap-3 mt-7 px-7' onPress={() => router.push('/tagLiveStock')}>
            <SimpleLineIcons name="tag" size={24} color="black" />
            <Text className='text-[#282828] text-[18px] font-semibold'>Tag Livestock</Text>
          </TouchableOpacity>
          <View className='border border-[#EDEBE7] w-full mt-5' />
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}