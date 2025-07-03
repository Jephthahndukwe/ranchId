import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import React, { useEffect } from 'react';
import { router, useNavigation } from 'expo-router';
import { AntDesign, MaterialIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { icons } from '../../constant';

export default function Reports() {
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, []);

  const reports = [
    {
      title: 'List Livestock Owner',
      icon: icons.icon1,
      route: '/livestock-owner',
    },
    {
      title: 'List Livestock Keeper',
      icon: icons.icon2,
      route: '/livestock-keeper',
    },
    {
      title: 'List Registration Location',
      icon: icons.icon3,
      route: '/tag-report',
    },
    {
      title: 'List Tagged Livestock',
      icon: icons.icon4,
      route: '/location-report',
    },
  ];

  return (
    <SafeAreaView className="h-full bg-[#FAF7F1]">
      <ScrollView className="">
        <TouchableOpacity 
          className='flex-row items-center gap-3 bg-[#fff] p-5'
          onPress={() => router.back()}
        >
          <AntDesign name="left" size={10} color="black" />
          <Text className='text-[#282828] text-[24px] font-normal'>Reports</Text>
        </TouchableOpacity>
        
        <View className='mt-5'>
          {reports.map((report, index) => (
            <React.Fragment key={report.route}>
              <TouchableOpacity 
                className='flex-row items-center gap-3 mt-7 px-7'
                // onPress={() => router.push(`/(reports)${report.route}`)}
              >
                <Image source={report.icon} size={24} color="black" />
                <Text className='text-[#282828] text-[18px] font-medium'>
                  {report.title}
                </Text>
              </TouchableOpacity>
              {index < reports.length - 1 && (
                <View className='border border-[#EDEBE7] w-full mt-5' />
              )}
            </React.Fragment>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
