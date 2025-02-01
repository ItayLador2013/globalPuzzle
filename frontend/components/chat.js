import { StatusBar } from 'expo-status-bar'
import { StyleSheet, Text, View, FlatList, Image, Button, Pressable, ScrollView, DevSettings, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard, ImageBackground, TextInput, Clipboard, Modal} from 'react-native';
import React, {useState, useEffect, useRef, memo} from 'react'
import * as Haptics from 'expo-haptics';
import * as Notifications from "expo-notifications";
import storage from "../storage"
import * as ImagePicker from 'expo-image-picker';
import { Entypo, Ionicons, FontAwesome5, Fontisto, Octicons, AntDesign, MaterialIcons, SimpleLineIcons, Feather, MaterialCommunityIcons } from '@expo/vector-icons'; 
import { VideoExportPreset } from 'expo-image-picker';
import Reaction from './Reaction';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';



async function registerForPushNotificationsAsync() {
  let token;

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
  }
  if (finalStatus !== 'granted') {
      alert('Failed to get push token for push notification!'); 
      return;
  } 
  token = (await Notifications.getExpoPushTokenAsync()).data;

  return token;
}
registerForPushNotificationsAsync()
 
     
export default function Chat({navigation, route}) {
  const server = storage.server

  const other = route.params.other
  const user = route.params.user
  const token = route.params.token
  const reported = route.params.reported
  const socket = React.useRef(new WebSocket('ws://icy-coast-dc00c4d8fe5f4ea9b06f37acb0361a28.azurewebsites.net/ws/socket-server/')).current;
  const ser = server + `media/` 

 
  const [messages, setMessages] = React.useState([{datetime: new Date(), content: "", sender: "", num: "amfu", new:[]}])
  const [newMess, setNewMess] = React.useState([]) 
  const [keyOpen, setKeyOpen] = React.useState(false)
  const [text, setText] = React.useState("")
  const inputRef = React.useRef(null)
  const [dateOpen, setDateOpen] = React.useState([])
  const [dateTrack, setDateTrack ] = React.useState([])
  const [re, setRe] = React.useState(false)
  const listRef = React.useRef(null)
  const [isLongPressed, setIsLongPressed] = React.useState("")
  const [messString, setMessString] = React.useState("")
  const [selected, setSelected] = React.useState("")
  const [up, setUp] = React.useState("")
  const profile = route.params.profile
  const [images, setImages] = React.useState([])
  const [reportOpen, setReportOpen] = React.useState(false)
  const otherImage = route.params.otherImage 


  const encrypt = (string) => {
      let res = string.split('').reverse();
      let final = "";

      let mid = Math.floor(res.length / 2);
      let firstHalf = res.slice(0, mid);
      let secondHalf = res.slice(mid).reverse();

      for (let i = 0; i < firstHalf.length; i++) {
          if (i % 2 === 0) {
              if (firstHalf.length === secondHalf.length) {
                  let temp = firstHalf[i];
                  firstHalf[i] = secondHalf[i];
                  secondHalf[i] = temp;
              } else {
                  let temp = firstHalf[i];
                  firstHalf[i] = secondHalf[i + 1];
                  secondHalf[i + 1] = temp;
              }
          }
          final += secondHalf[i] + firstHalf[i];
      }

      secondHalf = secondHalf.reverse();
      final = sortString(final.toLowerCase());
      res = firstHalf.concat(secondHalf);
      final += "#__-#***#-__#" + res.join('');
      final = final.replace(/ /g, "*__#");
      return final;
  }

  function sortString(string) {
      let charArray = string.split('');
      charArray.sort();
      return charArray.join('');
  }

  const decrypt = (string) => {
    let str = string.split("#__-#***#-__#")[1].replace(/\*\__#/g, " ");
    let strArray = str.split('');
    let mid = Math.floor(strArray.length / 2);
    let firstHalf = strArray.slice(0, mid);
    let secondHalf = strArray.slice(mid).reverse();

    for (let i = 0; i < firstHalf.length; i++) {
        if (i % 2 === 0) {
            if (firstHalf.length === secondHalf.length) {
                let temp = firstHalf[i];
                firstHalf[i] = secondHalf[i];
                secondHalf[i] = temp;
            } else {
                let temp = firstHalf[i];
                firstHalf[i] = secondHalf[i + 1];
                secondHalf[i + 1] = temp;
            }
        }
    }

    secondHalf = secondHalf.reverse();
    let res = firstHalf.join('') + secondHalf.join('');
    return res.split('').reverse().join('');
  }

  const savePhoto = async (uri) => {
    try {
      const { status } = await MediaLibrary.requestPermissionsAsync();

      if (status === 'granted') {


        await MediaLibrary.saveToLibraryAsync(uri);
        console.log('Photo saved successfully!');
      } else { 
        console.log('Permission to access media library denied');
      }
    } catch (error) {
      console.log('Error saving photo:', error);
    }
  };
  
  const showImagePicker = async () => {
    
    // Ask the user for the permission to access the media library 
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("You've refused to allow this appp to access your photos!");
      return;
    }
    
    let result = await ImagePicker.launchImageLibraryAsync({
      //mediaTypes: ImagePicker.MediaTypeOptions.img,
      allowsEditing: true,
      aspect: [4,3], 
      aspectRadius: 300,
      quality: 1,
    });

    // Explore the result

    if (!result.canceled) { 
      await setImages([...images, result.assets[0]])
    } 
  }

  const openCamera = async () => {
    // Ask the user for the permission to access the camera 

    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("You've refused to allow this appp to access your camera!");
      return () => openCamera();
    }

    const result = await ImagePicker.launchCameraAsync();

    // Explore the result

    if (!result.cancelled) {
      await setImages([...images, result])
      .then(() => setKeyOpen(true))
    }
  }

  React.useEffect(()=> { 
     
     getM(other) 
    
    },[])

  React.useEffect(()=> { 
     

     
  },[up])

  socket.onmessage = (event) => {     
    // Handle incoming messages from the WebSocket server 
    let data = JSON.parse(event.data)
    if(data.message.type == "chat" && data.message.sender == other && data.message.receiver == user){
      if(data.message.text != null){
        addMessage(other, decrypt(data.message.text), 0, false, null)
      }
      getM(other)
    }
};   

    const getM = (other) => { 
      fetch(server + `home/getM/`, { 
        method:"POST", 
        headers: {
          "Content-Type": "application/json",
        }, 
        body: JSON.stringify({"user":user, "token":token, "other":other})
      })
      .then(res => res.json())
      .then(res => {
        if(res){ 
        dates = [] 
        nums = []
        for(let i = 0; i < res.length; i++){
          date = new Date(res[i].datetime)
          res[i].datetime = date
      

          cdate = date.toLocaleDateString('en-US', {
            month: '2-digit',
            day: '2-digit', 
            year: '2-digit',
          });

          if(!dates.includes(cdate)){
            dates.push(cdate)
            nums.push(res[i].num)
            
          }

        }  
        
        res.reverse()
        setMessages(res) 
        setDateOpen(nums) 
        setDateTrack(dates)
      } 
      })
  } 

  const openKey = () => {
    setKeyOpen(true)
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy)

    if(messages.length > 0){
      listRef.current?.scrollToIndex({ index: 0 });
    }
    
  }

  const addMessage = (sender, content, id, hasImage, image) => {
    let data = {}
  
    if(messages.length >= 0){
        data = {"sender": sender, "content": content, "num": messages.length, 
        "read":true, "datetime": new Date(), "id": id, "reactions": {"user": "", "other": "", "has":false}, "hasImage": hasImage,
        "image": hasImage ? image : null}
    } else {

    }

    setMessages([data, ...messages])
    setText("")
  }

  const socketSendChat = (other, text) => {
    if(text != null){
      socket.send(JSON.stringify({"message": {"sender": user, "receiver": other, "type": "chat", "text": encrypt(text)}}))
    } else {
      socket.send(JSON.stringify({"message": {"sender": user, "receiver": other, "type": "chat", "text": null}}))
    }
  }

  const send = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)


    if(messages.length > 0){
       listRef.current?.scrollToIndex({ index: 0 }); 
    }
    
    if( images.length > 0){

      const sendimage = async (image, con) => {

      
      const formData = new FormData()

      const imname = user + other + "anotherImage.JPG"  
      
      let image_data = {
        uri : image.uri,
        name : image.fileName,
        type : image.type,
      } 
      if (image != null){
        
        await formData.append( 'image', image_data)
        await formData.append('name', user) 
        await formData.append('other', other) 
        await formData.append('content', con) 
        await formData.append('token', token)  
        
  
        const image = (data) => {
  
          fetch(server + `home/sendMImage/`, {
            method: 'POST',
            body: data, 
        })
        .then(res => res.json())
        .then(res => {
          if(res){
            socketSendChat(other, null)
            setUp((up) => up+"a")
            if(text == con){
              setText("")
            }
          }
        })
      }
      image(formData)
    }
  }
          const im = [...images]
          for(let i = 0; i < im.length; i++){
            if(i == im.length -1){
              sendimage(im[i], text)
            } else{
              sendimage(im[i], "")
            }
          }
          setImages([])

    } else {
    
    socketSendChat(other, text)
    addMessage(user, text, 0, false, null)
    
    fetch(server + `home/sendM/`, {
      method: "POST",
      headers: {
        "content-type": "application/js",
      },
      body: JSON.stringify({user: user, content: text, other:other, token:token})  
    }) 
    .then(res => res.json())
    .then(res => {
      if(res){
        setText("")
        setUp((up) => up+"a")
      }
    })
  }

  }

  const getMonth = (month) => {
    switch(month){
      case 1:
        return "Janurary"
        break;
      case 2:
        return "Feburary"
        break;
      case 3:
        return "March"
      case 4:
        return "April"
        break;
      case 5:
        return "May"
        break;
      case 6:
        return "June"
        break;
      case 7:
        return "July"
        break;
      case 8:
        return "August"
        break;
      case 9:
        return "September"
        break;
      case 10:
        return "October"
        break;
      case 11:
        return "November"
        break;
      case 12:
        return "December"
        break;
    }
  }

  const longPress = (num) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy)
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy)
    setIsLongPressed(num)

  }

  const copyToClipboard = async (text) => {
    await Clipboard.setString(text);
  }

  
 
  const [notification, setNotification] = React.useState(false);
  const notificationListener = React.useRef();
  const responseListener = React.useRef();

  React.useEffect(() => {

    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
       
      notif = notification.request.content
      if(notif.title == other){
        Notifications.setNotificationHandler({
          handleNotification: async () => ({
            shouldShowAlert: false,
            shouldPlaySound: false,
            shouldSetBadge: false,
          }),
        });

        setUp((up) => up + "a") 

     } else {
      Notifications.setNotificationHandler({
        handleNotification: async () => ({
          shouldShowAlert: true,
          shouldPlaySound: true,
          shouldSetBadge: false,
        }),
      });
     }
    });


    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
     
    });

    return () => {
      Notifications.removeNotificationSubscription(notificationListener.current);
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  

  const read = (sender, content, datetime) => {
      fetch(server + `home/read/`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({"sender":sender, "content":content, "datetime":datetime})
      })
  }


  const reactIn = (what) => {
    setSelected(what)
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy)     
  }

  const react = (what, text, id) => {
    setSelected("")
    if(what == "copy"){
      copyToClipboard(text)

    } else if(what == "save"){
      savePhoto(text)
    } else {
      fetch(server + "home/react/", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({"user":user, "reaction":what, "id": id, "other": other, "token":token})
      })
      .then(res => res.json())  
      .then(res => {
        setUp((up) => up+"a")
      })
    }
    setIsLongPressed("")  
  }

  const openImage = () => {
    return( 
      <View>
      <Image 
      style={{width: "75%",  alignSelf: "center", height: 368, marginTop: "33%",
    opacity: .3}} resizeMode="contain"/>
    <View style={{flexDirection: "row", alignItems: "center", justifyContent: "center", opacity: .7}}>
 
      <Pressable onPress={() => goToProfile()} onPressIn={() => {setSelected("profile"), Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy)}} onPressOut={() => setSelected("")}
      style={[{width: "30%", borderWidth: 1, borderColor: "white", borderRadius: 14, height: 30, 
      alignItems: "center", justifyContent: "center", opacity: .7 }, selected=="profile" && {opacity: .4}]}>
        <Text style={{color: "white", fontSize: 16}}>profile</Text>
      </Pressable>

      <Pressable style={[{width: "20%", borderWidth: 1, alignItems: "center", height: 33, borderColor: "#9e3333",
      justifyContent: "center", borderRadius: 13, marginLeft: "4%"}, selected=="report" && {opacity: .4}]}
        onPressIn={() => {setSelected("report"), Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy)}} onPressOut={() => setSelected("")} onPress={() => report()}>
          <Text style={{fontSize: 16, color: "#9e3333"}}>Report</Text>
        </Pressable>

    </View>
      
    </View>
    )
  }

  const goToProfile = () => {
    setSelected("")
    navigation.navigate("Profile", {user:user, token:token, of:other, userProfile:profile, oImage:otherImage})
}


  const report = () => {
    if(reportOpen){
      
    } else {
      setReportOpen(true)
    }
  }

  const sendReport = (reason) => {
    fetch(server + `home/report/`, {
      method: "POST",
      headers: {
        "content-type": 'application/json'
      }, 
      body: JSON.stringify({"user":user, "reported":other, "reason":reason, "token":token})
    })
    .then(res => res.json())
    .then(res => {
      setReportOpen(false)
      navigation.goBack()
    })
  }

  const call = () => {
    
    fetch(server + `home/call/`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({"user":user, "other":other, "token":token})
    })
    navigation.navigate("Call", {other: other, user:user, token:token}) 
  }


  const handleM = ({item}) => { 
    if(item.num != "amfu"){
      let me = user == item.sender
      let space = false
      let id = (messages.length-1)-item.num
      let spaceR = false

      if ( id < messages.length-1 && id > 0){ 

        let differenceInMs = Math.abs(item.datetime - messages[id -1].datetime);
        let differenceInHours = differenceInMs / (1000 * 60 * 60);
        let isLessThanHour = differenceInHours < .05;
        space = ((isLessThanHour && item.sender == messages[id - 1].sender))  
        
        if(item.reactions.has){
          spaceR = true
        } else {
          spaceR = false
        }
        smallSpace = (item.sender == messages[id - 1].sender)
      } 

      const currentDate = new Date();

      const isToday = item.datetime.getDate() === currentDate.getDate() &&
                      item.datetime.getMonth() === currentDate.getMonth() &&
                      item.datetime.getFullYear() === currentDate.getFullYear();
      const month = getMonth(item.datetime.getMonth() + 1)
      const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      const dayOfWeek = daysOfWeek[item.datetime.getDay()];

      const oneWeekAgo = new Date(Date.now() - 6 * 24 * 60 * 60 * 1000); 
      const thisWeek = item.datetime >= oneWeekAgo;
      let numDate = item.datetime.getDate()
      if(numDate < 10){
        numDate = "0" + numDate 
      } 

      let minutes = item.datetime.getMinutes()
      if(minutes < 10){
        minutes = "0" + minutes
      }
      let hours = item.datetime.getHours() 
      if(hours < 10){
        hours = "0" + hours
      }

      const thisYear = item.datetime.getFullYear() == currentDate.getFullYear()


      const yesterday = new Date();
      yesterday.setDate(currentDate.getDate() - 1);


      const wasYesterday = (item.datetime.getDate() === yesterday.getDate() &&
      item.datetime.getMonth() === yesterday.getMonth() &&
      item.datetime.getFullYear() === yesterday.getFullYear())
      
      
      return( 
        <Pressable onPress={() => setIsLongPressed("")} 
         style={[isLongPressed != "" && isLongPressed != item.num && {opacity: .4}, isLongPressed == "" && isLongPressed == item.num ? {zIndex: 1,} : {zIndex: 0},]}> 

        {dateOpen[0] == item.num &&
        openImage()
        }
        
        {dateOpen.includes(item.num) && 

          <View style={[{width: "100%",}, dateOpen[0] == item.num && {marginTop: "1%"}]}>
        <Text style={[{marginVertical: 30, alignSelf: "center", fontSize: 17, 
      color: "#7d8080"}]}>
          {isToday ? "Today" : wasYesterday ? "Yesterday" : thisWeek ? dayOfWeek : month + " " + numDate}{!thisYear && ", " + item.datetime.getFullYear()}</Text>
          </View> 

        }

<View style={[me ? {alignSelf: "flex-end"} : {alignSelf: "flex-start"}, {flexDirection: 'row'},]}>

 

  
  {isLongPressed != "" && isLongPressed == item.num && me &&
    <Pressable style={[{backgroundColor: "rgb(22,22,22)",  width:"12%", height: 165, borderRadius: 100, 
    flexDirection: "column", justifyContent: "space-between", padding: 0, alignItems: "center", top: -90, paddingTop: 5, zIndex: 1,
    }, me ? {left: "-20%",} : {right: "-20%"}, {top:0}, item.hasImage && {left: "-10%"}]}>
        
                   <Pressable style={[styles.react, selected == "like" && {backgroundColor: "#2d2e30"}, item.reactions.user == "like" && {backgroundColor: "#2d2e30"}]} onPressOut={() => setSelected("")}
                   onPressIn={() => reactIn("like")} 
                   onPress={() => react("like", item.content, item.id)}
                   >
                       <SimpleLineIcons name="like" size={24} color="white" /> 
                   </Pressable>
              
                   <Pressable style={[styles.react, selected == "love" && {backgroundColor: "#2d2e30"} , item.reactions.user == "love" && {backgroundColor: "#2d2e30"}]} onPressOut={() => setSelected("")}
                   onPressIn={() => reactIn("love")} 
                   onPress={() => react("love", item.content, item.id)}
                   
                   >
                           <AntDesign name="hearto" size={24} color="white" /> 
                   </Pressable>
              
                   <Pressable style={[styles.react, selected == "question" && {backgroundColor: "#2d2e30"}, item.reactions.user == "question" && {backgroundColor: "#2d2e30"}]} onPressOut={() => setSelected("")}
                   onPressIn={() => reactIn("question")} 
                   onPress={() => react("question", item.content, item.id)}
                   >
                         <FontAwesome5 name="question" size={21.4} color="white" />
                   </Pressable>
              
                   <Pressable style={[styles.react, selected == "laugh" && {backgroundColor: "#2d2e30"}, item.reactions.user == "laugh" && {backgroundColor: "#2d2e30"}]} onPressOut={() => setSelected("")}
                   onPressIn={() => reactIn("laugh")} 
                   onPress={() => react("laugh", item.content, item.id)}
                   > 
                         <MaterialCommunityIcons name="emoticon-lol-outline" size={24} color="white" />
                   </Pressable>  
               
                   
                   <View style={{borderWidth: 1, borderColor: "rgba(0,0,0,0)", borderTopColor: "gray"}}>
                   <Pressable style={[styles.react, selected == "copy" && {backgroundColor: "#2d2e30"}]} onPressOut={() => setSelected("")}
                   onPressIn={() => reactIn("copy")} onPress={() => react("copy", item.content)}>
                                 <Feather name="copy" size={24} color="white" /> 
                   </Pressable>

                   {item.hasImage && 
                   <Pressable style={[styles.react, selected == "save" && {backgroundColor: "#2d2e30"}]} onPressOut={() => setSelected("")}
                   onPressIn={() => reactIn("save")} onPress={() => react("save", server + 'media/' + item.image)}>
                              <AntDesign name="download" size={24} color="white" /> 
                   </Pressable>
                   }

                   </View> 
    
    </Pressable>
  }


          <Pressable delayLongPress={450} onLongPress={() => longPress(item.num+"")}
          onPress={() => setIsLongPressed("")}
          style={[ styles.chat, 
        me ? styles.me : styles.other,  
        space && {marginBottom: 1}, spaceR && {marginBottom: 14},item.content.length < 10 && {flexDirection: "row"}, item.reactions.has && {flexDirection: "column"},
        isLongPressed == item.num+"" && {transform: [{scale: 1.03},  {translateY: -5}, me ? {translateX: -12} : {translateX: 12}]}, item.hasImage && {flexDirection: "column"}, item.hasImage && {paddingHorizontal: 1, paddingTop: 0}]}>  

                  {item.hasImage && 
                  <View>
                    <Image source={{uri: server + "media/" + item.image}} 
                    style={{width: 200, minWidth: "100%", height: 300, borderTopRightRadius: 12, borderTopLeftRadius: 12}}/>
                  </View>
                  } 

                 <Text style={[{fontSize: 17, color: "rgba(255,255,255,.7)"}, item.reactions.has && item.content.length < 10 && {marginRight: "20%"}, item.hasImage && {marginLeft: "2%"}]}>{item.content}</Text> 
  
                   <Text style={[{fontSize: 12, marginHorizontal: 2, alignSelf: "flex-end", 
                 color:"rgb(106, 107, 107)", marginLeft: 4,}, me && {color: "#424545"}]}> 
                        {hours}:{minutes} 
                   </Text> 
                  
        </Pressable>
 
{isLongPressed != "" && isLongPressed == item.num && !me &&
    <Pressable style={[{backgroundColor: "rgb(22,22,22)",  width:"12%", height: 165, borderRadius: 100, 
    flexDirection: "column", justifyContent: "space-between", padding: 0, alignItems: "center", paddingTop: 5, zIndex: 1,
    }, me ? {left: "-20%",} : {right: "-20%"}, {top:0}, item.hasImage && {right: "-10%"}]}> 
        
                   <Pressable style={[styles.react, selected == "like" && {backgroundColor: "#2d2e30"}, item.reactions.user == "like" && {backgroundColor: "#2d2e30"}]} onPressOut={() => setSelected("")}
                   onPressIn={() => reactIn("like")} 
                   onPress={() => react("like", item.content, item.id)} 
                   >
                       <SimpleLineIcons name="like" size={24} color="white" /> 
                   </Pressable>
              
                   <Pressable style={[styles.react, selected == "love" && {backgroundColor: "#2d2e30"} , item.reactions.user == "love" && {backgroundColor: "#2d2e30"}]} onPressOut={() => setSelected("")}
                   onPressIn={() => reactIn("love")} 
                   onPress={() => react("love", item.content, item.id)}
                   
                   >
                           <AntDesign name="hearto" size={24} color="white" /> 
                   </Pressable>
              
                   <Pressable style={[styles.react, selected == "question" && {backgroundColor: "#2d2e30"}, item.reactions.user == "question" && {backgroundColor: "#2d2e30"}]} onPressOut={() => setSelected("")}
                   onPressIn={() => reactIn("question")} 
                   onPress={() => react("question", item.content, item.id)}
                   >
                         <FontAwesome5 name="question" size={21.4} color="white" />
                   </Pressable>
              
                   <Pressable style={[styles.react, selected == "laugh" && {backgroundColor: "#2d2e30"}, item.reactions.user == "laugh" && {backgroundColor: "#2d2e30"}]} onPressOut={() => setSelected("")}
                   onPressIn={() => reactIn("laugh")} 
                   onPress={() => react("laugh", item.content, item.id)}
                   > 
                         <MaterialCommunityIcons name="emoticon-lol-outline" size={24} color="white" />
                   </Pressable>  
              
                   
                   <View style={{borderWidth: 1, borderColor: "rgba(0,0,0,0)", borderTopColor: "gray"}}>
                   <Pressable style={[styles.react, selected == "copy" && {backgroundColor: "#2d2e30"}]} onPressOut={() => setSelected("")}
                   onPressIn={() => reactIn("copy")} onPress={() => react("copy", item.content)}>
                                 <Feather name="copy" size={24} color="white" /> 
                   </Pressable>

                  {item.hasImage && 
                   <Pressable style={[styles.react, selected == "save" && {backgroundColor: "#2d2e30"}]} onPressOut={() => setSelected("")}
                   onPressIn={() => reactIn("save")} onPress={() => react("save", server + 'media/' + item.image)}>
                              <AntDesign name="download" size={24} color="white" /> 
                   </Pressable>
                   }

                   </View> 

                   
    
    </Pressable>
  }
        {item.reactions.has && me && isLongPressed != item.num &&
    <View style={[{flexDirection: "row", position: "absolute", bottom: 4, left: -4}]}>
      {item.reactions.user != "" &&
        <Reaction reaction={item.reactions.user} me={true}/> 
}

      {item.reactions.other != "" &&
        <Reaction reaction={item.reactions.other} me={false}/>
    }
    </View>
}

{item.reactions.has && !me && isLongPressed != item.num &&
    <View style={[{flexDirection: "row", position: "absolute", bottom: "-9%", right: "-1%"}]}>
      {item.reactions.user != "" &&
        <Reaction reaction={item.reactions.user} me={true}/> 
}

      {item.reactions.other != "" &&
        <Reaction reaction={item.reactions.other} me={false}/>
    }
    </View>
}
        
</View> 
        </Pressable>
      )
         

  
  }
}

 
  return(
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={[styles.container, reported && {borderWidth: 2, borderColor: "red"}]} 
    >
    <LinearGradient 
      colors={['black', 'rgb(10,10,10)', ]} 
      locations={[0.0, 0.9999]}
      style={{height: "100%"}} 
    >
    
    
        <View style={[styles.header, {paddingTop: "1%", paddingBottom: "1%"}]}> 

        <SafeAreaView></SafeAreaView>
          <Pressable style={[{alignSelf:"flex-end", 
          paddingLeft: ".3%", marginRight: "4%", height: 50, justifyContent: "center"},
        selected=="back" && {opacity: .4}]} 
          onPressIn={() => setSelected("back")} onPressOut={() => setSelected("")}
          onPress={() => navigation.goBack()} 
          > 
             <Entypo name='chevron-left' size={35} color="white"/>  
          </Pressable>
            
            <SafeAreaView></SafeAreaView>

          <Pressable style={[styles.info,]} onPress={() => goToProfile()}> 
            
            <Image source={{uri: ser + otherImage}} style={{borderRadius: 300, height: 50, width: 50}} defaultSource={require('../assets/emptyProfile.png')}/>
            <Text style={styles.title}>{other}</Text>
          </Pressable>

      

            <Pressable onPress={() => call()}
            onPressIn={() => setSelected("call")} onPressOut={() => setSelected("")}
            style={[{alignSelf: "flex-end", position: "absolute", right: "6%", height: 50, alignItems: "center"}, selected=="call" && {opacity: .4}]}>
                <Ionicons name="videocam-outline" size={39} color="white" />  
            </Pressable>
        
        </View>

         {messages.length <= 0 &&
        <Pressable style={{maxHeight: "90%", height: "auto", paddingTop: 0,}}
        onPress={() => Keyboard.dismiss()}>
         
        {openImage()}
          </Pressable>
}
        
        
        <FlatList 
      //onPress={Keyboard.dismiss} 
      data={messages}   
      renderItem={handleM}
      keyExtractor={(item) => item.num} 
      inverted={true} 
      style={{maxHeight: "90%", height: "auto", paddingTop: 100,}}
      contentContainerStyle={{ flexGrow: 1 }}  
      ref={listRef}
      scrollEnabled={isLongPressed == ""} 

    />
      
      
    
    
    {!keyOpen && images.length <= 0? 
    
    <Pressable style={[{position: "absolute", bottom: -0, marginBottom: 25, marginLeft:7,
  }, isLongPressed != "" && {opacity: .4}, selected=="key" && {opacity: .4},]}
     onPress={() => openKey()} onPressIn={() => {Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy), setSelected("openChat")}}
     onPressOut={() => {Haptics.impactAsync(Haptics.ImpactFeedbackStyle.light), setSelected("")}}
     disabled={isLongPressed != ""} 
    >
    <Ionicons name="chatbubble-ellipses-outline" size={52} color="rgba(255,255,255,.7)" 
    style={[{alignSelf: "flex-end"}, selected=="openChat" && {transform: [{scale: 1.1}],}]}
    />
    </Pressable>
    
    : (keyOpen || images.length) > 0 &&

        <View style={[{position: "absolute",
        bottom: 0, backgroundColor: "rgba(27, 28, 28, 0.5)", width: '100%',
        flexDirection: "row"}, keyOpen && {minHeight: 43}]}> 

          <Pressable style={{alignSelf: "center", width: "10%"}}
          onPress={() => openCamera()}>
            <Entypo name='camera' color="white" size={30}/>
          </Pressable>
 
          <Pressable style={{alignSelf: "center", width: "10%"}}
          onPress={() => showImagePicker()}>
            <Entypo name='images' color="white" size={30}/>
          </Pressable> 
           
          
          <TextInput style={[styles.input, 
          !(images.length > 0 || (text.length > 0 && text[0] != "" && text[0] != " ") ) ? {width: "80%"} : {}]} 
           multiline={true} value={text} onChangeText={(text)=>setText(text)}
          onEndEditing={() => setKeyOpen(false)} 
          ref={inputRef}
          autoFocus
          
        />
      
      { images.length > 0 || (text.length > 0 && text[0] != "" && text[0] != " ") ?
        <Pressable style={[{alignSelf: "center", right: 1, position: "absolute", width: "9%", justifyContent: "center",alignItems: "center"}, selected=="send" && {opacity: .4}]}
        onPress={() => send()} onPressIn={() => setSelected("send")} onPressOut={() => setSelected("")}
        > 
          <View style={{backgroundColor:"#4d738a", borderRadius: 360,}}>
            <Entypo name='chevron-up' size={34} style={{}} color="#8fadbf"/>
          </View>
        </Pressable>
        :
        null
    }





    { images.length > 0 &&
    <View style={{position: "absolute", alignSelf: "flex-end", left: "20%", width: "80%", bottom: 42}}>
      <ScrollView horizontal style={{width: "100%"}}>
        {images.map((image) => {
          return(
            <Pressable key={image} style={{height: 90, width: 50, flexDirection: "row", marginLeft: 20}}>

              <Image source={{uri: image.uri}} 
            style={{width: 50, height: 80, alignSelf: "flex-end"}}/>
            
            <Pressable onPress={() => setImages(current => current.filter(element => { return element !== image}))}
            style={{position: "absolute", alignSelf: "flex-end", top: 5, right: -5}}>
              <AntDesign name="closecircleo" size={13} color="white" />
            </Pressable>
            
            </Pressable>
            
          )
        })}
      </ScrollView>
        
    </View>
}
        </View>
        
      
}

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
                      <Pressable style={[styles.choice, selected=="bully" && {opacity: .4, backgroundColor: "#707173"}]} onPressIn={() => reactIn("bully")} onPressOut={() => setSelected("")} onPress={() => sendReport("Cyberbullying and Harassment")}>
                            <Text style={{color: "white", fontSize: 19, alignSelf: "center"}}>Cyberbullying and Harassment</Text>
                      </Pressable>
                     
                      <Pressable style={[styles.choice, selected=="dec" && {opacity: .4, backgroundColor: "#707173"}]} onPressIn={() => reactIn("dec")} onPressOut={() => setSelected("")} onPress={() => sendReport("Phishing or Deceptive Activities")}>
                            <Text style={{color: "white", fontSize: 19, alignSelf: "center"}}>Phishing or Deceptive Activities</Text>
                      </Pressable> 

                      <Pressable style={[styles.choice, selected=="fake" && {opacity: .4, backgroundColor: "#707173"}]} onPressIn={() => reactIn("fake")} onPressOut={() => setSelected("")} onPress={() => sendReport("Impersonation or Fake Account")}>
                            <Text style={{color: "white", fontSize: 19, alignSelf: "center"}}>Impersonation or Fake Account</Text>
                      </Pressable>

                      <Pressable style={[styles.choice, selected=="viol" && {opacity: .4, backgroundColor: "#707173",}, {borderBottomLeftRadius: 15, borderBottomRightRadius: 15, borderBottomWidth:0}]} onPressIn={() => reactIn("viol")} onPressOut={() => setSelected("")} onPress={() => sendReport("Violation of Community Guidelines")}>
                            <Text style={{color: "white", fontSize: 19, alignSelf: "center"}}>Violation of Community Guidelines</Text>
                      </Pressable>
                     
                </View>
          </Pressable> 
        </Pressable>

        
      </Modal>
    
    </LinearGradient>
    </KeyboardAvoidingView>
  )

}
  


