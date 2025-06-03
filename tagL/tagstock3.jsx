// import React, { useState, useEffect } from 'react';
// import { View, Text, ScrollView, TouchableOpacity, Image, Alert } from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import { AntDesign } from '@expo/vector-icons';
// import { router, useNavigation, useLocalSearchParams } from 'expo-router';
// import InputField from '../../components/InputField';
// import CustomButton from '../../components/CustomButton';
// import CancelButton from '../../components/CancelButton';
// import * as ImagePicker from 'expo-image-picker';

// export default function TagLivestock3() {
//   const navigation = useNavigation();
//   const params = useLocalSearchParams();
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [error, setError] = useState('');
//   const formData = params.formData ? JSON.parse(params.formData) : {};

//   // Form fields
//   const [description, setDescription] = useState('');
//   const [taggingLocation, setTaggingLocation] = useState('');
//   const [commentsForOtherLocation, setCommentsForOtherLocation] = useState('');
//   const [weight, setWeight] = useState('');
//   const [productionType, setProductionType] = useState('');
//   const [commentsForOtherType, setCommentsForOtherType] = useState('');
//   const [verificationPhoto, setVerificationPhoto] = useState(null);
//   const [vaccinePhoto, setVaccinePhoto] = useState(null);

//   useEffect(() => {
//     navigation.setOptions({
//       headerShown: false,
//     });
//   }, []);

//   const handleImagePick = async (setImage) => {
//     try {
//       // Show action sheet for image source selection
//       Alert.alert(
//         "Select Image Source",
//         "Choose where you want to pick the image from",
//         [
//           {
//             text: "Cancel",
//             style: "cancel"
//           },
//           {
//             text: "Take Photo",
//             onPress: async () => {
//               const result = await ImagePicker.launchCameraAsync({
//                 mediaTypes: ImagePicker.MediaTypeOptions.Images,
//                 allowsEditing: true,
//                 aspect: [4, 3],
//                 quality: 1,
//               });

//               if (!result.canceled) {
//                 setImage(result.assets[0].uri);
//               }
//             }
//           },
//           {
//             text: "Choose from Gallery",
//             onPress: async () => {
//               const result = await ImagePicker.launchImageLibraryAsync({
//                 mediaTypes: ImagePicker.MediaTypeOptions.Images,
//                 allowsEditing: true,
//                 aspect: [4, 3],
//                 quality: 1,
//               });

//               if (!result.canceled) {
//                 setImage(result.assets[0].uri);
//               }
//             }
//           }
//         ]
//       );
//     } catch (error) {
//       alert('Error capturing image: ' + error.message);
//     }
//   };

//   const validateForm = () => {
//     if (!description || !taggingLocation || !weight || !productionType || !verificationPhoto) {
//       setError('Please fill in all required fields and capture verification photo');
//       return false;
//     }
//     return true;
//   };

//   const handleSubmit = () => {
//     if (!validateForm()) return;

//     const finalFormData = {
//       ...JSON.parse(formData),
//       description,
//       taggingLocation,
//       commentsForOtherLocation,
//       weight,
//       productionType,
//       commentsForOtherType,
//       verificationPhoto,
//       vaccinePhoto
//     };

//     console.log('Images being passed:', { verificationPhoto, vaccinePhoto });

//     router.push({
//       pathname: '/(auth)/tagLiveStock/summary',
//       params: { formData: JSON.stringify(finalFormData) }
//     });
//   };

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
//             Capture Verification Details
//           </Text>
//         </View>

//         {error ? (
//           <Text className="text-red-500 mt-4 text-center">{error}</Text>
//         ) : null}

//         <View className="mt-8">
//           <InputField
//             type='description'
//             label='Description'
//             className='h-[150px]'
//             value={description}
//             onChange={setDescription}
//           />

