import { setStatusBarNetworkActivityIndicatorVisible, StatusBar } from 'expo-status-bar';
import { Pressable, ScrollView, StyleSheet, Text, View, Image, ImageBackground, Dimensions, Modal, Animated, Easing, PanResponder, FlatList, findNodeHandle, TextInput, Keyboard, Platform, PermissionsAndroid } from 'react-native';
import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Entypo, Ionicons, FontAwesome5, Fontisto, Octicons, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons'; 
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';
import storage from '../storage';
import * as Notifications from "expo-notifications";
import { Camera } from 'expo-camera';
import { Audio } from 'expo-av';
import AgoraUIKit from 'agora-rn-uikit';
import 'expo-dev-client';
import {ClientRoleType, createAgoraRtcEngine, IRtcEngine, RtcSurfaceView, ChannelProfileType, } from 'react-native-agora';
import { SafeAreaView } from 'react-native-safe-area-context';
import { UserJoined } from 'agora-rn-uikit/src/Reducer';
import profileSet from './profileSet';

const appId = '8d6cd4c659d148efb99750db2b40f2df';
const auth = 'e0688dd1f27d49fbaf5dc2a13163628d';
const uid = 0;

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: false,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
}); 

export default function MatchCall({navigation, route}) {
    const server = storage.server
    const [hasPermission, setHasPermission] = React.useState(null);
    const [cameraType, setCameraType] = React.useState(Camera.Constants.Type.front);
    const cameraRef = React.useRef(null);
    const other = route.params.other
    const [sound, setSound] = React.useState(); 
    const [selected, setSelected] = React.useState("");
    const [videoCall, setVideoCall] = React.useState(true)
    const token = route.params.token
    const user = route.params.user
    const [channel, setChannel] = React.useState("")
    const notificationListener = React.useRef();
    const responseListener = React.useRef();
    const [up, setUp] = React.useState("")
    const [friend, setFriend] = React.useState(route.params.friend)
    const [requested, setRequested] = React.useState(false)
    const [beingRequested, setBeingRequested] = React.useState(false)

    function showMessage(msg) {
      setMessage(msg);
    }

    React.useEffect(() => {
        let ch = ""
        let arr = [user, other]
        arr.sort()
        for(let i=0; i < arr.length; i++){
            ch += arr[i] 
            console.log(arr[i])
        }
        setChannel(ch)
    }, [])


    React.useEffect(() => {

        notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
           
          notif = notification.request.content
          
            console.log(notif)
    
          if(notif.data.type=="endcall"){   
            console.log("Hi")
            endMatch()
          } else if(notif.data.type=="request" && notif.data.user == other){
            setRequested(true)
            setBeingRequested(true)
          } 
          
        });  
      
    
        responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
            if(notif.data.type=="endcall"){  
                endMatch()
            }
        });
    
        return () => {
          Notifications.removeNotificationSubscription(notificationListener.current);
          Notifications.removeNotificationSubscription(responseListener.current);
        };
      }, []);

    const playSound = async () => {
        console.log('Loading Sound');
        const { sound } = await Audio.Sound.createAsync( require('../assets/calling.mp3')
        );
        setSound(sound);
    
        console.log('Playing Sound');
        await sound.playAsync();
        sound.setIsLoopingAsync(true); // Disable default looping
        
      }
    
 

    React.useEffect(() => { 
        (async () => {    
          const { status } = await Camera.requestCameraPermissionsAsync();
          setHasPermission(status === 'granted');
        })();
      }, []);

      const endMatch = () => {
    
        fetch(server + `home/endMatch/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({"user":user, "other":other, "token": token })
        })
        navigation.navigate("Home")
      }

      const reverse = () => {
        if(cameraType==Camera.Constants.Type.back){
            setCameraType(Camera.Constants.Type.front)
        } else {
            setCameraType(Camera.Constants.Type.back)
        }
      }

      const press = (what) => {
        setSelected(what)
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy)

      }

      const props = {
        connectionData: {
          appId: '8d6cd4c659d148efb99750db2b40f2df',
          channel: channel != null ? channel : "",  
        },
        rtcCallbacks: {
          EndCall: () => endMatch(),  
        },
      };


const FLAGS = {
  "Afghanistan": "🇦🇫",
  "Akrotiri": "🇦🇨",
  "Albania": "🇦🇱",
  "Algeria": "🇩🇿",
  "American Samoa": "🇦🇸",
  "Andorra": "🇦🇩",
  "Angola": "🇦🇴",
  "Anguilla": "🇦🇮",
  "Antigua and BarbBarbuda": "🇦🇬",
  "Argentina": "🇦🇷",
  "Armenia": "🇦🇲",
  "Aruba": "🇦🇼",
  "Australia": "🇦🇺",
  "Austria": "🇦🇹",
  "Azerbaijan": "🇦🇿",
  "Bahrain": "🇧🇭",
  "Bangladesh": "🇧🇩",
  "Barbados": "🇧🇧",
  "Belarus": "🇧🇾",
  "Belgium": "🇧🇪",
  "Belize": "🇧🇿",
  "Benin": "🇧🇯",
  "Bermuda": "🇧🇲",
  "Bhutan": "🇧🇹",
  "Bolivia": "🇧🇴",
  "Bosnia and Herzegovina": "🇧🇦",
  "Botswana": "🇧🇼",
  "Brazil": "🇧🇷",
  "British Indian Ocean Territory": "🇮🇴",
  "British Virgin Islands": "🇻🇬",
  "Brunei": "🇧🇳",
  "Bulgaria": "🇧🇬",
  "Burkina Faso": "🇧🇫",
  "Burundi": "🇧🇮",
  "Cabo Verde": "🇨🇻",
  "Cambodia": "🇰🇭",
  "Cameroon": "🇨🇲",
  "Canada": "🇨🇦",
  "Cayman Islands": "🇰🇾",
  "Central African Republic": "🇨🇫",
  "Chad": "🇹🇩",
  "Chile": "🇨🇱",
  "China": "🇨🇳",
  "Christmas Island": "🇨🇽",
  "Cocos Islands": "🇨🇨",
  "Colombia": "🇨🇴",
  "Comoros": "🇰🇲",
  "Cook Islands": "🇨🇰",
  "Costa Rica": "🇨🇷",
  "Côte d'Ivoire": "🇨🇮",
  "Croatia": "🇭🇷",
  "Cuba": "🇨🇺",
  "Curaçao": "🇨🇼",
  "Cyprus": "🇨🇾",
  "Czechia": "🇨🇿",
  "Democratic Republic of the Congo": "🇨🇩",
  "Denmark": "🇩🇰",
  "Dhekelia": "🇩🇪",
  "Djibouti": "🇩🇯",
  "Dominica": "🇩🇲",
  "Dominican Republic": "🇩🇴",
  "Ecuador": "🇪🇨",
  "Egypt": "🇪🇬",
  "El Salvador": "🇸🇻",
  "Equatorial Guinea": "🇬🇶",
  "Eritrea": "🇪🇷",
  "Estonia": "🇪🇪",
  "Ethiopia": "🇪🇹",
  "Falkland Islands": "🇫🇰",
  "Faroe Islands": "🇫🇴",
  "Federated States of Micronesia": "🇫🇲",
  "Fiji": "🇫🇯",
  "Finland": "🇫🇮",
  "France": "🇫🇷",
  "French Guiana": "🇬🇫",
  "French Polynesia": "🇵🇫",
  "French Southern And Antarctic Lands": "🇹🇫",
  "Gabon": "🇬🇦",
  "Georgia": "🇬🇪",
  "Germany": "🇩🇪",
  "Ghana": "🇬🇭",
  "Gibraltar": "🇬🇮",
  "Greece": "🇬🇷",
  "Greenland": "🇬🇱",
  "Grenada": "🇬🇩",
  "Guadeloupe": "🇬🇵",
  "Guam": "🇬🇺",
  "Guatemala": "🇬🇹",
  "Guernsey": "🇬🇬",
  "Guinea": "🇬🇳",
  "Guinea-Bissau": "🇬🇼",
  "Guyana": "🇬🇾",
  "Haiti": "🇭🇹",
  "Honduras": "🇭🇳",
  "Hong Kong": "🇭🇰",
  "Hungary": "🇭🇺",
  "Iceland": "🇮🇸",
  "India": "🇮🇳",
  "Indonesia": "🇮🇩",
  "Iran": "🇮🇷",
  "Iraq": "🇮🇶",
  "Ireland": "🇮🇪",
  "Isle of Man": "🇮🇲",
  "Israel": "🇮🇱",
  "Italy": "🇮🇹",
  "Jamaica": "🇯🇲",
  "Japan": "🇯🇵",
  "Jersey": "🇯🇪",
  "Jordan": "🇯🇴",
  "Kazakhstan": "🇰🇿",
  "Kenya": "🇰🇪",
  "Kiribati": "🇰🇮",
  "Kosovo": "🇽🇰",
  "Kuwait": "🇰🇼",
  "Kyrgyzstan": "🇰🇬",
  "Laos": "🇱🇦",
  "Latvia": "🇱🇻",
  "Lebanon": "🇱🇧",
  "Lesotho": "🇱🇸",
  "Liberia": "🇱🇷",
  "Libya": "🇱🇾",
  "Liechtenstein": "🇱🇮",
  "Lithuania": "🇱🇹",
  "Luxembourg": "🇱🇺",
  "Macau": "🇲🇴",
  "Macedonia": "🇲🇰",
  "Madagascar": "🇲🇬",
  "Malawi": "🇲🇼",
  "Malaysia": "🇲🇾",
  "Maldives": "🇲🇻",
  "Mali": "🇲🇱",
  "Malta": "🇲🇹",
  "Marshall Islands": "🇲🇭",
  "Martinique": "🇲🇶",
  "Mauritania": "🇲🇷",
  "Mauritius": "🇲🇺",
  "Mayotte": "🇾🇹",
  "Mexico": "🇲🇽",
  "Moldova": "🇲🇩",
  "Monaco": "🇲🇨",
  "Mongolia": "🇲🇳",
  "Montenegro": "🇲🇪",
  "Montserrat": "🇲🇸",
  "Morocco": "🇲🇦",
  "Mozambique": "🇲🇿",
  "Myanmar": "🇲🇲",
  "Namibia": "🇳🇦",
  "Nauru": "🇳🇷",
  "Nepal": "🇳🇵",
  "Netherlands": "🇳🇱",
  "New Caledonia": "🇳🇨",
  "New Zealand": "🇳🇿",
  "Nicaragua": "🇳🇮",
  "Niger": "🇳🇪",
  "Nigeria": "🇳🇬",
  "Niue": "🇳🇺",
  "Norfolk Island": "🇳🇫",
  "North Korea": "🇰🇵",
  "Northern Mariana Islands": "🇲🇵",
  "Norway": "🇳🇴",
  "Oman": "🇴🇲",
  "Pakistan": "🇵🇰",
  "Palau": "🇵🇼",
  "Palestine": "🇵🇸",
  "Panama": "🇵🇦",
  "Papua New Guinea": "🇵🇬",
  "Paracel Islands": "🇵🇭",
  "Paraguay": "🇵🇾",
  "Peru": "🇵🇪",
  "Philippines": "🇵🇭",
  "Pitcairn Islands": "🇵🇳",
  "Poland": "🇵🇱",
  "Portugal": "🇵🇹",
  "Puerto Rico": "🇵🇷",
  "Qatar": "🇶🇦",
  "Republic of Congo": "🇨🇬",
  "Reunion": "🇷🇪",
  "Romania": "🇷🇴",
  "Russia": "🇷🇺",
  "Rwanda": "🇷🇼",
  "Saint Barthelemy": "🇧🇱",
  "Saint Kitts and Nevis": "🇰🇳",
  "Saint Lucia": "🇱🇨",
  "Saint Martin": "🇲🇫",
  "Saint Pierre and Miquelon": "🇵🇲",
  "Saint Vincent and The Grenadines": "🇻🇨",
  "Samoa": "🇼🇸",
  "San Marino": "🇸🇲",
  "Sao Tome and Principe": "🇸🇹",
  "Saudi Arabia": "🇸🇦",
  "Senegal": "🇸🇳",
  "Serbia": "🇷🇸",
  "Seychelles": "🇸🇨",
  "Sierra Leone": "🇸🇱",
  "Singapore": "🇸🇬",
  "Sint Maarten": "🇸🇽",
  "Slovakia": "🇸🇰",
  "Slovenia": "🇸🇮",
  "Solomon Islands": "🇸🇧",
  "Somalia": "🇸🇴",
  "South Africa": "🇿🇦",
  "South Georgia and South Sandwich Islands": "🇬🇸",
  "South Korea": "🇰🇷",
  "South Sudan": "🇸🇸",
  "Spain": "🇪🇸",
  "Spratly Islands": "🇻🇳",
  "Sri Lanka": "🇱🇰",
  "Sudan": "🇸🇩",
  "Suriname": "🇸🇷",
  "Svalbard": "🇸🇯",
  "Swaziland": "🇸🇿",
  "Sweden": "🇸🇪",
  "Switzerland": "🇨🇭",
  "Syria": "🇸🇾",
  "Taiwan": "🇹🇼",
  "Tajikistan": "🇹🇯",
  "Tanzania": "🇹🇿",
  "Thailand": "🇹🇭",
  "The Bahamas": "🇧🇸",
  "The Gambia": "🇬🇲",
  "Timor-Leste": "🇹🇱",
  "Togo": "🇹🇬",
  "Tokelau": "🇹🇰",
  "Tonga": "🇹🇴",
  "Trinidad and Tobago": "🇹🇹",
  "Tunisia": "🇹🇳",
  "Turkey": "🇹🇷",
  "Turkmenistan": "🇹🇲",
  "Turks and Caicos Islands": "🇹🇨",
  "Tuvalu": "🇹🇻",
  "U.S. Virgin Islands": "🇻🇮",
  "Uganda": "🇺🇬",
  "Ukraine": "🇺🇦",
  "United Arab Emirates": "🇦🇪",
  "United Kingdom": "🇬🇧",
  "United States": "🇺🇸",
  "Uruguay": "🇺🇾",
  "Uzbekistan": "🇺🇿",
  "Vanuatu": "🇻🇺",
  "Vatican City": "🇻🇦",
  "Venezuela": "🇻🇪",
  "Vietnam": "🇻🇳",
  "Wallis and Futuna": "🇼🇫",
  "Yemen": "🇾🇪",
  "Zambia": "🇿🇲",
  "Zimbabwe": "🇿🇼",
}


const request = () => {
  if(requested){
    setRequested(false)
    fetch(server + `home/unrequest/`, {
      method: "POST",
      headers: {
          "content-type": "application/json",
      },
      body: JSON.stringify({"user":user, "other":other, "token":token})
  })
  } else {
    setRequested(true)
    fetch(server + `home/request/`, {
      method: "POST",
      headers: {
          "content-type": "application/json",
      },
      body: JSON.stringify({"user":user, "other":other, "token":token})
  })
  }
}

const accept = () => {
  setBeingRequested(false)
  fetch(server + `home/acceptRe/`, {
      method: "POST",
      headers: {
          "content-type": "application/json"
      },
      body: JSON.stringify({"user":user, "token":token, "person":other})
  })
  .then(res => res.json())
  .then(res => {
      if(res){
          setUp((up) => up + "a")
      }
  })
}

const decline = () => {
  setBeingRequested(false)
  fetch(server + `home/denyRe/`, {
      method: "POST",
      headers: {
          "content-type": "application/json"
      },
      body: JSON.stringify({"user":user, "token":token, "person":other})
  })
  .then(res => res.json())
  .then(res => {
      if(res){
          setUp((up) => up + "a")
      }
  })
}




      return (
        videoCall &&
        <View style={{width: "100%", height:"100%", backgroundColor: "black"}}>

<SafeAreaView style={{height: "100%", width: "100%",}}>
  <AgoraUIKit
      connectionData={props.connectionData}
      rtcCallbacks={props.rtcCallbacks}
    />
    <Pressable style={{position: "absolute",  alignSelf: "center", marginTop: "10%"}
  } >

      <View style={{flexDirection: "row", alignItems: "center",}}>
        <Text style={{color: "white", fontSize: 30,}}>{other}</Text>
      <Text style={{color: "white", fontSize: 30,}}>{FLAGS[route.params.country]}</Text>
      </View>

      {!friend && 
      <Pressable style={[{alignItems: "center", paddingHorizontal: 10, paddingVertical: 5, backgroundColor: "#386b9c", borderRadius: 20,
      alignSelf: "flex-end", }, selected=="friend" && {opacity: .7}, requested && {opacity:.4}]}
      onPressIn={() => press("friend")} onPressOut={() => setSelected("")} onPress={() => request(other)}
      disabled={requested}
      >
        <Text style={{color: "white", fontSize: 20, textAlign: "center"}}>friend</Text>
      </Pressable>
      }

    </Pressable>
</SafeAreaView>



<Modal
       transparent={true}
        visible={beingRequested}
        animationType="fade"
        >
            
            <Pressable style={{width: "100%", height: "100%", backgroundColor: "rgba(0,0,0,0.5)"}} >


            <SafeAreaView style={{justifyContent: "center", alignItems: "center", display: "flex", position: "relative", width: "100%", height: "100%"}}>
            
            <Text style={{color: "white", fontSize: 23, width: "75%", textAlign: 'center', marginBottom: "10%"}}>{other} has requested to be your freind</Text>
            
                <Pressable onPressIn={() => press("accept")} onPressOut={() => setSelected("")} onPress={() => accept()}
                style={[{minWidth: "10%", borderRadius: 20, paddingHorizontal: 10, 
                paddingVertical: 5, backgroundColor: "#389c53", marginBottom: "5%"}, 
                selected=="accept" && {opacity:.7}]}>
                  <Text style={{color: "white", fontSize: 18}}>Accept</Text>
                </Pressable>

                <Pressable  onPressIn={() => press("deny")} onPressOut={() => setSelected("")} onPress={() => decline()}
                 style={[{minWidth: "10%", borderRadius: 20, paddingHorizontal: 10, 
                 paddingVertical: 5, backgroundColor: "red", marginBottom: "5%"}, 
                 selected=="deny" && {opacity:.7}]}>
                  <Text style={{color: "white", fontSize: 18}}>Deny</Text>
                </Pressable> 

                <Pressable  onPressIn={() => press("ignore")} onPressOut={() => setSelected("")} onPress={() => setBeingRequested(false)}
                style={[{minWidth: "10%", borderRadius: 20, paddingHorizontal: 10, paddingVertical: 5, backgroundColor: "rgba(0,0,0,0)", marginBottom: "5%", borderWidth: 2, borderColor: "white"},
                selected=="ignore" && {opacity:.7}]}>
                  <Text style={{color: "white", fontSize: 18}}>Ignore</Text>
                </Pressable>
             
            
            </SafeAreaView>

            </Pressable>
             
             
        </Modal>
    </View>

    
      
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
    button: {
      paddingHorizontal: 25,
      paddingVertical: 4,
      fontWeight: 'bold',
      color: '#ffffff',
      backgroundColor: '#0055cc',
      margin: 5,
  },
  main: {flex: 1, alignItems: 'center'},
  scroll: {flex: 1, backgroundColor: '#ddeeff', width: '100%'},
  scrollContainer: {alignItems: 'center'},
  videoView: {width: '90%', height: 200},
  btnContainer: {flexDirection: 'row', justifyContent: 'center'},
  head: {fontSize: 20},
  info: {backgroundColor: '#ffffe0', color: '#0000ff'}
  });