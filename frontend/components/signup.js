import { TextInput, View, Text, Pressable, Animated, StyleSheet, Dimensions, Keyboard } from "react-native"
import React from "react";
import storage from "../storage";
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Video} from 'expo-av';
import { SafeAreaView } from "react-native";

export default Signup = ({navigation, route}) => {
    const [user, setUser] = React.useState("")
    const [password, setPassword] = React.useState("")
    const [selected, setSelected] = React.useState("")
    const [confPass, setConfPass] = React.useState("")
    const server = storage.server
    const [wrong, setWrong] = React.useState(false)
    const videoRef = React.useRef(null)
    const linesWidth = React.useRef(new Animated.Value(0)).current;
    const screenWidth = Dimensions.get('window').width;
    const loginOpacity = React.useRef(new Animated.Value(0)).current;
    const next = React.useRef(new Animated.Value(1)).current;

    const storeData = async (user, token) => { 
        try {
          await AsyncStorage.setItem('user', user);
          await AsyncStorage.setItem('token', token);
        } catch (e) {
          // saving error
        }
      };

    const signup = () => {
       Keyboard.dismiss()
        if(user.length > 0 && password.length > 0 && confPass==password){ 
            fetch(server + `home/signup/`, {
                method: "POST", 
                headers: {
                    "content-type": "application/json",
                },
                body: JSON.stringify({"user":user, "password":password,})
            })
            .then(res => res.json())
            .then(res => {
                if(res.valid){

                        storeData(user, res.token)
                        growImage()
                        setTimeout(() => {
                            navigation.navigate("ProfileSet", {"user":user,"token":res.token})
   
                        }, 2000);
                } else {
                    setWrong(true)
                }
            })
        }
    }

    const openLines = () => {
        Animated.timing(linesWidth, {
            toValue: screenWidth * .5,
            duration: 1500,
            useNativeDriver:false,
        }).start()
    }

    React.useEffect(() => {
        openLines()
    },[]) 

    const apearText = () => {
        Animated.timing(loginOpacity, {
            toValue: 1,
            duration: 500,
            useNativeDriver:true
        }).start()
    }

    const disapearText = () => {
        Animated.timing(loginOpacity, {
            toValue: 0,
            duration: 500,
            useNativeDriver:true
        }).start()
    }

    const editText = () => {
        if(wrong){
            setWrong(false)
        }
        if(password.length > 0 && user.length > 0 && confPass.length > 0){
            apearText()
        } else {
            disapearText()
        }
    }

    const growImage = () => {
        Animated.timing(next, {
            toValue: 6,
            duration: 1500,
            useNativeDriver:true
        }).start()
    }

    React.useEffect(() => {
        videoRef.current.playAsync()
    }, [])

    
    return ( 
      <SafeAreaView style={{backgroundColor: "black", flex: 1, justifyContent: "center", alignItems: "center"}}>

            <View style={{height: "40%", width: "100%", display: "flex", flexDirection: "column", }}>
                       
                <Pressable onPressIn={() => setSelected("signup")} onPressOut={() => setSelected("")} onPress={() => signup()} >

                    <View style={{marginTop: "4%", justifyContent: "center", width: "50%", height: "auto", alignSelf: "flex-start"}}> 
                    
                        <Animated.View style={[styles.equal, {width: linesWidth , marginTop: 0}, wrong && {backgroundColor: "red"}]}></Animated.View>                 

                        <Animated.Text style={[{position: "absolute", color: "#286ab5", fontSize: 20, alignSelf: "center", fontWeight: "bold"}, 
                                     {opacity: loginOpacity}, selected=="signup" && {opacity: .4}]}>
                                        signup
                        </Animated.Text>
                        
                        <Animated.View style={[styles.equal, {width: linesWidth }, wrong && {backgroundColor: "red"}]}></Animated.View>  
                       
                    </View> 
                    </Pressable>


                    <Animated.View style={[styles.inputView, {marginTop: "10%"}]}
                    >
                       <TextInput style={styles.input} placeholder="username" placeholderTextColor={"gray"}
                       onChangeText={(text) => {setUser(text), editText()}} value={user}
                       /> 
                    </Animated.View>

                    <Animated.View style={[styles.inputView, ]}>
                       <TextInput style={styles.input} placeholder="password" placeholderTextColor={"gray"} autoCapitalize={"none"} secureTextEntry={true}
                       onChangeText={(text) => {setPassword(text), editText()}} value={password}
                       /> 
                    </Animated.View>

                    <Animated.View style={[styles.inputView, ]}>
                       <TextInput style={styles.input} placeholder="confirm password" placeholderTextColor={"gray"} autoCapitalize={"none"} secureTextEntry={true}
                       onChangeText={(text) => {setConfPass(text), editText()}} value={confPass}
                       /> 
                    </Animated.View>
                    
            </View>

            <Animated.View style={[{height: "55%", width: "100%", justifyContent: "center"}, {transform: [{scale: next}]}]}>
                <Video
            ref={videoRef}
            source={require("../assets/networld.mov")}
            style={{height: "100%", width: "100%",  }}
            />

           

            </Animated.View>
             

            <Pressable style={[{position: "absolute", bottom: "3%",},]} onPress={() => navigation.navigate("Login")}>
               <Text style={{fontSize:18, color: "lightblue"}}>Already have an acount? Login now</Text> 
            </Pressable>

      </SafeAreaView> 
    );
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },

    input: {
        width: "100%",
        height: "100%",
        flex: 1,
        paddingHorizontal: "3%",
        fontSize: 18,
        color: "white",
        justifyContent: "center",
    },

    equal: {
        height: 5,
        backgroundColor: "#22a3d6",
        borderTopRightRadius: 10,
        borderBottomRightRadius: 10,
        marginTop: "15%",
    },

    inputView:{
        width: "90%",
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.7)",
        height: 45,
        alignSelf: "center",
        marginTop: "5%",
        borderRadius: 30,
    }

  });