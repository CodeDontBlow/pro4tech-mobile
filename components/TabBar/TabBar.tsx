import { Ionicons } from '@expo/vector-icons';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import styles from './tab.styles';

const TABS = [
  { name: 'index', icon: 'home' },
  { name: 'history', icon: 'file-tray-full' },
] as const;

export default function TabBar({ state, navigation }: BottomTabBarProps) {
  return (
    <View style={styles.container}>
      {TABS.map((tab, i) => {
        const isFocused = state.index === i;
        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: state.routes[i].key,
            canPreventDefault: true,
          });
          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(state.routes[i].name);
          }
        };

        return (
          
          <TouchableOpacity
          
            key={tab.name}
            onPress={onPress}
            style={styles.tab}
            activeOpacity={0.7}
          >
            
            <Ionicons
              name={isFocused ? tab.icon : `${tab.icon}-outline`}
              size={35  }
              color={styles.icon.color}
            />
          </TouchableOpacity>
        );
      })}
    </View>
  );
}