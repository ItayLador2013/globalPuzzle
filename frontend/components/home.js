import { TextInput, View, Text, StyleSheet, Image, Pressable, Dimensions, PanResponder, findNodeHandle, Animated, FlatList, ActivityIndicator, ImageBackground, Modal, Keyboard, ScrollView, } from "react-native"
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
import { WebView } from 'react-native-webview'; 
import { SimpleLineIcons, Feather, FontAwesome, MaterialCommunityIcons, Ionicons, MaterialIcons } from '@expo/vector-icons'; 
import * as MediaLibrary from 'expo-media-library';


Notifications.setNotificationHandler({ 
    handleNotification: async () => ({ 
      shouldShowAlert: true, 
      shouldPlaySound: false,  
      shouldSetBadge: false,
    }),
});



export default Home = ({navigation, route}) => {

    const server = storage.server
    const isFocused = useIsFocused(); 
    const [profile, setProfile] = React.useState({"hobbies":[]})
    const [loaded, setLoaded] = React.useState(false)
    const [current, setCurrent] = React.useState("home")  
    const [currentHome, setCurrentHome] = React.useState("")
    const [user, setUser] = React.useState("") 
    const [token, setToken] = React.useState("")
    const [selected, setSelected] = React.useState("")
    const window = Dimensions.get("window")  
    const [permissionResponse, requestPermission] = MediaLibrary.usePermissions();
 

    const socket = React.useRef(new WebSocket('ws://globalpuzzle.webpubsub.azure.com/client/hubs/Hub?access_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJ3c3M6Ly9nbG9iYWxwdXp6bGUud2VicHVic3ViLmF6dXJlLmNvbS9jbGllbnQvaHVicy9IdWIiLCJpYXQiOjE3MDA0Mjc5NTYsImV4cCI6MTcwMDQzMTU1Niwicm9sZSI6WyJ3ZWJwdWJzdWIuc2VuZFRvR3JvdXAiLCJ3ZWJwdWJzdWIuam9pbkxlYXZlR3JvdXAiXX0.X0iUF9KR9wn8UjpcQybKxMo4-CcO_zCXCI9WALNPlQk')).current;
    if (socket) {    
        // Now you can safely work with the WebSocket object 
      } else {  
        console.error('WebSocket is undefined.');  
    }  
    socket.onmessage = (event) => {     
        // Handle incoming messages from the WebSocket server 
        let data = JSON.parse(event.data)
    };     
             
      socket.onopen = () => {  
        // WebSocket connection opened 
        console.log("open")
      };  
      
      socket.onclose = (event) => {
        // WebSocket connection closed 
        console.log("closed")
      };
      
      socket.onerror = (error) => {
        // Handle WebSocket errors
        console.log(error)
      };
 
    React.useEffect(() => {
    }, [])


    const navSize = (window.width * .90) * .12 
    const profileRef = React.useRef(null)
    const mapRef = React.useRef(null)
    const findRef = React.useRef(null)  
    const homeRef = React.useRef(null)
    const callRef = React.useRef(null) 
    const feedRef = React.useRef(null)

    const [moving, setMoving] = React.useState(true)
    const [searchOpen, setSearchOpen] = React.useState(false)
    const [searchInput, setSearchInput] = React.useState(false)
    const searchWidth = React.useRef(new Animated.Value(0)).current
    const searchRef = React.useRef(null)
    const [search, setSearch] = React.useState("")
    const [matches, setMatches] = React.useState([])
    const [sResult, setSResult] = React.useState([])
    const [requested, setRequested] = React.useState([])
    const [requesting, setRequesting] = React.useState([])
    const [requests, setRequests] = React.useState([])
    const chatWidth = React.useRef(new Animated.Value(window.width * .48)).current;
    const chatHeight = React.useRef(new Animated.Value((window.height * .90) * .30)).current; 
    const videoWidth = React.useRef(new Animated.Value(window.width * .48)).current;
    const videoHeight = React.useRef(new Animated.Value((window.height * .90) * .30)).current;
    const newsHeight = React.useRef(new Animated.Value((window.height * .90) * .47)).current;
    const networkHeight = React.useRef(new Animated.Value((window.height * .90) * .15)).current;
    const mapHeight = window.height
    const [chats, setChats] = React.useState([])
    const [networks, setNetworks] = React.useState([])
    const [up, setUp] = React.useState("")

    const [sUser, setSUser] = React.useState("")
    const [sFirst, setSFirst] = React.useState("")
    const [sBio, setSBio] = React.useState("")
    const [sLast, setSLast] = React.useState("")
    const [hobbies, setHobbies] = React.useState([])
    const [sImage, setSImage] = React.useState(null)

    const [expoPushToken, setExpoPushToken] = React.useState('');
    const [notification, setNotification] = React.useState(false);
    const notificationListener = React.useRef();
    const responseListener = React.useRef();
    const [networkLines, setNetworkLines] = React.useState([])
    const [chatBlue, setChatBlue] = React.useState(false)
    const selectedBlue = "#6aa8eb"

    const [web, setWeb] = React.useState(null)
    const [sInfo, setSInfo] = React.useState(false)
    const [sHobbies, setSHobbies] = React.useState(false)
    const [friends, setFriends] = React.useState([])
    const [friendsOpen, setFriendsOpen] = React.useState(false)
    const [friendsList, setFriendsList] = React.useState([])
    const [unfriended, setUnfriended] = React.useState([])

    const [pastCalls, setPastCalls] = React.useState([])
    const [sSaved, setSSaved] = React.useState([])

    const [articleLink, setArticleLink] = React.useState(null)
    const [shownArticles, setShownArticles] = React.useState([])
    const [countriesOpen, setCountriesOpen] = React.useState(false)

    const [feedCurrent, setFeedCurrent] = React.useState("")
    const [newColabTitle, setNewColabTitle] = React.useState("")
    const [newColabText, setNewColabText] = React.useState("")
    const [newColabMedia, setNewColabMedia] = React.useState([])

    const [mediaPicker, setMediaPicker] = React.useState(false)
    const [media, setMedia] = React.useState([])
    const [selectedMedia, setSelectedMedia] = React.useState(null)
    const selectedMediaWidth = React.useRef(new Animated.Value(window.width * .48)).current
    const selectedMediaHeight = React.useRef(new Animated.Value(window.width * .48)).current
    const [zoomMedia] = React.useState(new Animated.Value(0))
    

    const pages = ["map", "find", "feed", "home", "profile"]

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
  
      notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
         
        notif = notification.request.content
  
        if(notif.data.type=="videoCall"){
          Notifications.setNotificationHandler({
            handleNotification: async () => ({
              shouldShowAlert: false,
              shouldPlaySound: false,
              shouldSetBadge: false,
            }),
          });
          navigation.navigate("Incoming", {"other":notif.data.user, "image": notif.data.image, "token":token, "user":notif.data.other}) 
        } else {
          Notifications.setNotificationHandler({
            handleNotification: async () => ({
              shouldShowAlert: true,
              shouldPlaySound: true,
              shouldSetBadge: true,
            }),
          });
        }
        if(notif.title != "Friend Request" && notif.title != "Unfriended" ){
  
           Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
          setUp((up) => up+"r")
  
        }
         
      });  
    
  
      responseListener.current = Notifications.addNotificationResponseReceivedListener(notification => {
        
        notif = notification.notification.request.content 
   
        if(notif.data.type=="videoCall"){
       
          navigation.navigate("Incoming", {"other":notif.data.user, "image": notif.data.image, "token":token, "user":user}) 
        }
      });
  
      return () => {
        Notifications.removeNotificationSubscription(notificationListener.current);
        Notifications.removeNotificationSubscription(responseListener.current);
      };
    }, []);



    React.useEffect(() => {
        registerForPushNotificationsAsync().then(token => setExpoPushToken(token));
    
        notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
          setNotification(notification);
        });
    
        responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
        
        });
    
        return () => {
          Notifications.removeNotificationSubscription(notificationListener.current);
          Notifications.removeNotificationSubscription(responseListener.current);
        };
      }, []);


    async function registerForPushNotificationsAsync() {
        let token;
      
        if (Platform.OS === 'android') {
          await Notifications.setNotificationChannelAsync('default', {
            name: 'default',
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#FF231F7C',
          });
        }
      
        
          const { status: existingStatus } = await Notifications.getPermissionsAsync();
          let finalStatus = existingStatus;
          if (existingStatus !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
          }
          if (finalStatus !== 'granted') {
            
            return; 
          }
          token = (await Notifications.getExpoPushTokenAsync()).data;
         
       
      
        return token;
      }

  
    const countryColors = {
        "Afghanistan": ["black", "red", "green"],
        "Akrotiri": ["blue", "white", "red"],
        "Albania": ["red", "black"],
        "Algeria": ["green", "white", "red"],
        "American Samoa": ["blue", "white", "red"],
        "Andorra": ["blue", "yellow"],
        "Angola": ["red", "black", "yellow"],
        "Anguilla": ["blue", "white"],
        "Antigua and Barbuda": ["red", "black", "yellow"],
        "Argentina": ["blue", "white"],
        "Armenia": ["red", "blue", "orange"],
        "Aruba": ["blue", "yellow", "red"],
        "Australia": ["red", "white", "blue", "blue"],
        "Austria": ["red", "white"],
        "Azerbaijan": ["blue", "red", "green"],
        "Bahrain": ["red", "white"],
        "Bangladesh": ["green", "red"],
        "Barbados": ["blue", "yellow"],
        "Belarus": ["red", "green"],
        "Belgium": ["black", "yellow", "red"],
        "Belize": ["blue", "red", "white"],
        "Benin": ["green", "yellow", "red"],
        "Bermuda": ["red", "blue"],
        "Bhutan": ["orange", "yellow"],
        "Bolivia": ["red", "yellow", "green"],
        "Bosnia and Herzegovina": ["blue", "yellow", "white"],
        "Botswana": ["blue", "black", "white"],
        "Brazil": ["green", "yellow", "blue"],
        "British Indian Ocean Territory": ["blue", "green", "red"],
        "British Virgin Islands": ["blue", "white", "green"],
        "Brunei": ["yellow", "black", "white"],
        "Bulgaria": ["white", "green", "red"],
        "Burkina Faso": ["red", "green", "yellow"],
        "Burundi": ["red", "white", "green"],
        "Cabo Verde": ["blue", "white", "red"],
        "Cambodia": ["blue", "red"],
        "Cameroon": ["green", "red", "yellow"],
        "Canada": ["red", "white"],
        "Cayman Islands": ["blue", "white", "red"],
        "Central African Republic": ["blue", "white", "green"],
        "Chad": ["blue", "yellow", "red"],
        "Chile": ["red", "white", "blue"],
        "China": ["red", "yellow"],
        "Christmas Island": ["green", "blue", "yellow"],
        "Cocos Islands": ["green", "yellow"],
        "Colombia": ["yellow", "blue", "red"],
        "Comoros": ["green", "yellow", "white"],
        "Cook Islands": ["blue", "white"],
        "Costa Rica": ["blue", "white", "red"],
        "Côte d'Ivoire": ["orange", "white", "green"],
        "Croatia": ["red", "white", "blue"],
        "Cuba": ["blue", "white", "red"],
        "Curaçao": ["blue", "yellow"],
        "Cyprus": ["white"],
        "Czechia": ["red", "white", "blue"],
        "Democratic Republic of the Congo": ["blue", "yellow", "red"],
        "Denmark": ["red", "white"],
        "Dhekelia": ["blue", "white", "red"],
        "Djibouti": ["blue", "green", "white"],
        "Dominica": ["green", "yellow", "black"],
        "Dominican Republic": ["red", "white", "blue"],
        "Ecuador": ["yellow", "blue", "red"],
        "Egypt": ["red", "white", "black"],
        "El Salvador": ["blue", "white"],
        "Equatorial Guinea": ["green", "white", "red"],
        "Eritrea": ["red", "blue", "green"],
        "Estonia": ["blue", "black", "white"],
        "Ethiopia": ["green", "yellow", "red"],
        "Falkland Islands": ["blue", "red"],
        "Faroe Islands": ["white", "blue", "red"],
        "Federated States of Micronesia": ["blue", "white"],
        "Fiji": ["lightblue", "white", "lightgreen"],
        "Finland": ["blue", "white"],
        "France": ["blue", "white", "red"],
        "French Guiana": ["green", "yellow", "red"],
        "French Polynesia": ["red", "white"],
        "French Southern and Antarctic Lands": ["blue", "white", "red"],
        "Gabon": ["green", "yellow", "blue"],
        "Georgia": ["white", "red"],
        "Germany": ["black", "red", "gold"],
        "Ghana": ["red", "gold", "green"],
        "Gibraltar": ["red", "white"],
        "Greece": ["blue", "white"],
        "Greenland": ["white", "red"],
        "Grenada": ["red", "green", "gold"],
        "Guadeloupe": ["blue", "white", "red"],
        "Guam": ["blue", "red", "white"],
        "Guatemala": ["blue", "white"],
        "Guernsey": ["red", "white"],
        "Guinea": ["red", "yellow", "green"],
        "Guinea-Bissau": ["red", "yellow", "green"],
        "Guyana": ["green", "yellow", "black"],
        "Haiti": ["blue", "red"],
        "Honduras": ["blue", "white"],
        "Hong Kong": ["red", "white"],
        "Hungary": ["red", "white", "green"],
        "Iceland": ["blue", "white", "red"],
        "India": ["orange", "white", "green"],
        "Indonesia": ["red", "white"],
        "Iran": ["green", "white", "red"],
        "Iraq": ["red", "white", "black"],
        "Ireland": ["green", "white", "orange"],
        "Isle of Man": ["red", "white"],
        "Israel": ["blue", "white", "blue"],
        "Italy": ["green", "white", "red"],
        "Jamaica": ["green", "black", "gold"],
        "Japan": ["white", "red"],
        "Jersey": ["red", "white"],
        "Jordan": ["black", "white", "green"],
        "Kazakhstan": ["blue", "yellow"],
        "Kenya": ["black", "red", "green"],
        "Kiribati": ["red", "white"],
        "Kosovo": ["blue", "yellow"],
        "Kuwait": ["green", "white", "red"],
        "Kyrgyzstan": ["red", "yellow"],
        "Laos": ["blue", "red"],
        "Latvia": ["red", "white"],
        "Lebanon": ["red", "white"],
        "Lesotho": ["blue", "white", "green"],
        "Liberia": ["red", "white", "blue"],
        "Libya": ["red", "black", "green"],
        "Liechtenstein": ["blue", "red"],
        "Lithuania": ["yellow", "green", "red"],
        "Luxembourg": ["red", "white", "lightblue"],
        "Macau": ["green", "white"],
        "Macedonia": ["red", "yellow"],
        "Madagascar": ["white", "red", "green"],
        "Malawi": ["black", "red", "green"],
        "Malaysia": ["blue", "white", "red"],
        "Maldives": ["red", "white", "green"],
        "Mali": ["green", "gold", "red"],
        "Malta": ["red", "white"],
        "Marshall Islands": ["blue", "white"],
        "Martinique": ["blue", "white", "red"],
        "Mauritania": ["green", "yellow", "red"],
        "Mauritius": ["red", "blue", "yellow"],
        "Mayotte": ["red", "white", "green"],
        "Mexico": ["green", "white", "red"],
        "Moldova": ["blue", "yellow", "red"],
        "Monaco": ["red", "white"],
        "Mongolia": ["red", "blue"],
        "Montenegro": ["red", "blue"],
        "Montserrat": ["blue", "yellow", "green"],
        "Morocco": ["red", "green"],
        "Mozambique": ["green", "black", "yellow", "red"],
        "Myanmar": ["yellow", "green", "red"],
        "Namibia": ["blue", "red", "green"],
        "Nauru": ["blue", "yellow"],
        "Nepal": ["red", "blue"],
        "Netherlands": ["red", "white", "blue"],
        "New Caledonia": ["red", "green", "blue"],
        "New Zealand": ["red", "white", "blue"],
        "Nicaragua": ["blue", "white"],
        "Niger": ["orange", "white", "green"],
        "Nigeria": ["green", "white", "green"],
        "Niue": ["yellow", "white"],
        "Norfolk Island": ["green", "white"],
        "North Korea": ["red", "white", "blue"],
        "Northern Mariana Islands": ["blue", "white"],
        "Norway": ["red", "white", "blue"],
        "Oman": ["red", "white", "green"],
        "Pakistan": ["green", "white"],
        "Palau": ["lightblue", "yellow"],
        "Palestine": ["black", "white", "green", "red"],
        "Panama": ["red", "blue"],
        "Papua New Guinea": ["black", "red", "yellow"],
        "Paracel Islands": ["blue", "red", "white"],
        "Paraguay": ["red", "white", "blue"],
        "Peru": ["red", "white"],
        "Philippines": ["red", "blue", "yellow"],
        "Pitcairn Islands": ["blue", "yellow"],
        "Poland": ["white", "red"],
        "Portugal": ["green", "red"],
        "Puerto Rico": ["red", "white", "blue"],
        "Qatar": ["white", "red"],
        "Republic of Congo": ["green", "yellow", "red"],
        "Reunion": ["blue", "white", "red"],
        "Romania": ["blue", "yellow", "red"],
        "Russia": ["white", "blue", "red"],
        "Rwanda": ["blue", "yellow", "green"],
        "Saint Barthelemy": ["white", "blue", "red"],
        "Saint Kitts and Nevis": ["green", "yellow", "black"],
        "Saint Lucia": ["blue", "yellow", "black"],
        "Saint Martin": ["red", "white", "blue"],
        "Saint Pierre and Miquelon": ["blue", "white", "red"],
        "Saint Vincent and The Grenadines": ["blue", "yellow", "green"],
        "Samoa": ["red", "blue"],
        "San Marino": ["white", "blue"],
        "Sao Tome and Principe": ["green", "yellow", "black"],
        "Saudi Arabia": ["green", "white"],
        "Senegal": ["green", "yellow", "red"],
        "Serbia": ["red", "blue", "white"],
        "Seychelles": ["blue", "yellow", "red"],
        "Sierra Leone": ["green", "white", "blue"],
        "Singapore": ["red", "white"],
        "Sint Maarten": ["red", "white", "blue"],
        "Slovakia": ["white", "blue", "red"],
        "Slovenia": ["white", "blue", "red"],
        "Solomon Islands": ["blue", "yellow", "green"],
        "Somalia": ["blue", "white"],
        "South Africa": ["black", "gold", "green"],
        "South Georgia and South Sandwich Islands": ["blue", "white", "red"],
        "South Korea": ["white", "blue", "red"],
        "South Sudan": ["black", "red", "green", "blue", "yellow", "white"],
        "Spain": ["red", "yellow"],
        "Spratly Islands": ["blue", "white", "red"],
        "Sri Lanka": ["yellow", "green", "red"],
        "Sudan": ["red", "white", "black"],
        "Suriname": ["green", "white", "red"],
        "Svalbard": ["red", "white", "blue"],
        "Swaziland": ["blue", "yellow", "red"],
        "Sweden": ["blue", "yellow"],
        "Switzerland": ["red", "white"],
        "Syria": ["red", "white", "black"],
        "Taiwan": ["red", "white", "blue"],
        "Tajikistan": ["red", "white", "green"],
        "Tanzania": ["green", "yellow", "black"],
        "Thailand": ["red", "white", "blue"],
        "The Bahamas": ["blue", "yellow", "black"],
        "The Gambia": ["red", "blue", "green"],
        "Timor-Leste": ["red", "yellow", "black"],
        "Togo": ["green", "yellow", "red"],
        "Tokelau": ["red", "yellow"],
        "Tonga": ["red", "white"],
        "Trinidad and Tobago": ["red", "white", "black"],
        "Tunisia": ["red", "white"],
        "Turkey": ["red", "white"],
        "Turkmenistan": ["green", "red"],
        "Turks and Caicos Islands": ["blue", "white"],
        "Tuvalu": ["blue", "yellow"],
        "U.S. Virgin Islands": ["green", "white"],
        "Uganda": ["black", "yellow", "red"],
        "Ukraine": ["blue", "yellow"],
        "United Arab Emirates": ["red", "green", "white", "black"],
        "United Kingdom": ["red", "white", "blue"],
        "United States": ["red", "white", "blue"],
        "Uruguay": ["white", "blue"],
        "Uzbekistan": ["blue", "white", "green"],
        "Vanuatu": ["red", "green", "black", "yellow"],
        "Vatican City": ["yellow", "white"],
        "Venezuela": ["yellow", "blue", "red"],
        "Vietnam": ["red", "yellow"],
        "Wallis and Futuna": ["red", "white"],
        "Yemen": ["red", "white", "black"],
        "Zambia": ["green", "orange"],
        "Zimbabwe": ["green", "yellow", "red"],
        "": ["rgba(0,0,0,0)"]
    };

    const options = {
        enableVibrateFallback: true,
        ignoreAndroidSystemSettings: false,
      };
    
    const hapticLight = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
    }

    const hapticMedium = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
    }

    const haptic = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy)
    }

    const press = (what) => {
        setSelected(what)
        haptic()
    }

    const getChats = () => {
        fetch(server + `home/getChats/`, {
            method: "POST",
            headers: {
                "content-type": "application/json",
            },
            body: JSON.stringify({"user": user, "token": token})
        })
        .then(res => res.json())
        .then(res => {
            setChats(res)
        }) 
    }




    const panResponder = React.useMemo( 
        () => PanResponder.create({
  
          onMoveShouldSetPanResponder: (evt, gestureState) => {
            // Return true if the user has moved their finger more than 5 pixels
            if( Math.abs(gestureState.dx) >= 1){
              setMoving(true)
            }
            return Math.abs(gestureState.dx) >= 0;
          },
          onPanResponderMove: (evt, gestureState) => {
            // Check if the user's finger is currently over the View component with ref profRef
            const profNode = findNodeHandle(profileRef.current);
            const homeNode = findNodeHandle(homeRef.current);
            const findNode = findNodeHandle(findRef.current);
            const mapNode = findNodeHandle(mapRef.current);
            const callNode = findNodeHandle(callRef.current);
            const feedNode = findNodeHandle(feedRef.current);
  
  
            if (profNode) {
              profileRef.current.measureInWindow((x, y, width, height) => {
                if (
                  gestureState.moveX >= x &&
                  gestureState.moveX <= x + width //&&
                  //gestureState.moveY >= y &&
                  //gestureState.moveY <= y + height
                ) {
                  // User's finger is currently over the View component with ref profRef
                 
                  if(selected!="profile"){
                    navPress("profile")
                   
                  } else {
                    
                  }
                } else{
                  
                }
              });
            }

            if (feedNode) {
                feedRef.current.measureInWindow((x, y, width, height) => {
                  if (
                    gestureState.moveX >= x &&
                    gestureState.moveX <= x + width //&&
                    //gestureState.moveY >= y &&
                    //gestureState.moveY <= y + height
                  ) {
                    // User's finger is currently over the View component with ref profRef
                   
                    if(selected!="feed"){
                      navPress("feed")
                     
                    } else {
                      
                    }
                  } else{
                    
                  }
                });
              }
  
            if (homeNode) {
              homeRef.current.measureInWindow((x, y, width, height) => {
                if (
                  gestureState.moveX >= x &&
                  gestureState.moveX <= x + width //&&
                  //gestureState.moveY >= y &&
                  //gestureState.moveY <= y + height
                ) {
                  // User's finger is currently over the View component with ref profRef
                 
                  if(selected!="home"){
                    navPress("home")
                   
                  } else {
                    
                  }
                } else{
                  
                }
              });
            }

            if (callNode) {
                callRef.current.measureInWindow((x, y, width, height) => {
                  if (
                    gestureState.moveX >= x &&
                    gestureState.moveX <= x + width //&&
                    //gestureState.moveY >= y &&
                    //gestureState.moveY <= y + height
                  ) {
                    // User's finger is currently over the View component with ref profRef
                   
                    if(selected!="call"){
                      navPress("call")
                     
                    } else {
                      
                    }
                  } else{
                    
                  }
                });
              }
  
            if (findNode) {
              findRef.current.measureInWindow((x, y, width, height) => {
                if (
                  gestureState.moveX >= x &&
                  gestureState.moveX <= x + width //&&
                  //gestureState.moveY >= y &&
                  //gestureState.moveY <= y + height
                ) {
                  // User's finger is currently over the View component with ref profRef
                 
                  if(selected!="find"){
                    navPress("find") 
                   
                  } else {
                    
                  }
                } else{
                  
                }
              });
            } 
  
            if (mapNode) {
              mapRef.current.measureInWindow((x, y, width, height) => {
                if (
                  gestureState.moveX >= x &&
                  gestureState.moveX <= x + width //&&
                  //gestureState.moveY >= y &&
                  //gestureState.moveY <= y + height
                ) {
                  // User's finger is currently over the View component with ref profRef
                 
                  if(selected!="map"){
                    navPress("map") 
                   
                  } else {
                    
                  }
                } else{
                  
                }
              });
            } 
  
  
          }, 
          onPanResponderRelease: (evt, gestureState) => {
            // Check if the user's finger is currently over the View component with ref profRef
            if(pages.includes(selected)){
              curr(selected)
            } 
             
            setSelected("")  
        
            
           
          },
        }), [selected]
      ); 

    
    const stripEmail = (email) => {
        const atIndex = email.indexOf("@"); // Find the position of "@"
        
        if (atIndex !== -1) {
          const result = email.substring(atIndex + 1); // Extract everything after "@"
          return result
        } else {
          // Handle the case where there's no "@" in the string
          return ""
        }

    }
    
    
    const getFriends = (u, t) => {
        fetch(server + `home/getFriends/`, {
            method: "POST",
            headers: {
                "content-type": "application/json",
            },
            body: JSON.stringify({"user":u, "token":t})
        })
        .then(res => res.json())
        .then(res => {
            setFriendsList(res)
        })
    }

    React.useEffect(() => {
        if(isFocused && loaded){
            curr(current, true)
        } else if(isFocused){
            ch()
        }
    }, [isFocused])


    const getProfile = (u, t) => {
        fetch(server + `home/getProfile/`, {
            method: "POST",
            headers: {
                "content-type": "application/json",
            },
            body: JSON.stringify({"user":u, "token":t, "pushToken": expoPushToken})
        })
        .then(res => res.json())
        .then(res => {
            if(res == null){
                removeData()
                navigation.navigate("Login")
                return
            }
            if(res.setup){

                
                setProfile(res) 
                setNetworks(res.networks)
                setFriends(res.friends)
                getFriends(u, t)
                if(current == "home"){
                fetch(server + `home/getNews/`, {
                    method: "POST",
                    headers: {  
                        "content-type": "application/json",
                    }, 
                    body: JSON.stringify({"user": u, "token": t})  
                })
                .then(res => res.json())
                .then(res => {
                    if(res){  
                        setShownArticles(res)
                        setLoaded(true)
                    }
                }) 
                }
                
                getNetworkLines(u, t)
                
                if(res.call.isCall){
                    if(res.call.status == "onCall"){ 
                        
                    }else{
                    if(u==res.call.calling){
                        navigation.navigate("Call", {"user":u, "other":res.call.called, "token":t})
                    } else {
                        if(res.call.status == "ongoing"){
                          navigation.navigate("Call", {"user":u, "other":res.call.called, "token":t})
                        }
                   
                        navigation.navigate("Incoming", {"user":u, "other":res.call.calling, "token":t, "image": res.call.image})
                    }
                  }
                  }  
            } else {  
                navigation.navigate("ProfileSet", {"user":u, "token":t})
            }  
  
        }) 
    } 
   
    const getNetworkLines = (u, t) => { 
        fetch(server + `home/getLines/`, {
            method: "POST",
            headers: {  
                "content-type": "application/json",
            },
            body: JSON.stringify({"user":u, "token":t})
        })
        .then(res => res.json())
        .then(res => {
            setNetworkLines(res)
        })
    }

    const getPastCalls = () => {
        fetch(server + `home/getPastCalls/`, {
            method: "POST",
            headers: {
                "content-type": "application/json",
            },
            body: JSON.stringify({"user":user, "token":token})
        })
        .then(res => res.json())
        .then(res => {
            setPastCalls(res)
        })
    }
 
    const curr = (change, focus) => {
    if(current != change || focus){
        setCurrent(change)
        if(change == "profile"){ 
            getProfile(user, token) 
        } else if (change == "home"){
            getChats()
        } else if (change == "find"){ 
            getMatches()
            getRequesting()
            getRequests()
        } else if(change == "settings"){
            setSBio(profile.bio)
            setHobbies(profile.hobbies)
            setSImage(null)
            setSUser(user)
            setSFirst(profile.first)
            setSLast(profile.last) 
        } else if(change == "call"){
            getPastCalls()
        }
    } else if(current == "home"){
        if (currentHome=="chat"){
            shrinkChat()
        } else if (currentHome=="video"){
            shrinkVideo()
        } else if (currentHome == "news"){
            shrinkNews()
        }
    }
    } 

    const getRequesting = () => {
        fetch(server + 'home/getRequesting/', {
            method: "POST",
            headers: {
                "content-type": "application/json",
            },
            body: JSON.stringify({"user":user, "token": token})
        })
        .then(res => res.json())
        .then(res => {
            setRequesting(res) 
        })
    }

    const getRequests = () => {
        fetch(server + `home/getRequests/`, {
            method: "POST",
            headers: {
                "content-type": "application/json",
            },
            body: JSON.stringify({"user":user, "token":token})
        })
        .then(res => res.json())
        .then(res => {
            setRequests(res)
        })
    }

        const getData = async (what) => {
            try {
              const value = await AsyncStorage.getItem(what); 
              if (value !== null) {
    
                return value
              } else {
              

              }
            } catch (e) {
              // error reading value
            }
        }

        const ch = async () => {
            let u = await getData("user")    
            let t = await getData("token") 
            setUser(u)
            setToken(t) 
            if(u == null || t == null){
                navigation.navigate("Login")
            } else {
            getProfile(u,t)

            }
        }
    React.useEffect(() => { 
        ch() 
}, [])