//           <InputField
//             label="Tagging Location"
//             type="dropdown"
//             value={taggingLocation}
//             onChange={(value) => {
//               setTaggingLocation(value);
//               setError('');
//             }}
//             options={[
//               { label: "Select Location", value: "" },
//               { label: "Location 1", value: "location1" },
//               { label: "Location 2", value: "location2" },
//               { label: "Other", value: "other" },
//             ]}
//           />

//           {taggingLocation === 'other' && (
//             <InputField
//               label="Comments for Other Location"
//               type="text"
//               value={commentsForOtherLocation}
//               onChange={setCommentsForOtherLocation}
//               multiline={true}
//               numberOfLines={3}
//             />
//           )}

//           <InputField
//             label="Weight"
//             type="dropdown"
//             value={weight}
//             onChange={(value) => {
//               setWeight(value);
//               setError('');
//             }}
//             options={[
//               { label: "Select Weight Range", value: "" },
//               { label: "0-100 kg", value: "0-100" },
//               { label: "101-200 kg", value: "101-200" },
//               { label: "201-300 kg", value: "201-300" },
//               { label: "301+ kg", value: "301+" },
//             ]}
//           />

//           <InputField
//             label="Production Type"
//             type="dropdown"
//             value={productionType}
//             onChange={(value) => {
//               setProductionType(value);
//               setError('');
//             }}
//             options={[
//               { label: "Select Production Type", value: "" },
//               { label: "Dairy", value: "dairy" },
//               { label: "Meat", value: "meat" },
//               { label: "Dual Purpose", value: "dual" },
//               { label: "Other", value: "other" },
//             ]}
//           />

//           {productionType === 'other' && (
//             <InputField
//               label="Comments for Other Type"
//               type="text"
//               value={commentsForOtherType}
//               onChange={setCommentsForOtherType}
//               multiline={true}
//               numberOfLines={3}
//             />
//           )}

//           <Text className="text-[14px] font-semibold text-[#414141] mt-4">Verification Photo</Text>
//           <TouchableOpacity
//             onPress={() => handleImagePick(setVerificationPhoto)}
//             className="mt-2 border-2 border-dashed border-gray-300 rounded-lg p-4 items-center justify-center bg-white aspect-[4/3]"
//           >
//             {verificationPhoto ? (
//               <Image
//                 source={{ uri: verificationPhoto }}
//                 className="w-full h-full rounded-lg"
//                 resizeMode="cover"
//               />
//             ) : (
//               <View className="items-center">
//                 <AntDesign name="camera" size={24} color="gray" />
//                 <Text className="text-gray-400 mt-2">Capture or select a photo</Text>
//               </View>
//             )}
//           </TouchableOpacity>

//           <Text className="text-[14px] font-semibold text-[#414141] mt-6">Vaccine Photo</Text>
//           <TouchableOpacity
//             onPress={() => handleImagePick(setVaccinePhoto)}
//             className="mt-2 border-2 border-dashed border-gray-300 rounded-lg p-4 items-center justify-center bg-white aspect-[4/3]"
//           >
//             {vaccinePhoto ? (
//               <Image
//                 source={{ uri: vaccinePhoto }}
//                 className="w-full h-full rounded-lg"
//                 resizeMode="cover"
//               />
//             ) : (
//               <View className="items-center">
//                 <AntDesign name="camera" size={24} color="gray" />
//                 <Text className="text-gray-400 mt-2">Capture or select a photo</Text>
//               </View>
//             )}
//           </TouchableOpacity>
//         </View>

//         <View className="flex-row items-center justify-between px-4 py-5 gap-3 border-t-[#CEBAA747]/70 border-t mt-5 pt-5">
//           <CancelButton
//             title="Cancel"
//             containerStyles="flex-1 h-[64px]"
//             handlePress={() => router.push('/(dashboard)/dashboard')}
//           />
//           <CustomButton
//             title={isSubmitting ? "Saving..." : "Save"}
//             containerStyles="flex-1 h-[64px]"
//             handlePress={handleSubmit}
//             disabled={isSubmitting}
//           />
//         </View>
//       </ScrollView>
//     </SafeAreaView>
//   );
// }