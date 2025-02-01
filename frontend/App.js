
import React from 'react';
import {  SafeAreaView,  ScrollView,  StatusBar,  StyleSheet,  Text,  useColorScheme,  View, Animated} from 'react-native';

import Login from './components/login';
import Home from './components/home';
import Signup from './components/signup'; 
import ProfileSet from './components/profileSet';
import Profile from './components/profile';
import Chat from './components/chat';
import Call from './components/call';
import Incoming from './components/incoming';
import Lookup from './components/lookup';
import Found from './components/found';
import MatchCall from './components/matchCall';
import NewChat from './components/newChat';

import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
 
const Stack = createNativeStackNavigator(); 





const App = () => {
  return (
    <NavigationContainer styles={{backgroundColor: "black"}}>
      <Stack.Navigator>

        <Stack.Screen name="Home" component={Home} options={{headerShown: false, autoHideHomeIndicator:true, gestureEnabled:false}}
        />
        <Stack.Screen name="Login" component={Login} options={{headerShown: false, autoHideHomeIndicator:true, animation: "fade", gestureEnabled:false}}
        />
        <Stack.Screen name="Signup" component={Signup} options={{headerShown: false, autoHideHomeIndicator:true, animation: "fade", gestureEnabled:false}}
        /> 
        <Stack.Screen name="ProfileSet" component={ProfileSet} options={{headerShown: false, autoHideHomeIndicator:true, animation: "fade", gestureEnabled:false}} 
        />
        <Stack.Screen name="Profile" component={Profile} options={{headerShown: false, autoHideHomeIndicator:true, animation: "slide", gestureEnabled:true, }}
        />
        <Stack.Screen name="Chat" component={Chat} options={{headerShown: false, autoHideHomeIndicator:true, animation: "slide", gestureEnabled:true, }}
        />
        <Stack.Screen name="Call" component={Call} options={{headerShown: false, autoHideHomeIndicator:true, animation: "fade", gestureEnabled:false, }}
        />
        <Stack.Screen name="Incoming" component={Incoming} options={{headerShown: false, autoHideHomeIndicator:true, animation: "fade", gestureEnabled:false, }}
        />
        <Stack.Screen name="Lookup" component={Lookup} options={{headerShown: false, autoHideHomeIndicator:true, animation: "fade", gestureEnabled:false, }}
        />
        <Stack.Screen name="Found" component={Found} options={{headerShown: false, autoHideHomeIndicator:true, animation: "fade", gestureEnabled:false, }}
        />
        <Stack.Screen name="MatchCall" component={MatchCall} options={{headerShown: false, autoHideHomeIndicator:true, animation: "fade", gestureEnabled:false, }}
        />
        <Stack.Screen name="NewChat" component={NewChat} options={{headerShown: false, autoHideHomeIndicator:true, animation: "slide", gestureEnabled:true, }}
        />
        

      </Stack.Navigator>
    </NavigationContainer>
  );
};


const styles = StyleSheet.create({
  
});

export default App;
