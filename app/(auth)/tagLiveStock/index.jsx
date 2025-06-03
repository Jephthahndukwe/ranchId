import { View, Text, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import { BarCodeScanner } from 'expo-barcode-scanner';
import { router } from 'expo-router';
import { AntDesign } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TouchableOpacity } from 'react-native';
import { ScrollView } from 'react-native';
import CustomButton from '../../../components/CustomButton'

export default function TagLiveStock() {
   const [scannedImage, setScannedImage] = useState(null);
   const [scannedTagId, setScannedTagId] = useState('');
   const [hasPermission, setHasPermission] = useState(null);
   const [scanning, setScanning] = useState(false);

   useEffect(() => {
    //   Request camera permission for scanning
     const getPermissions = async () => {
       const { status } = await BarCodeScanner.requestPermissionsAsync();
       setHasPermission(status === 'granted');
     };

     getPermissions();
   }, []);

   if (hasPermission === null) {
     return <Text>Requesting camera permission...</Text>;
   }
   if (hasPermission === false) {
     return <Text>No access to camera</Text>;
   }

   const handleScanTag = () => {
     setScanning(true); // Enable scanning mode
   };

   const handleBarCodeScanned = ({ type, data }) => {
     setScanning(false);
     setScannedTagId(data); // Set the scanned tag ID

    //   Navigate with scanned tag ID
     router.push({
       pathname: '/(auth)/tagLiveStock/tagLiveStock2',
       params: {
       tagId: data,
         imageUri: scannedImage,
       }
     });
   };

   if (scanning) {
     return (
       <SafeAreaView className="h-full bg-[#FAF7F1] flex-1 items-center justify-center">
         <BarCodeScanner
           onBarCodeScanned={scannedTagId ? undefined : handleBarCodeScanned}
           style={{ width: '100%', height: '100%' }}
         />
         <TouchableOpacity className="absolute top-10 left-5" onPress={() => setScanning(false)}>
           <AntDesign name="close" size={24} color="white" />
         </TouchableOpacity>
       </SafeAreaView>
     );
   }
    return (
        <SafeAreaView className="h-full bg-[#FAF7F1]">
            <ScrollView className="px-4">
                <TouchableOpacity
                    className="flex-row items-center gap-3 bg-[#fff] p-5"
                    onPress={() => router.back()}
                >
                    <AntDesign name="left" size={10} color="black" />
                    <Text className="text-[#282828] text-[24px] font-normal">Tag Livestock</Text>
                </TouchableOpacity>

                <View className="mt-5">
                    <Text className="text-[#282828] text-[24px] font-semibold">Step 01/03</Text>
                    <Text className="text-[#5B626C] text-[18px] font-medium mt-2">
                        Scan Livestock Tag
                    </Text>
                </View>

                <View className="mt-8 items-center">
                    {scannedImage ? (
                        <View className="w-full aspect-[4/3] bg-white rounded-lg overflow-hidden">
                            <Image
                                source={{ uri: scannedImage }}
                                className="w-full h-full"
                                resizeMode="cover"
                            />
                        </View>
                    ) : (
                        <View className="w-full aspect-[4/3] bg-white rounded-lg items-center justify-center border-2 border-dashed border-gray-300">
                            <Text className="text-gray-400">Scan tag to capture image</Text>
                        </View>
                    )}
                </View>

                <View className="mt-8">
                    {scannedTagId && (
                        <Text className="text-center text-[16px] font-medium mb-4">
                            Scanned Tag ID: {scannedTagId}
                        </Text>
                    )}
                    <CustomButton
                        title="Scan Tag"
                        containerStyles="w-full h-[64px]"
                        handlePress={handleScanTag}
                    />
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}