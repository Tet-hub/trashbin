import React, { useState, useEffect } from "react";
import {
  Modal,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Text,
  View,
  StatusBar,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { signOut } from "firebase/auth";
import { auth, db } from "../config/firebase";
import { getDatabase, ref, onValue, off } from "firebase/database";
import { getCurrentUserUid } from "../service/getCurrentUserId";
import { collection, query, where, getDocs, addDoc } from "firebase/firestore";
import Icon from "react-native-vector-icons/FontAwesome";
import Ionicons from "react-native-vector-icons/Ionicons";
import AntDesign from "react-native-vector-icons/AntDesign";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import Entypo from "react-native-vector-icons/Entypo";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import { useNavigation } from "@react-navigation/native";
export default function MenuScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="white" barStyle="dark-content" />
      <TouchableOpacity style={styles.logoutView}>
        <MaterialCommunityIcons
          name="logout"
          size={30}
          color="black"
          style={{ marginRight: 5 }}
        />
        <Text style={styles.logoutText}>LOGOUT</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    flex: 1,
    position: "relative",
  },
  logoutView: {
    flexDirection: "row",
    backgroundColor: "#D9D9D9",
    alignItems: "center",
    width: "35%",
    padding: 10,
    marginLeft: 10,
    marginTop: 20,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: "500",
  },
});
