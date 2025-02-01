import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Animated, Easing } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function LoadingCircle() {
    const [rotation] = useState(new Animated.Value(0));
  
    useEffect(() => {
      Animated.loop(
        Animated.timing(rotation, {
          toValue: 1,
          duration: 3000,
          easing: Easing.linear,
          useNativeDriver: true,
        })
      ).start();
    }, []);
  
    const spin = rotation.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '360deg'], 
    });
  
    return (
      <View style={styles.container}>
        <Animated.View style={[styles.circle, { transform: [{ rotate: spin }] }]}>
          <LinearGradient
            colors={['#010717',  'green',  '#010717']} 
            style={styles.gradient}
          />
        </Animated.View>
      </View>
    );
  }

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    circle: {
      width: 80,
      height: 80,
      borderRadius: 40,
      overflow: 'hidden',
      borderWidth: 0,
    },
    gradient: {
      flex: 1,
    },
  });