const navPress = (what) => {
    haptic()
    setSelected(what)
}

const searchGrows = () => {
    Animated.timing(searchWidth,  {
        toValue: window.width * .98,
        duration: 500,
        useNativeDriver: false
    }).start(({finished}) => {
        setSearchInput(true)
        searchRef.current.focus()
      })
}

const searchShrinks = () => {
    Animated.timing(searchWidth, {
        toValue: window.width * 0,
        duration: 500,
        useNativeDriver: false
    }).start(({finished}) => {
        setSearchInput(true)
        setSearchOpen(false)
      })
}

const startSearch = () => {
    press("")
    setSearchOpen(true)
    searchGrows()
    if(searchRef != null){
        
    }
}

const stopSearch = () => {
    
    searchShrinks()
}

const searching = (text) => {
    setSearch(text)
    fetch(server + `home/search/`, {
        method: "POST",
        headers: { 
            "content-type": "application/json"
        },
        body: JSON.stringify({"user":user, "token":token, "term":text})
    })
    .then(res => res.json())
    .then(res => { 
        setSResult(res)
    })
}

const unfriend = (other) => {
    setUnfriended([...unfriended, other])
    fetch(server + `home/unfriend/`, {
        method: "POST",
        headers: {
            "content-type": "content-type",
        },
        body: JSON.stringify({"user":user, "other":other, "token":token})
    })
}

