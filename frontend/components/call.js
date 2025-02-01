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


const appId = '8d6cd4c659d148efb99750db2b40f2df';
const auth = 'e0688dd1f27d49fbaf5dc2a13163628d';
const uid = 0;

const textStyle = {
  color: '#fff',
  backgroundColor: '#2edb85',
  fontWeight: '700',
  fontSize: 24,
  width: '100%',
  borderColor: '#2edb85',
  borderWidth: 4,
  textAlign: 'center',
  textAlignVertical: 'center',
};

const btnStyle = {
  borderRadius: 360,
  width: 40,
  height: 40,
  backgroundColor: 'rgba(0,0,0,0)', 
  borderWidth: 1,
  borderColor: "white",
  padding: 10, 
};

const startButton = {
  justifyContent: 'center',
  alignItems: 'center',
  alignContent: 'center',
  height: '90%',
};

const remoteBtnStyle = {backgroundColor: '#2edb8555', display: "none"};

export default function Call({navigation, route}) {
    const server = storage.server
    const [hasPermission, setHasPermission] = React.useState(null);
    const [cameraType, setCameraType] = React.useState(Camera.Constants.Type.front);
    const cameraRef = React.useRef(null);
    const other = route.params.other
    const [sound, setSound] = React.useState(); 
    const [selected, setSelected] = React.useState("");
    const [videoCall, setVideoCall] = React.useState(true)
    const [call, setCall] = React.useState({})
    const token = route.params.token
    const user = route.params.user
    const notificationListener = React.useRef();
    const responseListener = React.useRef();
    const [up, setUp] = React.useState("")

    const agoraEngineRef = React.useRef<IRtcEngine | null>(null); // Agora engine instance
    const [isJoined, setIsJoined] = React.useState(false); // Indicates if the local user has joined the channel
    const [remoteUid, setRemoteUid] = React.useState(0); // Uid of the remote user
    const [message, setMessage] = React.useState(''); // Message to the user

    function showMessage(msg) {
      setMessage(msg);
    }

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
            end()
          } 
          
        });  
      
    
        responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
            console.log("recieved?")
            if(notif.data.type=="endcall"){  
                end()
                navigation.goBack()
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

      const end = () => {
     
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

      const getCall = () => {
        fetch(server + `home/getCall/`, { 
          method: "POST",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify({"user":user, "token":token, "other":other})
          
          })
          .then(res => res.json())
          .then(res => {
            if(res.channel == ""){
              setUp((up) => up + "a") 
            }
            console.log(res)
            setCall(res)
            setVideoCall(true)
            
        })
      }

      const props = {
        connectionData: {
          appId: '8d6cd4c659d148efb99750db2b40f2df',
          channel: call.channel != null ? call.channel : "",  
        },
        rtcCallbacks: {
          EndCall: () => end(),  
        },
        styleProps: {
          iconSize: 30,
          theme: '#ffffffee',
          overlayContainer: {
            backgroundColor: '#2edb8533',
            opacity: 1,
          },
          localBtnStyles: {
            muteLocalVideo: btnStyle,
            muteLocalAudio: btnStyle,
            switchCamera: btnStyle,
            endCall: {
              borderRadius: 360,
              width: 50,
              height: 50,
              backgroundColor: '#f66',
              borderWidth: 0,
            },
          },
          localBtnContainer: {
            backgroundColor: 'rgba(0,0,0,0)',
            bottom: 0,
            paddingVertical: 10,
            borderWidth: 4,
            height: 80,
          },
          maxViewRemoteBtnContainer: {
            top: 0,
            alignSelf: 'flex-end',
          },
          remoteBtnStyles: {
            muteRemoteAudio: remoteBtnStyle,
            muteRemoteVideo: remoteBtnStyle,
            remoteSwap: remoteBtnStyle,
            minCloseBtnStyles: remoteBtnStyle,
          },
          minViewContainer: {
            bottom: 80,
            top: undefined,
            backgroundColor: '#fff',
            borderColor: 'white',
            borderWidth: 0,
            height: '0%',
          },
          minViewStyles: {
            height: '100%',
          },
          maxViewStyles: {
            height: '100%',
          },
          UIKitContainer: {height: '100%'},
        },
      };


      React.useEffect(() => {
      
          getCall()
      }, [ ,up])

      const getPermission = async () => {
        if (Platform.OS === 'android') {
            await PermissionsAndroid.requestMultiple([
                PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
                PermissionsAndroid.PERMISSIONS.CAMERA,
            ]);
        }
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



      return (
        videoCall &&
        <View style={{width: "100%", height:"100%", backgroundColor: "black"}}>

<SafeAreaView style={{height: "100%", width: "100%",}}>

<AgoraUIKit
            styleProps={props.styleProps}
            connectionData={props.connectionData}
            rtcCallbacks={props.rtcCallbacks}
          />

    <Pressable style={{position: "absolute",  alignSelf: "center", marginTop: "10%"}
  } >

      <View style={{flexDirection: "row", alignItems: "center",}}>
        <Text style={{color: "white", fontSize: 30,}}>{other}</Text>
      <Text style={{color: "white", fontSize: 30,}}>{FLAGS[call.country]}</Text>
      </View>

      {!call.friend && 
      <Pressable>
        <Text style={{color: "white", fontSize: 30,}}>friend</Text>
      </Pressable>
      }

    </Pressable>
</SafeAreaView>
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
      backgroundColor: 'black',
      margin: 5,
  },
  main: {flex: 1, alignItems: 'center'},
  scroll: {flex: 1, backgroundColor: '#ddeeff', width: '100%'},
  scrollContainer: {alignItems: 'center'},
  videoView: {width: '100%', height: 200},
  btnContainer: {flexDirection: 'row', justifyContent: 'center', },
  head: {fontSize: 20},
  info: {backgroundColor: '#ffffe0', color: '#0000ff'}
  });