import { View, Text, ScrollView, TouchableOpacity, Image, ActivityIndicator, Alert } from 'react-native';
import React, { useState, useEffect, useRef } from 'react';
import { useNavigation, router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Animatable from 'react-native-animatable';
import { Ionicons, FontAwesome, MaterialCommunityIcons, Feather, FontAwesome5 } from '@expo/vector-icons';
import { icons } from '../../../constant';
import Menu from '../../../components/Menu';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Index() {
  const navigation = useNavigation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("month");
  const [indicatorPosition, setIndicatorPosition] = useState(0);
  const [userData, setUserData] = useState(null);
  const [reportData, setReportData] = useState({
    today: { tagged: 0, owners: 0, keepers: 0, exited: 0 },
    week: { tagged: 0, owners: 0, keepers: 0, exited: 0 },
    month: { tagged: 0, owners: 0, keepers: 0, exited: 0 },
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const tabRefs = useRef([]);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Get user data from storage
        const storedUserData = await AsyncStorage.getItem('userData');
        const token = await AsyncStorage.getItem('userToken');
        
        if (!token || !storedUserData) {
          // console.log('Dashboard - No auth data found, redirecting to login');
          router.replace('/');
          return;
        }

        // Parse and set user data
        const parsedUserData = JSON.parse(storedUserData);
        setUserData(parsedUserData);
        // console.log('Dashboard initialized with user:', parsedUserData);

        // Fetch report data
        await fetchReportData(token);
      } catch (error) {
        // console.error('Dashboard - Error initializing:', error);
        router.replace('/');
      }
    };

    initializeAuth();
    navigation.setOptions({
      headerShown: false,
    });
  }, []);

  const fetchReportData = async (token) => {
    try {
      // Fetch all livestock owners with pagination
      const [ownersResponse, keepersResponse, taggedResponse] = await Promise.all([
        fetch('https://api.ranchid.app/api/enumerator/get_livestock_owners?limit=1000&page=1', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
          },
        }),
        // Fetch all livestock keepers with pagination
        fetch('https://api.ranchid.app/api/enumerator/get_livestock_keepers?limit=1000&page=1', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
          },
        }),
        // Fetch all tagged livestock with pagination - wrapped in try/catch to handle potential errors
        (async () => {
          try {
            const response = await fetch('https://api.ranchid.app/api/dashboard/all_tagged_livestock?limit=1000&page=1', {
              headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json',
              },
            });
            return await response.json();
          } catch (error) {
            // console.warn('Error fetching tagged livestock:', error);
            return { status: 'error', message: 'Failed to fetch tagged livestock' };
          }
        })()
      ]);

      // Parse responses
      let ownersData = {};
      let keepersData = {};
      let taggedData = {};

      // Handle owners response
      if (ownersResponse.ok) {
        ownersData = await ownersResponse.json();
      } else {
        // console.warn('Failed to fetch owners:', ownersResponse.status);
      }

      // Handle keepers response
      if (keepersResponse.ok) {
        keepersData = await keepersResponse.json();
      } else {
        // console.warn('Failed to fetch keepers:', keepersResponse.status);
      }

      // Tagged data is already parsed in the try/catch above
      taggedData = taggedResponse;

      // console.log('Owners API Response:', JSON.stringify(ownersData, null, 2));
      // console.log('Keepers API Response:', JSON.stringify(keepersData, null, 2));
      // console.log('Tagged API Response:', JSON.stringify(taggedData, null, 2));

      // Get current date for filtering
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      const monthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());

      // Filter function for dates
      const filterByDate = (dateString, startDate) => {
        if (!dateString) return false;
        const itemDate = new Date(dateString);
        return itemDate >= startDate;
      };

      // Process owners data - handle different response structures
      let allOwners = [];
      if (ownersData) {
        if (Array.isArray(ownersData)) {
          allOwners = ownersData;
        } else if (ownersData.data && Array.isArray(ownersData.data)) {
          allOwners = ownersData.data;
        } else if (ownersData.owners && Array.isArray(ownersData.owners)) {
          allOwners = ownersData.owners;
        } else if (ownersData.status === 'success' && Array.isArray(ownersData.records)) {
          allOwners = ownersData.records;
        } else if (ownersData.records && Array.isArray(ownersData.records)) {
          allOwners = ownersData.records;
        }
        // console.log('Processed owners count:', allOwners.length);
      }
      
      const ownersToday = allOwners.filter(owner => 
        owner && owner.created_at && filterByDate(owner.created_at, today)
      );
      const ownersThisWeek = allOwners.filter(owner => 
        owner && owner.created_at && filterByDate(owner.created_at, weekAgo)
      );
      const ownersThisMonth = allOwners.filter(owner => 
        owner && owner.created_at && filterByDate(owner.created_at, monthAgo)
      );

      // Process keepers data - handle different response structures
      let allKeepers = [];
      if (keepersData) {
        if (Array.isArray(keepersData)) {
          allKeepers = keepersData;
        } else if (keepersData.data && Array.isArray(keepersData.data)) {
          allKeepers = keepersData.data;
        } else if (keepersData.keepers && Array.isArray(keepersData.keepers)) {
          allKeepers = keepersData.keepers;
        } else if (keepersData.status === 'success' && Array.isArray(keepersData.records)) {
          allKeepers = keepersData.records;
        }
      }
      
      const keepersToday = allKeepers.filter(keeper => 
        keeper && keeper.created_at && filterByDate(keeper.created_at, today)
      );
      const keepersThisWeek = allKeepers.filter(keeper => 
        keeper && keeper.created_at && filterByDate(keeper.created_at, weekAgo)
      );
      const keepersThisMonth = allKeepers.filter(keeper => 
        keeper && keeper.created_at && filterByDate(keeper.created_at, monthAgo)
      );

      // Process tagged livestock data - handle different response structures and authorization errors
      let allTagged = [];
      if (taggedData) {
        if (taggedData.status === 'Failed' || taggedData.status === 'error') {
          // console.warn('Tagged livestock data not available:', taggedData.message || 'Unknown error');
        } else if (Array.isArray(taggedData)) {
          allTagged = taggedData;
        } else if (taggedData.data && Array.isArray(taggedData.data)) {
          allTagged = taggedData.data;
        } else if (taggedData.livestocks && Array.isArray(taggedData.livestocks)) {
          allTagged = taggedData.livestocks;
        } else if (taggedData.records && Array.isArray(taggedData.records)) {
          allTagged = taggedData.records;
        } else if (taggedData.status === 'success' && Array.isArray(taggedData.data)) {
          allTagged = taggedData.data;
        }
        // console.log('Processed tagged livestock count:', allTagged.length);
      }
      
      const taggedToday = allTagged.filter(tag => 
        tag && tag.created_at && filterByDate(tag.created_at, today)
      );
      const taggedThisWeek = allTagged.filter(tag => 
        tag && tag.created_at && filterByDate(tag.created_at, weekAgo)
      );
      const taggedThisMonth = allTagged.filter(tag => 
        tag && tag.created_at && filterByDate(tag.created_at, monthAgo)
      );
      
      // console.log('Processed Counts:', {
      //   allOwners: allOwners.length,
      //   allKeepers: allKeepers.length,
      //   allTagged: allTagged.length,
      //   ownersToday: ownersToday.length,
      //   keepersToday: keepersToday.length,
      //   taggedToday: taggedToday.length,
      //   ownersDataStructure: Array.isArray(ownersData) ? 'array' : 
      //                      (ownersData ? Object.keys(ownersData) : 'null/undefined'),
      //   keepersDataStructure: Array.isArray(keepersData) ? 'array' : 
      //                       (keepersData ? Object.keys(keepersData) : 'null/undefined'),
      //   taggedDataStructure: Array.isArray(taggedData) ? 'array' : 
      //                      (taggedData ? Object.keys(taggedData) : 'null/undefined'),
      //   ownersSample: allOwners.length > 0 ? allOwners[0] : 'No owners',
      //   keepersSample: allKeepers.length > 0 ? allKeepers[0] : 'No keepers',
      //   taggedSample: allTagged.length > 0 ? allTagged[0] : 'No tagged livestock'
      // });

          // Update report data with actual counts
      const newReportData = {
        today: {
          tagged: taggedToday.length,
          owners: ownersToday.length,
          keepers: keepersToday.length,
          exited: 0, // This would require an API endpoint
        },
        week: {
          tagged: taggedThisWeek.length,
          owners: ownersThisWeek.length,
          keepers: keepersThisWeek.length,
          exited: 0, // This would require an API endpoint
        },
        month: {
          tagged: taggedThisMonth.length,
          owners: ownersThisMonth.length,
          keepers: keepersThisMonth.length,
          exited: 0, // This would require an API endpoint
        },
      };
      
      setReportData(newReportData);
      
      // Store the full data in AsyncStorage for offline access
      await AsyncStorage.setItem('livestockData', JSON.stringify({
        owners: allOwners,
        keepers: allKeepers,
        tagged: allTagged,
        lastUpdated: new Date().toISOString(),
        reportData: newReportData
      }));
      
      setIsLoading(false);

    } catch (error) {
      // console.error('Error fetching report data:', error);
      setError('Failed to fetch dashboard data. Trying to load from cache...');
      
      // Try to load from cache if online fetch fails
      try {
        const cachedData = await AsyncStorage.getItem('livestockData');
        if (cachedData) {
          const { reportData: cachedReportData, lastUpdated } = JSON.parse(cachedData);
          // console.log('Loaded data from cache, last updated:', lastUpdated);
          if (cachedReportData) {
            setReportData(cachedReportData);
            setError(null);
          }
        }
      } catch (cacheError) {
        // console.error('Error loading from cache:', cacheError);
        setError('Failed to load data. Please check your connection and try again.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const handleTabPress = (tab, index) => {
    setActiveTab(tab);
    tabRefs.current[index]?.measure((x) => {
      setIndicatorPosition(x);
    });
  };

  // Refresh data when tab changes
  useEffect(() => {
    const refreshData = async () => {
      const token = await AsyncStorage.getItem('userToken');
      if (token) {
        await fetchReportData(token);
      }
    };
    refreshData();
  }, [activeTab]);

  return (
    <SafeAreaView className="h-full bg-[#FAF7F1]">
      {isLoading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#0829B2" />
          <Text className="mt-4 text-gray-600">Loading dashboard data...</Text>
        </View>
      ) : error ? (
        <View className="flex-1 justify-center items-center p-4">
          <Text className="text-red-500 text-center mb-4">{error}</Text>
          <TouchableOpacity 
            className="bg-[#0829B2] px-4 py-2 rounded-lg"
            onPress={async () => {
              const token = await AsyncStorage.getItem('userToken');
              if (token) await fetchReportData(token);
            }}
          >
            <Text className="text-white">Retry</Text>
          </TouchableOpacity>
        </View>
      ) : (
      <ScrollView className="px-4 my-8">
        {/* Dashboard Title & Icons */}
        <Animatable.View animation="fadeInDown" duration={800} className="flex-row items-center justify-between">
          <Text className="text-[#282828] text-[24px] font-normal">Dashboard</Text>
          <View className="flex-row items-center justify-center gap-8">
            <Ionicons name="notifications" size={20} color="black" />
            <TouchableOpacity onPress={toggleMenu}>
              <FontAwesome name="bars" size={20} color="black" />
            </TouchableOpacity>
          </View>
        </Animatable.View>

        {/* Welcome Text */}
        <Animatable.View animation="fadeInUp" delay={300} className="mt-7">
          <Text className="text-[#282828] text-[20px] font-normal">
            Welcome <Text className="font-bold">{userData?.username || 'User'}</Text>
          </Text>
          <Text className="text-[#282828] font-extrabold text-[14px] mt-8">YOUR ACTIVITIES</Text>
        </Animatable.View>

        {/* Tabs */}
        <Animatable.View animation="slideInLeft" delay={500} className="mt-7">
          <View className="flex-row items-center justify-between relative">
            {["today", "week", "month"].map((tab, index) => (
              <TouchableOpacity
                key={tab}
                ref={(el) => (tabRefs.current[index] = el)}
                onPress={() => handleTabPress(tab, index)}
                className="flex-1 items-center"
              >
                <Text className={`text-[16px] font-medium ${activeTab === tab ? "text-[#0829B2]" : "text-[#4F4F4F]"}`}>
                  {tab === "today" ? "Today" : tab === "week" ? "This Week" : "This Month"}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Underline Indicator */}
          <View className="mt-3 relative">
            <Animatable.View
              animation="slideInLeft"
              duration={300}
              className="absolute bg-[#0829B2] h-[4px] rounded-t-[4px] transition-all"
              style={{
                width: "30%",
                left: indicatorPosition,
              }}
            />
          </View>

          <View className="w-full border border-solid border-[#E0E0E0] mt-[5px]" />
        </Animatable.View>

        {/* Report Cards */}
        <Animatable.View animation="fadeInUp" delay={700} className="mt-6">
          <Animatable.View animation="bounceIn" delay={800} className="bg-[#3E55B2] w-full p-6 rounded-[12px] flex-row items-end justify-between">
            <View>
              <Text className="text-white text-[32px] font-semibold">{reportData[activeTab].tagged}</Text>
              <Text className="text-white text-[16px] font-normal mt-3">Tagged Livestock</Text>
            </View>
            <MaterialCommunityIcons name="marker-check" size={24} color="white" />
          </Animatable.View>

          <Animatable.View animation="bounceIn" delay={900} className="bg-[#E05F75] w-full p-6 rounded-[12px] flex-row items-end justify-between mt-5">
            <View>
              <Text className="text-white text-[32px] font-semibold">{reportData[activeTab].owners}</Text>
              <Text className="text-white text-[16px] font-normal mt-3">Livestock Owner</Text>
            </View>
            <Feather name="users" size={24} color="white" />
          </Animatable.View>

          <Animatable.View animation="bounceIn" delay={1000} className="bg-[#467250] w-full p-6 rounded-[12px] flex-row items-end justify-between mt-5">
            <View>
              <Text className="text-white text-[32px] font-semibold">{reportData[activeTab].keepers}</Text>
              <Text className="text-white text-[16px] font-normal mt-3">Livestock Keeper</Text>
            </View>
            <FontAwesome5 name="users" size={24} color="white" />
          </Animatable.View>

          <Animatable.View animation="bounceIn" delay={1100} className="bg-[#D67D42] w-full p-6 rounded-[12px] flex-row items-end justify-between mt-5">
            <View>
              <Text className="text-white text-[32px] font-semibold">{reportData[activeTab].exited}</Text>
              <Text className="text-white text-[16px] font-normal mt-3">Exited Owner</Text>
            </View>
            <Image source={icons.frame} />
          </Animatable.View>
        </Animatable.View>
      </ScrollView>
      )}
      
      {/* Render the Menu component */}
      <Menu isOpen={isMenuOpen} onClose={toggleMenu} />
    </SafeAreaView>
  );
}