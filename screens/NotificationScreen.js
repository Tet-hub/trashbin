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
  SafeAreaView,
} from "react-native";

export default function NotificationScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="white" barStyle="dark-content" />
      <Text>Notifications!!!</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    flex: 1,
    position: "relative",
  },
});
