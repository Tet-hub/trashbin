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
import {
  NavigationHelpersContext,
  useNavigation,
} from "@react-navigation/native";
export default function AddBinScreen() {
  const [trashbinId, setTrashbinId] = useState("");
  const [trashbinName, setTrashbinName] = useState("");
  const [trashbinLoc, setTrashbinLoc] = useState("");
  const currentUserUid = getCurrentUserUid();
  const navigation = useNavigation();

  console.log("currentUserUid: ", currentUserUid);
  // Function to add data to the database
  const handleAddData = async () => {
    try {
      const trashbinCollection = collection(db, "trashbin");

      const newData = {
        trashbinId: trashbinId,
        userId: currentUserUid,
        trashbinName: trashbinName,
        trashbinLocation: trashbinLoc,
      };

      await addDoc(trashbinCollection, newData);
      navigation.navigate("Home");
    } catch (error) {
      console.error("Error adding data: ", error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="white" barStyle="dark-content" />
      <Text style={styles.addBinText}>Add Bin</Text>
      <View style={styles.bodyDiv}>
        <View style={styles.inputView}>
          <Text style={styles.textLabel}>Bin Name: </Text>
          <View style={styles.binInputView}>
            <TextInput
              onChangeText={(text) => setTrashbinName(text)}
              style={styles.placeholderStyle}
              placeholder="Enter bin name..."
              autoCapitalize="sentences"
            />
          </View>
        </View>
        <View style={styles.inputView}>
          <Text style={styles.textLabel}>Bin ID: </Text>
          <View style={styles.binInputViewID}>
            <TextInput
              onChangeText={(text) => setTrashbinId(text)}
              style={styles.placeholderStyle}
              placeholder="Enter bin id..."
              autoCapitalize="sentences"
            />
          </View>
        </View>
        <View style={styles.inputView}>
          <Text style={styles.textLabel}>Location: </Text>
          <View style={styles.binInputViewLoc}>
            <TextInput
              onChangeText={(text) => setTrashbinLoc(text)}
              style={styles.placeholderStyle}
              placeholder="Enter bin location..."
              autoCapitalize="sentences"
            />
          </View>
        </View>
        <TouchableOpacity style={styles.addButtonTO} onPress={handleAddData}>
          <Text style={styles.addBinButton}>Add Bin</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    flex: 1,
    position: "relative",
  },
  addBinText: {
    textAlign: "center",
    marginTop: 30,
    fontSize: 20,
    marginBottom: 30,
  },
  inputView: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  bodyDiv: {
    alignSelf: "center",
    width: "90%",
  },
  textLabel: {
    fontSize: 16,
    fontWeight: "400",
  },
  binInputView: {
    borderWidth: 1,
    borderColor: "#5C8374",
    borderRadius: 5,
    width: "75%",
  },
  binInputViewID: {
    borderWidth: 1,
    borderColor: "#5C8374",
    borderRadius: 5,
    width: "75%",
    marginLeft: 27,
  },
  binInputViewLoc: {
    borderWidth: 1,
    borderColor: "#5C8374",
    borderRadius: 5,
    width: "75%",
    marginLeft: 6,
  },
  placeholderStyle: {
    marginLeft: 20,
    marginRight: 20,
    marginVertical: 3,
  },
  addButtonTO: {
    alignSelf: "center",
    marginTop: 40,
    backgroundColor: "#D9D9D9",
    width: "90%",
  },
  addBinButton: {
    fontSize: 16,
    textAlign: "center",
    padding: 18,
  },
});
