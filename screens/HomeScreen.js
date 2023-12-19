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
export default function HomeScreen() {
  const navigation = useNavigation();
  const [data, setData] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [trashbinId, setTrashbinId] = useState("");
  const [trashbinName, setTrashbinName] = useState("");
  const [trashbinLoc, setTrashbinLoc] = useState("");
  const [trashbinData, setTrashbinData] = useState([]);

  const currentUserUid = getCurrentUserUid();
  // console.log("currentUserUid: ", currentUserUid);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const trashbinCollection = collection(db, "trashbin");
        const q = query(
          trashbinCollection,
          where("userId", "==", currentUserUid)
        );
        const querySnapshot = await getDocs(q);

        const fetchedData = [];
        querySnapshot.forEach((doc) => {
          const trashbinData = doc.data();
          fetchedData.push({
            id: doc.id,
            userId: trashbinData.userId,
            trashbinName: trashbinData.trashbinName,
            trashbinLocation: trashbinData.trashbinLocation,
            trashbinId: trashbinData.trashbinId,
          });
        });

        if (fetchedData.length > 0) {
          setTrashbinData(fetchedData);
        }
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };

    fetchData();
  }, [currentUserUid]);

  useEffect(() => {
    const fetchDataForId = (id) => {
      const dbRealtime = getDatabase();
      const dataRef = ref(
        dbRealtime,
        `trashbin/${id.trashbinId}/capacityLevel`
      );

      onValue(dataRef, (snapshot) => {
        const capacityLevel = snapshot.val();
        // console.log("Capacity Level:", capacityLevel);
        setTrashbinData((prevData) => {
          const updatedData = prevData.map((bin) => {
            if (bin.id === id.id) {
              return {
                ...bin,
                capacityLevel: capacityLevel,
              };
            }
            return bin;
          });
          return updatedData;
        });
      });
    };

    trashbinData.forEach((id) => {
      fetchDataForId(id);
    });

    return () => {
      // Clean up the listeners when the component unmounts or when trashbinData changes
      trashbinData.forEach((id) => {
        const dbRealtime = getDatabase();
        const dataRef = ref(
          dbRealtime,
          `trashbin/${id.trashbinId}/capacityLevel`
        );
        off(dataRef);
      });
    };
  }, [trashbinData]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="white" barStyle="dark-content" />
      <View style={styles.topBarView}>
        <View style={styles.topIconView}>
          <Icon
            name="trash"
            size={25}
            color="#9EC8B9"
            style={{ marginRight: 15 }}
          />
          <Text style={styles.titleText1}>KON</Text>
          <Text style={styles.titleText2}>BIN</Text>
          <Text style={styles.titleText3}>I</Text>
        </View>
        <View style={styles.topIconView}>
          <TouchableOpacity onPress={() => navigation.navigate("Notification")}>
            <Ionicons
              name="notifications"
              size={25}
              color="#9EC8B9"
              style={{ marginRight: 15 }}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate("Menu")}>
            <Ionicons name="menu" size={30} color="#9EC8B9" />
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.screenTitleDiv}>
        <Text style={styles.screenTitleText}>Monitoring Waste Levels,</Text>
        <Text style={styles.screenTitleText}>Redefining Efficiency</Text>
      </View>
      <View style={styles.bodyDiv}>
        <TouchableOpacity
          onPress={() => navigation.navigate("AddBin")}
          style={styles.addDiv}
        >
          <AntDesign
            name="pluscircle"
            size={20}
            color="black"
            style={{ marginRight: 10 }}
          />
          <Text style={styles.addBinText}>ADD BIN</Text>
        </TouchableOpacity>
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={{ marginBottom: 20, marginTop: 10 }}
        >
          {trashbinData &&
            trashbinData.map((binData, index) => (
              <View key={index} style={styles.binContainer}>
                <View style={styles.bigBinView}>
                  <FontAwesome5 name="trash" size={135} color="#092635" />
                  <View style={styles.percentageView}>
                    <Text style={styles.percentageText}>100%</Text>
                  </View>
                </View>
                <View style={styles.insideBinContainer}>
                  <Text style={styles.binNameText}>{binData.trashbinName}</Text>
                  <View style={styles.labelDataView}>
                    <Text style={styles.idLabel}>Bin ID:</Text>
                    <View style={styles.iconDataView}>
                      <MaterialCommunityIcons
                        name="page-layout-sidebar-left"
                        size={20}
                        color="black"
                        style={{ marginRight: 2 }}
                      />
                      <Text style={styles.idData}>{binData.trashbinId}</Text>
                    </View>
                  </View>
                  <View style={styles.labelDataView}>
                    <Text style={styles.idLabel}>Location:</Text>
                    <View style={styles.iconDataView}>
                      <Entypo
                        name="location"
                        size={20}
                        color="black"
                        style={{ marginRight: 2 }}
                      />
                      <Text style={styles.idData}>
                        {binData.trashbinLocation}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.labelDataView}>
                    <Text style={styles.idLabel}>Capacity Level:</Text>
                    <View style={styles.iconDataView}>
                      <MaterialIcons
                        name="storage"
                        size={20}
                        color="black"
                        style={{ marginRight: 2 }}
                      />
                      {binData.capacityLevel !== undefined && (
                        <Text style={styles.idDataCapacityText}>
                          {binData.capacityLevel}
                        </Text>
                      )}
                    </View>
                  </View>
                </View>
              </View>
            ))}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