const styles = StyleSheet.create({
  
    header: {
      backgroundColor: "rgba(41, 41, 41, 0.4)",
      flexDirection: "row",
  },
  title: {
    color: "white",
    fontSize: 17,
    marginLeft: 6,
  },
  info: {
    flexDirection: "row",
    alignSelf: "flex-end",
    justifyContent: "center",
  },
  
  chat: {
    borderWidth: 0,
    maxWidth: "70%",
    borderRadius: 12,
    padding: 4,
    width: "auto",
    marginBottom: 13,
    paddingHorizontal: 14,
    flexDirection: "column",
    paddingVertical: 5,
   
  },
  me: {
    alignSelf: "flex-end",
    marginRight: 12,
    backgroundColor: "#506fa3",
  },
  other: {
    alignSelf: "flex-end",
    marginLeft: 12,
    backgroundColor: "#303030", 
  },
  input: {
    backgroundColor: "rgb(54, 56, 56)",
    width: "70%",
    alignSelf: "center",
    fontSize: 17,
    color: "white",
    borderRadius: 14,
    padding: 3,
    paddingHorizontal: 8,
    alignContent: "center",
    minHeight: 32,  

    
  },
  container: {
  backgroundColor: "black",
  
  },

  react: {
    alignItems: "center",
    borderRadius: 360,
    width: 40,
    height: 40,
    justifyContent: "center"

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
  }
  


  
    
  });
