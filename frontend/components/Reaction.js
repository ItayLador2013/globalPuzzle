import React, { useState, useEffect } from 'react';
import { Text, View } from 'react-native';
import { Entypo, Ionicons, FontAwesome5, Fontisto, Octicons, AntDesign, MaterialIcons, SimpleLineIcons, Feather, MaterialCommunityIcons } from '@expo/vector-icons'; 

const Reaction = ({ reaction, me }) => {
  

  return (
  <View style={[{borderRadius: 360, width: 25, height: 25, 
  backgroundColor: "#56585c", alignItems: "center", 
  justifyContent: "center"}, me && {backgroundColor:"#8fafe3"}]}>
    {reaction == "like" ?
        <SimpleLineIcons name="like" size={17} color={!me ? "white" : "white"} /> 
        :
        reaction == "love" ?

        <AntDesign name="hearto" size={17} color={!me ? "white" : "white"} /> 

        :
        reaction == "question" ?

        <FontAwesome5 name="question" size={14.4} color={!me ? "white" : "white"} />

        :
        reaction == "laugh" &&

        <MaterialCommunityIcons name="emoticon-lol-outline" size={17} color={!me ? "white" : "white"} />

}
  </View>
  );


 

};

export default Reaction; 