import { Pressable, ScrollView, StyleSheet, Text, View, Image, ImageBackground, Dimensions, Modal, Animated, Easing, PanResponder, FlatList, findNodeHandle, TextInput, Keyboard } from 'react-native';
import * as React from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Flag from 'react-native-flags'; 
import storage from '../storage';
import Hobbies from './hobbies';
import Entypo from '@expo/vector-icons/Entypo';
import Ionicons from '@expo/vector-icons/Ionicons';
import AntDesign from '@expo/vector-icons/AntDesign';
import { MaterialIcons, Feather } from '@expo/vector-icons'; 
import jobs from './jobs';
import { SafeAreaView } from "react-native";
import * as Haptics from 'expo-haptics';



export default function Profile({navigation, route}) {
    const server = storage.server
    const [profile, setProfile] = React.useState({"age": 0, "bio": "", "city": "", "dob": 0, "first": "", "friend": [], "hobbies": [], "id": 0, "image": "", "isoL": "", "isoO": "", "last": "", "lives": "", "num_friends": 0, "orgin": "", "setup": true})
    const token = route.params.token
    const user = route.params.user
    const of = route.params.of
    const oImage = route.params.oImage
    const userProfile = route.params.userProfile
    const [profImage, setProfImage ] = React.useState(null) 
    const [selected, setSelected] = React.useState("")
    const ser = server + `media/`
    const { height } = Dimensions.get('window');
    const [unfriended, setUnfriended] = React.useState(false)
    const [requested, setRequested] = React.useState(false)
    const [requests, setRequests] = React.useState(false)
    const [up, setUp] = React.useState("")
    const [reported, setReported] = React.useState(false)
    const [reportOpen, setReportOpen] = React.useState(false)
    const [loaded, setLoaded] = React.useState(false) 
    const window = Dimensions.get("window")
    const [countriesOpen, setCountriesOpen] = React.useState(false)
  

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

    const storeData = async (value, where) => {
        try {
          await AsyncStorage.setItem(where, value)
        } catch (e) {
          // saving error
          console.log(e)
        }
      }

    const showFriends = () => {
        haptic()
        setFriendsOpen(true)
    }
    const getData = async (where) => {
    try {
      const value = await AsyncStorage.getItem(where)
      if(value !== null) {
        return value
      } else {
        return null
      }
    } catch(e) {
      // error reading value 
      console.log(e)
    }
    } 


    const getRequested = () => {
      fetch(server + `home/getRequested/`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({"user":user, "token":token})
      })
      .then(res => res.json())
      .then(res => {
        arr=[]
        for(let i=0; i < res.length; i++){
          arr.push(res[i].user)
        }
        setRequested(arr.includes(of))
      })
    }



    const goToChat = () => {
        other = ["", of, "", profile.image, 0, ""] 
        setSelected("") 
        navigation.navigate("Chat", {"user":user, "other":of, "token":token, "otherImage":profile.image})
      } 

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
                if(res != null){
                  setLoaded(true)
                } 
                setProfile(res) 
                setProfImage(res.image)
                setReported(res.reported)
                if(!res.friends.includes(user)){
                  getRequested()
                }

            })
    }

    React.useEffect(() => {
        console.log(user)
        getProfile(user, token, of)
        getRequests()

    }, [up])

    

    const goBack = () => {
        navigation.goBack()
    }

    const request = () => {
      if(requested){
        setRequested(false)
        fetch(server + `home/unrequest/`, {
          method: "POST",
          headers: {
              "content-type": "application/json",
          },
          body: JSON.stringify({"user":user, "other":of, "token":token})
      })
      } else {
        setRequested(true)
        fetch(server + `home/request/`, {
          method: "POST",
          headers: {
              "content-type": "application/json",
          },
          body: JSON.stringify({"user":user, "other":of, "token":token})
      })
      }
    }

    const unfriend = () => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy) 
      if(unfriended){
        request()
      } else {
        setUnfriended(true)
        fetch(server + `home/unfriend/`,{
          method: "POST",
          headers: {
            'content-type': 'application/json',
          },
          body: JSON.stringify({"user":user, "person":of, "token":token})
        })
      }
    }

    const getRequests = () => {
      fetch(server + `home/getRequests/`, {
          method: "POST",
          headers: {
              "content-type": "application/json"
          }, 
          body: JSON.stringify({"user":user, "token":token})
      }) 
      .then(res => res.json())
      .then(res => {  
        arr=[] 
        for(let i=0; i < res.length; i++){ 
          arr.push(res[i].user) 
        }
        setRequests(arr.includes(of))
         
      })
  }

  const deny = () => {
    Haptics.selectionAsync()
    fetch(server + `home/denyRe/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({'person': of, 'user': user, "token":token})
    })
    .then(res => res.json())
    .then(res => {
      setUp((up) => up+"a")
    })
  }

  const accept = () => {
    Haptics.selectionAsync()
    fetch(server + `home/acceptRe/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({'person': of, 'user': user, "token":token})
    })
    .then(res => res.json())
    .then(res => {
      setUp((up) => up+"a")
      
    })
  }
    const push = (what) => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy)
      setSelected(what)
    }


    const report = () => {
      if(reportOpen){
        
      } else {
        setReportOpen(true)
      }
    }
  
    const sendReport = (reason) => { 
      setSelected("")
      fetch(server + `home/report/`, {
        method: "POST",
        headers: {
          "content-type": 'application/json'
        }, 
        body: JSON.stringify({"user":user, "reported":of, "reason":reason, "token":token})
      })
      .then(res => res.json())
      .then(res => {
        setReportOpen(false)
        setReported(true)
      })
    }

    const unreport = () => {
      setSelected("")
      fetch(server + `home/unreport/`, {
        method: "POST",
        headers: {
          "content-type": 'application/json'
        }, 
        body: JSON.stringify({"user":user, "reported":of, "token":token})
      })
      .then(res => res.json()) 
      .then(res => {
        setReportOpen(false)
        setReported(false) 
      }) 
    }
    
    if(loaded){
    return(
      <View 
      style={[styles.container, reported && {borderWidth: 2, borderColor: "red"}]}
      
    >
      <View style={{width: "100%", height: "9%", justifyContent: "flex-end", marginBottom: "1%", }} >
          <Pressable onPressIn={() => setSelected("back")} onPressOut={() => setSelected("")} onPress={() => navigation.goBack()} >
                <Entypo name="chevron-left" color="white" size={40} style={[{marginLeft: ".5%"}, selected=="back" && {opacity: .4}]}/>
          </Pressable>
      </View>

      <View
            style={{width: "100%", height: "100%", alignSelf: "flex-end",}}>
            
            <View style={{height: "10%", justifyContent: "center",}}>
                <View style={{height: "98%%", backgroundColor: "rgba(22, 22, 23, 1)", borderRadius: 20, paddingVertical: "3%", width: "98%", alignSelf: 'center', flexDirection: "row"}}>
                       
             <View style={{width: "100%",  height: "100%", justifyContent: "center", alignItems: "center", }}>
                            
                            <Text style={{fontSize: 25, color: "white",
                             opacity: .4, width: "96%", textAlign: "center",
                             fontFamily: 'AmericanTypewriter-bold', fontWeight: "bold", }} 
                            adjustsFontSizeToFit numberOfLines={2}
                            >{profile.schoolType == "university" ?
                            profile.school
                            :
                            profile.city + ", " + profile.country
                            }</Text>


                        </View>
                </View>
            </View>  
            <View style={{height: "57%",}}>
            
            <View style={{flexDirection:"row",  borderRadius: 20, width: "98%", alignSelf: 'center', justifyContent: "space-between", height: "100%"}}> 
                <View style={{flexDirection: "column", marginTop: 0, alignItems: "center", left: 0, marginRight: "0%", width: "60%", backgroundColor: "rgba(22, 22, 22, 1)",  borderRadius: 20, padding: "3%", height: "100%"}}>
                    <Image source={{uri: server + "media/" + profile.image}} style={styles.profimage}  defaultSource={require('../assets/emptyProfile.png')}/>
                    <View style={[styles.info, ]}> 
                        <Text style={styles.infoT}>{profile.name}</Text> 
                        <Text style={styles.infoT}>{of}</Text>

                        {profile.schoolType == "university" ?
                        <Text style={[styles.infoT, ]}>Focusing on {profile.field} at {profile.school}</Text>
                          : profile.schoolType == "secondary" &&
                          <Text style={[styles.infoT, ]}>Secondary school student at {profile.school}</Text>
                          }
                        </View>
                </View>  

                <View style={{width: "39%"}}>

                <View  
                style={[{alignItems: "center", width: "100%", 
                backgroundColor: "rgba(22, 22, 22, 1)",  borderRadius: 20, 
                padding: "3%", height: "20%", justifyContent: "space-around", paddingVertical: "8%"}]}>  
                    
                    <Pressable style={[ {opacity: .8}, selected=="showFriends" && {opacity: .4}]} 
                    >    
                        <Text style={[styles.infoT, {fontSize: 19}]}>{profile.num_friends} friends</Text>
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
                        
                        <Flag code={profile.iso} type="flat" style={{height: "100%", width: "100%", borderRadius: 20, opacity: .7, }} />

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
        
        <View style={{height: "23%", justifyContent: "center"}}>
                <View style={{height: "98%%", backgroundColor: "rgba(22, 22, 22, 1)", borderRadius: 20, paddingVertical: "3%", width: "58.8%", alignSelf: 'flex-start', marginLeft: "1%", flexDirection: "row", flexWrap: "wrap"}}>


                  {profile.friend && !unfriended &&
                  <Pressable onPress={() => goToChat()} onPressIn={() => press("chat")} onPressOut={() => setSelected("")}
                  style={[{width: "50%", alignItems: "center", opacity: .9, marginTop: "3%"}, selected=="chat" && {opacity: .8, transform: [{scale: .98}]}]}>

                      <Ionicons name="chatbubbles"  size={window.width * .50 * .29} color="white" />

                  </Pressable>
                  }

                  {requests &&
                  <Pressable onPressIn={() => press("accept")} onPressOut={() => setSelected("")} onPress={() => accept()}
                  style={[{width: "50%", alignItems: "center", opacity: .9, marginTop: "3%"}, selected=="accept" && {opacity: .8, transform: [{scale: .98}]}]}>

                    <AntDesign name="plus" size={window.width * .50 * .29} color="#36c96c" />

                    </Pressable>
                  }
                  {
                    requests ?
                    <Pressable onPressIn={() => press("deny")} onPressOut={() => setSelected("")} onPress={() => deny()}
                  style={[{width: "50%", alignItems: "center", opacity: .9, marginTop: "3%"}, selected=="deny" && {opacity: .8, transform: [{scale: .98}]}]}>

                    <AntDesign name="minus" size={window.width * .50 * .29} color="red" />

                    </Pressable>
                    :
                  (!profile.friend || unfriended )?
                  <Pressable onPressIn={() => press("friend")} onPressOut={() => setSelected("")} onPress={() => request()}
                  style={[{width: "50%", alignItems: "center", opacity: .9, marginTop: "3%"}, selected=="friend" && {opacity: .8, transform: [{scale: .98}]}]}>

                      <Ionicons name={"person-add" + (!requested ? "-outline" : "")} size={window.width * .50 * .30} color="white" />

                  </Pressable>
                  : !requests &&
                  <Pressable onPressIn={() => press("unfriend")} onPressOut={() => setSelected("")} onPress={() => unfriend()}
                  style={[{width: "50%", alignItems: "center", opacity: .9, marginTop: "3%"}, selected=="unfriend" && {opacity: .8, transform: [{scale: .98}]}]}>

                    <Ionicons name="person-remove-sharp" size={window.width * .50 * .29} color="white" />

                  </Pressable>
                
                  }


                  <Pressable onPressIn={() => press("report")} onPressOut={() => setSelected("")} onPress={() => reported ? unreport() : report()}
                  style={[{width: "50%", alignItems: "center", opacity: .9, marginTop: "3%"}, selected=="report" && {opacity: .8, transform: [{scale: .98}]}]}>

                          <MaterialIcons name="report" size={window.width * .50 * .30} color={ reported ? "red" : "rgba(100,100,100, 1)"} />
                  </Pressable>

                
                </View>
        </View> 
              
            </View>
           
              
      


      <Modal
        visible={reportOpen} 
        transparent={true}  
        animationType="fade" 
        onRequestClose={() => reportOpen(!reportOpen)}    
      >         
        <Pressable style={{ flex: 1, backgroundColor: 'rgba(0,0,0,.4)', 
        justifyContent: 'center', alignItems: 'center', paddingTop: "0%", height: "100%"}}
        onPressIn={() => setReportOpen(!reportOpen)}> 
           
          <Pressable style={{ backgroundColor: 'rgb(27,27,27)', borderRadius: 15, width: '97.5%', height:"40%", }}>
              <View style={{height: "40%", justifyContent: "center"}}>  
                    <Text style={{color: "white", fontSize: 21, fontWeight: "bold", textAlign: "center"}}>What do you want to report?</Text>
                    <Text style={{color: "white", opacity: .5, fontSize: 12}}>At globalPuzzle, we prioritize community guidelines and honesty. When a report is filed, we thoroughly investigate the issue. Please note that filing a fake report carries the same consequences as abusing the app's services.</Text>
              </View>

                <View style={{height: "60%", borderBottomLeftRadius: 15, borderBottomRightRadius: 10,}}>
                      <Pressable style={[styles.choice, selected=="bully" && {opacity: .4, backgroundColor: "#707173"}]} onPressIn={() => push("bully")} onPressOut={() => setSelected("")} onPress={() => sendReport("Cyberbullying and Harassment")}>
                            <Text style={{color: "white", fontSize: 19, alignSelf: "center"}}>Cyberbullying and Harassment</Text>
                      </Pressable>
                     
                      <Pressable style={[styles.choice, selected=="dec" && {opacity: .4, backgroundColor: "#707173"}]} onPressIn={() => push("dec")} onPressOut={() => setSelected("")} onPress={() => sendReport("Phishing or Deceptive Activities")}>
                            <Text style={{color: "white", fontSize: 19, alignSelf: "center"}}>Phishing or Deceptive Activities</Text>
                      </Pressable> 

                      <Pressable style={[styles.choice, selected=="fake" && {opacity: .4, backgroundColor: "#707173"}]} onPressIn={() => push("fake")} onPressOut={() => setSelected("")} onPress={() => sendReport("Impersonation or Fake Account")}>
                            <Text style={{color: "white", fontSize: 19, alignSelf: "center"}}>Impersonation or Fake Account</Text>
                      </Pressable>

                      <Pressable style={[styles.choice, selected=="viol" && {opacity: .4, backgroundColor: "#707173",}, {borderBottomLeftRadius: 15, borderBottomRightRadius: 15, borderBottomWidth:0}]} onPressIn={() => push("viol")} onPressOut={() => setSelected("")} onPress={() => sendReport("Violation of Community Guidelines")}>
                            <Text style={{color: "white", fontSize: 19, alignSelf: "center"}}>Violation of Community Guidelines</Text>
                      </Pressable>
                     
                </View>
          </Pressable> 
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
              
                {profile.countries != null &&
                profile.countries.map((country) => { 

                    return(
                        <Text style={{fontSize: 51, marginHorizontal: "4%", marginVertical: "3%"}} key={country}>{FLAGS[country]}</Text>  
                    )
                })}


            </Pressable>

            
            
            </SafeAreaView>

            </Pressable>
             
             
        </Modal>


        </View>

       
 
    )
    } else {
      return(
        <View style={{justifyContent: "center", alignItems: "center", flex: 1, width: "100%", height: "100%", backgroundColor: "black"}}>
          <Image style={{width: window.width *.75, height: window.width * .75, borderRadius: 360,}}
          source={{uri: server + "media/" + oImage}} defaultSource={require("../assets/emptyProfile.png")}
          />
          <Text style={{color: "white", fontSize: 30, fontWeight: "bold", marginTop: "5%"}}>{of}</Text>
        </View>
      )
    }
    

}

