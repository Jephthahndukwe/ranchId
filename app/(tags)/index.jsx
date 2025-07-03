import { AntDesign } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, StatusBar, SafeAreaView } from 'react-native';

const TagsScreen = () => {
    const tagOptions = [
        { id: 1, title: 'Scan for Exit (Abattoir)', icon: '🔍' },
        { id: 2, title: 'Scan for Exit (Other)', icon: '🔍' },
        { id: 3, title: 'Scan for Sale', icon: '🔍' },
        { id: 4, title: 'Scan for Owner Change', icon: '🔍' },
        { id: 5, title: 'Scan for Theft/Loss', icon: '🔍' },
        { id: 6, title: 'Scan for Border Crossing', icon: '🔍' },
        { id: 7, title: 'Scan Other', icon: '🔍' },
    ];

    const handleTagPress = (tagId) => {
        console.log(`Tag ${tagId} pressed`);
        // Handle tag selection here
    };

    const handleBackPress = () => {
        console.log('Back pressed');
        // Handle navigation back
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <TouchableOpacity
                className="flex-row items-center gap-3 bg-[#fff] p-5"
                onPress={() => router.back()}
            >
                <AntDesign name="left" size={10} color="black" />
                <Text className="text-[#282828] text-[24px] font-normal">Tags</Text>
            </TouchableOpacity>

            {/* Tag List */}
            <View style={styles.content}>
                {tagOptions.map((tag) => (
                    <TouchableOpacity
                        key={tag.id}
                        style={styles.tagItem}
                        onPress={() => handleTagPress(tag.id)}
                        activeOpacity={0.7}
                    >
                        <View style={styles.iconContainer}>
                            <View style={styles.scanIcon}>
                                <View style={styles.scanIconInner} />
                                <View style={styles.scanIconCorner1} />
                                <View style={styles.scanIconCorner2} />
                                <View style={styles.scanIconCorner3} />
                                <View style={styles.scanIconCorner4} />
                            </View>
                        </View>
                        <Text style={styles.tagText}>{tag.title}</Text>
                    </TouchableOpacity>
                ))}
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FAF7F1',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: '#ffffff',
        borderBottomWidth: 1,
        borderBottomColor: '#e5e5e5',
    },
    backButton: {
        padding: 4,
    },
    backIcon: {
        fontSize: 24,
        color: '#007AFF',
        fontWeight: '300',
    },
    headerTitle: {
        fontSize: 17,
        fontWeight: '600',
        color: '#000000',
    },
    headerSpacer: {
        width: 32,
    },
    content: {
        flex: 1,
        backgroundColor: '#FAF7F1',
    },
    tagItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 18,
        paddingVertical: 20,
        borderBottomWidth: 0.5,
        borderBottomColor: '#e5e5e5',
    },
    iconContainer: {
        marginRight: 16,
        width: 24,
        height: 24,
        justifyContent: 'center',
        alignItems: 'center',
    },
    scanIcon: {
        width: 20,
        height: 20,
        position: 'relative',
        justifyContent: 'center',
        alignItems: 'center',
    },
    scanIconInner: {
        width: 12,
        height: 12,
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: '#666666',
        borderRadius: 2,
    },
    scanIconCorner1: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: 4,
        height: 4,
        borderTopWidth: 2,
        borderLeftWidth: 2,
        borderTopColor: '#666666',
        borderLeftColor: '#666666',
    },
    scanIconCorner2: {
        position: 'absolute',
        top: 0,
        right: 0,
        width: 4,
        height: 4,
        borderTopWidth: 2,
        borderRightWidth: 2,
        borderTopColor: '#666666',
        borderRightColor: '#666666',
    },
    scanIconCorner3: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        width: 4,
        height: 4,
        borderBottomWidth: 2,
        borderLeftWidth: 2,
        borderBottomColor: '#666666',
        borderLeftColor: '#666666',
    },
    scanIconCorner4: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        width: 4,
        height: 4,
        borderBottomWidth: 2,
        borderRightWidth: 2,
        borderBottomColor: '#666666',
        borderRightColor: '#666666',
    },
    tagText: {
        fontSize: 17,
        color: '#000000',
        fontWeight: '400',
    },
});

export default TagsScreen;