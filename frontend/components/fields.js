import AntDesignIcon from '@expo/vector-icons/AntDesign';
import Ionicons from "@expo/vector-icons/Ionicons";
import { StyleSheet } from 'react-native';
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Entypo from "@expo/vector-icons/Entypo";
import Octicons from "@expo/vector-icons/Octicons";
import FontAwsome from "@expo/vector-icons/FontAwesome"
import Fontisto from "@expo/vector-icons/Fontisto";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import React from 'react';
import { Foundation, FontAwesome } from '@expo/vector-icons'; 

const Fields = ({ item, size }) => {
   
    if(item == "Science") {
        return (
            <Entypo name="lab-flask" size={size} color="white" />
        ) 
    } else if(item == "Technology"){
        return (
            <Ionicons name="hardware-chip-sharp" size={size} color="white" />
        )
    } else if (item == "Engineering"){
        return <MaterialIcons name="engineering" size={size} color="white" />
    } else if (item == "Mathematics"){
        return <MaterialCommunityIcons name="function-variant" size={size} color="white" />
    } else if (item == "Social Sciences"){
        return <FontAwesome5 name="users" size={size} color="white" />
    } else if (item == "Humanities"){
        return <MaterialCommunityIcons name="human-handsdown" size={size} color="white" />
    } else if (item == "Arts"){
        return <Ionicons name="md-color-palette-sharp" size={size} color="white" />
    } else if (item == "Business"){ 
        return <Entypo name="suitcase" size={size} color="white" />
    } else if (item == "Medicine"){
        return <FontAwesome5 name="notes-medical" size={size} color="white" />
    } else if (item == "Law"){
        return <Octicons name="law" size={size} color="white" />
    } else if (item == "Education"){
        return <FontAwesome5 name="chalkboard-teacher" size={size} color="white" />
    } else if (item == "Psychology"){
        return <MaterialIcons name="psychology" size={size} color="white" />
    } else if (item == "Communications"){
        return <Ionicons name="chatbubbles" size={size} color="white" />
    } else if (item == "Environmental Studies"){
        return <FontAwesome5 name="tree" size={size} color="white" />
    } else if (item == "Agriculture"){
        return <MaterialIcons name="agriculture" size={size} color="white" />
    } else if (item == "Architecture"){
        return <MaterialIcons name="architecture" size={size} color="white" />
    } else if (item == "Design") {
        return <MaterialIcons name="design-services" size={size} color="white" />
    } else if (item == "Nursing") {
        return <Fontisto name="nursing-home" size={size} color="white" />
    } else if (item == "Music") {
        return <Ionicons name="musical-note" size={size} color="white" />
    } else if (item == "History"){
        return <FontAwesome5 name="history" size={size} color="white" />
    } else if (item == "Philosophy"){
        return <Ionicons name="infinite" size={size} color="white" />
    } else if (item == "Physics") {
        return <FontAwesome5 name="lightbulb" size={size} color="white" />
    } else if (item == "Chemistry") {
        return <MaterialCommunityIcons name="atom" size={size} color="white" />
    } else if (item == "Biology"){
        return <MaterialCommunityIcons name="dna" size={size} color="white" />
    } else if (item == "Computer Science"){
        return <MaterialIcons name="computer" size={size} color="white" />
    } else if (item == "Economics"){
        return <FontAwesome5 name="chart-line" size={size} color="white" />
    } else if (item == "Political Science") {
        return <Ionicons name="newspaper" size={size} color="white" />
    } else if (item == "Sociology") {
        return <FontAwesome5 name="users" size={size} color="white" />
    }  else if (item == "Anthropology"){
        return <MaterialCommunityIcons name="human" size={size} color="white" />
    } else if (item == "Geology"){
        return <Foundation name="mountains" size={size} color="white" />
    } else if (item == "Linguistics"){
        return <FontAwesome name="language" size={size} color="white" />
    } else if (item == "Criminal Justice") {
        return <MaterialIcons name="gavel" size={size} color="white" />
    } else if (item == "Marketing") {
        return <Entypo name="megaphone" size={size} color="white" />
    } else if (item == "Finance") {
        return <MaterialCommunityIcons name="finance" size={size} color="white" />
    } else if (item == "Dentistry") {
        return <FontAwesome5 name="tooth" size={size} color="white" />
    } else if (item == "Pharmacy") {
        return <MaterialCommunityIcons name="pill" size={size} color="white" />
    } else if (item == "Theater") {
        return <FontAwesome5 name="theater-masks" size={size} color="white" />
    } else if (item == "Religious Studies") {
        return <Ionicons name="book" size={size} color="white" />
    } else if (item == "Public Health") {
        return <MaterialIcons name="healing" size={size} color="white" />
    } else if (item == "Geography") {
        return <FontAwesome name="map" size={size} color="white" />
    } else if (item == "Nutrition") {
        return <MaterialCommunityIcons name="food" size={size} color="white" />
    } else if (item == "Sports Science"){
        return <Ionicons name="basketball-sharp" size={size} color="white" />
    } else if (item == "Environmental Science") {
        return <FontAwesome5 name="tree" size={size} color="white" />
    }
    else {
        return (
            <FontAwesome name="question" size={size} color="white" />
        )
    }
} 

export default Fields 

