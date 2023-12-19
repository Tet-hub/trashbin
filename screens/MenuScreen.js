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
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

export default function MenuScreen() {
  const handleLogout = async () => {
    await signOut(auth);
  };
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="white" barStyle="dark-content" />
      <TouchableOpacity style={styles.logoutView} onPress={handleLogout}>
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
