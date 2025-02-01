import { TextInput, View, Text, StyleSheet, Image, Pressable, Dimensions, PanResponder, findNodeHandle, Animated, FlatList, ActivityIndicator, ImageBackground, AppState } from "react-native"
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
import profileSet from "./profileSet";
import Profile from "./profile";



Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: false,
      shouldSetBadge: false,
    }),
});


export default Found = ({navigation, route}) => {
    const server = storage.server
    const user = route.params.user
    const token = route.params.token
    const other = route.params.other
    const window = Dimensions.get("window")
    const notificationListener = React.useRef();
    const responseListener = React.useRef();
    const [up, setUp] = React.useState("")
    const appState = React.useRef(AppState.currentState);
    const [appStateVisible, setAppStateVisible] = React.useState(appState.current);

    const [otherProfile, setOtherProfile] = React.useState([])

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
                navigation.navigate("Home") 
            }
        }) 
    }

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
              cancelMatch()
          }
        });
    
        return () => {
          subscription.remove(); 
        }; 
      }, []);

      React.useEffect(() => {

        notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
           
          notif = notification.request.content
          
    
          if(notif.data.type=="matchEnd"){   
            Notifications.setNotificationHandler({
                handleNotification: async () => ({
                  shouldShowAlert: true,
                  shouldPlaySound: false,
                  shouldSetBadge: false,
                }),
              }); 
            cancelMatch()
          } 
          
        });  
      
        responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
            if(notif.data.type=="matchEnd"){  
                cancelMatch()
            }
        });
    
        return () => {
          Notifications.removeNotificationSubscription(notificationListener.current);
          Notifications.removeNotificationSubscription(responseListener.current);
        };
      }, []);


    const getProfile = (c, t, o) => {
        fetch(server + `home/getProfileOf/`, {    
                method: "POST",
                headers: {
                    "content-type": "application/json",
                }, 
                body: JSON.stringify({"user":c, "token":t, "of":o })  
            })
            .then(res => res.json()) 
            .then(res => {   
                setOtherProfile(res) 

                setTimeout(() => {
                    navigation.navigate("MatchCall", {"user":user, "other":other, "country": res.country, "token":token, "friend":res.friend})
                }, 5000);

            })
    }

    React.useEffect(() => {
        getProfile(user, token, other)
        
    }, [])

    const cancelMatch = () => {
        fetch(server + `home/cancelMatch/`, {
            method: "POST",
            headers: {
                "content-type": "application/json",
            },
            body: JSON.stringify({"user":user, "token": token, "other":other})
        })
        .then(res => res.json())
        .then(res => {
            if(res){
                navigation.navigate("Home")  
            }
        })
    }

    return(
        <View style={{width: "100%", height: "100%", backgroundColor: "black"}}>
            <View style={{width: "100%", height: "100%", alignItems: "center",}}>

                <Pressable style={{height: "70%", width: "100%", alignItems: "center", justifyContent: "center"}} >
                <Image source={{uri: server + `media/` + otherProfile.image}}
                style={{width:window.width * .75, height: window.width* .75, borderRadius: 360}}
                />
                <Text style={[{color: "white", fontSize: 40}, otherProfile.cord == null && {borderWidth: 10, borderColor: "green", padding: "10%", borderRadius: 50}]}>{other}</Text>
                <Text style={{color: "white", fontSize: 40, marginTop: "2%"}}>{otherProfile.name}</Text>
                <Text style={{color: "white", fontSize: 40, textAlign: "center", marginTop: "5%"}}>{otherProfile.country}{FLAGS[otherProfile.country]}</Text>            
                </Pressable>

        {otherProfile.cord != null ?
                <MapView style={{width: "100%", height: "30%"}} scrollEnabled={false}
                initialRegion={{
                    latitude: otherProfile.cord != null ? otherProfile.cord.latitude : 100,
                    longitude:  otherProfile.cord != null ? otherProfile.cord.longitude : 0,
                    latitudeDelta: 1.0922,
                    longitudeDelta: 1.0421,
                  }}
                >
                    <Marker 
                    coordinate={{
                    latitude: otherProfile.cord != null ? otherProfile.cord.latitude : 0,
                    longitude:  otherProfile.cord != null ? otherProfile.cord.longitude : 0,}}>

                    </Marker>
                </MapView>
                :
                <View >

                </View>
}
            </View>     
        </View>
    )
}