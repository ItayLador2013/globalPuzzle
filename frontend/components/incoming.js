import { setStatusBarNetworkActivityIndicatorVisible, StatusBar } from 'expo-status-bar';
import { Pressable, ScrollView, StyleSheet, Text, View, Image, ImageBackground, Dimensions, Modal, Animated, Easing, PanResponder, FlatList, findNodeHandle, TextInput, Keyboard } from 'react-native';
import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Entypo, Ionicons, FontAwesome5, Fontisto, Octicons, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons'; 
import * as Haptics from 'expo-haptics';
import storage from '../storage';
import * as Notifications from "expo-notifications";
import { Camera } from 'expo-camera';
import TypingTextAnimation from './TypingTextAnimation';




export default function Incoming({navigation, route}) {
    const server = storage.server
    const [hasPermission, setHasPermission] = React.useState(null);
    const [cameraType, setCameraType] = React.useState(Camera.Constants.Type.front);
    const [selected, setSelected] = React.useState("")
    const cameraRef = React.useRef(null);
    const other = route.params.other
    const image = route.params.image
    const token = route.params.token
    const user = route.params.user
    const notificationListener = React.useRef();
    const responseListener = React.useRef();

    React.useEffect(() => {

        notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
           
          notif = notification.request.content
          
            console.log(notif)
    
          if(notif.data.type=="endcall"){   
            Notifications.setNotificationHandler({
                handleNotification: async () => ({
                  shouldShowAlert: false,
                  shouldPlaySound: false,
                  shouldSetBadge: false,
                }),
              }); 
            decline()
          } 
          
        });  
      
    
        responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
            console.log("recieved?")
            if(notif.data.type=="endcall"){   
                navigation.goBack()
            }
        });
    
        return () => {
          Notifications.removeNotificationSubscription(notificationListener.current);
          Notifications.removeNotificationSubscription(responseListener.current);
        };
      }, []);

    React.useEffect(() => {
      console.log(user)
    }, [])

    React.useEffect(() => {
        (async () => {
          const { status } = await Camera.requestCameraPermissionsAsync();
          setHasPermission(status === 'granted');
        })();
      }, []);

      const decline = () => {
        console.log(token)
        fetch(server + `home/endCall/`, {
          method: "POST",
          headers: {
              "Content-Type": "application/json"
          },
          body: JSON.stringify({"user":user, "other":other, "token": token })
      })
      navigation.goBack()
        
      }

      const accept = () => {
        console.log(token)
        fetch(server + `home/acceptCall/`, {
          method: "POST",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify({"user":user, "token":token, "other":other})
        })
        .then(res => res.json())
        .then(res => {
          if(res){
            console.log(token)
            navigation.navigate("Call", {"user":user, "other":other, "token":token})
          }
        })
      }

      const press = (what) => {
        setSelected(what)
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy) 

      }

    
 
      return (
        <ImageBackground source={{uri: server + `media/` + image}} style={{flex: 1, backgroundColor: "#1c1b1b"}}>
        
          
                <View style={{width: "100%", alignItems: "center", marginTop: "17%", flexDirection: "column"}}>
                    <Text style={{color: "white", fontSize: 34, fontWeight: "bold"}}>
                        {other}</Text>
                    <View style={{flexDirection: "row"}}>
                            <Text style={{color: "white"}}>incoming video call</Text>
                            <TypingTextAnimation text="..." speed={450} />
                    </View>
                </View>

                <View style={{width: "100%", flexDirection: "row", alignSelf: "center", justifyContent: "space-around", position: "absolute", bottom: "10%"}}>
                        
                        <Pressable onPress={() => decline()} onPressIn={() => press("decline")} onPressOut={() => setSelected("")}
                        style={[{width: 75, height: 75, justifyContent: "center", 
                        alignItems: "center", backgroundColor: "red", borderRadius: 360},
                        selected=="decline" && {backgroundColor: "#611010"}]}>
                            <Ionicons name="call" size={42} color="white" 
                            style={{transform:[{rotate: "100deg"}]}}/>
                        </Pressable>

                        <Pressable onPress={() => accept()} onPressIn={() => press("accept")} onPressOut={() => setSelected("")}
                        style={[{width: 75, height: 75, justifyContent: "center", 
                        alignItems: "center", backgroundColor: "green", borderRadius: 360},
                        selected=="accept" && {backgroundColor: "#2b421d"}]}>
                            <Ionicons name="call" size={42} color="white" />
                        </Pressable>
      
                </View>

             
      
        </ImageBackground>
      );


}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    cameraContainer: {
      flex: 1,
      width: '100%',
      backgroundColor: 'transparent',
      height: "100%"
    },
    camera: {
      flex: 1,
      height: "100%",
    },
    overlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)', // Adjust the opacity as needed
    },
  });