import { TextInput, View, Text, StyleSheet, Image, Pressable, Dimensions, PanResponder, findNodeHandle, Animated, FlatList, ActivityIndicator, ImageBackground, AppState, Easing } from "react-native"
import React from "react";
import storage from "../storage";
import AsyncStorage from '@react-native-async-storage/async-storage';
import Hobbies from "./hobbies";
import Flag from 'react-native-flags';
import AntDesign from '@expo/vector-icons/AntDesign';
import Ionicon from "@expo/vector-icons/Ionicons";
import MaterialCommunityIcon from "@expo/vector-icons/MaterialCommunityIcons";
import FontAwsome5 from "@expo/vector-icons/FontAwesome5"
import MaterialIcon from "@expo/vector-icons/MaterialIcons"; 
import Entypo from "@expo/vector-icons/Entypo";
import Octicon from "@expo/vector-icons/Octicons";
import FontAwsome from "@expo/vector-icons/FontAwesome"
import Fontisto from "@expo/vector-icons/Fontisto";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5"
import jobs from "./jobs";
import { SafeAreaView } from "react-native";
import * as Haptics from 'expo-haptics';
import {LinearGradient} from 'expo-linear-gradient';
import MapView from 'react-native-maps';
import {Polyline, Marker} from 'react-native-maps'
import * as Notifications from 'expo-notifications';
import { useIsFocused } from '@react-navigation/native'; 
import TypingTextAnimation from './TypingTextAnimation';


Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: false,
      shouldSetBadge: false,
    }),
});



export default Lookup = ({navigation, route}) => {

    const server = storage.server
    const isFocused = useIsFocused();
    const user = route.params.user
    const token = route.params.token
    const number = route.params.number
    const [found, setFound] = React.useState(false)
    const appState = React.useRef(AppState.currentState);
    const [appStateVisible, setAppStateVisible] = React.useState(appState.current);
    const window = Dimensions.get("window")
    const [degrees] = React.useState(new Animated.Value(window.width * 0.40))
    const [selected, setSelected] = React.useState("")
    const [deg] = React.useState(new Animated.Value(0))
   
    React.useEffect(() => {
      const subscription = AppState.addEventListener('change', nextAppState => {
        if (
          appState.current.match(/inactive|background/) &&
          nextAppState === 'active'
        ) {
          console.log('App has come to the foreground!');
        }
  
        appState.current = nextAppState;
        setAppStateVisible(appState.current);
        if(appState.current == "background"){
            cancelSearch()
        }
      });
  
      return () => {
        subscription.remove(); 
      }; 
    }, []);

    const startSearch = () => {
        fetch(server + `home/startSearch/`, {
            method: "POST",
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify({"user":user, "token":token, "number": number})
        })
        .then(res => res.json())
        .then(res => { 
            if(res != null){
                searchFound(res)
            }
        })
    }

    const cancelSearch = () => {
        fetch(server + `home/cancelSearch/`, {
            method: "POST",
            headers: {
                "content-type": "application/json",
            },
            body: JSON.stringify({"user":user, "token":token})
        })
        .then(res => res.json())
        .then(res => {
            
            if(res){
                navigation.goBack() 
            }
        }) 
    }

    const searchFound = (other) => { 
        setFound(true)
        navigation.navigate("Found", {"user":user, "other":other, "token":token})
    }

    React.useEffect(() => {

        startSearch() 

    }, [ ,isFocused]) 

    React.useEffect(() => {
        Animated.loop(
          Animated.timing(degrees, {
            toValue: window.height * 1.1,
            duration: 750,
            easing: Easing.linear, 
            useNativeDriver: false,
          })
        ).start();

        Animated.loop(
          Animated.timing(deg, {
            toValue: 1,
            duration: 3000,
            easing: Easing.linear, 
            useNativeDriver: true,
          })
        ).start();
        
      }, []);
    
      const spin = deg.interpolate({
        inputRange: [0, 1],
        outputRange: ["0deg", "360deg"], 
      });
        
    return (
        <View style={{flex: 1, width: "100%", height: "100%", backgroundColor: "black", display: "flex", flexDirection: "coloumn", alignItems: "center", justifyContent: "center"}}>
 
                   
                        
                   

                    <Animated.View 
                    style={{borderColor: "rgba(0, 225, 0, 0.5)", borderWidth: 10,width: degrees, height: degrees, borderRadius: 360, position: "absolute"}}>

                    </Animated.View>

                    <Animated.View style={{width: window.height * 2, height: window.width * 0.60, transform: [{rotate: spin}], position: "absolute"}}>

                          <LinearGradient
                          colors={["transparent", "green", 'transparent']}
                          style={{width: "50%", height: "100%"}}
                          >

                          </LinearGradient>
                           
                    </Animated.View>

                   
                

                    <View style={{ backgroundColor: "black", borderRadius: 360, padding: window.width * .05, minWidth: window.width * .40, minHeight: window.width * .40, justifyContent: "center", alignItems: "center" }}> 


                   
                    

                    <Pressable onPress={() => cancelSearch()} onPressIn={() => setSelected("cancel")} onPressOut={() => setSelected("")}
                    style={[{padding: "2%", borderWidth: 1, borderColor: "white", borderRadius: 20,}, selected==
                    "cancel" && {opacity: .4}]}>
                    <Text style={{color:"white", }}>cancel search</Text>
                    </Pressable> 

                    </View>



                  
        </View>
    )
}

const styles = StyleSheet.create({
    

    
}) 