import { TextInput, View, Text, Pressable, Animated, StyleSheet, Dimensions, Image, Keyboard, Modal, FlatList, ScrollView } from "react-native"
import React, { startTransition } from "react";
import storage from "../storage";
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Video} from 'expo-av';
import * as Haptics from 'expo-haptics'
import jobs from "./jobs";
import Fields from "./fields" 
import * as ImagePicker from 'expo-image-picker';
import { isNewBackTitleImplementation } from "react-native-screens";
import { SafeAreaView } from "react-native-safe-area-context";
import Flag from "react-native-flags";
import {Entypo, Ionicons, FontAwesome, FontAwesome5, MaterialCommunityIcons, Fontisto, MaterialIcons} from "@expo/vector-icons"


export default ProfileSet = ({navigation, route}) => {
    const server = storage.server
    const user = route.params.user
    const token = route.params.token
    const [selected, setSelected] = React.useState("")
    const screenWidth = Dimensions.get('window').width;
    const [current, setCurrent] = React.useState(1)
    const nextDimension = screenWidth * .20
    const [image, setImage] = React.useState(null)  
    const [first, setFirst] = React.useState("")
    const [last, setLast] = React.useState("")
    const [bio, setBio] = React.useState("")
    const selectedBlue = "#6aa8eb"
    const [country, setCountry] = React.useState(null)
    const [city, setCity] = React.useState("")
    const [countryOpen, setCountryOpen] = React.useState(false)
    const window = Dimensions.get("window")
    const [error, setError] = React.useState("")
    const [hobbies, setHobbies] = React.useState([])
    const [occupation, setOccupation] = React.useState(null)
    const [occupationOpen, setOccupationOpen] = React.useState(false)
    const [email, setEmail] = React.useState("")
    const [school, setSchool] = React.useState("")
    const [schoolType, setSchoolType] = React.useState("")
    const [field, setField] = React.useState("")

    const [confEmail, setConfEmail] = React.useState("")
    const [confScreen, setConfScreen] = React.useState(false)
    const [validEmails, setValidEmails] = React.useState([])
    
    const [month, setMonth] = React.useState("")
    const [date, setDate] = React.useState("")
    const [year, setYear] = React.useState("")
    const [selectedDob, setSelectedDob] = React.useState(false)

    const monthRef = React.useRef(null)
    const dateRef = React.useRef(null)
    const yearRef = React.useRef(null)

    const [conf1, setConf1] = React.useState("")
    const [conf2, setConf2] = React.useState("")
    const [conf3, setConf3] = React.useState("")
    const [conf4, setConf4] = React.useState("")
    const [conf5, setConf5] = React.useState("")

    const conf1Ref = React.useRef(null)
    const conf2Ref = React.useRef(null)
    const conf3Ref = React.useRef(null)
    const conf4Ref = React.useRef(null)
    const conf5Ref = React.useRef(null)

    const [confError, setConfError] = React.useState(false)

    const fieldMargin = React.useRef(new Animated.Value(0)).current


    const countries = [
        "Afghanistan",
        "Akrotiri",
        "Albania", 
        "Algeria", 
        "American Samoa",
        "Andorra", 
        "Angola", 
        "Anguilla",
        "Antigua and BarbBarbuda",
        "Argentina", 
        "Armenia", 
        "Aruba", 
        "Australia", 
        "Austria", 
        "Azerbaijan", 
        "Bahrain", 
        "Bangladesh", 
        "Barbados", 
        "Belarus", 
        "Belgium", 
        "Belize", 
        "Benin", 
        "Bermuda",
        "Bhutan", 
        "Bolivia",
        "Bosnia and Herzegovina",
        "Botswana", 
        "Brazil", 
        "British Indian Ocean Territory", 
        "British Virgin Islands", 
        "Brunei", 
        "Bulgaria", 
        "Burkina Faso",
        "Burundi", 
        "Cabo Verde", 
        "Cambodia", 
        "Cameroon", 
        "Canada", 
        "Cayman Islands", 
        "Central African Republic",
        "Chad", 
        "Chile", 
        "China", 
        "Christmas Island",
        "Cocos Islands", 
        "Colombia", 
        "Comoros", 
        "Cook Islands",
        "Costa Rica", 
        "Côte d'Ivoire", 
        "Croatia", 
        "Cuba", 
        "Curaçao", 
        "Cyprus", 
        "Czechia", 
        "Democratic Republic of the Congo", 
        "Denmark", 
        "Dhekelia",
        "Djibouti",
        "Dominica",
        "Dominican Republic", 
        "Ecuador",
        "Egypt", 
        "El Salvador",
        "Equatorial Guinea", 
        "Eritrea", 
        "Estonia", 
        "Ethiopia",
        "Falkland Islands",
        "Faroe Islands", 
        "Federated States of Micronesia", 
        "Fiji",
        "Finland", 
        "France", 
        "French Guiana", 
        "French Polynesia", 
        "French Southern And Antarctic Lands", 
        "Gabon", 
        "Georgia",
        "Germany",
        "Ghana", 
        "Gibraltar", 
        "Greece", 
        "Greenland", 
        "Grenada", 
        "Guadeloupe", 
        "Guam", 
        "Guatemala", 
        "Guernsey",
        "Guinea", 
        "Guinea-Bissau",
        "Guyana", 
        "Haiti", 
        "Honduras", 
        "Hong Kong",
        "Hungary", 
        "Iceland", 
        "India", 
        "Indonesia",
        "Iran", 
        "Iraq", 
        "Ireland", 
        "Isle of Man",
        "Israel",
        "Italy", 
        "Jamaica", 
        "Japan", 
        "Jersey",
        "Jordan",
        "Kazakhstan", 
        "Kenya", 
        "Kiribati", 
        "Kosovo", 
        "Kuwait", 
        "Kyrgyzstan", 
        "Laos", 
        "Latvia", 
        "Lebanon",
        "Lesotho",
        "Liberia",
        "Libya",
        "Liechtenstein", 
        "Lithuania", 
        "Luxembourg",
        "Macau", 
        "Macedonia", 
        "Madagascar",
        "Malawi", 
        "Malaysia", 
        "Maldives", 
        "Mali", 
        "Malta",
        "Marshall Islands",
        "Martinique",
        "Mauritania",
        "Mauritius", 
        "Mayotte", 
        "Mexico", 
        "Moldova", 
        "Monaco", 
        "Mongolia",
        "Montenegro", 
        "Montserrat", 
        "Morocco", 
        "Mozambique", 
        "Myanmar",
        "Namibia",
        "Nauru", 
        "Nepal", 
        "Netherlands", 
        "New Caledonia",
        "New Zealand", 
        "Nicaragua", 
        "Niger", 
        "Nigeria", 
        "Niue", 
        "Norfolk Island", 
        "North Korea", 
        "Northern Mariana Islands", 
        "Norway", 
        "Oman", 
        "Pakistan", 
        "Palau", 
        "Palestine", 
        "Panama", 
        "Papua New Guinea",
        "Paracel Islands",
        "Paraguay", 
        "Peru", 
        "Philippines",
        "Pitcairn Islands", 
        "Poland", 
        "Portugal", 
        "Puerto Rico", 
        "Qatar", 
        "Republic of Congo", 
        "Reunion",
        "Romania",
        "Russia", 
        "Rwanda", 
        "Saint Barthelemy", 
        "Saint Kitts and Nevis", 
        "Saint Lucia", 
        "Saint Martin",
        "Saint Pierre and Miquelon", 
        "Saint Vincent and The Grenadines", 
        "Samoa", 
        "San Marino", 
        "Sao Tome and Principe",
        "Saudi Arabia",
        "Senegal",
        "Serbia", 
        "Seychelles", 
        "Sierra Leone",
        "Singapore", 
        "Sint Maarten", 
        "Slovakia", 
        "Slovenia", 
        "Solomon Islands", 
        "Somalia", 
        "South Africa", 
        "South Georgia and South Sandwich Islands",
        "South Korea", 
        "South Sudan", 
        "Spain", 
        "Spratly Islands", 
        "Sri Lanka", 
        "Sudan", 
        "Suriname", 
        "Svalbard", 
        "Swaziland",
        "Sweden", 
        "Switzerland", 
        "Syria", 
        "Taiwan",
        "Tajikistan",
        "Tanzania",
        "Thailand",
        "The Bahamas",
        "The Gambia", 
        "Timor-Leste",
        "Togo", 
        "Tokelau", 
        "Tonga", 
        "Trinidad and Tobago",
        "Tunisia",
        "Turkey", 
        "Turkmenistan",
        "Turks Aad Caicos Islands", 
        "Tuvalu",
        "U.S. Virgin Islands", 
        "Uganda", 
        "Ukraine",
        "United Arab Emirates", 
        "United Kingdom",
        "United States", 
        "Uruguay", 
        "Uzbekistan",
        "Vanuatu", 
        "Vatican City", 
        "Venezuela", 
        "Vietnam", 
        "Wallis and Futuna", 
        "Yemen", 
        "Zambia",
        "Zimbabwe",
           ]
     
     const iso = {
       "Afghanistan": "AF",
       "Akrotiri": "AX",
       "Albania": "AL",
       "Algeria": "DZ",
       "American Samoa": "AS",
       "Andorra": "AD",
       "Angola": "AO",
       "Anguilla": "AI",
       "Antigua and BarbBarbuda": "AG",
       "Argentina": "AR",
       "Armenia": "AM",
       "Aruba": "AW",
       "Australia": "AU",
       "Austria": "AT",
       "Azerbaijan": "AZ",
       "Bahrain": "BH",
       "Bangladesh": "BD",
       "Barbados": "BB",
       "Belarus": "BY",
       "Belgium": "BE",
       "Belize": "BZ",
       "Benin": "BJ",
       "Bermuda": "BM",
       "Bhutan": "BT",
       "Bolivia": "BO",
       "Bosnia and Herzegovina": "BA",
       "Botswana": "BW",
       "Brazil": "BR",
       "British Indian Ocean Territory": "IO",
       "British Virgin Islands": "VG",
       "Brunei": "BN",
       "Bulgaria": "BG",
       "Burkina Faso": "BF",
       "Burundi": "BI",
       "Cabo Verde": "CV",
       "Cambodia": "KH",
       "Cameroon": "CM",
       "Canada": "CA",
       "Cayman Islands": "KY",
       "Central African Republic": "CF",
       "Chad": "TD",
       "Chile": "CL",
       "China": "CN",
       "Christmas Island": "CX",
       "Cocos Islands": "CC",
       "Colombia": "CO",
       "Comoros": "KM",
       "Cook Islands": "CK",
       "Costa Rica": "CR",
       "Côte d'Ivoire": "CI",
       "Croatia": "HR",
       "Cuba": "CU",
       "Curaçao": "CW",
       "Cyprus": "CY",
       "Czechia": "CZ",
       "Democratic Republic of the Congo": "CD",
       "Denmark": "DK",
       "Dhekelia": "DX",
       "Djibouti": "DJ",
       "Dominica": "DM",
       "Dominican Republic": "DO",
       "Ecuador": "EC",
       "Egypt": "EG",
       "El Salvador": "SV",
       "Equatorial Guinea": "GQ",
       "Eritrea": "ER",
       "Estonia": "EE",
       "Ethiopia": "ET",
       "Falkland Islands": "FK",
       "Faroe Islands": "FO",
       "Federated States of Micronesia": "FM",
       "Fiji": "FJ",
       "Finland": "FI",
       "France": "FR",
       "French Guiana": "GF",
       "French Polynesia": "PF",
       "French Southern And Antarctic Lands": "TF",
       "Gabon": "GA",
       "Georgia": "GE",
       "Germany": "DE",
       "Ghana": "GH",
       "Gibraltar": "GI",
       "Greece": "GR",
       "Greenland": "GL",
       "Grenada": "GD",
       "Guadeloupe": "GP",
       "Guam": "GU",
       "Guatemala": "GT",
       "Guernsey": "GG",
       "Guinea": "GN",
       "Guinea-Bissau": "GW",
       "Guyana": "GY",
       "Haiti": "HT",
       "Honduras": "HN",
       "Hong Kong": "HK",
       "Hungary": "HU",
       "Iceland": "IS",
       "India": "IN",
       "Indonesia": "ID",
       "Iran": "IR",
       "Iraq": "IQ",
       "Ireland": "IE",
       "Isle of Man": "IM",
       "Israel": "IL",
       "Italy": "IT",
       "Jamaica": "JM",
       "Japan": "JP",
       "Jersey": "JE",
       "Jordan": "JO",
       "Kazakhstan": "KZ",
       "Kenya": "KE",
       "Kiribati": "KI",
       "Kosovo": "XK",
       "Kuwait": "KW",
       "Kyrgyzstan": "KG",
       "Laos": "LA",
       "Latvia": "LV",
       "Lebanon": "LB",
       "Lesotho": "LS",
       "Liberia": "LR",
       "Libya": "LY",
       "Liechtenstein": "LI",
       "Lithuania": "LT",
       "Luxembourg": "LU",
       "Macau": "MO",
       "Macedonia": "MK",
       "Madagascar": "MG",
       "Malawi": "MW",
       "Malaysia": "MY",
       "Maldives": "MV",
       "Mali": "ML",
       "Malta": "MT",
       "Marshall Islands": "MH",
       "Martinique": "MQ",
       "Mauritania": "MR",
       "Mauritius": "MU",
       "Mayotte": "YT",
       "Mexico": "MX",
       "Moldova": "MD",
       "Monaco": "MC",
       "Mongolia": "MN",
       "Montenegro": "ME",
       "Montserrat": "MS",
       "Morocco": "MA",
       "Mozambique": "MZ",
       "Myanmar": "MM",
       "Namibia": "NA",
       "Nauru": "NR",
       "Nepal": "NP",
       "Netherlands": "NL",
       "New Caledonia": "NC",
       "New Zealand": "NZ",
       "Nicaragua": "NI",
       "Niger": "NE",
       "Nigeria": "NG",
       "Niue": "NU",
       "Norfolk Island": "NF",
       "North Korea": "KP",
       "Northern Mariana Islands": "MP",
       "Norway": "NO",
       "Oman": "OM",
       "Pakistan": "PK",
       "Palau": "PW",
       "Palestine": "PS",
       "Panama": "PA",
       "Papua New Guinea": "PG",
       "Paracel Islands": "PF",
       "Paraguay": "PY",
       "Peru": "PE",
       "Philippines": "PH",
       "Pitcairn Islands": "PN",
       "Poland": "PL",
       "Portugal": "PT",
       "Puerto Rico": "PR",
       "Qatar": "QA",
       "Republic of Congo": "CG",
       "Reunion": "RE",
       "Romania": "RO",
       "Russia": "RU",
       "Rwanda": "RW",
       "Saint Barthelemy": "BL",
       "Saint Kitts and Nevis": "KN",
       "Saint Lucia": "LC",
       "Saint Martin": "MF",
       "Saint Pierre and Miquelon": "PM",
       "Saint Vincent and The Grenadines": "VC",
       "Samoa": "WS",
       "San Marino": "SM",
       "Sao Tome and Principe": "ST",
       "Saudi Arabia": "SA",
       "Senegal": "SN",
       "Serbia": "RS",
       "Seychelles": "SC",
       "Sierra Leone": "SL",
       "Singapore": "SG",
       "Sint Maarten": "SX",
       "Slovakia": "SK",
       "Slovenia": "SI",
       "Solomon Islands": "SB",
       "Somalia": "SO",
       "South Africa": "ZA",
       "South Georgia and South Sandwich Islands": "GS",
       "South Korea": "KR",
       "South Sudan": "SS",
       "Spain": "ES",
       "Spratly Islands": "PS",
       "Sri Lanka": "LK",
       "Sudan": "SD",
       "Suriname": "SR",
       "Svalbard": "SJ",
       "Swaziland": "SZ",
       "Sweden": "SE",
       "Switzerland": "CH",
       "Syria": "SY",
       "Taiwan": "TW",
       "Tajikistan": "TJ",
       "Tanzania": "TZ",
       "Thailand": "TH",
       "The Bahamas": "BS",
       "The Gambia": "GM",
       "Timor-Leste": "TL",
       "Togo": "TG",
       "Tokelau": "TK",
       "Tonga": "TO",
       "Trinidad and Tobago": "TT",
       "Tunisia": "TN",
       "Turkey": "TR",
       "Turkmenistan": "TM",
       "Turks Aad Caicos Islands": "TC",
       "Tuvalu": "TV",
       "U.S. Virgin Islands": "VI",
       "Uganda": "UG",
       "Ukraine": "UA",
       "United Arab Emirates": "AE",
       "United Kingdom": "GB",
       "United States": "US",
       "Uruguay": "UY",
       "Uzbekistan": "UZ",
       "Vanuatu": "VU",
       "Vatican City": "VA",
       "Venezuela": "VE",
       "Vietnam": "VN",
       "Wallis and Futuna": "WF",
       "Yemen": "YE",
       "Zambia": "ZM",
       "Zimbabwe": "ZW"
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

  const jobTitles = [
    "Student",
    "Doctor",
    "Teacher",
    "Engineer",
    "Artist",
    "Chef",
    "Writer",
    "Developer",
    "Designer",
    "Accountant",
    "Lawyer",
    "Architect",
    "Musician",
    "Scientist",
    "Police Officer",
    "Firefighter",
    "Pilot",
    "Nurse",
    "Dentist",
    "Electrician",
    "Plumber",
    "Mechanic",
    "Pharmacist",
    "Waiter/Waitress",
    "Librarian",
    "Fashion Designer",
    "Photographer",
    "Journalist",
    "Athlete",
    "Psychologist",
    "Social Worker",
    "Real Estate Agent",
    "Farmer",
    "Veterinarian",
    "Hairdresser",
    "Actor/Actress",
    "Economist",
    "Truck Driver",
    "Construction Worker",
    "Flight Attendant",
    "Barista",
    "Paramedic",
    "Military Officer",
    "Software Engineer",
    "Data Analyst",
    "Graphic Designer",
    "Buisness",
    "Independent",
    "Other",
  ];

  const fieldsOfStudy = [
    "Engineering",
    "Mathematics",
    "Humanities",
    "Arts",
    "Business",
    "Medicine",
    "Law",
    "Education",
    "Psychology",
    "Communications",
    "Agriculture",
    "Architecture",
    "Design",
    "Nursing",
    "Music",
    "History",
    "Philosophy",
    "Physics",
    "Chemistry",
    "Biology",
    "Computer Science",
    "Economics",
    "Political Science",
    "Sociology",
    "Anthropology",
    "Geology",
    "Linguistics",
    "Criminal Justice",
    "Marketing",
    "Finance",
    "Dentistry",
    "Pharmacy",
    "Theater",
    "Religious Studies",
    "Public Health",
    "Environmental Science",
    "Geography",
    "Nutrition",
    "Sports Science",
    "Other",
  ];

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

    const validEmail = (email) => {
        return email.includes("@") && (email.includes(".edu") || email.includes(".org") || email.includes(".com") || email.includes(".gov") || email.includes(".co"))
    }

    const canNext = () => {
        if(current == 1){
            if(image == null){
                return false
            }
        } else if(current == 2){
            return first != "" && last != "" && email != "" && validEmail(email)
        } else if(current == 3){
            if(year.length < 4 || month.length < 2 || date.length < 2){
                return false
            }
            const today = new Date()
            if(parseInt(year) < 1900 || parseInt(month) > 12 || parseInt(date) > 31 || parseInt(year) > today.getFullYear()){
                return false
            }
        } else if (current == 3.5){
            return field != "" && field != null
        } else if(current == 4){
            if (country == null || city==""){
                return false
            } 
        } else if(current == 5){
            if (hobbies.length < 1 || hobbies.length > 24){
                return false
            } 
        }

        return true
    }

    const selectImage = async () => {
    
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
          aspectRadius: 360,
          quality: 1,
        });
    
        // Explore the result
    
        if (!result.canceled) { 
 
          setImage(result.assets[0])
    
        } 
      }
    
    const postImage = async () => {
        const formData = new FormData()
        const imname = user + "ProfileImage.JPG"  

        if (image != null){

            let image_data = {
            uri : image.uri,
            name : imname,
            type : image.type,
          }   
    
            await formData.append('image', image_data)
        } else {
            await formData.append('image', null)
        }    

        await formData.append('name', user) 
        await formData.append('token', token)  
        
        
        sendImage(formData)

    }

    const confirmEmail = () => {
        fetch(server + `home/confirmEmail/`, {
            method: "POST",
            headers: {
                "content-type": "application/json",
            },
            body: JSON.stringify({"user": user, "token": token, "email": email})
        })
        .then(res => res.json())
        .then(res => {
            setConfEmail(res)
            console.log(res)
            setConfScreen(true)
            setConf1("")
            setConf2("")
            setConf3("")
            setConf4("")
            setConf5("")
        })
    }

    const checkEmail = () => {
        fetch(server + `home/checkEmail/`, {
            method: "POST",
            headers: {
                "content-type": "application/json",
            },
            body: JSON.stringify({"user": user, "token": token, "email": email})
        })
        .then(res => res.json()) 
        .then(res => {
            if(res){
                setSchool(res.school)
                setSchoolType(res.type)
                if(!validEmails.includes(email)){
                    confirmEmail()
                } else {
                    setCurrent(3)
                }
            } else { 
                setError("email")
            }
        })  
    }

    const next = () => {
        if(current == 2) {
            checkEmail()
            return
        }
        if (current == 3){
            console.log(schoolType)
            if(schoolType == "university"){
                setCurrent(3.5)
                return
            } 
        }
        if(current == 3.5){
            setCurrent(4)
            return
        }
        if(current < 4){
            if(current == 2.5){
                setCurrent(3)
            } else {
                setCurrent((current) => current + 1)
            }
        } else if (current==4){
            verifyCity()
        } else if(current==5){
            finish()
        }
    }

    const previous = () => {
        if(current == 4){
            setCurrent(3.5)
            return
        }
        setCurrent((current) => current -1)
    }

    const sendImage = (data) => {
        fetch(server + `home/profileImage/`, {
            method: "POST",
            
            body: data
        })
    }

    const finish = () => {
        postImage()
        const birth = year + "-" + month + "-" + date

        fetch(server + `home/setProfile/`, {
            method: "POST",
            headers: "application/json",
            body: JSON.stringify({"user":user, "token":token, "hobbies": hobbies, 
            "first":first, "last":last, "country":country, "city":city, "dob":birth, "school": school, "field": field, "type": schoolType, "email": email})
        })
        .then(res => res.json())
        .then(res => {
            if(res){
                navigation.navigate("Home", {})
            } 
        })
    }

    const selectCountry = () => {
        setCountryOpen(true)
        setError("")
        Keyboard.dismiss()
        hapticMedium()
    }

    const verifyCity = () =>  {
        fetch(server + `home/verifyCity/`, {
            method: "POST",
            headers: {
                "content-type": "application/json",
            },
            body: JSON.stringify({"city":city, "country":iso[country]})
        })
        .then(res => res.json())
        .then(res => {
            if(res){
                setCity(res)
                setCurrent((current) => current + 1)
            } else {
                setError("city")
            }
        })
    }

    const hobbie = (what) => { 
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy)
        if(hobbies.includes(what)){
          setHobbies(current => current.filter(element => { return element !== what}))
        } else {
          setHobbies([...hobbies, what])
        }
      }
    
    const selectField = (item) => {
        if(field == ""){
        setField(item)
        Animated.timing(fieldMargin, {
            toValue: window.width * .08,
            duration: 500,
            useNativeDriver: false,
        }).start()
        } else {
            Animated.timing(fieldMargin, {
                toValue: 0,
                duration: 500,
                useNativeDriver: false,
            }).start(({finished}) => {
                setField(item)
                Animated.timing(fieldMargin, {
                    toValue: window.width * .08,
                    duration: 500,
                    useNativeDriver: false,
                }).start()
            })
        }
    }

    const unselectField = (item) => {
        if (item == field)
        Animated.timing(fieldMargin, {
            toValue: 0,
            duration: 500,
            useNativeDriver: false,
        }).start(({finished}) => {
            if(item == field) {
                setField("")
            }
        })
        
    }

    const fieldChoice = (item) => {
        return(
            <Pressable style={[{flexDirection: "row", alignItems: "center", width: "100%", marginVertical: "1%"}, selected==item && {opacity: .4}, field == item && {backgroundColor: "rgba(223,223,223,.5)"}]} onPressIn={() => press(item)} onPressOut={() => setSelected("")} onPress={() => field==item ? unselectField(item) : selectField(item)}>
                <Animated.View style={[{width: "100%", flexDirection: "row", alignItems: "center"}, field == item && {paddingLeft: fieldMargin,}]}>
                <View style={{width: "20%", alignItems: "center"}}> 
                    <Fields item={item} size={window.width * .15}/>
                </View> 
                <Text style={{color: "white", fontWeight: "bold", fontSize: 24, width: "80%", paddingLeft: "2%"}}>{item}</Text>
                </Animated.View>
            </Pressable>
        )
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

    
      const handleKeyPress = (e, what) => {
        if (e.nativeEvent.key === 'Backspace') {
          if(what == "year" && year.length <= 0){
                dateRef.current.focus()
          } else if(what == "date" && date.length <= 0){
                monthRef.current.focus()
          }
        }
      };

    
    const changeDOB = (text, what) => {
        if(what=="month"){
            setMonth(text)
            if(text.length >=2 && selected != "date"){
                dateRef.current.focus()
            }
        } else if(what=="date"){
            setDate(text)
            if(text.length >=2 && selected != "year"){
                console.log(what)
                yearRef.current.focus()
            }
        } else if(what=="year"){
            setYear(text)
            if(text.length >=4){
                Keyboard.dismiss()
                setSelected("")
            }
        }
    }

    const startDOB = (what) => {
            setSelected(what)
            setSelectedDob(true)
            if(!(month.length >= 2)){
                if(what == "date" || what == "year"){
                    monthRef.current.focus() 
                }
                return
            }

            if (!(date.length >= 2)){
                if(what == "year"){
                    dateRef.current.focus()
                }
                return
            } 
            
            if(!(year.length >= 4) && (selected != "year" && selected != "date" && selected != "month")){
                yearRef.current.focus()
                return
            }
        
    }

    const checkDOB = (what) => {
        if(what == "month"){
            
        } else if(what=="date"){
            if(month.length < 2){
                return false
            }
        } else if(what == "year"){
            if(month.length < 2 || date.length < 2){
                return false
            }
        }

        return true
    }

    const checkConfirm = (last) => {
        console.log(conf1 + conf2 + conf3 + conf4 + last === confEmail)
        console.log(confEmail, conf1 + conf2 + conf3 + conf4 + last)
        if (conf1 + conf2 + conf3 + conf4 + last === confEmail){
            setConfScreen(false)
            setCurrent(3)
            setValidEmails([...validEmails, email])
        } else {
            setConfError(true)
            setConf1("")
            setConf2("")
            setConf3("")
            setConf4("")
            setConf5("")
            conf1Ref.current.focus()
        }
    }
    const changeConf = async (num, text) => {
        setConfError(false)
        switch(num){
            case 1 : 
                setConf1(text)
                if(text.length > 0){
                    conf2Ref.current.focus()
                }
                break
            case 2 :
                setConf2(text)
                if(text.length > 0){
                    conf3Ref.current.focus()
                }
                break
            case 3 :
                setConf3(text)
                if(text.length > 0){
                    conf4Ref.current.focus()
                }
                break
            case 4:
                setConf4(text)
                if(text.length > 0){
                    conf5Ref.current.focus()
                }
                break
            case 5:
                setConf5(text)
                checkConfirm(text)
                break
        }
    }

    const handleKeyConf = (e, num) => {
        switch(num){
            case 1 : 
                if(e.nativeEvent.key === 'Backspace' && conf1.length <= 0){
                    
                } else if(conf1.length > 0){
                    conf2Ref.current.focus()
                }
                break
            case 2 :

                if(e.nativeEvent.key === 'Backspace' && conf2.length <= 0){
                    conf1Ref.current.focus()
             
                } else if(conf2.length > 0){
                    conf3Ref.current.focus()
                }
                break
            case 3 :

                if(e.nativeEvent.key === 'Backspace' && conf3.length <= 0){
                    conf2Ref.current.focus()
                    
                } else if(conf3.length > 0){
                    conf4Ref.current.focus()
                }
                break
            case 4:

                if(e.nativeEvent.key === 'Backspace' && conf4.length <= 0){
                    conf3Ref.current.focus()
                   
                } else if(conf4.length > 0){
                    conf5Ref.current.focus()
                }
                break
            case 5:
                if(e.nativeEvent.key === 'Backspace' && conf5.length <= 0){
                    conf4Ref.current.focus()
            
                } else if(conf5.length > 0){
                    
                }
                break
        }
    }


    const changeEmail = () => {
        setConfScreen(false)
        setConf1("")
        setConf2("")
        setConf3("")
        setConf4("")
        setConf5("")
    }


    return(
        <SafeAreaView style={{flex: 1, backgroundColor: "black", alignItems: "center"}}>
               
               <View style={{width: "100%", height: "70%", alignItems: "center", }} onPress={() => Keyboard.dismiss()}>
               
               <Pressable onPress={() => selectImage()}>
                <Animated.View style={[{ height: "50%", marginTop: "25%", justifyContent: "center",}, current != 1 && {display:"none",}]}>
                    <Image style={{width:screenWidth * .90, height:screenWidth *.90, borderRadius: 360, backgroundColor: "gray"}}
                    source={ image ? {uri: image.uri} : require("../assets/emptyProfile.png")}
                    />
                    <Image source={require("../assets/camera.png")} style={{ width: "80%", height: "80%" ,position: "absolute", alignSelf: "center",
                }} resizeMode={"contain"}/>
                </Animated.View>
               </Pressable>



               <View style={[current != 2 && {display:"none"}, {width: "100%", height: "100%"}]}>
                
                <Text style={[styles.personalT, {marginTop: "15%"}]}>First Name</Text>
                
                   
                   
                    <View style={[{width: "100%", height: "8%", marginRight: "2%",}]}>
                    <TextInput 
                    value={first}
                    onChangeText={(text) => setFirst(text)}
                    style={[styles.input, {borderTopRightRadius: 20, borderBottomRightRadius: 20, borderLeftWidth: 0,},
                    selected=="first" && {borderColor: selectedBlue}]}
                    placeholder="first" 
                    onFocus={() => setSelected("first")}
                    onEndEditing={() => setSelected("")}
                    />
                    
                </View>
                
                <Text style={[styles.personalT, {marginLeft: "50%", marginTop: "10%",}]}>Last Name</Text>
                
                <View style={[{width: "100%", height: "8%", flexDirection: "column", alignItems: "flex-end"}]}>
                    <TextInput 
                    value={last}
                    onChangeText={(text) => setLast(text)}
                    style={[styles.input, {borderTopLeftRadius: 20, borderBottomLeftRadius: 20, borderRightWidth: 0,},
                    selected=="last" && {borderColor: selectedBlue}]}
                    placeholder="last"
                    onFocus={() => setSelected("last")}
                    onEndEditing={() => setSelected("")}
                    
                    />
                </View>
                
       
                <Text style={[styles.personalT, {marginTop: "15%"}]}>School Email Address</Text>
                    <View style={{width:"80%", height:"8%", marginLeft: "2%",}}>
                        
                        <TextInput  onChangeText={(text) => {setEmail(text), error=="email" && setError("")}} value={email} onFocus={() => setSelected("email")} onEndEditing={() => setSelected("")} 
                         style={[{width: "100%", height: "100%", borderWidth: 2, 
                        borderColor: "white", borderRadius: 20, paddingHorizontal: "2%", 
                        justifyContent: "center", flexDirection: "row",
                        color: "white", fontSize: 19, paddingHorizontal: "4%"},
                    selected=="email" && {borderColor: selectedBlue}]}
                        placeholder="email" autoCapitalize="none" keyboardType="email-address" autoCorrect={false}/>

                    <Text 
                    style={[{position: "absolute", color: "white", top: "-20%", left: "5%", backgroundColor: "black"},
                    email.length <= 0 && {display: "none"}, selected=="email" && {color: selectedBlue}]}>Email</Text>

                    </View> 
                    <Text style={[{color: "red", marginTop: "1%", display: "none", width: "80%", marginLeft: "2%"}, error=="email" && {display: "flex"}]}>
                        Please use your school email. Currently the app's services are not available to all schools. Check our website at <Text style={{color: "lightblue"}}>http://globalpuzzle.co/schools</Text> to see if your school is available.
                    </Text>
                        
                        
            
               </View>
            
            <View style={[current != 3 && {display: "none"}, {width: "100%", height: "100%"}]}>
                    
                    <Text style={{color: "white", fontSize: 25, fontWeight: "bold", marginBottom: "5%"}}>Date of Birth</Text>

                    <Pressable style={[{alignSelf: "center", alignSelf: "center", width: "70%", paddingVertical: "2.5%", borderWidth: 3, borderColor: "white",
                        borderRadius: 25, flexDirection: "row", justifyContent: "space-around"}, 
                selectedDob && {borderColor: selectedBlue, }]}                
                >         

                    <TextInput 
                    placeholder="mm"
                    inputMode="numeric"
                    keyboardType="number-pad"
                    maxLength={2}
                    ref={monthRef}
                    value={month}
                    onChangeText={(text) => changeDOB(text, "month")}
                    style={[styles.dateInput, {width: "30%"}]}
                    onFocus={() => startDOB("month")}
                    onKeyPress={(e) => handleKeyPress(e, "month")}
                    onEndEditing={() => setSelectedDob(false)}
                    />

                    <TextInput 
                    placeholder="dd"
                    inputMode="numeric"
                    keyboardType="number-pad"
                    maxLength={2}
                    ref={dateRef}
                    value={date}
                    onChangeText={(text) => changeDOB(text, "date")}
                    style={[styles.dateInput, {width: "30%"}]}
                    onFocus={() => startDOB("date")}
                    onKeyPress={(e) => handleKeyPress(e, "date")}
                    onEndEditing={() => setSelectedDob(false)}
                    />

                    <TextInput 
                    placeholder="yyyy"
                    inputMode="numeric"
                    keyboardType="number-pad"
                    maxLength={4}
                    ref={yearRef}
                    value={year}
                    onChangeText={(text) => changeDOB(text, "year")}
                    style={[styles.dateInput, {width: "40%"}]}
                    onFocus={() => startDOB("year")}
                    onKeyPress={(e) => handleKeyPress(e, "year")}
                    onEndEditing={() => setSelectedDob(false)}
                    />

                        </Pressable>
                    
                    
                    <Ionicons name="ios-calendar-sharp" size={window.width * .70} color="white" 
                    style={{opacity:.5, alignSelf: "center"}}/>

            </View>

            <View style={[current != 3.5 && {display: "none"}, {width: "100%", height: "100%", flex: 1}]}>
                    
                    <Text style={{color: "white", fontSize: 25, fontWeight: "bold", marginBottom: "1%", height: "20%"}}>What is your main area of study at {school} </Text>
                    
                    <View style={{height: "78%", width: "100%", }}> 
                    
                        <ScrollView style={{flex:1, }} scrollEnabled>
                                {fieldsOfStudy.map((item) => {
                                    return(
                                        fieldChoice(item)
                                    )
                                })}
                        </ScrollView>

                    </View>
                    
                    
            </View>

               <View style={[current != 4 && {display: "none"}, {width: "100%", height: "100%", }]}>
                    
                    
                    <Pressable 
                    onPressIn={() => press("country")}
                    onPressOut={() => setSelected("")}
                    onPress={() => selectCountry()}
                    style={[{width: "80%", height: "8%", borderWidth: 2, 
                    borderColor: "white", borderRadius: 20, paddingHorizontal: "2%", 
                    justifyContent: "center", marginTop: "10%", marginLeft: "2%", flexDirection: "row"},
                    selected=="country" && {opacity: .4}]}>
                        
                        <View style={{height: "100%", width: '20%', alignSelf: "center", justifyContent: "center"}}>
                            <Text style={{fontSize: 19, alignSelf: "center",}}>{FLAGS[country]}</Text>
                        </View>

                        <Text numberOfLines={1}
                         style={{color: "white", fontSize: 19, alignSelf: "center", width: "80%"}}>{country != null ? country : "Country"}</Text>
                    
                    </Pressable>

                    <View 
                    style={[{width: "80%", height: "8%", borderWidth: 2, 
                    borderColor: "white", borderRadius: 20, 
                    justifyContent: "center", marginTop: "10%", marginRight: "2%", alignSelf: "flex-end"}, 
                    selected=="city" && {borderColor: selectedBlue}
                    , error=="city" && {borderColor: "red"}]}>
                        
                        <TextInput style={{color: "white", fontSize: 19, width: "90%", height: "100%", 
                        paddingHorizontal: "3%", }}
                        placeholder="city"
                        onFocus={() => setSelected("city")}
                        onEndEditing={() => setSelected("")}
                        value={city}
                        onChangeText={(text) => {setCity(text), error=="city" && setError("")}}
                        />
                    </View>
                    
              
                    <Text style={[{color: "red", marginTop: "2%", alignSelf: "flex-end"}, error!="city" && {opacity:0}]}>
                        city does not exist in selected country
                    </Text>
                    

                    <Ionicons name="location" size={window.width*.5} color="white" style={{opacity: .4, alignSelf: "center"}}/>


               </View>


               <View style={[{height: "100%", width: "100%"}, current!=5 && {display: "none"}]}>
                <ScrollView style={{flex:1}}>
                            <Text style={[styles.catagoryText, {marginBottom: "5%", opacity: .8}]}>Pick one or more hobbies</Text>
                           {music()}
                           {art()} 
                           {sport()}
                           {extreme()}
                           {culture()}  
                           {technology()}
                           {travel()}


                </ScrollView>
               </View>


                
                </View>
            
            


                <Animated.View style={{width: "120%", alignItems: "flex-end"}}>
                    <Pressable style={[{width: "33%", alignItems: "flex-end"}, selected=="next" && {opacity: .4},
                    !canNext() && {opacity: .4}]}
                    onPressIn={() => press("next")} onPressOut={() => setSelected("")} onPress={() => next()}
                   disabled={!canNext()}
                   > 
                        <View style={[styles.next, {width: "100%", height: nextDimension}]}>
                                    <Text style={styles.nextT}>{ current != 5 ? "next" : "finish"}</Text>
                        </View>
                    </Pressable>
                </Animated.View>

                <Animated.View style={[{width: "120%", alignItems: "flex-end", marginTop: "7%"}, current <= 1 && {display:'none'}]}>
                    <Pressable style={[{width: "33%", alignItems: "flex-end"}, selected=="previous" && {opacity: .4}]}
                    onPressIn={() => press("previous")} onPressOut={() => setSelected("")} onPress={() => previous()}
                    > 
                        <View style={[styles.next, {width: "100%", height: nextDimension, backgroundColor: "black", borderWidth: 2, borderColor: "white"}]}>
                                    <Text style={styles.nextT}>previous</Text>
                        </View>
                    </Pressable>
                </Animated.View>
            
        <Modal
        transparent={true}
        visible={countryOpen}
        animationType="fade"
        >
            <Pressable style={{width: "100%", height: "100%", justifyContent: "center", alignItems: "center"}} onPress={() => setCountryOpen(false)}>
                
                
                <Pressable style={{width: "95%", height: "60%", backgroundColor: "rgb(22,22,22)", borderRadius: 20, paddingVertical: "1%", paddingHorizontal: "3%"}}>
                    <FlatList
                    data={countries}
                    keyExtractor={(item) => item.id}
                    renderItem={({item}) => {
                        return(
                            <Pressable style={[{width: "100%", flexDirection: "row", alignItems: "center", },
                        selected==item && {opacity: .7}]} key={item}
                            onPress={() => {haptic(), setCountry(item), setCountryOpen(false)}}
                            onPressIn={() => press(item)}
                            onPressOut={() => setSelected("")}
                            unstable_pressDelay={100}
                            > 
                                <View style={{width: "30%",}} >
                                    <Flag code={iso[item]} type="flat" style={{width: "50%"}}/>
                                </View>
                                
                                <Text style={{color: "white", opacity: .7, fontSize: 19, width: "70%"}}>{item}</Text>
                            </Pressable>
                        )
                    }}
                    style={{width: "100%", height: "100%"}}
                    />
                </Pressable>
            
            
            </Pressable>
            
        </Modal>
        
        <Modal
        transparent={true}
        visible={occupationOpen}
        animationType="fade"
        >
            <Pressable style={{width: "100%", height: "100%", justifyContent: "center", alignItems: "center"}} onPress={() => setOccupationOpen(false)}>
                
                
                <Pressable style={{width: "95%", height: "60%", backgroundColor: "rgb(22,22,22)", borderRadius: 20, paddingVertical: "1%", paddingHorizontal: "3%"}}>
                    <FlatList
                    data={jobTitles}
                    keyExtractor={(item) => item.id}
                    renderItem={({item}) => {
                        return(
                            <Pressable style={[{width: "100%", flexDirection: "row", alignItems: "center", marginTop: "5%"},
                        selected==item && {opacity: .7}]} key={item}
                            onPress={() => {haptic(), setOccupation(item), setOccupationOpen(false)}}
                            onPressIn={() => press(item)}
                            onPressOut={() => setSelected("")}
                            unstable_pressDelay={100}
                            > 
                            <View style={{width: "30%", alignItems: "center"}}>
                                {jobs[item]} 
                            </View>
                               
                                
                                <Text style={{color: "white", opacity: .7, fontSize: 19, width: "70%", marginLeft: "5%"}}>{item}</Text>
                            </Pressable>
                        )
                    }}
                    style={{width: "100%", height: "100%"}}
                    />
                </Pressable>
            
            
            </Pressable>
            
        </Modal>

        <Modal
        transparent={true}
        visible={confScreen}
        animationType="fade"
        >
            <View style={{flex: 1, width: "100%", height: "100%", backgroundColor: "black", alignItems: "center", paddingTop: "30%"}}>
                    <Text style={{color: "white", fontSize:21, fontWeight: "700", width: "90%", marginBottom: "30%"}}>Confirm your email address. A verification code has been sent to {email}</Text>
                    <Pressable style={{width: "80%", borderWidth: 0, borderColor: "white", flexDirection: "row", justifyContent: "center"}}>
                        <TextInput style={[styles.confIn, selected=="1" && styles.selectedConf, confError && styles.confError]} placeholder="0" maxLength={1} value={conf1} onChangeText={(text) => changeConf(1, text)} ref={conf1Ref} onKeyPress={(e) => handleKeyConf(e, 1)} keyboardType="numeric" onFocus={() => setSelected("1")} onEndEditing={() => setSelected("")} 
                        />
                        <TextInput style={[styles.confIn, selected=="2" && styles.selectedConf, confError && styles.confError]} placeholder="0" maxLength={1} value={conf2} onChangeText={(text) => changeConf(2, text)} ref={conf2Ref} onKeyPress={(e) => handleKeyConf(e, 2)} keyboardType="numeric" onFocus={() => setSelected("2")} onEndEditing={() => setSelected("")}
                        />
                        <TextInput style={[styles.confIn, selected=="3" && styles.selectedConf, confError && styles.confError]} placeholder="0" maxLength={1} value={conf3} onChangeText={(text) => changeConf(3, text)} ref={conf3Ref} onKeyPress={(e) => handleKeyConf(e, 3)} keyboardType="numeric" onFocus={() => setSelected("3")} onEndEditing={() => setSelected("")}
                        />
                        <TextInput style={[styles.confIn, selected=="4" && styles.selectedConf, confError && styles.confError]} placeholder="0" maxLength={1} value={conf4} onChangeText={(text) => changeConf(4, text)} ref={conf4Ref} onKeyPress={(e) => handleKeyConf(e, 4)} keyboardType="numeric" onFocus={() => setSelected("4")} onEndEditing={() => setSelected("")}
                        />
                        <TextInput style={[styles.confIn, selected=="5" && styles.selectedConf, confError && styles.confError]} placeholder="0" maxLength={1} value={conf5} onChangeText={(text) => changeConf(5, text)} ref={conf5Ref} onKeyPress={(e) => handleKeyConf(e, 5)} keyboardType="numeric" onFocus={() => setSelected("5")} onEndEditing={() => setSelected("")}
                        />
                    </Pressable>

                    <Pressable onPress={() => confirmEmail()} style={[{marginTop: "8%", }, selected=="resend" && {opacity: .4}]} onPressIn={() => setSelected("resend")} onPressOut={() => setSelected("")}
                    >
                        <Text style={{fontSize:18, color: "white", alignSelf: "flex-start"}}>resend email</Text>
                    </Pressable>

                    <Pressable onPress={() => changeEmail()} style={[{marginTop: "3%", }, selected=="change" && {opacity: .4}]} onPressIn={() => setSelected("change")} onPressOut={() => setSelected("")}
                    >
                        <Text style={{fontSize:18, color: "white", alignSelf: "flex-start"}}>change email</Text>
                    </Pressable>
            </View>
        </Modal>

        </SafeAreaView>
    )
}