const newChat = () => {
    if (friendsList.length > 0){
    navigation.navigate("NewChat", {"user":user, "friends": friendsList, "token":token, "profile":profile})
    }
}

    const searchUsers = ({item}) => {
        let member = item 
        let matchPage = member.match && (search == "" || search == null || search[0] == " ")
        
        return(
            <View key={item.id} style={[{width: "100%", marginBottom: "4%", paddingHorizontal: "3.5%", flexDirection: "row", alignItems: "center", height: 75, }, matchPage && member.user == matches[0].user && {marginTop: "10%",}, matchPage && member.user == matches[matches.length - 1].user && {marginBottom: "10%"}]}> 
                
                <Pressable style={{width: "75%", flexDirection: "row"}} onPress={() => goToProfile(member.user, member.image)}>
                     
                    <LinearGradient
                    colors={countryColors[member.country]} 
                    style={{height:75, borderRadius: 360, width: "2%", backgroundColor: "blue", marginRight: "2%",}}
                    >
                           
                    </LinearGradient>
                    
                    <Image source={{uri: server + `media/` + member.image}} style={{width: 75, height: 75, borderRadius: 360}} 
                    defaultSource={require("../assets/emptyProfile.png")} 
                    />

                    <View style={{height: "100%", justifyContent: "space-around", paddingVertical: "2%", paddingHorizontal: "2%", opacity: .8, width: "60%"}}>
                        
                        <View style={{flexDirection: "row", width: "100%", alignItems: "center"}}>
                              <Text numberOfLines={1} style={{color: "white", fontSize: 17, maxWidth: "100%"}}>{matchPage && "hji"}{member.name}</Text>
                              <Text> {FLAGS[member.country]}</Text>
                        </View>


                        <View style={{flexDirection: "row", }}>
                            <Text numberOfLines={1} style={{maxWidth: "72%", color: "white",  fontSize: 17}} >{member.user}</Text>
                            <Text style={{color: "white",  fontSize: 17}}> ({member.age})</Text>
                        </View>
                        
                        <Text style={{color: "white",  fontSize: 17}}>{Math.floor(member.precent)}%</Text>
                    </View>
                </Pressable>

                <View style={{ height: "100%", width: "25%", justifyContent: "center", }}>
                    {(!member.request || (unfriended.includes(member.user))) ?
                    <Pressable onPress={() => request(member.user)}>
                        <Text style={[ {fontSize: 18}, requested.includes(member.user) ? {color: "#6d7582"} : {color: "#5e7191", }]}>{ requested.includes(member.user) ? "unrequest": "connect"}</Text>
                    </Pressable>
                    : !friends.includes(member.user) ?
                    <View style={{height: "100%", width: "100%", flexDirection: "row", justifyContent: "center",}}>
                        
                        <Pressable style={[{justifyContent: "center"}, selected=="accept" && {opacity: .4}]}
                        onPressIn={() => press("accept")}
                        onPressOut={() => setSelected("")}
                        onPress={() => accept(member)}
                        >
                            <Text style={{color: "#8bcf7e"}}>accept</Text>
                        </Pressable>

                        <Pressable style={[{justifyContent: "center"}, selected=="decline" && {opacity: .4}]}
                        onPressIn={() => press("decline")}
                        onPressOut={() => setSelected("")}
                        onPress={() => decline(member)}
                        >
                            <Text style={{ color: "#ad393d"}}>decline</Text>
                        </Pressable>

                    </View>
                    :
                    <Pressable onPress={() => unfriend(member.user)}>
                        <Text style={{color: "#5e7191", fontSize: 18}}>{"unfriend"}</Text>
                    </Pressable>
                    }

                </View>

            </View>   
        )
    }

    const request = (other) => {
        haptic()
        if(requested.includes(other)){
            setRequested(current => current.filter(element => { return element !== other}))
            fetch(server + `home/unrequest/`, {
                method: "POST", 
                headers: {
                    "content-type": "application/json",
                },
                body: JSON.stringify({"user": user, "token":token, "other":other})
            })
        } else {
            setRequested([...requested, other])
            fetch(server + `home/request/`, {
                method: "POST",
                headers: {
                    "content-type": "application/json",
                },
                body: JSON.stringify({"user": user, "token":token, "other":other})
            })
        }
    }

    const goToProfile = (other, image) => { 
        if(friendsOpen){
            setFriendsOpen(false)
        }
        navigation.push("Profile", {"of":other, "user":user, "token":token, "oImage": image})
    }


    const growChat = () => {
        haptic()
        getChats()
        Animated.timing(chatHeight, { 
            toValue: window.height * .89,
            duration: 500,
            useNativeDriver: false
        }).start()

        Animated.timing(chatWidth, {
            toValue: window.width,
            duration: 500,
            useNativeDriver: false
        }).start(() => {
            setCurrentHome("chat")
        })
    }

    const shrinkChat = () => {
        setCurrentHome("")
        Animated.timing(chatHeight, {
            toValue: (window.height * .90) * .30,
            duration: 500,
            useNativeDriver: false
        }).start()

        Animated.timing(chatWidth, {
            toValue: window.width * .48,
            duration: 500,
            useNativeDriver: false
        }).start(() => {
            
        })
    }


    const growVideo = () => {
        haptic()
        setChatBlue(true)
        Animated.timing(videoHeight, {
            toValue: window.height * .91,
            duration: 500,
            useNativeDriver: false
        }).start()

        Animated.timing(videoWidth, {
            toValue: window.width,
            duration: 500,
            useNativeDriver: false
        }).start(() => {
            setCurrentHome("video")
        })

        disapearChat()
    }

    const shrinkVideo = () => {
        setCurrentHome("")
        apearChat()
        Animated.timing(videoHeight, {
            toValue: (window.height * .90) * .30,
            duration: 500,
            useNativeDriver: false
        }).start()

        Animated.timing(videoWidth, {
            toValue: window.width * .48,
            duration: 500,
            useNativeDriver: false
        }).start(() => {
            setChatBlue(false)
        })
    }


    const disaperVideo = () => {
        Animated.timing(videoHeight, {
            toValue: 0,
            duration: 500,
            useNativeDriver: false
        }).start()

        Animated.timing(videoWidth, {
            toValue: 0,
            duration: 500,
            useNativeDriver: false
        }).start()
    }

    const disapearChat = () => {
        

        Animated.timing(chatWidth, {
            toValue: 0,
            duration: 500,
            useNativeDriver: false
        }).start()
    }

    const apearChat = () => {
        Animated.timing(chatHeight, {
            toValue: (window.height * .90) * .30,
            duration: 500,
            useNativeDriver: false
        }).start()

        Animated.timing(chatWidth, {
            toValue: window.width * .48,
            duration: 500,
            useNativeDriver: false
        }).start()
    }

    const openNews = () => {
        Animated.timing(newsHeight, {
            toValue: (window.height * .90) * .90,
            duration: 500,
            useNativeDriver: false
        }).start() 

        Animated.timing(chatHeight, {
            toValue: 0,
            duration: 500,
            useNativeDriver: false
        }).start()

        Animated.timing(videoHeight, {
            toValue: 0,
            duration: 500,
            useNativeDriver: false
        }).start() 

        Animated.timing(networkHeight, {
            toValue: 0, 
            duration: 500,
            useNativeDriver: false
        }).start()

        setCurrentHome("news")

    }

    const shrinkNews = () => {
        setCurrentHome("")
        Animated.timing(newsHeight, {
            toValue: (window.height * .90) * .47,
            duration: 500,
            useNativeDriver: false
        }).start()  

        Animated.timing(chatHeight, {
            toValue: (window.height * .90) * .30,
            duration: 500,
            useNativeDriver: false
        }).start()

        Animated.timing(videoHeight, {
            toValue: (window.height * .90) * .30,
            duration: 500,
            useNativeDriver: false
        }).start() 

        Animated.timing(networkHeight, {
            toValue: (window.height * .90) * .15, 
            duration: 500,
            useNativeDriver: false
        }).start()
    }

    const getMatches = () => {
        fetch(server + `home/getMatches/`, {
            method: "POST",
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify({"user":user, "token":token, })
        })
        .then(res => res.json())
        .then(res => {
            setMatches(res)
        })
    }

   

    const removeData = async () => {
        try {
            await AsyncStorage.removeItem('user');
            await AsyncStorage.removeItem('token');
            
          } catch (e) {
            // error reading value
          }
    }


    const logout = () => {
        fetch(server + `home/logout/`, {
            method: "POST", 
            headers: {
                "content-type": "application/json",
            },
            body: JSON.stringify({"user":user, "token":token, "pushToken": expoPushToken})
        })
        .then(res => res.json())
        .then(res => {
            if(res){
                setCurrent("home")
                removeData()
                navigation.navigate("Login")
            }
            
        })
    }

    const isToday = (date) => {
        let today = new Date()
        return today.getDate() == date.getDate() && today.getMonth() == date.getMonth() && today.getFullYear() == date.getFullYear()
    }

    const time = (date) => {
        let h = date.getHours()
        if (h > 12){
            h-=12
        } 

        let hours = h 
        
        let minutes = (date.getMinutes() >= 10 ? date.getMinutes() : "0" + date.getMinutes())
        
        return hours + ":" + minutes + (date.getHours() >= 12 ? " PM" : " AM")
    }

    const goToChat = (other, image) => {
        navigation.navigate("Chat", {"other": other, "user":user, "token":token, "otherImage": image,})
    }

    const goToGroup = (others) => {

    }

    const isYsterday = (date) => {
        const today = new Date()
        const yesterday = new Date(today);
        yesterday.setDate(today.getDate() - 1);

        return date.getDate() === yesterday.getDate() &&
                date.getMonth() === yesterday.getMonth() &&
                date.getFullYear() === yesterday.getFullYear()
    } 

    const thisWeek = (date) => {
        const today = new Date()
        const lastWeek = new Date(today);
        lastWeek.setDate(today.getDate() - 7);

        return lastWeek < date
    }

    const day = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
    const month = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Dec"]


    const formatDate = (datetime) => {
        const date = new Date(datetime)
        const today = new Date()
        let shownDate = ""
        let differenceInHours = Math.floor((today-date)/(1000*60*60))
        let differenceInDays = Math.floor(differenceInHours/24)
        let differenceInWeeks = Math.floor(differenceInDays/7)
      
        if(isToday(date)){
            shownDate = time(date) 
        } else if(isYsterday(date)) {
            shownDate = "Yesterday"
        } else if(differenceInWeeks <= 0) {
            shownDate = day[date.getDay()]
        } else if(today.getFullYear() == date.getFullYear()){
            shownDate = month[date.getMonth()] + " " + (date.getDate() >=10 ? date.getDate() : "0" + date.getDate())
        } else {
            shownDate = (date.getDate() >=10 ? date.getDate() : "0" + date.getDate()) + "/" + ((date.getMonth() + 1) >=10 ? (date.getMonth() + 1) : "0" + (date.getMonth() + 1)) + "/" + date.getFullYear().toString()[date.getFullYear().toString().length-2] + date.getFullYear().toString()[date.getFullYear().toString().length-1] 
        }
        return shownDate

    }

    const moveDegrees = (degrees, imageSize) => {
        // Calculate new position based on 30-degree angle
        const angleInRadians = (degrees * Math.PI) / 180; // Convert degrees to radians
        const distance = 20; // Adjust this value for how much you want to move
        const newTop = (distance * Math.sin(angleInRadians)) + 40 - (imageSize/2);
        const newLeft = (distance * Math.cos(angleInRadians)) + 40 - (imageSize/2);
    
        // Update the state with the new position
        if(newTop == NaN || newLeft == NaN){
            
            return {"top": 0, "left": 0}
        }
        return {"top": newTop, "left": newLeft} 
    }

    const imageGroup = (images) => {
        const imageSize = 80/(images.length/2)
        
        return (
            <View style={[{width: 80, height: 80, display: "flex", flexDirection: "row", borderRadius: 360, justifyContent: "center", } ]}>
                {images.map((image) => {
                    const location  = (image.id/images.length) * 360
                    const degrees =  moveDegrees(location, imageSize)
                    return(
                        <Image source={[{uri: server + `media/` + image.image}]} key={image.image}
                        style={[{width: imageSize, height: imageSize, borderRadius: 360,  position: "absolute", alignSelf: "center", }, degrees.left != null && degrees.top != null && {left: degrees.left, top: degrees.top}]} 
                        defaultSource={require('../assets/emptyProfile.png')}
                        />
                    )
                })}
            </View>
        ) 
    }


    const chat = ({item}) => { 
        const isGroup = item.others.length > 1
        const user = item.others[0]
        let shownDate = ""
        if(item.lastMessage.datetime){
            shownDate = formatDate(item.lastMessage.datetime)
        }
        
        let images = []
        if (isGroup){
            for(let i=0; i < item.others.length; i++){
                images.push({"image": item.others[i].image, "id":i})
            }
        }
        images.push({"image": profile.image, "id": images.length}) 
        
        return( 
            <Pressable onPress={() => isGroup ? goToGroup(item.others) : goToChat(user.user, user.image)}
            onPressIn={() => press(item.id)} onPressOut={() => setSelected("")} unstable_pressDelay={50}
            key={item.name}
             style={[{flexDirection: "row", height: 96, paddingHorizontal: "1%", 
             paddingVertical: 8,
             borderBottomWidth:.5, borderColor: "rgba(255,255,255,0.5)"},
             selected==item.id && {backgroundColor: "rgba(255,255,255,0.2)",  
             opacity: .4}]}> 
                
                <View style={{flexDirection: "row", width: "75%", height: "100%"}}>
                    
               {!isGroup ? 
                <Image source={{uri: server + `media/` + user.image}}
                    style={{width: 80, height: 80, borderRadius: 360}}
                    defaultSource={require('../assets/emptyProfile.png')}
                />
                :
                imageGroup(images)
               }

                <View style={{height: "100%", marginLeft: "2%", width: "70%"}}>
                    <Text style={{color: "white", fontSize: 18, opacity: .7}} numberOfLines={1}>{item.name}</Text>

                    <Text style={{color: "white", fontSize: 16, opacity: .7, width: "100%", marginTop: "3%"}} 
                    numberOfLines={2}>
                        {item.lastMessage.content}
                    </Text>
               
                </View>
 </View>

            <View style={{width: "30%", height: "100%"}}>
                    <Text style={{color: "white", }}>{shownDate}</Text>
            </View>


            </Pressable>
        )
    }


    const marker = (item) => { 
        return(
<Marker key={item.user}
          coordinate={{latitude: item.latitude != null ? item.latitude : 0,
            longitude:  item.longitude != null ? item.longitude : 0,}}
          title={item.name}
          description={item.user}
        >
          {/* Replace 'imageSource' with the path to your image */} 
          <Pressable onPressIn={() => haptic()}>
            <Image source={{uri: server + `media/` + item.image}}
             style={[{ width:20, height: 20,borderColor: "white", borderWidth: .3,
              borderRadius: 360}, item.user==user && {borderColor: "gold"}]} />
          </Pressable>
        </Marker>
        )
    }

    const line = (item) => {
     
        return (
            <Polyline key={item.key}
    coordinates={[
    {latitude: item.latitude, longitude: item.longitude}, 
    {latitude: item.otherLatitude, longitude: item.otherLongitude},
    ]}
    strokeColor="#000" // fallback for when `strokeColors` is not supported by the map-provider
    strokeColors={[
      '#287cd1',  
      '#76ace3',
      '#c0d7ed',  
      '#dae7f5' 
    ]} 
    strokeWidth={2}
  /> 
            )
       
    } 

    const lineShadow = (item) => {
     
        return (
            <Polyline key={item.key}
    coordinates={[
    {latitude: item.latitude, longitude: item.longitude}, 
    {latitude: item.otherLatitude, longitude: item.otherLongitude},
    ]}
    strokeColor="#000" // fallback for when `strokeColors` is not supported by the map-provider
    strokeColors={[
      'rgba(40, 124, 209, .2)',  
      'rgba(118, 172, 227, .2)',
      'rgba(192, 215, 237, .2)',  
      'rgba(218, 231, 245, .2)'
    ]} 
    strokeWidth={6} 
  />
            )
       
    } 


    
    const lookupCall = (number) => {
        navigation.navigate("Lookup", {"user":user, "token":token, "number": number })
    }

    const accept = (other) => {
        fetch(server + `home/acceptRe/`, {
            method: "POST",
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify({"user":user, "token":token, "person":other.user})
        })
        .then(res => res.json())
        .then(res => {
            if(res){
                other.request = false
                setUp((up) => up + "a")
            }
        })
    }

    const decline = (other) => {
        fetch(server + `home/denyRe/`, {
            method: "POST",
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify({"user":user, "token":token, "person":other.user})
        })
        .then(res => res.json())
        .then(res => {
            if(res){
                other.request = false
                setUp((up) => up + "a")
            }
        })
    }

    const showFriends = () => {
        haptic()
        setFriendsOpen(true)
    }

    const pastCall = ({item}) => {
        const ICalled = item.calling == user
        const missed = item.status == "missed"

        const shownDate = formatDate(item.datetime)

        return(
            <Pressable onPressIn={() => press(item)} onPressOut={() => setSelected("")} onPress={() => item.match ? request(item.called): call(ICalled ? item.called : item.calling)} 
            disabled={item.match && friends.includes(item.user)}
             style={[{width: "98%", backgroundColor: "rgb(15,15,15)", 
             paddingVertical: "5%", marginVertical: "2%", alignSelf: "center", 
             borderRadius:20, flexDirection: "row", paddingHorizontal: "2%", 
             justifyContent: "center"}, 
             selected==item && {opacity: .4}]} key={item.datetime}>
                    
                    <View style={{width: "10%"}}>

                    {(!missed || ICalled) && !item.match ?
                    
                        <SimpleLineIcons name={"call-" + (ICalled ? "out" : "in")} size={window.width * .98 * .08} color="white"/>
                    : !item.match ?
                        <Feather name="phone-missed" size={window.width * .98 * .08} color="red" />
                     : item.match &&
                     
                     <Image source={require("../assets/network.png")}
                             style={[{width: window.width * .98 * .08, height: window.height * .98 * .04, }]} resizeMode={"contain"}
                    />
                    
                    } 

                     
                </View> 

                <View style={{width: "65%", paddingLeft: "10%", alignItems: "center", flexDirection: "row"}}>
                     
               { item.match && !friends.includes(item.called) && 
                     
                    <Pressable onPress={() => request(item.called)} style={{marginRight: "1%"}}>
                        <Ionicons name={"person-add" + (!requested.includes(item.called) ? "-outline" : "")} size={window.width * .98 * .65 * .09} color="white" /> 
                    </Pressable>
                
                   } 

                        <Text style={[{color: "white", fontSize: 17, opacity: .8, width: "90%"}]} numberOfLines={1}>{ICalled ? item.called : item.calling}</Text>
                </View>

                <View style={{width: "25%", justifyContent: "center"}}>
                        
                        <Text style={{color: "white", fontSize: 17, opacity: .8}} numberOfLines={1}>{shownDate}</Text>
                 
                </View>

            </Pressable>
        )
    }


    const call = (other) => {
    
        fetch(server + `home/call/`, {
          method: "POST",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify({"user":user, "other":other, "token":token})
        })
        navigation.navigate("Call", {other: other, user:user, token:token}) 
      }


    const hobbie = (what) => { 
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy)
        if(hobbies.includes(what)){
          setHobbies(current => current.filter(element => { return element !== what}))
        } else {
          setHobbies([...hobbies, what])
        }
      } 

      const sport = () => {
        return(
          <View style={styles.catagory}>
  
                                  <Text style={styles.catagoryText}>sport</Text>
                                  
                              <View style={styles.hobbiesView}>
                                
                                <Pressable style={styles.hobby} onPress={() => hobbie("soccer")}>
                                    <Text style={styles.hobText}>soccer</Text>
                                    <View style={styles.icon}>
                                        {hobbies.includes("soccer") ? 
                                        <Image source={require("../assets/soccer.gif")}
                                        style={styles.hobIcon}/>
                                        :
                                        <FontAwesome name="soccer-ball-o" size={26} color="#2e2d2d" />
                                        }
                                    </View>
                                   </Pressable>  
  
                                   <Pressable style={styles.hobby} onPress={() => hobbie("basketball")}>
                                    <Text style={styles.hobText}>basketball</Text>
                                    <View style={styles.icon}>
                                        {hobbies.includes("basketball") ? 
                                        <Image source={require("../assets/ball.gif")}
                                        style={styles.hobIcon}/>
                                        :
                                        <FontAwesome5 name="basketball-ball" size={26} color="#2e2d2d" />
                                        }
                                    </View>
                                   </Pressable>  
  
                                   <Pressable style={styles.hobby} onPress={() => hobbie("football")}>
                                    <Text style={styles.hobText}>football</Text>
                                    <View style={styles.icon}>
                                        {hobbies.includes("football") ? 
                                        <Image source={require("../assets/football.gif")}
                                        style={[styles.hobIcon, {transform: [{scale: .115}]}]}/>
                                        :
                                        <FontAwesome5 name="football-ball" size={26} color="#2e2d2d" />
                                        }
                                    </View>
                                   </Pressable> 
                                   
                                   <Pressable style={styles.hobby} onPress={() => hobbie("baseball")}>
                                    <Text style={styles.hobText}>baseball</Text>
                                    <View style={styles.icon}>
                                        {hobbies.includes("baseball") ? 
                                        <Image source={require("../assets/baseball.gif")}
                                        style={styles.hobIcon}/>
                                        :
                                        <FontAwesome5 name="baseball-ball" size={26} color="#2e2d2d" />
                                        }
                                    </View>
                                   </Pressable>  
  
                                   <Pressable style={styles.hobby} onPress={() => hobbie("tennis")}>
                                    <Text style={styles.hobText}>tennis</Text>
                                    <View style={styles.icon}>
                                        {hobbies.includes("tennis") ? 
                                        <Image source={require("../assets/tennis.gif")}
                                        style={[styles.hobIcon, {transform:[{scale:.05}]}]}/>
                                        :
                                        <Ionicons name="tennisball" size={18} color="#2e2d2d" />
                                        }
                                    </View>
                                   </Pressable>
  
                                   <Pressable style={styles.hobby} onPress={() => hobbie("swimming")}>
                                    <Text style={styles.hobText}>swimming</Text>
                                    <View style={styles.icon}>
                                        {hobbies.includes("swimming") ? 
                                        <Image source={require("../assets/swimming.gif")}
                                        style={[styles.hobIcon, {transform:[{scale:.13}]}]}/>
                                        :
                                        <MaterialCommunityIcons name="swim" size={28} color="#2e2d2d" />
                                        }
                                    </View>
                                   </Pressable>  
  
                                   <Pressable style={styles.hobby} onPress={() => hobbie("golf")}>
                                    <Text style={styles.hobText}>golf</Text>
                                    <View style={styles.icon}>
                                        {hobbies.includes("golf") ? 
                                        <Image source={require("../assets/golf.gif")}
                                        style={[styles.hobIcon, {transform: [{scale: .12}]}]}/>
                                        :
                                        <FontAwesome5 name="golf-ball" size={28} color="#2e2d2d" />
                                        }
                                    </View>
                                   </Pressable> 
  
                                   <Pressable style={styles.hobby} onPress={() => hobbie("hockey")}>
                                    <Text style={styles.hobText}>hockey</Text>
                                    <View style={styles.icon}>
                                        {hobbies.includes("hockey") ? 
                                        <Image source={require("../assets/hockey.gif")}
                                        style={styles.hobIcon}/>
                                        :
                                        <FontAwesome5 name="hockey-puck" size={26} color="#2e2d2d" />
                                        }
                                    </View>
                                   </Pressable>  
  
                                   <Pressable style={styles.hobby} onPress={() => hobbie("skateboarding")}>
                                    <Text style={styles.hobText}>skateboarding</Text>
                                    <View style={styles.icon}>
                                        {hobbies.includes("skateboarding") ? 
                                        <Image source={require("../assets/skateboard.gif")}
                                        style={[styles.hobIcon, {transform: [{scale: .13}]}]}/>
                                        :
                                        <MaterialCommunityIcons name="skateboard" size={33} color="#2e2d2d" />
                                        }
                                    </View>
                                   </Pressable> 
  
                                   <Pressable style={styles.hobby} onPress={() => hobbie("boxing")}>
                                    <Text style={styles.hobText}>boxing</Text>
                                    <View style={styles.icon}>
                                        {hobbies.includes("boxing") ? 
                                        <Image source={require("../assets/boxing.gif")}
                                        style={[styles.hobIcon, {transform: [{scale: .1}]}]}/>
                                        :
                                        <MaterialCommunityIcons name="boxing-glove" size={33} color="#2e2d2d" />
                                        }
                                    </View>
                                   </Pressable> 
  
                                   <Pressable style={styles.hobby} onPress={() => hobbie("martialArts")}>
                                    <Text style={styles.hobText}>martial arts</Text>
                                    <View style={styles.icon}>
                                        {hobbies.includes("martialArts") ? 
                                        <Image source={require("../assets/martialArts.gif")}
                                        style={[styles.hobIcon, {transform: [{scale: .1}]}]}/>
                                        :
                                        <MaterialCommunityIcons name="karate" size={33} color="#2e2d2d" />
                                        }
                                    </View>
                                   </Pressable> 
  
                                   <Pressable style={styles.hobby} onPress={() => hobbie("cycling")}>
                                    <Text style={styles.hobText}>cycling</Text>
                                    <View style={styles.icon}>
                                        {hobbies.includes("cycling") ? 
                                        <Image source={require("../assets/cycling.gif")}
                                        style={[styles.hobIcon, {transform: [{scale: .12}]}]}/>
                                        :
                                        <FontAwesome name="bicycle" size={27} color="#2e2d2d" />
                                        }
                                    </View>
                                   </Pressable> 
  
                                   <Pressable style={styles.hobby} onPress={() => hobbie("running")}>
                                    <Text style={styles.hobText}>running</Text>
                                    <View style={styles.icon}>
                                        {hobbies.includes("running") ? 
                                        <Image source={require("../assets/running.gif")}
                                        style={[styles.hobIcon, {transform: [{scale: .12}]}]}/>
                                        :
                                        <FontAwesome5 name="running" size={27} color="#2e2d2d" />
                                        }
                                    </View>
                                   </Pressable> 
  
                             </View>
  
                              </View>
        )
      }
      const art = () => {
        return(
  <View style={styles.catagory}>
  
  <Text style={styles.catagoryText}>art</Text>
  
  <View style={styles.hobbiesView}>
  
  <Pressable style={styles.hobby} onPress={() => hobbie("painting")}>
    <Text style={styles.hobText}>painting</Text>
    <View style={styles.icon}>
        {hobbies.includes("painting") ? 
        <Image source={require("../assets/art.gif")}
        style={[styles.hobIcon, {transform: [{scale: .12}]}]}/>
        :
        <FontAwesome5 name="palette" size={27} color="#2e2d2d" style={{transform: [{rotate: "140deg"}]}}/>
        }
    </View>
  </Pressable> 
  
  <Pressable style={styles.hobby} onPress={() => hobbie("sketching")}>
    <Text style={styles.hobText}>sketching</Text>
    <View style={styles.icon}>
        {hobbies.includes("sketching") ? 
        <Image source={require("../assets/write.gif")} 
        style={[styles.hobIcon, {transform: [{scale: .11}]}]}/>
        :
        <MaterialCommunityIcons name="draw" size={27} color="#2e2d2d" />
        }
    </View>
  </Pressable> 
  
  <Pressable style={styles.hobby} onPress={() => hobbie("photography")}>
    <Text style={styles.hobText}>photography</Text>
    <View style={styles.icon}>
        {hobbies.includes("photography") ? 
        <Image source={require("../assets/camera.gif")} 
        style={[styles.hobIcon, {transform: [{scale: .11}]}]}/>
        :
        <Entypo name="camera" size={27} color="#2e2d2d" />
        }
    </View>
  </Pressable> 
  
  <Pressable style={styles.hobby} onPress={() => hobbie("crafting")}>
    <Text style={styles.hobText}>crafting</Text>
    <View style={styles.icon}> 
        {hobbies.includes("crafting") ? 
        <Image source={require("../assets/craft.gif")} 
        style={[styles.hobIcon, {transform: [{scale: .12}]}]}/>
        :
        <FontAwesome5 name="hammer" size={24} color="#2e2d2d" />
        }
    </View>
  </Pressable> 
  
  </View>
  </View>
        )
      }
      const technology = () => {
  return(
    <View style={styles.catagory}>
  
                                  <Text style={styles.catagoryText}>technology</Text>
                                  
                              <View style={styles.hobbiesView}>
                              
                                <Pressable style={styles.hobby} onPress={() => hobbie("robotics")}>
                                    <Text style={styles.hobText}>robotics</Text>
                                    <View style={styles.icon}> 
                                        {hobbies.includes("robotics") ? 
                                        <Image source={require("../assets/tech.gif")} 
                                        style={[styles.hobIcon, {transform: [{scale: .14}]}]}/>
                                        :
                                        <FontAwesome5 name="robot" size={24} color="#2e2d2d" />
                                        }
                                    </View>
                                </Pressable>
  
                                <Pressable style={styles.hobby} onPress={() => hobbie("coding")}>
                                    <Text style={styles.hobText}>coding</Text>
                                    <View style={styles.icon}> 
                                        {hobbies.includes("coding") ? 
                                        <Image source={require("../assets/coding.gif")} 
                                        style={[styles.hobIcon, {transform: [{scale: .11}]}]}/>
                                        :
                                        <Entypo name="code" size={24} color="#2e2d2d" />
                                        }
                                    </View>
                                </Pressable>
  
                                <Pressable style={styles.hobby} onPress={() => hobbie("engineering")}>
                                    <Text style={styles.hobText}>engineering</Text>
                                    <View style={styles.icon}> 
                                        {hobbies.includes("engineering") ? 
                                        <Image source={require("../assets/engineering.gif")} 
                                        style={[styles.hobIcon, {transform: [{scale: .11}]}]}/>
                                        :
                                        <MaterialIcons name="engineering" size={24} color="#2e2d2d" />
                                        }
                                    </View>
                                </Pressable>
  
                                <Pressable style={styles.hobby} onPress={() => hobbie("tv")}>
                                    <Text style={styles.hobText}>tv</Text>
                                    <View style={styles.icon}> 
                                        {hobbies.includes("tv") ? 
                                        <Image source={require("../assets/tv.gif")} 
                                        style={[styles.hobIcon, {transform: [{scale: .11}]}]}/>
                                        :
                                        <Ionicons name="ios-tv-outline" size={32} color="#2e2d2d" />
                                        }
                                    </View>
                                </Pressable>
  
                                <Pressable style={styles.hobby} onPress={() => hobbie("video games")}>
                                    <Text style={styles.hobText}>video games</Text>
                                    <View style={styles.icon}> 
                                        {hobbies.includes("video games") ? 
                                        <Image source={require("../assets/game.gif")} 
                                        style={[styles.hobIcon, {transform: [{scale: .13}]}]}/>
                                        :
                                        <Ionicons name="game-controller" size={34} color="#2e2d2d" />
                                        }
                                    </View>
                                </Pressable>
                              
                              </View>
                              </View>
  )
      } 
      const travel = () => {
  return(
  
    <View style={styles.catagory}>
  
    <Text style={styles.catagoryText}>nature/travel</Text>
    
  <View style={styles.hobbiesView}>
  
  <Pressable style={styles.hobby} onPress={() => hobbie("travel")}>
      <Text style={styles.hobText}>travel</Text>
      <View style={styles.icon}> 
          {hobbies.includes("travel") ? 
          <Image source={require("../assets/travel.gif")} 
          style={[styles.hobIcon, {transform: [{scale: .12}]}]}/>
          :
          <Fontisto name="world-o" size={29} color="#2e2d2d" />
          }
      </View>
  </Pressable>
  
  <Pressable style={styles.hobby} onPress={() => hobbie("hiking")}>
      <Text style={styles.hobText}>hiking</Text>
      <View style={styles.icon}> 
          {hobbies.includes("hiking") ? 
          <Image source={require("../assets/hike.gif")} 
          style={[styles.hobIcon, {transform: [{scale: .12}]}]}/>
          :
          <FontAwesome5 name="walking" size={32} color="#2e2d2d" />
          }
      </View>
  </Pressable>
  
  <Pressable style={styles.hobby} onPress={() => hobbie("fishing")}>
      <Text style={styles.hobText}>fishing</Text>
      <View style={styles.icon}> 
          {hobbies.includes("fishing") ? 
          <Image source={require("../assets/fish.gif")} 
          style={[styles.hobIcon, {transform: [{scale: .12}]}]}/>
          :
          <FontAwesome5 name="fish" size={27} color="#2e2d2d" 
          style={{transform: [{rotate: "180deg"}]}}/>
          }
      </View>
  </Pressable>
  
  <Pressable style={styles.hobby} onPress={() => hobbie("hunting")}>
      <Text style={styles.hobText}>hunting</Text>
      <View style={styles.icon}> 
          {hobbies.includes("hunting") ? 
          <Image source={require("../assets/hunt.gif")} 
          style={[styles.hobIcon, {transform: [{scale: .12}]}]}/>
          :
          <FontAwesome5 name="fish" size={27} color="#2e2d2d"/>
          }
      </View>
  </Pressable>
  
  <Pressable style={styles.hobby} onPress={() => hobbie("driving")}>
      <Text style={styles.hobText}>driving</Text>
      <View style={styles.icon}> 
          {hobbies.includes("driving") ? 
          <Image source={require("../assets/driving.gif")} 
          style={[styles.hobIcon, {transform: [{scale: .11}]}]}/>
          :
          <Ionicons name="md-car-sport-sharp" size={27} color="#2e2d2d"/>
          }
      </View>
  </Pressable>
  
  <Pressable style={styles.hobby} onPress={() => hobbie("flying")}>
      <Text style={styles.hobText}>flying</Text>
      <View style={styles.icon}> 
          {hobbies.includes("flying") ? 
          <Image source={require("../assets/flying.gif")} 
          style={[styles.hobIcon, {transform: [{scale: .11}]}]}/>
          :
          <FontAwesome5 name="plane" size={27} color="#2e2d2d"/>
          }
      </View>
  </Pressable>
        
  </View>
  </View>
  )
      }
      const culture = () => {
  return(
    <View style={styles.catagory}>
  
    <Text style={styles.catagoryText}>culture</Text>
    
  <View style={styles.hobbiesView}>
  
  <Pressable style={styles.hobby} onPress={() => hobbie("reading")}>
      <Text style={styles.hobText}>reading</Text>
      <View style={styles.icon}> 
          {hobbies.includes("reading") ? 
          <Image source={require("../assets/book.gif")} 
          style={[styles.hobIcon, {transform: [{scale: .11}]}]}/>
          :
          <FontAwesome5 name="book" size={27} color="#2e2d2d"/>
          }
      </View>
  </Pressable>
  
  <Pressable style={styles.hobby} onPress={() => hobbie("writing")}>
      <Text style={styles.hobText}>writing</Text>
      <View style={styles.icon}> 
          {hobbies.includes("writing") ? 
          <Image source={require("../assets/writing.gif")} 
          style={[styles.hobIcon, {transform: [{scale: .11}]}]}/>
          :
          <MaterialCommunityIcons name="typewriter" size={27} color="#2e2d2d"/>
          }
      </View>
  </Pressable> 
  
  <Pressable style={styles.hobby} onPress={() => hobbie("theater")}>
      <Text style={styles.hobText}>theater</Text>
      <View style={styles.icon}>
          {hobbies.includes("theater") ? 
          <Image source={require("../assets/theater.gif")} 
          style={[styles.hobIcon, {transform: [{scale: .11}]}]}/>
          :
          <MaterialIcons name="theater-comedy" size={30} color="#2e2d2d" />
          }
      </View>
  </Pressable>        
  
  <Pressable style={styles.hobby} onPress={() => hobbie("politics")}>
      <Text style={styles.hobText}>politics</Text>
      <View style={styles.icon}>
          {hobbies.includes("politics") ? 
          <Image source={require("../assets/politics.gif")} 
          style={[styles.hobIcon, {transform: [{scale: .11}]}]}/>
          :
          <Ionicons name="newspaper" size={30} color="#2e2d2d" />
          }
      </View>
  </Pressable>   
  
  </View>
  </View>
  )
      }
      const extreme = () => {
  return(
    <View style={styles.catagory}>
  
                                  <Text style={styles.catagoryText}>extreme</Text>
                                  
                              <View style={styles.hobbiesView}>
  
                              <Pressable style={styles.hobby} onPress={() => hobbie("skiing")}>
                                    <Text style={styles.hobText}>skiing</Text>
                                    <View style={styles.icon}> 
                                        {hobbies.includes("skiing") ? 
                                        <Image source={require("../assets/ski.gif")} 
                                        style={[styles.hobIcon, {transform: [{scale: .11}]}]}/>
                                        :
                                        <FontAwesome5 name="skiing" size={28} color="#2e2d2d" />
                                        }
                                    </View>
                              </Pressable>
  
                              <Pressable style={styles.hobby} onPress={() => hobbie("scuba diving")}>
                                    <Text style={styles.hobText}>scuba diving</Text>
                                    <View style={styles.icon}> 
                                        {hobbies.includes("scuba diving") ? 
                                        <Image source={require("../assets/scuba.gif")} 
                                        style={[styles.hobIcon, {transform: [{scale: .11}]}]}/>
                                        :
                                        <Fontisto name="snorkel" size={28} color="#2e2d2d" />
                                        }
                                    </View>
                              </Pressable>
  
                              <Pressable style={styles.hobby} onPress={() => hobbie("skydiving")}>
                                    <Text style={styles.hobText}>skydiving</Text>
                                    <View style={styles.icon}> 
                                        {hobbies.includes("skydiving") ? 
                                        <Image source={require("../assets/skydiving.gif")} 
                                        style={[styles.hobIcon, {transform: [{scale: .11}]}]}/>
                                        :
                                        <MaterialCommunityIcons name="parachute" size={34} color="#2e2d2d" />
                                        }
                                    </View>
                              </Pressable>
  
                              <Pressable style={styles.hobby} onPress={() => hobbie("snowboarding")}>
                                    <Text style={styles.hobText}>snowboarding</Text>
                                    <View style={styles.icon}> 
                                        {hobbies.includes("snowboarding") ? 
                                        <Image source={require("../assets/snowboarding.gif")} 
                                        style={[styles.hobIcon, {transform: [{scale: .11}]}]}/>
                                        :
                                        <FontAwesome5 name="snowboarding" size={28} color="#2e2d2d" />
                                        }
                                    </View>
                              </Pressable>
  
                              </View>
                              </View>
  )
      }
      const music = () => {
  return(
    <View style={styles.catagory}>
  
                                  <Text style={styles.catagoryText}>music</Text>
                                  
                              <View style={styles.hobbiesView}>
  
                              <Pressable style={styles.hobby} onPress={() => hobbie("music")}>
                                    <Text style={styles.hobText}>music</Text>
                                    <View style={styles.icon}> 
                                        {hobbies.includes("music") ? 
                                        <Image source={require("../assets/music.gif")} 
                                        style={[styles.hobIcon, {transform: [{scale: .11}]}]}/>
                                        :
                                        <FontAwesome name="music" size={26} color="#2e2d2d" />
                                        }
                                    </View>
                              </Pressable>
  
                              <Pressable style={styles.hobby} onPress={() => hobbie("singing")}>
                                    <Text style={styles.hobText}>singing</Text>
                                    <View style={styles.icon}> 
                                        {hobbies.includes("singing") ? 
                                        <Image source={require("../assets/singing.gif")} 
                                        style={[styles.hobIcon, {transform: [{scale: .11}]}]}/>
                                        :
                                        <Entypo name="modern-mic" size={26} color="#2e2d2d" />
                                        }
                                    </View>
                              </Pressable>
  
                              <Pressable style={styles.hobby} onPress={() => hobbie("guitar")}>
                                    <Text style={styles.hobText}>guitar</Text>
                                    <View style={styles.icon}> 
                                        {hobbies.includes("guitar") ? 
                                        <Image source={require("../assets/guitar.gif")} 
                                        style={[styles.hobIcon, {transform: [{scale: .11}]}]}/>
                                        :
                                        <FontAwesome5 name="guitar" size={26} color="#2e2d2d" />
                                        }
                                    </View>
                              </Pressable>
  
                              <Pressable style={styles.hobby} onPress={() => hobbie("drums")}>
                                    <Text style={styles.hobText}>drums</Text>
                                    <View style={styles.icon}> 
                                        {hobbies.includes("drums") ? 
                                        <Image source={require("../assets/drum.gif")} 
                                        style={[styles.hobIcon, {transform: [{scale: .11}]}]}/>
                                        :
                                        <FontAwesome5 name="drum" size={26} color="#2e2d2d" />
                                        }
                                    </View>
                              </Pressable>
  
                              <Pressable style={styles.hobby} onPress={() => hobbie("piano")}>
                                    <Text style={styles.hobText}>piano</Text>
                                    <View style={styles.icon}> 
                                        {hobbies.includes("piano") ? 
                                        <Image source={require("../assets/piano.gif")} 
                                        style={[styles.hobIcon, {transform: [{scale: .11}]}]}/>
                                        :
                                        <MaterialCommunityIcons name="piano" size={26} color="#2e2d2d" />
                                        }
                                    </View>
                              </Pressable>
  
                              <Pressable style={styles.hobby} onPress={() => hobbie("dancing")}>
                                    <Text style={styles.hobText}>dancing</Text>
                                    <View style={styles.icon}> 
                                        {hobbies.includes("dancing") ? 
                                        <Image source={require("../assets/dancing.gif")} 
                                        style={[styles.hobIcon, {transform: [{scale: .11}]}]}/>
                                        :
                                        <MaterialCommunityIcons name="dance-ballroom" size={34} color="#2e2d2d" />
                                        }
                                    </View>
                              </Pressable>
  
                              </View>
                              </View>
  )
      }


      const  arraysAreEqual = (arr1, arr2) => {
        if (arr1.length !== arr2.length) {
          return false;
        }
      
        for (const element of arr1) {
          if (!arr2.includes(element)) {
            return false;
          }
        }
      
        return true;
      }
    
    const canSaveSettings = () => {
        return (sImage != null || sFirst != profile.first || sLast != profile.last || sBio != profile.bio || sUser != user || !arraysAreEqual(hobbies, profile.hobbies))
    }

    const saveSettings = () => {
        if(sImage != null){

        }

        if(sFirst != profile.first || sLast != profile.last){
            fetch(server + `home/setName/`, {
                method: "POST",
                headers: {
                    "content-type": "application/json",
                },
                body: JSON.stringify({"user": user, "token": token, "first": sFirst, "last": sLast})
            })
        }

        if(sBio != profile.bio){
            fetch(server + `home/setBio/`, {
                method: "POST",
                headers: {
                    "content-type": "application/json",
                },
                body: JSON.stringify({"user": user, "token": token, "first": sBio, })
            })
        }

        if(!arraysAreEqual(hobbies, profile.hobbies)){
            fetch(server + `home/setHobbies/`, {
                method: "POST",
                headers: {
                    "content-type": "application/json",
                },
                body: JSON.stringify({"user": user, "token": token, "hobbies": hobbies,})
            })
        }

        if(sUser != user){
            fetch(server + `home/setUser/`, {
                method: "POST",
                headers: {
                    "content-type": "application/json",
                },
                body: JSON.stringify({"user":user, "token": token, "newUser": sUser})
            })
            .then(res => res.json())
            .then(res =>  {
                const changeStoredUser = async () => {
                    await AsyncStorage.setItem("user", sUser)
                    .then(setLoaded(false).then(ch().then(setCurrent("profile"))))
                }

                if(res){
                    changeStoredUser()
                }
            })
        }

        if(canSaveSettings()){
            setSSaved(true)
            curr("profile")
            setTimeout(() => {
                setSSaved(false)
            }, 2500);
        }
    }

    const article = (item) => {
        return (
            <View key={item} style={{width: "100%", height: "90%",  alignItems: "center"}}
            >
                <Image source={{uri: item.image}} style={{width: "100%", height: "60%", borderRadius: 10, backgroundColor: "black"}} resizeMode="cover"/>
                <Text style={{color: "white", opacity: .7, fontSize: 23,  fontFamily: 'AmericanTypewriter', fontWeight:600}}>{item.title}</Text>

            </View>
        )
    }

    const articles = ({item}) => {
        return (
            <Pressable key={item}
            onPress={() => shownArticles.length > 1 && setArticleLink(item.link)} 
            onPressIn={() => setSelected(item.id + "-news")} onPressOut={() => setSelected("")}
            >
            <View style={[{width: "100%",  alignItems: "center", flexDirection: "column", marginTop: "20%", }, selected==item.id + "-news" && {opacity: .4}]}>
                <Image source={item.image != "N/A" ? {uri: item.image} : {uri: null}} style={{width: "100%", height: (window.height * .90 * .3), backgroundColor: "black"}} resizeMode="contain"/>
                
                <Text style={{color: "white", opacity: .7, fontSize: 23,  fontFamily: 'AmericanTypewriter', fontWeight:600}}>{item.title}</Text>
            </View>

            </Pressable>
        )
    }

    const newColab = () => {
        setFeedCurrent("new")
    }

    const fetchNextPage = async (after, list) => {
        const { assets, endCursor, hasNextPage } = await MediaLibrary.getAssetsAsync({
          after,
          first: 20,
          mediaType: ['photo', 'video'], // Adjust the number as per your requirements
          sortBy: 'creationTime',
        });
        
        list.push(...assets)
        if(hasNextPage){
            await fetchNextPage(endCursor, list)
        } else {
            setMedia(list)
        }
    }

    const openMedia = () => {
        const open = async () => {
            try{
                fetchNextPage( null, [])
                setMediaPicker(true)
            } catch {
                await MediaLibrary.requestPermissionsAsync() 
                
            }
        }
        open()
    }

    const growMedia = () => {
        Animated.timing(selectedMediaWidth,  {
            toValue: window.width * 1,
            duration: 500,
            useNativeDriver: false
        }).start(({finished}) => {
            
          })
        
        Animated.timing(selectedMediaHeight,  {
            toValue: window.height * 1,
            duration: 500,
            useNativeDriver: false
        }).start(({finished}) => {
            
          })
        Animated.timing(zoomMedia,  {
            toValue: 1,
            duration: 500,
            useNativeDriver: false
        }).start(({finished}) => {
            
          })
    }

    const shrinkMedia = () => {
        Animated.timing(selectedMediaWidth, {
            toValue: window.width * .48,
            duration: 500,
            useNativeDriver: false
        }).start(({finished}) => {
            setSelectedMedia(null)
        })
        Animated.timing(selectedMediaHeight,  {
            toValue: window.width * .48,
            duration: 500,
            useNativeDriver: false
        }).start(({finished}) => {
            
          })
        Animated.timing(zoomMedia,  {
            toValue: 0,
            duration: 500,
            useNativeDriver: false
        }).start(({finished}) => {
            
          })
    }

    const exitMedia = () => {
        if(selectedMedia != null){
            shrinkMedia()
        } else {
            setMediaPicker(false)
        }
        
        
    }

    if(loaded){

    return(
    <SafeAreaView style={{flex: 1, backgroundColor: "black", height: "100%", width: "100%"}}> 
            
            

        {current == "profile" ? //profileScreen
            <View
            style={{width: "100%", height: "100%", alignSelf: "flex-end", }}>
             
            <View style={{height: "10%", justifyContent: "center",}}>
                <View style={{height: "98%%", backgroundColor: "rgba(22, 22, 23, 1)", borderRadius: 20, paddingVertical: "3%", width: "98%", alignSelf: 'center', flexDirection: "row"}}>
                       
            <View style={{width: "100%",  height: "100%", justifyContent: "center", alignItems: "center", }}>
                            
                            <Text style={{fontSize: 25, color: "white",
                             opacity: .4, width: "96%", textAlign: "center",
                             fontFamily: 'AmericanTypewriter-bold', fontWeight: "bold", }} 
                            adjustsFontSizeToFit numberOfLines={2}
                            >
                                
                                {profile.schoolType == "university" ?
                                profile.school
                                :
                                profile.city + ", " + profile.country
                                }
                                
                                </Text>


                        </View>
                </View>
            </View> 
            <View style={{height: "60.5%",}}>
            
            <View style={{flexDirection:"row",  borderRadius: 20, width: "98%", alignSelf: 'center', justifyContent: "space-between", height: "100%"}}> 
                <View style={{flexDirection: "column", marginTop: 0, alignItems: "center", left: 0, marginRight: "0%", width: "60%",  height: "100%"}}>
                    <View style={{height: "100%", backgroundColor: "rgba(22,22,22,1)", alignItems: "center",  borderRadius: 20, padding: "3%",}}> 
                    <Image source={{uri: server + "media/" + profile.image}} style={styles.profimage}  defaultSource={require('../assets/emptyProfile.png')}/>
                    <View style={[styles.infoV, ]}> 

                        <Text style={styles.infoT}>{profile.name}</Text>  
                        <Text style={styles.infoT}>{user}</Text> 
                        {profile.schoolType == "university" ?
                        <Text style={[styles.infoT, ]}>Focusing on {profile.field} at {profile.school}</Text>
                          : profile.schoolType == "secondary" &&
                          <Text style={[styles.infoT, ]}>Secondary school student at {profile.school}</Text>
                          }
                        </View>
                    </View>

                    

                </View>  

                <View style={{width: "39%",}}>

                <View  
                style={[{alignItems: "center", width: "100%", 
                backgroundColor: "rgba(22, 22, 22, 1)",  borderRadius: 20, 
                padding: "3%", height: "20%", justifyContent: "space-around", paddingVertical: "8%"}]}>  
                    
                    <Pressable style={[ {opacity: .8}, selected=="showFriends" && {opacity: .4}]} 
                    onPress={() => {showFriends(), setSelected("")}} onPressIn={() => {setSelected("showFriends"), Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)}} onPressOut={() => setSelected("")}
                    >    
                        <Text style={[styles.infoT, {fontSize: 19}]}>{friends.length} friends</Text>
                    </Pressable>

                    <Pressable style={[ {opacity: .8}, selected=="showPosts" && {opacity: .4}]} 
                     onPressIn={() => {setSelected("showPosts"), Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)}} onPressOut={() => setSelected("")} onPress={() => setCountriesOpen(true)}
                    >     
                        <Text style={[styles.infoT, {fontSize: 19}]}>network</Text>  
                    </Pressable>
                
                </View> 

                <View   
                style={[{alignItems: "center", width: "100%", marginTop: "1%",
                backgroundColor: "rgba(22, 22, 22, 0)",  borderRadius: 20, 
                 height: "20%",}, ]}> 
                        
                        <Flag code={profile.iso} type="flat" style={{height: "100%", width: "100%", borderRadius: 20, opacity: 1, }} />

                </View> 

                <View 
                style={[{alignItems: "center", width: "100%", marginTop: "1%",
                backgroundColor: "rgba(22, 22, 22, 1)",  borderRadius: 20, 
                padding: "3%", height: "99%", }]} 
                > 
                    
                     <Hobbies profile={profile}/> 
                   
                </View>
              
                </View>

              

            </View>
          </View>
        
        <View style={{height: "24.1%", justifyContent: "center"}}>
                <View style={{height: "98%%", backgroundColor: "rgba(22, 22, 22, 1)", borderRadius: 20, paddingVertical: "3%", width: "58.8%", alignSelf: 'flex-start', marginLeft: "1%", justifyContent: "center"}}>
                        
                        <Pressable style={[{alignSelf: "center", opacity: .7}, selected=="settings" && {opacity: .4}]} onPressIn={() => press("settings")} onPressOut={() => setSelected("")} onPress={() => curr("settings")}>
                                <Ionicon name="settings-sharp" size={90} color="white" />
                        </Pressable>
                </View>
            </View> 
              
        </View>

            :
            current == "home" ?

            <View
            style={{width: "100%", height: "100%", alignSelf: "flex-end", }}>

                <View style={[styles.homeView]}>
                
                <View style={[{width: "100%", flexDirection: "row", },]}>
                
                
                <Animated.View style={[styles.homeIsland, selected=="chat" && {transform:[{scale: .985}]}, 
                    {width: chatWidth ,height: chatHeight}, currentHome=="chat" && {marginHorizontal: "0%", borderRadius: 0}
                    , chatBlue && {backgroundColor: "#7299db", borderTopRightRadius: 0, borderBottomRightRadius: 0},
                     currentHome=="chat" && {backgroundColor: "rgba(0,0,0,0)", borderWidth: 5, borderColor: "rgb(22,22,22)", borderRadius: 20}]}>  
                        
                        {currentHome!="chat" ? //chatScreen
                        <Pressable style={[{justifyContent: "center", alignItems: "center", width: "100%", height: "100%",}, chatBlue && {display:"none"}]}
                        onPressIn={() => press("chat")} onPressOut={() => setSelected("")} onPress={() => currentHome=="chat" ? shrinkChat() : growChat()} 
                        >     


                            <Entypo name="chat" size={100} style={styles.homeIcon} color={"white"}/>
                            <Text style={styles.homeText}>Chat with your friends</Text>
                       
                        </Pressable>
                        :

                        <View style={{width: "100%", height: "100%",}}>
                            <View style={{width: "100%", height: "7%", flexDirection: "row", justifyContent: "space-between"}}>
                                
                                <Pressable onPress={() => shrinkChat()} onPressIn={() => press("back")} onPressOut={() => setSelected("")} > 
                                    <Entypo  name="chevron-left" size={35} 
                                    color={"white"} style={[selected=="back" && {opacity: .4}]} />
                                </Pressable>
 
                                <Pressable onPress={() => newChat()} onPressIn={() => press("newchat")} onPressOut={() => setSelected("")}  >
                                <Entypo  name="plus" size={35} 
                                    color={"white"} style={[{marginRight: "1%"}, selected=="newchat" && {opacity: .4}]}/> 
                                </Pressable>
                                    

                            </View>

                            <View style={{height: "93%", width: "100%", }}>
                                    <FlatList
                                    data={chats} 
                                    renderItem={chat}
                                    keyExtractor={(item, index) => index}  
                                    />
                            </View>
                        </View>     
                    }
  

                    </Animated.View> 
  
 
                    <Animated.View style={[styles.homeIsland, selected=="video" && {transform:[{scale: .985}]}, 
                    {width: videoWidth ,height: videoHeight}, currentHome=="video" && {marginHorizontal: "0%", borderRadius: 0}]}>  
                    
                    {currentHome!="video" ? //videoMatchScreen
                    <Pressable style={[{justifyContent: "center", alignItems: "center", width: "100%", height: "100%",}]}
                        onPressIn={() => press("video")} onPressOut={() => setSelected("")} onPress={() => currentHome=="video" ? shrinkVideo() : growVideo()}
                    >
                         
                            <FontAwsome5 name="video" size={100} style={styles.homeIcon} color={"white"}/>
                            <Text style={styles.homeText}>Video chat with a match from all over the world</Text>

                    </Pressable>
                    :

                    
                    <Pressable style={[{ alignItems: "center", width: "100%", height: "100%", position: "absolute", top: 0, left: 0, }]}
                    onPressIn={() => press("video")} onPressOut={() => setSelected("")} onPress={() => currentHome=="video" ? shrinkVideo() : growVideo()}
                >
                    
                    <View style={{width: "100%", height: "100%"}}>

                    <Image source={require("../assets/nets.png")} style={{width: "100%", position: "absolute", height: "100%"}}
                        resizeMode="cover"
                        />
                    <Text style={{fontWeight: "bold", fontSize: 25, width: "80%", textAlign: "left", color: "white", opacity: .6, marginTop: "10%", marginLeft: "2%"}}
                    >Connect to someone from all over the world in a video call</Text>

                        <View style={{width: "98%", display: "flex", flexDirection: "row", justifyContent: "space-around"}}>
                        
                        <Pressable style={{marginTop: "8%", width: "48%"}}
                        onPress={() => lookupCall(1)} onPressIn={() => press("connect-1")} onPressOut={() => setSelected("")}
                        >
                            <View style={[{paddingHorizontal: "5%", paddingVertical: "2%" ,justifyContent: "center", alignItems: "center", borderWidth: 1, borderRadius: 20, borderColor: "rgb(200,200,200)", minWidth: "30%", backgroundColor: "rgba(22,22,22, 1)"}
                        , selected=="connect-1" && {backgroundColor: "rgba(22,22,22, .4)", opacity: .4, }]} >
                                <Text style={{color: "white", fontSize: 22, fontWeight: "bold", display: "flex", textAlign: "center", flexDirection: "row", alignItems: "center"}}><FontAwesome5 name="user"  size={22} color="white" style={{fontWeight: "bold"}}/> person</Text>
                            </View>
                        </Pressable>

                        <Pressable style={{marginTop: "8%", width: "48%"}}
                        onPress={() => lookupCall(2)} onPressIn={() => press("connect-2")} onPressOut={() => setSelected("")}
                        >
                            <View style={[{paddingHorizontal: "5%", paddingVertical: "2%" ,justifyContent: "center", alignItems: "center", borderWidth: 1, borderRadius: 20, borderColor: "rgb(200,200,200)", minWidth: "30%", backgroundColor: "rgba(22,22,22, 1)"}
                        , selected=="connect-2" && {backgroundColor: "rgba(22,22,22, .4)", opacity: .4, }]} > 
                                <Text style={{color: "white", fontSize: 22, fontWeight: "bold", display: "flex", textAlign: "center", flexDirection: "row", alignItems: "center"}}>
                                    
                                    <View style={{flexDirection: "row", display: "flex"}}>
                                        <FontAwesome5 name="user"  size={22} color="white" style={{fontWeight: "bold"}}/> 
                                        <FontAwesome5 name="user"  size={22} color="white" style={{fontWeight: "bold"}}/> 
                                    </View>

                                    
                                    {" people"}</Text>
                            </View>
                        </Pressable>

                        
                        </View>

                    </View>
                    

                    </Pressable>


                    }
                    </Animated.View>
                </View>

                    <Animated.View style={[styles.network, selected=="visualize" && {transform:[{scale: .985}]}, {height: networkHeight}]} 
                    onPressIn={() => press("visualize")} onPressOut={() => setSelected("")}
                    onPress={() => curr("map")} 
                    >
                        <Pressable onPressIn={() => press("visualize")} onPressOut={() => setSelected("")}
                    onPress={() => curr("map")} style={{width: '100%', height: "100%", flexDirection: "row"}}
                        >              
                            <Image source={require("../assets/network.png")}
                             style={[{width: "50%", height: "100%",}]} resizeMode={"contain"}
                            />

                            <View style={{width: "50%", height: "100%", justifyContent: "center", }}>
                               <Text style={[styles.homeText]}>
                                Visualize your Global Network</Text> 
                            </View> 

                        </Pressable>

                    </Animated.View>

                    <Animated.View style={[styles.news,  selected=="news" && {transform:[{scale: .985}]}, {height: newsHeight}]}>
                        <Pressable style={{width: "100%",}} 
                        onPressIn={() => press("news")} onPressOut={() => setSelected("")} onPress={() => openNews()} 
                        >
                                
                               
                                {shownArticles != null && shownArticles.length > 0 &&  currentHome!="news" &&
                                    article(shownArticles[0])
                                }

                                {currentHome=="news" && //newsScreen
                                <FlatList
                                    data={shownArticles}
                                    renderItem={articles}
                                    keyExtractor={(item) => item.id}
                                />
                                }
                            
                            {currentHome != "news" &&
                            <View style={{height: "10%", width: "100%", }}> 
                                <Text style={[styles.homeText]}>more world news</Text>
                            </View>
                            }

                        </Pressable> 
                    </Animated.View>

                </View>  
             
                


            </View>

            :
            current=="feed" ? //feedScreen

            <View style={{width: "100%", height: "100%", alignSelf: "flex-end",}} >

                {feedCurrent == "new" ? 
                
                            <View style={{width: "100%", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", paddingTop: "20%",}}>
                                
                                <View style={{width: "98%", height: "78%", backgroundColor: "rgba(22,22,22,1)", borderRadius: 20, overflow: "hidden"}}>
                                        
                                        <TextInput style={{width: "100%", height: "10%", paddingHorizontal: "5%", marginVertical: "1.5%", fontSize: 19, color: "white",}} placeholder="title"  numberOfLines={2} placeholderTextColor={"gray"}
                                             multiline onChangeText={(text) => setNewColabTitle(text)} value={newColabTitle}
                                        />
                                        

                                        <Pressable style={[{flexDirection: "row", paddingHorizontal: "4%"}, selected=="media" && {opacity: .4}]}
                                        onPressIn={() => setSelected("media")} onPressOut={() => setSelected("")} onPress={() => openMedia()}
                                        >
                                            <AntDesign name="pluscircleo" size={24} color="white" style={{marginRight: "2%"}}/>
                                            <Text style={{color: "white", fontWeight: "700", fontSize: 19,}}>upload media</Text>
                                        </Pressable>

                                        <TextInput style={{width: "100%", height: "50%", paddingHorizontal: "5%", marginVertical: "1.5%", fontSize: 19, color: "white",}} placeholder="content" placeholderTextColor={"gray"} 
                                        multiline
                                        onChangeText={(text) => setNewColabText(text)} value={newColabText}
                                        />

                                </View>

                            </View>
                :
                <View style={{width: "100%", height: "100%"}}>
                    <View style={{width: "100%", }}>
                       
                       
                         <Pressable style={[{alignSelf: "flex-end", marginRight: "5%"}, selected=="newPost" && {opacity: .4}]}
                         onPressIn={() => press("newPost")} onPressOut={() => setSelected("")} onPress={() => newColab()}
                         >
                                <Entypo name="new-message" size={window.width * .07} color="white" 
                            />
                        </Pressable>
                        
                    </View>

                    <View style={{flex: 1,  justifyContent: "flex-end"}}>
                           
                    </View>
                </View>
            }
                    
            </View>

            :
            current=="find" ? //findScreen
            <View
            style={{width: "100%", height: "100%", alignSelf: "flex-end",}}>
                    
                    <Pressable onPress={() => startSearch()} style={[{height: "7%"}, selected=="search" && {opacity:.7}]} onPressIn={() => press("search")} onPressOut={() => setSelected("")} >
                        <Animated.View style={[styles.searchBar, searchOpen && {borderWidth: 1, borderColor: "rgba(255,255,255,0.4)", borderRadius: 360, paddingHorizontal: "3%", width: searchWidth}]}>
                                
                                <View style={styles.search}>
                                    <FontAwsome5 name="search" color={"white"} size={30} style={styles.searchIcon}/>
                                </View>

                                <TextInput ref={searchRef} onEndEditing={() => stopSearch()}
                                style={[styles.searchInput, (searchInput || search.replaceAll(' ', '').length > 0) && {display: "flex"}]}
                                    autoCorrect={false} onFocus={() => startSearch()}
                                    value={search} onChangeText={(text) => searching(text)}
                                />
                                
                                
                        </Animated.View> 
                    </Pressable>

                    <View style={styles.findIsland}>
                    
                    {sResult.length <= 0 && requests.length > 0 &&
                        <View style={{width: "100%", height: "35%"}}>
                            <FlatList
                            data={requests}
                            keyExtractor={(item) => item.id}
                            style={[styles.searchList, {paddingTop: "10%", paddingBottom: "10%"}]}
                            renderItem={searchUsers}
                        />

                            <Text style={styles.title}>Requests</Text>
                        </View>
                    }

                    {sResult.length > 0 ?
                        <FlatList
                            data={sResult}
                            keyExtractor={(item) => item.id}
                            style={[styles.searchList, {}]} 
                            renderItem={searchUsers}
                        />
                        : matches.length <= 0 &&
                        <View style={styles.searchList}>
                            <Image source={require("../assets/network.gif")} resizeMode={"contain"}
                            style={{width: "70%", height: "50%", }}
                            />          
                        </View>
                    } 

                    {search.replace(' ', '').length <= 0 && matches.length > 0&&
                    
                    
                            <View style={[{width: "100%", height: "100%", overflowY: "hidden",}, requests.length > 0 && {height: "65%"}]}>
                                    
                        <FlatList
                            data={matches}
                            keyExtractor={(item) => item.id}
                            style={[styles.searchList, {}]}
                            renderItem={searchUsers}
                        />

                                    <Text style={styles.title}>Matches</Text>

                            
                                </View>
                            
                    }
                    
                    </View>

            </View>
            : current=="map" ?
            
            <View style={{width: "100%", height: mapHeight , position: "absolute", top: 0, left: 0,}}>
                    <MapView style={{height: "100%", width: "100%", }}   
                    maxZoomLevel={4}
                    initialRegion={{
                        latitude: profile.cord != null ? profile.cord.latitude : 0,
                        longitude:  profile.cord != null ? profile.cord.longitude : 0,
                     
                      }}
                    >
        
        
        {networkLines.map((item) => line(item))} 
        {networkLines.map((item) => lineShadow(item))} 
        {networks.map((item) => marker(item))} 
    
 
      
     
                    </MapView> 
            </View>
 
            : current=="settings" ? //settingsScreen
  
            <View style={{width: "100%", height: "100%"}}>
                <View style={{width: "100%", height: "100%", flexDirection: "row", flexWrap: "wrap"}}>
                    
                    <Pressable 
                    style={[styles.sIsland, {borderTopRightRadius: 0, borderBottomRightRadius: 0}]}>
                        <Image source={{uri: sImage == null ? server + `media/` + profile.image : sImage.uri}}
                        style={{width: window.width * .47, height: window.width * .47, 
                        borderRadius: 360,}}
                        />

                    <Entypo name="camera" size={90} color="black" 
                    style={{position: "absolute",}}/>

                    </Pressable>

                    <View style={[styles.sIsland, {width: "2%", marginHorizontal: "0%",
                borderTopLeftRadius: 0, borderBottomLeftRadius: 0,}]}>
                        

                    </View>

                    <Animated.View style={[styles.sIsland, {width: window.width * .42,
                    marginHorizontal: "3%"}, selected=="sInfo" && {transform: [{scale: .99},
                    ]}]}>
                        <Pressable style={{width: "100%", height: "100%", justifyContent: "space-around", alignItems: "center"}} onPress={() => setSInfo(true)}
                        onPressIn={() => press("sInfo")} onPressOut={() => setSelected("")} 
                        >

                        <Ionicon name="information" size={window.width * .42} color={(sFirst!= profile.first || sLast != profile.last || sBio != profile.bio || sUser != user) ? selectedBlue :"white"} />
                        </Pressable>

                    </Animated.View> 

                    <Pressable style={[styles.sIsland, {width: "65%", height: "20%", marginTop: "2%", justifyContent: "flex-start", paddingTop: "2%", }
                    ,selected=="hobbies" && {transform: [{scale: .99}]}]} onPressIn={() => press("hobbies")} onPressOut={() => setSelected("")} onPress={() => setSHobbies(true)}
                    >
                            <Text style={[{color: "white", fontSize: 28, fontWeight: "bold"}, !arraysAreEqual(hobbies, profile.hobbies) && {color: selectedBlue}]}>Hobbies</Text>
                    </Pressable>

                    <Pressable 
                    style={[styles.sIsland, {width: "29%", height: "20%", marginTop: "2%", }
                    ]} disabled={!canSaveSettings()} onPressIn={() => press("save")} onPressOut={() => setSelected("")} onPress={() => saveSettings()}
                    >
                                <Ionicon name="save" size={window.width * .25} color="#a7cffa" 
                                style={[!canSaveSettings() && {opacity: .2}, selected=="save" && {transform: [{scale: .99}]}]} 
                                />
                    </Pressable>

                    <Pressable style={[styles.sIsland, {width: "96%", height: "41%", marginTop: "2%", justifyContent: "flex-start", flexDirection: "row", flexWrap: "wrap", }]}>
                           
                            <Pressable style={[styles.action, selected=="about" && {opacity: .6, }]} onPressIn={() => press("about")} onPressOut={() => setSelected("")} onPress={() => setWeb("frequently_asked_questions")}>
                                <MaterialCommunityIcon name="frequently-asked-questions" size={75} color="white" />
                            </Pressable> 

                            <Pressable style={[styles.action, selected=="terms" && {opacity: .6, }]} onPressIn={() => press("terms")} onPressOut={() => setSelected("")} onPress={() => setWeb("terms_and_conditions")}>
                                <AntDesign name="filetext1" size={75} color="white" />
                            </Pressable> 
 
                            <Pressable style={[styles.action, selected=="privacy" && {opacity: .6, }]} onPressIn={() => press("privacy")} onPressOut={() => setSelected("")} onPress={() => setWeb("privacy_policy")}>
                                <MaterialCommunityIcon name="shield-lock" size={75} color="white" />
                            </Pressable> 

                            <Pressable style={[styles.action, selected=="founder" && {opacity: .6, }]} onPressIn={() => press("founder")} onPressOut={() => setSelected("")}  onPress={() => setWeb("about_the_creator")}>
                                <MaterialCommunityIcon name="head-lightbulb" size={75} color="white" />
                            </Pressable> 
 
                            <Pressable style={[styles.action, selected=="licence" && {opacity: .6, }]} onPressIn={() => press("licence")} onPressOut={() => setSelected("")} onPress={() => setWeb("end_user_license_agreement")}>
                                <MaterialCommunityIcon name="license" size={75} color="white" />
                            </Pressable> 

                            <Pressable style={[styles.action, selected=="logout" && {opacity: .6, }]} onPressIn={() => press("logout")} onPressOut={() => setSelected("")} onPress={() => logout()} 
                            >
                                <MaterialIcon name="logout" size={75} color="#d9363c" /> 
                            </Pressable> 

                    </Pressable>
                 
                </View>
            </View>

            : current == "call" && //pastCallsScreen

            <View style={{width: "100%", height: "100%"}}>

                <View style={{width: "98%", height: "92%", backgroundColor: "rgb(22,22,22)", borderRadius: 20, alignSelf: "center", }}>

                            {pastCalls.length > 0 ?
                            <FlatList
                            data={pastCalls}
                            keyExtractor={(item) => item.id}
                            renderItem={pastCall}
                            key={(item) => item.id}
                            style={{width: "100%", height: "100%"}}
                            />
                            :
                            <Text style={{color: "white", opacity: .9, fontSize: 26, alignSelf: "center", marginTop: "20%"}}>You have no past calls</Text>
                            }

                </View>

            </View>
}
 

            <View style={[{height: "9%", width: "100%", backgroundColor: "#19191a", bottom: 0, alignItems: "center", position: "absolute",}]} {...panResponder.panHandlers}> 
                    <View style={styles.navBar}>
                             
                            <Pressable ref={mapRef} onPressIn={() => navPress("map")} onPressOut={() => setSelected("")} onPress={() => curr("map")}
                             style={[styles.navItem, {height: navSize, width: navSize}]}> 
                                        <FontAwsome name={"map" + ((current != "map" && selected!="map") || (pages.includes(selected) && selected !== "map") ? "-o" : "")} size={30}  
                                        style={[styles.navIcon, ((selected!="map") || (pages.includes(selected) && selected !== "map")) && {transform: [{scale: 1.1}]}]} 
                                        color="white"/> 
                            </Pressable>

                            <Pressable ref={findRef} onPressIn={() => navPress("find")} onPressOut={() => setSelected("")} onPress={() => curr("find")}
                             style={[styles.navItem, {height: navSize, width: navSize}]}> 
                                        <MaterialCommunityIcon name={"account-search" + ((current != "find" && selected != "find")|| (pages.includes(selected) && selected !== "find")  ? "-outline" : "")} size={35}  
                                        style={[styles.navIcon, ((selected!="find") || (pages.includes(selected) && selected !== "find")) && {transform: [{scale: 1.1}]}]} 
                                        color="white"/> 
                            </Pressable>

                             <Pressable ref={homeRef} onPressIn={() => navPress("home")} onPressOut={() => setSelected("")} onPress={() => curr("home")}
                             style={[styles.navItem, {height: navSize, width: navSize}]}> 
                                        <MaterialCommunityIcon name={"account-group" + ((current != "home" && selected!="home")|| (pages.includes(selected) && selected !== "home") ? "-outline" : "")} size={35}  
                                        style={[styles.navIcon, ((selected!="home") || (pages.includes(selected) && selected !== "home")) && {transform: [{scale: 1.1}]}]} 
                                        color="white"/> 
                            </Pressable>

                            <Pressable ref={feedRef} onPressIn={() => navPress("feed")} onPressOut={() => setSelected("")} onPress={() => curr("feed")}
                             style={[styles.navItem, {height: navSize, width: navSize}]}> 
                                        <MaterialIcon name={"lightbulb" + ((current != "feed" && selected!="feed")|| (pages.includes(selected) && selected !== "feed") ? "-outline" : "")} size={35}  
                                        style={[styles.navIcon, ((selected != "feed") || (pages.includes(selected) && selected !== "feed")) && {transform: [{scale: 1.1}]}]} 
                                        color="white"/> 
                            </Pressable> 

                           

                            <Pressable ref={profileRef} onPressIn={() => navPress("profile")} onPressOut={() => setSelected("")} onPress={() => curr("profile")}
                             style={[styles.navItem, {height: navSize, width: navSize}]}> 
                                        <Ionicon name={"person" + ((current != "profile" && selected != "profile") || (pages.includes(selected) && selected !== "profile") ? "-outline" : "")} size={30}  
                                        style={[styles.navIcon, ((selected!="profile") || (pages.includes(selected) && selected !== "profile")) && {transform: [{scale: 1.1}]}]} 
                                        color="white" 
                                        /> 
                            </Pressable>


                    </View>
            </View>


        <Modal
       transparent={true}
        visible={web != null}
        animationType="fade"
        originWhitelist={['*']}
        >
            
            <View style={{width: "100%", height: "100%", backgroundColor: "black"}}>


            <SafeAreaView>
                <View style={{backgroundColor: "rgba(0,0,0,1)", width: "100%", height: "100%"}} 
           >
            <Pressable style={{width: "10%", height: "5%",  opacity: .9,}} 
            onPress={() => setWeb(null)}>
                    <Entypo name="chevron-left" size={40} color="white" />
            </Pressable>
                <WebView
                originWhitelist={['*']}
                style={{width: "100%", height: "95%"}}
                source={{uri: server + `global/` + web}} 
                />

            </View>

            
            
            </SafeAreaView>

            </View>
             
             
        </Modal>


        <Modal
       transparent={true}
        visible={sInfo}
        animationType="fade"
        >
            
            <Pressable style={{width: "100%", height: "100%", backgroundColor: "rgba(0,0,0,0.5)"}} onPress={() => setSInfo(false)}>


            <SafeAreaView style={{justifyContent: "center", alignItems: "center",}}>
            
            <Pressable style={{backgroundColor: "rgba(22,22,22,1)", width: "95%", height: "80%", borderRadius: 20}} 
          onPress={() => Keyboard.dismiss()} >
                <TextInput value={sUser}
                onFocus={() => setSelected("sUser")}
                onEndEditing={() => setSelected("")}
                onChangeText={(text) => setSUser(text)}
                style={[{width: "80%", borderWidth: 1, borderColor: "rgba(255,255,255,0.5)",
            color: 'white', paddingHorizontal: "2%", paddingVertical: "2.5%", marginTop: "10%", fontSize: 18,
        borderTopRightRadius: 20, borderBottomRightRadius: 20, borderLeftWidth: 0},
    selected=="sUser" && {borderColor: selectedBlue, borderWidth: 2}]}  
                /> 

<View style={{flexDirection: "row", marginTop: '2%'}}>
    <TextInput value={sFirst}
                onFocus={() => setSelected("sFirst")}
                onEndEditing={() => setSelected("")}
                onChangeText={(text) => setSFirst(text)}
                style={[{width: "50%", borderWidth: 1, borderColor: "rgba(255,255,255,0.5)",
            color: 'white', paddingHorizontal: "2%", paddingVertical: "2.5%", marginTop: "10%", fontSize: 18,
        borderTopRightRadius: 20, borderBottomRightRadius: 20, borderLeftWidth: 0},
    selected=="sFirst" && {borderColor: selectedBlue, borderWidth: 2}]}  
                /> 

<TextInput value={sLast}
                onFocus={() => setSelected("sLast")}
                onEndEditing={() => setSelected("")}
                onChangeText={(text) => setSLast(text)}
                style={[{width: "50%", borderWidth: 1, borderColor: "rgba(255,255,255,0.5)",
            color: 'white', paddingHorizontal: "2%", paddingVertical: "2.5%", marginTop: "10%", fontSize: 18,
        borderTopLeftRadius: 20, borderBottomLeftRadius: 20, borderRightWidth: 0},
    selected=="sLast" && {borderColor: selectedBlue, borderWidth: 2}]}  
                /> 
</View>


            </Pressable>

            
            
            </SafeAreaView>

            </Pressable>
             
             
        </Modal>


        <Modal
       transparent={true}
        visible={sHobbies}
        animationType="fade"
        >
            
            <Pressable style={{width: "100%", height: "100%", backgroundColor: "rgba(0,0,0,0.5)"}} onPress={() => setSHobbies(false)}>


            <SafeAreaView style={{justifyContent: "center", alignItems: "center",}}> 
            
            <Pressable style={{backgroundColor: "rgba(22,22,22,1)", width: "95%", height: "80%", borderRadius: 20}} 
          onPress={() => Keyboard.dismiss()} >   
                     
                <ScrollView style={{height: "100%", width: "100%"}}>
                           {music()}
                           {art()} 
                           {sport()}
                           {extreme()}
                           {culture()}  
                           {technology()}
                           {travel()}
                </ScrollView>

            </Pressable>

            
            
            </SafeAreaView>

            </Pressable>
             
             
        </Modal>



        <Modal
       transparent={true}
        visible={sSaved}
        animationType="fade"
        >
            
            <Pressable style={{width: "100%", height: "100%", backgroundColor: "rgba(0,0,0,0.1)"}} onPress={() => setSSaved(false)}>


            <SafeAreaView style={{justifyContent: "center", alignItems: "center",}}> 
            
            <Pressable style={{backgroundColor: "rgba(5,5,5,1)", width: "60%", paddingVertical: "2%", borderRadius: 20, alignItems: "center", justifyContent: "center"}} 
          onPress={() => Keyboard.dismiss()} >    
                     
                <Text style={{color: "rgba(255,255,255,.9)", fontSize: 18, fontWeight: "bold"}}>settings saved</Text>

            </Pressable>

            
            
            </SafeAreaView>

            </Pressable>
             
             
        </Modal>




        <Modal
       transparent={true}
        visible={friendsOpen}
        animationType="fade"
        >
            
            <Pressable style={{width: "100%", height: "100%", backgroundColor: "rgba(0,0,0,0.5)"}} onPress={() => setFriendsOpen(false)}>


            <SafeAreaView style={{justifyContent: "center", alignItems: "center",}}>
            
            <Pressable style={{backgroundColor: "rgba(22,22,22,1)", width: "95%", height: "90%", borderRadius: 20}} 
           >
                

                <FlatList
                            data={friendsList}
                            keyExtractor={(item) => item.id}
                            style={[styles.searchList, {paddingTop: "10%",}]}
                            renderItem={searchUsers}
                />


            </Pressable>

            
            
            </SafeAreaView>

            </Pressable>
             
             
        </Modal>


        <Modal
       transparent={true}
        visible={countriesOpen}
        animationType="fade" 
        >
            
            <Pressable style={{width: "100%", height: "100%", backgroundColor: "rgba(0,0,0,0.5)"}} onPress={() => setCountriesOpen(false)}>


            <SafeAreaView style={{justifyContent: "center", alignItems: "center",}}>
            
            <Pressable style={{backgroundColor: "rgba(22,22,22,1)", width: "95%",  borderRadius: 20, alignItems: "center", flexDirection: "row", justifyContent: "center", flexWrap: "wrap"}} 
           >
 
                {profile.countries.map((country) => { 

                    return(
                        <Text style={{fontSize: 51, marginHorizontal: "4%", marginVertical: "3%"}} key={country}>{FLAGS[country]}</Text>  
                    )
                })}


            </Pressable>

            
            
            </SafeAreaView>

            </Pressable>
             
             
        </Modal>




        <Modal
       transparent={true}
        visible={articleLink != null}
        animationType="slide"
        
        originWhitelist={['*']}
        >
            
            <View style={{width: "100%", height: "100%", backgroundColor: "black"}}>


            <SafeAreaView>
                <View style={{backgroundColor: "rgba(0,0,0,1)", width: "100%", height: "100%"}} 
           >
            <Pressable style={{width: "10%", height: "5%",  opacity: .9,}} 
            onPress={() => setArticleLink(null)}>
                    <Entypo name="chevron-left" size={40} color="white" />
            </Pressable>
                <WebView
                originWhitelist={['*']}
                style={{width: "100%", height: "95%"}}
                source={{uri: articleLink}} 
                />

            </View>

            
            
            </SafeAreaView>

            </View>
             
             
        </Modal>

        <Modal
       transparent={true}
        visible={mediaPicker}
        animationType="slide"
        >
            
            <View style={{width: "100%", height: "100%", backgroundColor: "rgb(22,22,22)"}}>


                <FlatList
                data={media}
                renderItem={({item}) => {      
                    const image = item

                    const getDuration = (seconds) => {
                        if(seconds < 60){
                            return Math.floor(seconds) + "s"
                        } else if(seconds < (60 * 60)){
                            return Math.floor(seconds/60) + "m"
                        } else if(seconds < (60*60*60)) {
                            return Math.floor(seconds/(60*60)) + "h"
                        } else if(seconds < (60*60*60*24)) {
                            return Math.floor(seconds/(60*60*60)) + "d"
                        }
                    }

                    const selectMedia = () => {
                        setSelectedMedia(image)
                        growMedia()

                    }

                    return(
                        <Pressable onPressIn={() => setSelected(image.uri)} onPressOut={() => setSelected("")} 
                        style={[ selected==image.uri && {opacity: .4}, {justifyContent: "center", zIndex: 2},
                            selectedMedia == image && {}]} 
                    onPress={() => selectMedia(image)} disabled={selectedMedia != null} 
                        >
                            <Animated.Image  style={[{width: window.width * .48, height: window.width * .48, backgroundColor: "black", margin: window.width * .01, },
                                selectedMedia == image && {}
                                ]} resizeMode={"cover"}
                            source={{uri: image.uri}} 
                            /> 
 
                            {image.mediaType == "video" &&

                                <LinearGradient 
                                colors={["rgba(0,0,0,0)", "rgba(0,0,0,0)", "rgba(0,0,0,.08)", "rgba(0,0,0,.25)"]}
                                style={{position: "absolute", width: window.width *.48, height: window.width * .48, alignItems: "flex-end", justifyContent: "flex-end", flexDirection: "row", paddingBottom: "3%", paddingRight: "3%"}}>
                                    <AntDesign name="playcircleo" size={17} color="white" style={{marginRight: "1.5%"}}
                                    />
                                    <Text style={{color: "white", fontSize: 17,}}>{getDuration(image.duration)}</Text>
                                </LinearGradient>
                                
                            }
                        </Pressable>
                        
                    )
                }}
                keyExtractor={(item) => item.id}
                key={(item) => item.id}
                numColumns={2} 
                contentContainerStyle={{width: "100%", display: "flex", flexDirection: "row", flexWrap: "wrap", paddingTop: "23%", width: "100%"}}
                style={{flex: 1}}
                />

                <LinearGradient 
                    colors={['rgba(0,0,0,0.0)', 'rgba(0,0,0,.0)', 'rgba(0,0,0,.0)',]}                
                    style={{height: "10%", display: "flex", justifyContent: "center", position: "absolute", width: "100%"}}> 
                    <SafeAreaView>

                        <Pressable style={{paddingHorizontal: "3%"}}
                        onPressIn={() => setSelected("cancel")} onPressOut={() => setSelected("")} onPress={() => exitMedia()}
                        >
                            <Text style={[{fontSize: 18, color: "white"}, selected=="cancel" && {opacity: .4}]}>cancel</Text>
                        </Pressable>

                    </SafeAreaView>
                    
                    
                </LinearGradient>
            
            </View>
             
        </Modal>

        <Modal
       transparent={true}
        visible={selectedMedia != null}
        animationType="fade"
        >
            <View style={{width: "100%", height: "100%", backgroundColor: "rgb(22,22,22)"}}>
            
            </View>

        </Modal>

        </SafeAreaView> 
    )
} else {
    return(
    <View style={{flex:1, backgroundColor: "black"}}>
        <Image source={require("../assets/splash.png")} style={{width: "100%", height: "100%"}}
        resizeMode="cover"
        />

    </View>
    )
} 
}