const styles = new StyleSheet.create({
  input: {
    borderColor:"white",
    borderWidth: 1,
    width: 350,
    height:50,
    fontSize: 23,
    color: "white",
    padding: 10,
    marginBottom: 45,
    borderRadius: 15,
    
},
container: {
    backgroundColor: "black",
    flex: 1,
    alignItems: 'center',
},
selected: {
    borderColor: "#6591eb",
    borderWidth: 3,
},
pressed : {
    backgroundColor: "#314569"
},
bottom: {
    position: "absolute",
    bottom: 35,
},
footer: {
    width: "100%",
    bottom: "2.5%",
    //backgroundColor: "black",
    borderColor: "gray",
    borderTopWidth: 0.05,
    position: "absolute",
    //borderRadius: 360,
    opacity: .07,

},
navigation: {
    borderRadius: 360,
    borderWidth: 0,
    borderColor: "white",
    padding: 8,
    opacity: 1,
    backgroundColor: "black"
    
},
profimage: {
  width: 210,
  height: 210,
  borderRadius: 3600,
},
info: {
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
move: {
  alignItems: "center",  
  justifyContent: "center",
  
  flexDirection: "row",
  
  
},
flag: {
  marginHorizontal: "1.2%",
  height: 64,
  width: 64,
  borderWidth: 0,
  borderRadius: 0, 
  borderColor: "rgba(0,0,0,0)"

},
plane: {
  color: "white",
  marginHorizontal: 0,
},

header: {
  borderWidth: .1,
  borderBottomColor: "gray",
  backgroundColor: "rgba(0,0,0,0.2)",
  flexDirection: "row",
  alignContent: "flex-start",
  alignItems: "flex-start",
  justifyContent: "flex-start",
  alignSelf: "flex-start",
  width: "100%",
  height: "100%",
},
settings: {
  borderWidth: 0.0,
  borderColor: "gray",
  borderRadius: 10,
  position: "absolute",
  right: "12%",
  alignItems: "center",
  opacity: .8,
  justifyContent: "center",
  height: "40%",
 
  //alignSelf: "center"
},
bg: {

  flex: 1,
  padding: 0,
  width: "100%"
},
title: {
  color: "white", 
  fontWeight: 400, 
  fontSize: 33, 
  marginBottom: "5%", 
  marginTop: "5%",
  opacity: .9,
  

},
reInfo:{
  color: "white",
  fontSize: 17,
  
},

moreView: {
borderWidth: 1,
borderRadius: 16,
width: "80%",
height: "10%",
alignItems: "center",
justifyContent: "center",
marginTop: "8%",
},

moreText: {
fontSize: 17,
color: "#9b9c9e",
},

settingIn: {
borderWidth: 1,
width: "90%",
borderRadius: 16, 
fontSize: 16,
color: "white",
paddingHorizontal: "3%"

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
marginBottom: "15%",
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

hobInfo: {
color: "white",
opacity: 0.7,
fontSize: 17
},

choice: {
  width: "100%", 
  height: "25%", 
  borderWidth: 1, 
  borderColor: "white",
  opacity: .5,
  borderLeftWidth: 0,
  borderRightWidth: 0,
  justifyContent: "center"
},

choiceText: {
  color: "white", 
  fontSize: 19, 
  alignSelf: "center",
},
    
})