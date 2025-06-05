import React, { useState } from 'react';
import { StyleSheet, Text, View, FlatList, Image, TouchableOpacity, Platform } from 'react-native';
import { Bell, MessageSquare, Heart, UserPlus, Star, Settings } from 'lucide-react-native';
import Animated, { 
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import Colors from '../../constants/Colors';

type NotificationType = 'message' | 'like' | 'follow' | 'mention' | 'review';

interface Notification {
  id: string;
  type: NotificationType;
  user: {
    name: string;
    avatar: string;
  };
  content: string;
  timestamp: string;
  read: boolean;
}

const NOTIFICATIONS: Notification[] = [
  {
    id: '1',
    type: 'message',
    user: {
      name: 'Emily Chen',
      avatar: 'https://images.pexels.com/photos/1542085/pexels-photo-1542085.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
    },
    content: 'sent you a new message',
    timestamp: '2m ago',
    read: false
  },
  {
    id: '2',
    type: 'like',
    user: {
      name: 'Marcus Johnson',
      avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
    },
    content: 'liked your recent post',
    timestamp: '15m ago',
    read: false
  },
  {
    id: '3',
    type: 'follow',
    user: {
      name: 'Sofia Rodriguez',
      avatar: 'https://images.pexels.com/photos/1520760/pexels-photo-1520760.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
    },
    content: 'started following you',
    timestamp: '1h ago',
    read: true
  },
  {
    id: '4',
    type: 'mention',
    user: {
      name: 'Alex Kim',
      avatar: 'https://images.pexels.com/photos/1516680/pexels-photo-1516680.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
    },
    content: 'mentioned you in a comment',
    timestamp: '2h ago',
    read: true
  },
  {
    id: '5',
    type: 'review',
    user: {
      name: 'Isabella Martinez',
      avatar: 'https://images.pexels.com/photos/1587009/pexels-photo-1587009.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
    },
    content: 'left a review on your profile',
    timestamp: '3h ago',
    read: true
  }
];

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

export default function NotificationsScreen() {
  const [notifications, setNotifications] = useState<Notification[]>(NOTIFICATIONS);
  const [selectedFilter, setSelectedFilter] = useState<NotificationType | 'all'>('all');
  
  const headerScale = useSharedValue(1);
  const filterBarTranslateY = useSharedValue(0);

  const getNotificationIcon = (type: NotificationType) => {
    switch (type) {
      case 'message':
        return <MessageSquare size={20} color={Colors.primary} />;
      case 'like':
        return <Heart size={20} color={Colors.accent} />;
      case 'follow':
        return <UserPlus size={20} color={Colors.primary} />;
      case 'mention':
        return <Star size={20} color="#FFA500" />;
      case 'review':
        return <Star size={20} color="#FFD700" />;
      default:
        return <Bell size={20} color={Colors.primary} />;
    }
  };

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  const headerStyle = useAnimatedStyle(() => ({
    transform: [{ scale: headerScale.value }]
  }));

  const filterBarStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: filterBarTranslateY.value }]
  }));

  const renderNotification = ({ item }: { item: Notification }) => {
    const scale = useSharedValue(1);
    
    const onPressIn = () => {
      scale.value = withSpring(0.95);
    };
    
    const onPressOut = () => {
      scale.value = withSpring(1);
    };
    
    const animatedStyle = useAnimatedStyle(() => ({
      transform: [{ scale: scale.value }]
    }));

    return (
      <AnimatedTouchable
        style={[styles.notificationItem, !item.read && styles.unreadItem, animatedStyle]}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        onPress={() => markAsRead(item.id)}
        activeOpacity={0.9}
      >
        <Image source={{ uri: item.user.avatar }} style={styles.avatar} />
        <View style={styles.notificationContent}>
          <View style={styles.notificationHeader}>
            <Text style={styles.username}>{item.user.name}</Text>
            <Text style={styles.timestamp}>{item.timestamp}</Text>
          </View>
          <Text style={styles.notificationText}>{item.content}</Text>
        </View>
        <View style={styles.iconContainer}>
          {getNotificationIcon(item.type)}
        </View>
      </AnimatedTouchable>
    );
  };

  const filteredNotifications = selectedFilter === 'all'
    ? notifications
    : notifications.filter(n => n.type === selectedFilter);

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.header, headerStyle]}>
        <Text style={styles.title}>Notifications</Text>
        <TouchableOpacity style={styles.settingsButton}>
          <Settings size={24} color={Colors.secondary} />
        </TouchableOpacity>
        {unreadCount > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{unreadCount}</Text>
          </View>
        )}
      </Animated.View>

      <Animated.ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={[styles.filterBar, filterBarStyle]}
        contentContainerStyle={styles.filterBarContent}
      >
        {['all', 'message', 'like', 'follow', 'mention', 'review'].map((filter) => (
          <TouchableOpacity
            key={filter}
            style={[
              styles.filterButton,
              selectedFilter === filter && styles.filterButtonActive
            ]}
            onPress={() => setSelectedFilter(filter as NotificationType | 'all')}
          >
            <Text
              style={[
                styles.filterText,
                selectedFilter === filter && styles.filterTextActive
              ]}
            >
              {filter.charAt(0).toUpperCase() + filter.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </Animated.ScrollView>

      <FlatList
        data={filteredNotifications}
        renderItem={renderNotification}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        onScroll={({ nativeEvent }) => {
          const offset = nativeEvent.contentOffset.y;
          headerScale.value = withTiming(offset > 0 ? 0.95 : 1, {
            duration: 200,
            easing: Easing.bezier(0.25, 0.1, 0.25, 1),
          });
          filterBarTranslateY.value = withTiming(offset > 0 ? -10 : 0, {
            duration: 200,
            easing: Easing.bezier(0.25, 0.1, 0.25, 1),
          });
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingTop: Platform.OS === 'ios' ? 60 : 24,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    height: 56,
    position: 'relative',
  },
  title: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 24,
    color: Colors.secondary,
  },
  settingsButton: {
    position: 'absolute',
    right: 16,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    position: 'absolute',
    top: 8,
    right: 12,
    backgroundColor: Colors.accent,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.background,
  },
  badgeText: {
    color: Colors.background,
    fontSize: 10,
    fontFamily: 'Inter-Bold',
    paddingHorizontal: 4,
  },
  filterBar: {
    marginTop: 16,
    marginBottom: 8,
  },
  filterBarContent: {
    paddingHorizontal: 12,
    gap: 8,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.textLight + '40',
  },
  filterButtonActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  filterText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    color: Colors.text,
  },
  filterTextActive: {
    color: Colors.background,
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 24,
  },
  notificationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: Colors.background,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: Colors.secondary,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  unreadItem: {
    backgroundColor: Colors.primary + '10',
    borderLeftWidth: 4,
    borderLeftColor: Colors.primary,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
  },
  notificationContent: {
    flex: 1,
  },
  notificationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  username: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: Colors.secondary,
  },
  timestamp: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    color: Colors.textLight,
  },
  notificationText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: Colors.text,
  },
  iconContainer: {
    marginLeft: 12,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.secondary,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
});