const styles = StyleSheet.create({
    island: {
        width: "100%",
        backgroundColor: "#252626",
        borderRadius: 10,
    },
    profimage: {
        width: 210,
        height: 210,
        borderRadius: 3600,
    },
    infoV: {
        flexDirection: "column",
        width: 180,
        alignItems: "center",
    },
    infoT: {
        color: "white",
        textAlign: "center",
        fontSize: 18,
        fontWeight: "normal", 
        opacity: 1,
        
    },

    navBar: {
        width: "90%",
        paddingVertical: ".1%",
        paddingHorizontal: "1%",
        borderRadius: 20,
        backgroundColor: "#121212",
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center",
        marginTop: "2%",
        
    },

    navItem: {
        borderRadius: 360,
        justifyContent: "center",
        alignItems: "center",
    },

    homeView: {
        width: "100%",
        height: "100%",
        flexDirection: "column",
       
       
    },

    homeIsland: {
        width: "48%",
        height: "30%",
        marginHorizontal: "1%",
        backgroundColor: "rgba(22, 22, 22, 1)",
        borderRadius: 10,
        padding: "1%",
        alignItems:"center",
        justifyContent: "center"
    },

    homeIcon: {
        opacity: .4,
        height: "50%",
        justifyContent: "center"
        
    },

    homeText: {
        color: "white",
        opacity: .5,
        fontSize: 23,
        textAlign: "center",
    },

    network: {
        width: "98%",
        height: "15%",
        marginHorizontal: "1%",
        marginVertical: "2%", 
        backgroundColor: "rgba(22, 22, 22, 1)",
        borderRadius: 10,
        padding: "1%",
        flexDirection: "row"
    },

    news: {
        width: "98%",
        height: "47%",
        marginHorizontal: "1%",
        backgroundColor: "rgba(22, 22, 22, 1)",
        borderRadius: 10,
        padding: "1%",
        flexDirection: "row"
    },

    searchBar: {
        alignItems: "center",
        marginHorizontal: "1%",
        flexDirection: "row",
    },

    search: {
        height: "100%",
        width: "10%",
        justifyContent: "center",
        alignItems: "center",
    },

    searchInput: {
        width: "90%",
        height: "100%",
        color: "white",
        fontSize: 18,
        display: "none",
        paddingHorizontal: "1%"
    },

    findIsland: {
        width: "98%",
        marginHorizontal: "1%",
        height: "82%",
        backgroundColor: "rgba(22, 22, 22, 1)",
        marginBottom: "1%", 
        borderRadius: 10,
    },

    title: {
        color: "white",
        fontSize: 21,
        opacity: .6,
        fontWeight: "900",
        marginLeft: "3%",
        marginTop: "3%",
        position: "absolute",
    },

    searchList: {
        height: "100%",
        width: "100%",
        paddingTop: "4.5%"
    },

    text: {
        color: "white",
        opacity: .8,
        marginTop: "5%",
    },

    sIsland: {
        width: "48%",
        height: "31%",
        marginHorizontal: "1%",
        backgroundColor: "rgba(22, 22, 22, 1)",
        borderRadius: 10,
        padding: "1%",
        alignItems:"center",
        justifyContent: "center"
    },

    infoSettingT: {
        color: "white",
        fontSize: 18,
        opacity: .7,
        width: "100%",
        paddingVertical: "1%",
        paddingHorizontal: "1%",
        height: "50%",
        borderColor: "rgba(255,255,255,0.7)",
        borderRadius: 10
    },

    infoSettingV: {
        width: "90%",
        height: "33%",
        justifyContent: "center",
    },

    action: {
        width: "33.33%", 
        height: "48%",
        justifyContent: "center",
        alignItems: "center"
    },
    modalBack: {
        backgroundColor: "rgba(0,0,0,0.2)",
        flex: 1
    },
    icon: { 
        borderWidth: 2,
        borderStyle: 'solid', 
        borderColor: "#2d2d2e",  
        backgroundColor: 'black',  
        borderRadius: 20, 
        borderRadius: 360, 
        padding: "2%", 
        alignItems: "center",
        marginHorizontal: 0,
        marginBottom: "10%",
        height: 43,
        width: 43,
        justifyContent: "center",
        
       },  
     hobbie: {
       width: "32%",
     },
     gray: {
       color: "#2d2d2e"
     },
     orange: {color: "#994e11"},
     purple: {color: "#8212e3"},
     black: {color: "black"},
     white: {color: "white"},
     silver: {color: "#c5c5c7"},
     gold: {color: "#8f651e"},
     brown: {color: "#ba7147"},
     yellow: {color: "#8a7e6b"},
     blue: {color: "#98d2d4"},
     green: {color: "#5c6e47"},
     salmon: {color: "#FA8072"},
  
     start: {
        alignSelf: "center"
     },
     end: {
        alignSelf: "center"
     },
     info: {
        width: "196%", 
        backgroundColor: "#343436", 
        height: "66%", 
        position: "absolute", 
        top: "-75%",
        alignItems: "center", 
        justifyContent: "center", 
        borderRadius: 10,
     },
     hobInfo: {
      color: "white",
      opacity: 0.7,
      fontSize: 17
     },
     error: {
      borderColor: "#ba2416",
      borderWidth: 3,
     },
  
     hobIcon: {
      transform: [
        {
          scale: 0.09,
        }
      ]
     },
  
     hobbiesView: {
      flexDirection: "row",
      flexWrap: "wrap",
      marginTop: "3%",
      width: "98%",
      
     },
     hobby: {
      flexDirection: "row",
      width: "42%",
      justifyContent: "flex-end",
      
      
     },
     hobText: {
      fontSize: 16,
      color: "white",
      opacity: 0.7,
      marginTop: "5%",
      marginRight: "1%",
     },
     catagoryText: {
      color: "white",
      opacity: .6,
      fontSize: 24,
      fontWeight: "bold",
      marginLeft: "3%"
     },
     catagory: {
      marginBottom: "2%"
     },

    
})