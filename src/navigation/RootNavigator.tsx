import React, { useEffect, useRef } from 'react';
import { NavigationContainer, NavigationContainerRef } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { HomeScreen } from '@screens/HomeScreen';
import { CarDetailScreen } from '@screens/CarDetailScreen';
import { StaticHomeScreen } from '@static-screen/StaticHomeScreen';
import { registerNavigator } from '@sdui/actions/actionHandler';

type RootStackParamList = {
  home: undefined;
  car_detail: { carId?: string } | undefined;
  static_home: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator() {
  const navRef = useRef<NavigationContainerRef<RootStackParamList>>(null);

  useEffect(() => {
    // Connects the SDUI action handler to real navigation — once this
    // runs, "navigate" actions actually move screens instead of just
    // logging a warning.
    registerNavigator((screenName, params) => {
      navRef.current?.navigate(screenName as keyof RootStackParamList, params as any);
    });
  }, []);

  return (
    <NavigationContainer ref={navRef}>
      <Stack.Navigator initialRouteName="home">
        <Stack.Screen name="home" component={HomeScreen} options={{ title: 'Cars24' }} />
        <Stack.Screen name="car_detail" component={CarDetailScreen} options={{ title: 'Car Detail' }} />
        <Stack.Screen name="static_home" component={StaticHomeScreen} options={{ title: 'Static (Benchmark)' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}