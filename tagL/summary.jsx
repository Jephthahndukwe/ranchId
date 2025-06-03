// import React, { useEffect, useState } from 'react';
// import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import { AntDesign } from '@expo/vector-icons';
// import { router, useLocalSearchParams, useNavigation } from 'expo-router';
// import CustomButton from '../../components/CustomButton';
// import * as SecureStore from 'expo-secure-store';

// export default function TagLivestockSummary() {
//   const navigation = useNavigation();
//   const params = useLocalSearchParams();
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const formData = params.formData ? JSON.parse(params.formData) : {};

//   const handleSubmit = async () => {
//     setIsSubmitting(true);
//     try {
//       // Create FormData for handling file uploads
//       const formDataToSend = new FormData();
      
//       // Add all text fields
//       formDataToSend.append('tag_id', formData.tagId);
//       formDataToSend.append('animal_type', formData.livestockType.toLowerCase());
//       formDataToSend.append('breed', formData.livestockBreed);
//       formDataToSend.append('sex', formData.gender.toLowerCase());
//       formDataToSend.append('health_status', formData.healthStatus);
//       formDataToSend.append('description', formData.description);
//       formDataToSend.append('birth_period', formData.birthPeriod);
//       formDataToSend.append('passport_id', formData.passportId);
//       formDataToSend.append('location_id', formData.locationKeeper);

//       // Handle image files
//       if (formData.verificationPhoto) {
//         const verificationPhotoFile = await fetch(formData.verificationPhoto).then(r => r.blob());
//         formDataToSend.append('verification_photo', verificationPhotoFile);
//       }

//       if (formData.vaccinePhoto) {
//         const vaccinePhotoFile = await fetch(formData.vaccinePhoto).then(r => r.blob());
//         formDataToSend.append('vaccine_photo', vaccinePhotoFile);
//       }

//       // Make API call to backend
//       const response = await fetch('https://api.ranchid.app/api/enumerator/tag_livestock', {
//         method: 'POST',
//         headers: {
//           // Add auth token from secure storage
//           'Authorization': `Bearer ${await SecureStore.getItemAsync('token')}`,
//         },
//         body: formDataToSend
//       });

//       const data = await response.json();

//       if (!response.ok) {
//         throw new Error(data.message || 'Failed to tag livestock');
//       }

//       // Navigate to success screen
//       router.push('/(auth)/tagLiveStock/success');
//     } catch (error) {
//       alert(error.message || "An error occurred while saving");
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   useEffect(() => {
//     navigation.setOptions({
//       headerShown: false,
//     });
//   }, []);

//   return (
//     <SafeAreaView className="h-full bg-[#FAF7F1]">
//       <ScrollView className="px-4">
//         <TouchableOpacity
//           className="flex-row items-center gap-3 bg-[#fff] p-5"
//           onPress={() => router.back()}
//         >
//           <AntDesign name="left" size={10} color="black" />
//           <Text className="text-[#282828] text-[24px] font-normal">Tag Livestock</Text>
//         </TouchableOpacity>

//         <View className="mt-5">
//           <Text className="text-[#282828] text-[24px] font-semibold">Step 03/03</Text>
//           <Text className="text-[#5B626C] text-[18px] font-medium mt-2">
//             Form Summary
//           </Text>
//         </View>

//         <View className="mt-8 bg-white rounded-lg p-4">
//           <InfoRow label="Scanned Tag ID" value={formData.tagId} />
//           <InfoRow label="Location Keeper" value="Abiola Fareed" />
//           <InfoRow label="Livestock Type" value="Goat (Simple)" />
//           <InfoRow label="Livestock Breed" value="Red Bororo" />
//           <InfoRow label="Gender" value="Male" />
//           <InfoRow label="Health Status" value="Healthy" />
//           <InfoRow label="Age" value="23, Sokoto street, Agbogbon" />
//           <InfoRow label="Birth Period" value="Brown and White in color" />
//           <InfoRow label="Tagging Location" value="Stall" />
//           <InfoRow label="Document" value="International passport" />
//           <InfoRow label="Description" value={formData.description} />

//           <View className="mt-4">
//             <Text className="text-[14px] font-semibold text-[#414141] mb-2">Verification Photo</Text>
//             {formData.verificationPhoto ? (
//               <View className="w-full h-[120px] mb-4">
//                 <Image
//                   source={{ uri: formData.verificationPhoto }}
//                   style={{ width: '100%', height: '100%' }}
//                   className="rounded-lg"
//                   resizeMode="cover"
//                 />
//               </View>
//             ) : (
//               <View className="w-full h-[120px] bg-gray-100 rounded-lg mb-4 items-center justify-center">
//                 <Text className="text-gray-400">No verification photo</Text>
//               </View>
//             )}
//           </View>

//           <View className="mt-2">
//             <Text className="text-[14px] font-semibold text-[#414141] mb-2">Vaccine Photo</Text>
//             {formData.vaccinePhoto ? (
//               <View className="w-full h-[120px]">
//                 <Image
//                   source={{ uri: formData.vaccinePhoto }}
//                   style={{ width: '100%', height: '100%' }}
//                   className="rounded-lg"
//                   resizeMode="cover"
//                 />
//               </View>
//             ) : (
//               <View className="w-full h-[120px] bg-gray-100 rounded-lg items-center justify-center">
//                 <Text className="text-gray-400">No vaccine photo</Text>
//               </View>
//             )}
//           </View>
//         </View>

//         <View className="mt-8 mb-8">
//           <CustomButton
//             title={isSubmitting ? "Saving..." : "Submit"}
//             containerStyles="w-full h-[64px]"
//             // handlePress={handleSubmit}
//             handlePress={() => router.push('/(auth)/tagLiveStock/success')}
//             disabled={isSubmitting}
//           />
//         </View>
//       </ScrollView>
//     </SafeAreaView>
//   );
// }

// const InfoRow = ({ label, value }) => (
//   <View className="flex-row justify-between items-center py-2 border-b border-gray-100">
//     <Text className="text-[14px] text-[#414141] flex-1">{label}</Text>
//     <Text className="text-[14px] text-[#282828] font-medium flex-1 text-right">{value}</Text>
//   </View>
// );
