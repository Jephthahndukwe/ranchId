// Menu.js
import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { AntDesign, FontAwesome, MaterialCommunityIcons, SimpleLineIcons, FontAwesome5 } from '@expo/vector-icons';
import { useTheme } from 'nativewind'; // Import NativeWind for theme support
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Menu = ({ isOpen, onClose }) => {
    const [userData, setUserData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const fetchUserData = async () => {
        try {
            const token = await AsyncStorage.getItem('userToken');
            if (!token) {
                onClose();
                router.replace('/');
                return;
            }

            // Get stored user data
            const storedUserData = await AsyncStorage.getItem('userData');
            if (storedUserData) {
                setUserData(JSON.parse(storedUserData));
            }
        } catch (error) {
            console.error('Error fetching user data:', error);
            Alert.alert('Error', 'Failed to load user profile. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleMenuClick = (e) => {
        // Prevent click event from closing the menu
        e.stopPropagation();
    };

    const handleLogout = async () => {
        try {
            // Show confirmation dialog
            Alert.alert(
                "Logout",
                "Are you sure you want to logout?",
                [
                    {
                        text: "Cancel",
                        style: "cancel"
                    },
                    {
                        text: "Logout",
                        onPress: async () => {
                            try {
                                // Clear auth token and user data
                                await AsyncStorage.removeItem('userToken');
                                await AsyncStorage.removeItem('userData');
                                // Close menu
                                onClose();
                                // Navigate to login screen using the correct route
                                router.replace('/');
                            } catch (error) {
                                console.error('Error during logout cleanup:', error);
                                Alert.alert("Error", "Failed to complete logout. Please try again.");
                            }
                        },
                        style: 'destructive'
                    }
                ]
            );
        } catch (error) {
            console.error('Error during logout:', error);
            Alert.alert("Error", "Failed to logout. Please try again.");
        }
    };

    useEffect(() => {
        if (isOpen) {
            fetchUserData();
        }
    }, [isOpen]);

    if (!isOpen) return null; // Don't render the menu if it's not open

    if (isLoading) {
        return (
            <View
                className="absolute bottom-0 left-0 right-0 bg-[#fff] rounded-t-[12px]"
                style={{
                    transform: [{ translateY: isOpen ? 0 : '100%' }],
                    zIndex: 1000,
                }}
            >
                <View className="h-[566px] flex items-center justify-center">
                    <ActivityIndicator size="large" color="#0829B2" />
                </View>
            </View>
        );
    }

    return (
        <>
            {/* Dark overlay behind the menu */}
            <View
                style={[styles.overlay, isOpen ? { opacity: 1 } : { opacity: 0 }]}
                onTouchStart={onClose} // Close menu when user clicks on the overlay
            />

            {/* Sliding menu */}
            <View
                className={`absolute bottom-0 left-0 right-0 bg-[#fff] rounded-t-[12px] transition-transform duration-300 ${isOpen ? 'translate-y-0' : 'translate-y-full'}`}
                style={{
                    transform: [{ translateY: isOpen ? 0 : '100%' }],
                    zIndex: 1000,
                }}
            >
                <View className="h-[566px]">
                    <View className='bg-[#FAF7F1] rounded-[10px] flex-row items-end justify-between p-8'>
                        <View className='flex-row items-center justify-start gap-4'>
                            <View className='bg-[#F9EFE0] border-[#DDD9CE] border rounded-[12px] p-5'>
                                <Text className='text-[#000000] font-semibold text-[24px]'>
                                    {userData?.name ? userData.name.substring(0, 2).toUpperCase() : 'AB'}
                                </Text>
                            </View>
                            <View className=''>
                                <Text className='text-[#282828] text-[20px] font-semibold'>
                                    {userData?.name || 'Ajala Bukky'}
                                </Text>
                                <Text className='text-[#555555] text-[16px] font-normal mt-1'>
                                    {userData?.email || 'bukky@yahoo.co.uk'}
                                </Text>
                                <Text className='text-[#555555] text-[12px] font-semibold mt-1'>
                                    Role: {userData?.role || 'ENUMERATOR'}
                                </Text>
                            </View>
                        </View>
                        <TouchableOpacity>
                            <AntDesign name="edit" size={22} color="#0829B3" />
                        </TouchableOpacity>
                    </View>
                    <View className='mt-5'>
                        <TouchableOpacity className='flex-row items-center gap-3 mt-6 px-7' onPress={() => router.push('/(auth)')}>
                            <MaterialCommunityIcons name="note-edit-outline" size={24} color="black" />
                            <Text className='text-[#282828] text-[18px] font-semibold'>Register</Text>
                        </TouchableOpacity>
                        <View className='border border-[#EDEBE7] w-full mt-5' />
                        <TouchableOpacity className='flex-row items-center gap-3 mt-6 px-7'>
                            <SimpleLineIcons name="tag" size={24} color="black" />
                            <Text className='text-[#282828] text-[18px] font-semibold'>Tags</Text>
                        </TouchableOpacity>
                        <View className='border border-[#EDEBE7] w-full mt-5' />
                        <TouchableOpacity className='flex-row items-center gap-3 mt-6 px-7'>
                            <AntDesign name="disconnect" size={24} color="black" />
                            <Text className='text-[#282828] text-[18px] font-semibold'>Offline Functions</Text>
                        </TouchableOpacity>
                        <View className='border border-[#EDEBE7] w-full mt-5' />
                        <TouchableOpacity 
                            className='flex-row items-center gap-3 mt-6 px-7'
                            onPress={handleLogout}
                        >
                            <AntDesign name="logout" size={24} color="black" />
                            <Text className='text-[#282828] text-[18px] font-semibold'>Logout</Text>
                        </TouchableOpacity>
                        <View className='border border-[#EDEBE7] w-full mt-5' />
                    </View>
                    <TouchableOpacity onPress={onClose}>
                        <View className='flex-row items-center justify-end gap-3 px-5 mt-8'>
                            <Text className='text-[#EB5757] text-[18px] font-medium'>Close</Text>
                            <FontAwesome5 name="times" size={14} color="#EB5757" />
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        </>
    );
};

const styles = {
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Dark overlay
        zIndex: 999, // Ensure overlay appears above content
    },
};

export default Menu;