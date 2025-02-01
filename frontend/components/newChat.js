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
import { flat } from "react-native-flags/flags";

export default NewChat = ({navigation, route}) => {
    const server = storage.server
    const user = route.params.user
    const profile = route.params.profile
    const token = route.params.token
    const friends = route.params.friends

    const window = Dimensions.get("window")  
    const imageD = window.width * .13

    const [added, setAdded] = React.useState([])
    const [selected, setSelected] = React.useState("")

    
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
        hapticMedium()
    }

    const addUser = (item) => {
        if(added.includes(item)){
            setAdded(current => current.filter(element => { return element !== item}))
        } else {
            setAdded([...added, item])
        }
    }

    const friend = ({item}) => {
        return (
            <Pressable style={[{width: "100%", paddingVertical: "1.5%", paddingHorizontal: "2%", display: "flex", flexDirection: "row", alignItems: "center"}, selected==item.user && {opacity: .4}]} onPressIn={() => press(item.user)} onPressOut={() => setSelected("")} onPress={() => addUser(item)}>
                    
                    <Image source={{uri: server + `media/` + item.image}} style={{width: imageD, height: imageD, borderRadius: 360}}  
                    defaultSource={require("../assets/emptyProfile.png")} 
                    />
                <Text style={{color: "white", fontSize: 17, marginLeft: "1%", width: "57%", marginRight: "10%"}} numberOfLines={1}>{item.name} ({item.user})</Text>

                <View style={{width: "20%", alignItems: "center"}}>
                        <View style={{height: window.width * .05, width: window.width * .05, borderWidth: 2, borderColor: "white", borderRadius: 360, padding: window.width * .01, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center"}}>
                                    
                                    {added.includes(item) && 
                                    <View style={{width: window.width * .03, height: window.width * .03, backgroundColor: "white", borderRadius: 360}}>

                                    </View>
                                    }
                        </View>
                </View>
            </Pressable>
        )
    }

    const back = () => {
        navigation.goBack()
        setAdded([])

    }

    const canCreate = () =>  {
        return added.length > 1 
    }

    const createGroup = () => {
        fetch(server + `home/createGroup/`, {
            method: "POST",
            headers: {
                "content-type": "application/json",
            },
            body: JSON.stringify({"user": user, "token": token, "added": added})
        })
        .then(res => res.json())
        .then(res => {
            if(res){
                navigation.goBack()
            }
        })
    }
 
    return (
        <View style={{flex: 1, backgroundColor: "black", width: "100%", height: "100%"}}>
            <SafeAreaView style={{flex: 1}}>
 
                <View style={{flex: 1, width: "100%", height: "100%"}}>
                    
                    <View style={{height: "5%", width: "100%", display: "flex", flexDirection: "row", justifyContent: "space-between"}}> 
                                    
                                <Pressable onPress={() => back()} onPressIn={() => press("back")} onPressOut={() => setSelected("")} 
                                style={{paddingLeft: "3%",}}> 
                                    <Text style={[{color: "white", fontSize: 16, }, selected=="back" && {opacity: .4}]}>cancel</Text>
                                </Pressable>

                                <Pressable  disabled={!canCreate()}
                                onPress={() => createGroup()} onPressIn={() => press("create")} onPressOut={() => setSelected("")} 
                                style={{paddingRight: "3%",}}>  
                                    <Text style={[{color: "white", fontSize: 16, }, selected=="create" && {opacity: .4}, !canCreate() && {opacity: .2}]}>create group</Text>
                                </Pressable>
                    </View>

                    <Text style={{color: "white", opacity: .7, fontSize: 24, marginHorizontal: "2%", marginTop: "5%", marginBottom: "5%",}}>Pick friends to add to group</Text>
                    <FlatList
                    data={friends}
                    renderItem={friend}
                    keyExtractor={(item) => item.id}
                    key={(item) => item.id}
                    style={{flex: 1,}}
                    />
                </View>
                    
            </SafeAreaView>
        </View>
    )
}