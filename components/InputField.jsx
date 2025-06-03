import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Image, Alert } from "react-native";
import { Picker } from "@react-native-picker/picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as ImagePicker from "expo-image-picker";
import AntDesign from "react-native-vector-icons/AntDesign";

const InputField = ({
  label,
  type = "text",
  value,
  onChange,
  options = [],
  placeholder = "",
  secureTextEntry = false,
  className = "", // Add className for NativeWind styling
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const renderInput = () => {
    switch (type) {
      case "text":
      case "email":
      case "password":
      case "description":
        return (
          <TextInput
            className={`border border-gray-300 rounded-lg p-4 bg-white ${className}`}
            placeholder={placeholder}
            value={value}
            onChangeText={onChange}
            secureTextEntry={type === "password" && !showPassword}
            multiline={type === "description"}
          />
        );
      case "dropdown":
        return (
          <View className={`border border-gray-300 rounded-lg bg-[#fff] ${className}`}>
            <Picker
              selectedValue={value}
              onValueChange={onChange}
              style={{ color: "black" }}
            >
              {options.map((option, index) => (
                <Picker.Item key={index} label={option.label} value={option.value} />
              ))}
            </Picker>
          </View>
        );
      case "date":
        return (
          <>
            <TouchableOpacity
              className={`border border-gray-300 rounded-lg p-4 bg-white justify-center ${className}`}
              onPress={() => setShowDatePicker(true)}
            >
              <Text>{value || placeholder}</Text>
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker
                value={new Date()}
                mode="date"
                display="default"
                onChange={(event, date) => {
                  setShowDatePicker(false);
                  if (date) onChange(date.toISOString().split("T")[0]);
                }}
              />
            )}
          </>
        );
      case "image":
        return (
          <View className={`${className}`}>
            {value ? (
              <View className="h-40 border border-gray-300 rounded-lg overflow-hidden">
                <Image 
                  source={{ uri: value }} 
                  className="w-full h-full"
                  resizeMode="cover"
                />
                <TouchableOpacity 
                  className="absolute top-2 right-2 bg-white rounded-full p-1"
                  onPress={() => onChange(null)}
                >
                  <AntDesign name="close" size={16} color="black" />
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity
                className="h-40 border border-gray-300 rounded-lg bg-white justify-center items-center"
                onPress={async () => {
                  // Request both permissions
                  const cameraStatus = await ImagePicker.requestCameraPermissionsAsync();
                  const libraryStatus = await ImagePicker.requestMediaLibraryPermissionsAsync();
                  
                  if (cameraStatus.status !== "granted" || libraryStatus.status !== "granted") {
                    alert("Camera and gallery permissions are required!");
                    return;
                  }

                  // Create action sheet to choose between camera and gallery
                  Alert.alert(
                    "Select Photo",
                    "Choose a method to add your photo",
                    [
                      {
                        text: "Take Photo",
                        onPress: async () => {
                          const result = await ImagePicker.launchCameraAsync({
                            mediaTypes: ImagePicker.MediaTypeOptions.Images,
                            allowsEditing: true,
                            aspect: [1, 1],
                            quality: 1,
                            cameraType: ImagePicker.CameraType.front
                          });
                          if (!result.canceled) {
                            onChange(result.assets[0].uri);
                          }
                        }
                      },
                      {
                        text: "Choose from Gallery",
                        onPress: async () => {
                          const result = await ImagePicker.launchImageLibraryAsync({
                            mediaTypes: ImagePicker.MediaTypeOptions.Images,
                            allowsEditing: true,
                            aspect: [1, 1],
                            quality: 1
                          });
                          if (!result.canceled) {
                            onChange(result.assets[0].uri);
                          }
                        }
                      },
                      {
                        text: "Cancel",
                        style: "cancel"
                      }
                    ]
                  );
                }}
              >
                <AntDesign name="camera" size={24} color="#666" />
                <Text className="text-gray-500 mt-2">Capture Portrait</Text>
              </TouchableOpacity>
            )}
          </View>
        );
      case "radio":
        return (
          <View className={`flex-row items-center gap-4 ${className}`}>
            {options.map((option) => (
              <TouchableOpacity
                key={option.value}
                className="flex-row items-center gap-2"
                onPress={() => onChange(option.value)}
              >
                <View
                  className={`w-5 h-5 border rounded-full ${value === option.value ? "bg-blue-500" : "bg-white"
                    }`}
                />
                <Text>{option.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        );
      case "checkbox":
        return (
          <View className={`${className}`}>
            {options.map((option, index) => (
              <TouchableOpacity
                key={index}
                className="flex-row items-center mb-2"
                onPress={() => onChange(option.value)} // Ensure onChange gets called with the selected value
              >
                <View
                  className={`w-6 h-6 rounded-full border-2 ${value === option.value
                    ? "border-blue-500 bg-blue-500"
                    : "border-gray-400 bg-white"
                    } flex items-center justify-center`}
                >
                  {value === option.value && <View className="w-3 h-3 bg-white rounded-full" />}
                </View>
                <Text className="ml-2 text-black">{option.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <View className="mb-4">
      {label && <Text className="mb-2 text-[14px] font-semibold text-[#414141]">{label}</Text>}
      {renderInput()}
      {type === "password" && (
        <TouchableOpacity
          className="absolute right-4 top-10"
          onPress={() => setShowPassword(!showPassword)}
        >
          <Text>{showPassword ? "Hide" : "Show"}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default InputField;