// Styles for the modal
const styles = StyleSheet.create({
  container: {
    backgroundColor: "#092635",
    flex: 1,
    position: "relative",
  },
  topBarView: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignSelf: "center",
    width: "85%",
    marginTop: 20,
  },
  titleText1: {
    color: "white",
    fontSize: 20,
  },
  titleText2: {
    color: "#9EC8B9",
    fontSize: 20,
  },
  titleText3: {
    color: "white",
    fontSize: 20,
  },
  topIconView: {
    flexDirection: "row",
    alignItems: "center",
  },
  screenTitleDiv: {
    borderColor: "#FFFCFC",
    borderWidth: 1,
    width: "85%",
    alignSelf: "center",
    padding: 20,
    marginTop: 30,
  },
  screenTitleText: {
    textAlign: "center",
    fontSize: 18,
    color: "#FFFFFF",
  },
  addDiv: {
    flexDirection: "row",
    backgroundColor: "#9EC8B9",
    paddingTop: 15,
    paddingBottom: 15,
    paddingLeft: 15,
    paddingRight: 15,
    borderRadius: 20,
    position: "absolute",
    right: 20,
    marginTop: 20,
  },
  addBinText: {
    fontWeight: "400",
  },
  bodyDiv: {
    backgroundColor: "white",
    flex: 1,
    width: "100%",
    marginTop: 30,
    borderTopRightRadius: 35,
    borderTopLeftRadius: 35,
    paddingTop: 65,
  },
  binContainer: {
    borderWidth: 1.5,
    borderColor: "black",
    alignSelf: "center",
    width: "75%",
    marginTop: 20,
    borderRadius: 20,
    padding: 20,
    marginLeft: 50,
  },
  insideBinContainer: {
    marginLeft: 70,
  },
  binNameText: {
    fontSize: 16,
    fontWeight: "500",
  },
  idLabel: {
    fontSize: 14,
    fontWeight: "300",
  },
  labelDataView: {
    marginTop: 10,
  },
  iconDataView: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 2,
  },
  idDataCapacityText: {
    color: "#FF0000",
    fontWeight: "500",
  },
  bigBinView: {
    position: "absolute",
    left: -60,
    top: 40,
  },
  percentageView: {
    position: "absolute",
    top: 70,
    left: 37,
    alignItems: "center",
    justifyContent: "center",
  },
  percentageText: {
    color: "white",
    fontSize: 20,
    fontWeight: "500",
  },
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    width: "80%",
    alignItems: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "gray",
    padding: 10,
    marginBottom: 10,
    width: "100%",
  },
  addButton: {
    backgroundColor: "blue",
    padding: 10,
    borderRadius: 5,
    width: "100%",
    marginBottom: 10,
  },
  cancelButton: {
    backgroundColor: "red",
    padding: 10,
    borderRadius: 5,
    width: "100%",
  },
  buttonText: {
    color: "white",
    textAlign: "center",
  },
});