const styles = StyleSheet.create({
    next: {
        backgroundColor: "#286ab5aa",
        borderRadius: 360,
        justifyContent: "center",
        paddingLeft: "7%",

    },
    nextT: {
        fontSize: 21,
        fontWeight: "bold",
        color: "white",
        opacity: .7,
    },
    
    input: {
        color: "white",
        borderWidth: 2,
        borderColor: "white",
        paddingHorizontal: "2%",
        fontSize: 19,
        paddingVertical: "2%",
        width: "49%",
        height: "100%"
        
    },

    inputField: {
        backgroundColor: "black", 
        position: "absolute", 
        color: "white", 
        top: "-4%", 
        left: "6%",
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
     dateInput: {
        fontSize: 21,
        alignItems: "center",
        textAlign: "center",
        color: "white"
     },
     
     confIn: {
        borderBottomWidth: 3,
        borderBottomColor: "white",
        width: "15%",
        paddingBottom: "3%",
        marginHorizontal: "3%",
        fontSize: 28,
        textAlign: "center",
        color: "white",

     },
     selectedConf: {
        
     },
     confError: {
        borderColor: "red",
     },
     personalT: {
        color: "white",
        fontSize: 23,
        fontWeight: "bold",
        marginTop: "5%",
        marginBottom: "5%",
        marginLeft: "2%",
     }
}) 