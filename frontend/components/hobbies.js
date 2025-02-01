import { Pressable, ScrollView, StyleSheet, Text, View, Image, ImageBackground, Dimensions, Modal, Animated, Easing, PanResponder, FlatList, findNodeHandle, TextInput, Keyboard,  } from 'react-native';
import * as React from 'react';

export default function Hobbies({profile}) {
    hob = ["Sports", "Video Games", "Reading", "Travel", "TV", "Fishing", "Crafting", "Collecting", "Music", "Hiking", "Art", "Cooking", "Technology", "Shopping"]
    const [selected, setSelected] = React.useState("")
    const latestSelected = React.useRef(selected)
    const screenWidth = Dimensions.get('window').width;
    const screenHeight = Dimensions.get('window').height;


    


    return (
        <View style={{flexDirection: "row", flexWrap: "wrap", width: "100%", height: "100%", justifyContent: "flex-start", alignItems: "center"}}>
        
        <View style={{position: "absolute", flexDirection: "row",  flexWrap: "wrap", width: "100%", height: "100%", justifyContent: "flex-start", alignItems: "center",}}>
        {Array.from({ length: 24 }).map((_, index) => {
                return(
                <View style={styles.icon} key={index}>
                <Text>{index}</Text>
                </View>                 
        )})}  
</View>

        {profile.hobbies.includes("soccer") && (
  <View style={styles.icon}>
    <Image source={require("../assets/soccer.gif")} style={styles.hobIcon} />
  </View>
)}

{profile.hobbies.includes("basketball") && (
  <View style={styles.icon}>
    <Image
      source={require("../assets/ball.gif")}
      style={{ transform: [{ scale: 0.1 }] }}
    />
  </View>
)}

{profile.hobbies.includes("football") && (
  <View style={styles.icon}>
    <Image
      source={require("../assets/football.gif")}
      style={[styles.hobIcon, { transform: [{ scale: 0.115 }] }]}
    />
  </View>
)}

{profile.hobbies.includes("baseball") && (
  <View style={styles.icon}>
    <Image source={require("../assets/baseball.gif")} style={styles.hobIcon} />
  </View>
)}

{profile.hobbies.includes("tennis") && (
  <View style={styles.icon}>
    <Image
      source={require("../assets/tennis.gif")}
      style={[styles.hobIcon, { transform: [{ scale: 0.05 }] }]}
    />
  </View>
)}

{profile.hobbies.includes("swimming") && (
  <View style={styles.icon}>
    <Image
      source={require("../assets/swimming.gif")}
      style={[styles.hobIcon, { transform: [{ scale: 0.13 }] }]}
    />
  </View>
)}

{profile.hobbies.includes("golf") && (
  <View style={styles.icon}>
    <Image
      source={require("../assets/golf.gif")}
      style={[styles.hobIcon, { transform: [{ scale: 0.12 }] }]}
    />
  </View>
)}

{profile.hobbies.includes("hockey") && (
  <View style={styles.icon}>
    <Image source={require("../assets/hockey.gif")} style={styles.hobIcon} />
  </View>
)}

{profile.hobbies.includes("skateboarding") && (
  <View style={styles.icon}>
    <Image
      source={require("../assets/skateboard.gif")}
      style={[styles.hobIcon, { transform: [{ scale: 0.13 }] }]}
    />
  </View>
)}

{profile.hobbies.includes("boxing") && (
  <View style={styles.icon}>
    <Image
      source={require("../assets/boxing.gif")}
      style={[styles.hobIcon, { transform: [{ scale: 0.1 }] }]}
    />
  </View>
)}

{profile.hobbies.includes("martialArts") && (
  <View style={styles.icon}>
    <Image
      source={require("../assets/martialArts.gif")}
      style={[styles.hobIcon, { transform: [{ scale: 0.1 }] }]}
    />
  </View>
)}

{profile.hobbies.includes("cycling") && (
  <View style={styles.icon}>
    <Image
      source={require("../assets/cycling.gif")}
      style={[styles.hobIcon, { transform: [{ scale: 0.12 }] }]}
    />
  </View>
)}

{profile.hobbies.includes("running") && (
  <View style={styles.icon}>
    <Image
      source={require("../assets/running.gif")}
      style={[styles.hobIcon, { transform: [{ scale: 0.12 }] }]}
    />
  </View>
)}

{profile.hobbies.includes("painting") && (
  <View style={styles.icon}>
    <Image
      source={require("../assets/art.gif")}
      style={[styles.hobIcon, { transform: [{ scale: 0.12 }] }]}
    />
  </View>
)}

{profile.hobbies.includes("sketching") && (
  <View style={styles.icon}>
    <Image
      source={require("../assets/write.gif")}
      style={[styles.hobIcon, { transform: [{ scale: 0.11 }] }]}
    />
  </View>
)}

{profile.hobbies.includes("photography") && (
  <View style={styles.icon}>
    <Image
      source={require("../assets/camera.gif")}
      style={[styles.hobIcon, { transform: [{ scale: 0.11 }] }]}
    />
  </View>
)}

{profile.hobbies.includes("crafting") && (
  <View style={styles.icon}>
    <Image
      source={require("../assets/craft.gif")}
      style={[styles.hobIcon, { transform: [{ scale: 0.12 }] }]}
    />
  </View>
)}

{profile.hobbies.includes("robotics") && (
  <View style={styles.icon}>
    <Image
      source={require("../assets/tech.gif")}
      style={[styles.hobIcon, { transform: [{ scale: 0.14 }] }]}
    />
  </View>
)}

{profile.hobbies.includes("coding") && (
  <View style={styles.icon}>
    <Image
      source={require("../assets/coding.gif")}
      style={[styles.hobIcon, { transform: [{ scale: 0.11 }] }]}
    />
  </View>
)}

{profile.hobbies.includes("engineering") && (
  <View style={styles.icon}>
    <Image
      source={require("../assets/engineering.gif")}
      style={[styles.hobIcon, { transform: [{ scale: 0.11 }] }]}
    />
  </View>
)}

{profile.hobbies.includes("tv") && (
  <View style={styles.icon}>
    <Image
      source={require("../assets/tv.gif")}
      style={[styles.hobIcon, { transform: [{ scale: 0.11 }] }]}
    />
  </View>
)}

{profile.hobbies.includes("video games") && (
  <View style={styles.icon}>
    <Image
      source={require("../assets/game.gif")}
      style={[styles.hobIcon, { transform: [{ scale: 0.13 }] }]}
    />
  </View>
)}

{profile.hobbies.includes("travel") && (
  <View style={styles.icon}>
    <Image
      source={require("../assets/travel.gif")}
      style={[styles.hobIcon, { transform: [{ scale: 0.12 }] }]}
    />
  </View>
)}

{profile.hobbies.includes("hiking") && (
  <View style={styles.icon}>
    <Image
      source={require("../assets/hike.gif")}
      style={[styles.hobIcon, { transform: [{ scale: 0.12 }] }]}
    />
  </View>
)}

{profile.hobbies.includes("fishing") && (
  <View style={styles.icon}>
    <Image
      source={require("../assets/fish.gif")}
      style={[styles.hobIcon, { transform: [{ scale: 0.12 }] }]}
    />
  </View>
)}

{profile.hobbies.includes("hunting") && (
  <View style={styles.icon}>
    <Image
      source={require("../assets/hunt.gif")}
      style={[styles.hobIcon, { transform: [{ scale: 0.12 }] }]}
    />
  </View>
)}

{profile.hobbies.includes("driving") && (
  <View style={styles.icon}>
    <Image
      source={require("../assets/driving.gif")}
      style={[styles.hobIcon, { transform: [{ scale: 0.1 }] }]}
    />
  </View>
)}

{profile.hobbies.includes("flying") && (
  <View style={styles.icon}>
    <Image
      source={require("../assets/flying.gif")}
      style={[styles.hobIcon, { transform: [{ scale: 0.11 }] }]}
    />
  </View>
)}

{profile.hobbies.includes("reading") && (
  <View style={styles.icon}>
    <Image
      source={require("../assets/book.gif")}
      style={[styles.hobIcon, { transform: [{ scale: 0.11 }] }]}
    />
  </View>
)}

{profile.hobbies.includes("writing") && (
  <View style={styles.icon}>
    <Image
      source={require("../assets/writing.gif")}
      style={[styles.hobIcon, { transform: [{ scale: 0.11 }] }]}
    />
  </View>
)}

{profile.hobbies.includes("theater") && (
  <View style={styles.icon}>
    <Image
      source={require("../assets/theater.gif")}
      style={[styles.hobIcon, { transform: [{ scale: 0.11 }] }]}
    />
  </View>
)}

{profile.hobbies.includes("politics") && (
  <View style={styles.icon}>
    <Image
      source={require("../assets/politics.gif")}
      style={[styles.hobIcon, { transform: [{ scale: 0.11 }] }]}
    />
  </View>
)}

{profile.hobbies.includes("skiing") && (
  <View style={styles.icon}>
    <Image
      source={require("../assets/ski.gif")}
      style={[styles.hobIcon, { transform: [{ scale: 0.11 }] }]}
    />
  </View>
)}

{profile.hobbies.includes("scuba diving") && (
  <View style={styles.icon}>
    <Image
      source={require("../assets/scuba.gif")}
      style={[styles.hobIcon, { transform: [{ scale: 0.11 }] }]}
    />
  </View>
)}

{profile.hobbies.includes("skydiving") && (
  <View style={styles.icon}>
    <Image
      source={require("../assets/skydiving.gif")}
      style={[styles.hobIcon, { transform: [{ scale: 0.11 }] }]}
    />
  </View>
)}

{profile.hobbies.includes("snowboarding") && (
  <View style={styles.icon}>
    <Image
      source={require("../assets/snowboarding.gif")}
      style={[styles.hobIcon, { transform: [{ scale: 0.11 }] }]}
    />
  </View>
)}

{profile.hobbies.includes("music") && (
  <View style={styles.icon}>
    <Image
      source={require("../assets/music.gif")}
      style={[styles.hobIcon, { transform: [{ scale: 0.11 }] }]}
    />
  </View>
)}

{profile.hobbies.includes("singing") && (
  <View style={styles.icon}>
    <Image
      source={require("../assets/singing.gif")}
      style={[styles.hobIcon, { transform: [{ scale: 0.11 }] }]}
    />
  </View>
)}

{profile.hobbies.includes("guitar") && (
  <View style={styles.icon}>
    <Image
      source={require("../assets/guitar.gif")}
      style={[styles.hobIcon, { transform: [{ scale: 0.11 }] }]}
    />
  </View>
)}

{profile.hobbies.includes("drums") && (
  <View style={styles.icon}>
    <Image
      source={require("../assets/drum.gif")}
      style={[styles.hobIcon, { transform: [{ scale: 0.11 }] }]}
    />
  </View>
)}

{profile.hobbies.includes("piano") && (
  <View style={styles.icon}>
    <Image
      source={require("../assets/piano.gif")}
      style={[styles.hobIcon, { transform: [{ scale: 0.11 }] }]}
    />
  </View>
)}

{profile.hobbies.includes("dancing") && (
  <View style={styles.icon}>
    <Image
      source={require("../assets/dancing.gif")}
      style={[styles.hobIcon, { transform: [{ scale: 0.11 }] }]}
    />
  </View>
)}



                
                

        </View> 
    );
  }

  const styles = StyleSheet.create({
    icon: { 
        borderWidth: 2,
        borderStyle: 'solid', 
        borderColor: "#2d2d2e", 
        backgroundColor: 'black',  
        borderRadius: 360, 
        padding: "2%", 
        alignItems: "center",
        marginHorizontal: 0,
        marginBottom: "1%",
        height: 43,
        width: 43,
        justifyContent: "center", 
        marginRight: "2%", 
        marginBottom: "2%"
        
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

     hobIcon: {
        transform: [
          {
            scale: 0.09,
          }
        ]
       },
    
  });