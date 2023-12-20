import React, { useState, useEffect } from "react";
import {
  ToastAndroid,
  StyleSheet,
  Alert,
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
import {
  collection,
  query,
  where,
  getDocs,
  onSnapshot,
  deleteDoc,
  doc,
} from "firebase/firestore";
import Icon from "react-native-vector-icons/FontAwesome";
import Ionicons from "react-native-vector-icons/Ionicons";
import AntDesign from "react-native-vector-icons/AntDesign";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import Entypo from "react-native-vector-icons/Entypo";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import { useNavigation } from "@react-navigation/native";
import LoadingIndicator from "../components/LoadingIndicator";

export default function HomeScreen() {
  const navigation = useNavigation();
  const [trashbinData, setTrashbinData] = useState([]);
  const currentUserUid = getCurrentUserUid();
  //console.log("currentUserUid: ", currentUserUid);
  const [debouncedTrashbinData, setDebouncedTrashbinData] =
    useState(trashbinData);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const trashbinCollection = collection(db, "trashbin");
    const q = query(trashbinCollection, where("userId", "==", currentUserUid));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const updatedData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTrashbinData(updatedData);
      setDebouncedTrashbinData(updatedData);
      setLoading(false);
    });
    return () => {
      // Unsubscribe from the snapshot listener when the component unmounts
      unsubscribe();
    };
  }, [currentUserUid]);

  useEffect(() => {
    const dbRealtime = getDatabase();
    const unsubscribeCallbacks = trashbinData.map((bin) => {
      const dataRef = ref(
        dbRealtime,
        `trashbin/${bin.trashbinId}/capacityLevel`
      );
      return onValue(dataRef, (snapshot) => {
        const capacityLevel = snapshot.val();

        setDebouncedTrashbinData((prevData) => {
          return prevData.map((prevBin) => {
            if (prevBin.id === bin.id) {
              return {
                ...prevBin,
                capacityLevel: capacityLevel,
              };
            }
            return prevBin;
          });
        });
      });
    });

    return () => {
      unsubscribeCallbacks.forEach((unsubscribe) => unsubscribe());
    };
  }, [trashbinData]);

  const handleTrashIconClick = (binName, binDocId) => {
    Alert.alert(
      "",
      `Are you sure you want to delete ${binName}?`,
      [
        {
          text: "CANCEL",
          style: "cancel",
        },
        {
          text: "DELETE",
          onPress: () => handleDeleteConfirmed(binDocId),
          style: "destructive",
        },
      ],
      { cancelable: true }
    );
  };

  const handleDeleteConfirmed = async (binDocId) => {
    try {
      const trashbinRef = doc(db, "trashbin", binDocId);
      await deleteDoc(trashbinRef);
      ToastAndroid.show("Trashbin deleted successfully!", ToastAndroid.SHORT);
    } catch (error) {
      console.error("Error deleting trashbin:", error);
      ToastAndroid.show("Error deleting trashbin", ToastAndroid.SHORT);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="white" barStyle="dark-content" />
      <View style={styles.topBarView}>
        <View style={styles.topIconView}>
          <Text style={styles.titleText1}>KON</Text>
          <Text style={styles.titleText2}>BIN</Text>
          <Text style={styles.titleText3}>I-</Text>
          <Text style={styles.titleText2}>SEN</Text>
          <Text style={styles.titleText3}>SE</Text>
        </View>
        <View style={styles.topIconView}>
          <TouchableOpacity onPress={() => navigation.navigate("Menu")}>
            <Ionicons name="person-circle-outline" size={30} color="#9EC8B9" />
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
        {loading ? (
          <LoadingIndicator />
        ) : (
          <>
            <ScrollView
              showsVerticalScrollIndicator={false}
              style={{ marginBottom: 20, marginTop: 10 }}
            >
              {debouncedTrashbinData && debouncedTrashbinData.length > 0 ? (
                debouncedTrashbinData.map((binData, index) => (
                  <View key={index} style={styles.binContainer}>
                    <View style={styles.bigBinView}>
                      <FontAwesome5 name="trash" size={135} color="#092635" />
                      <View style={styles.percentageView}>
                        <Text style={styles.percentageText}>100%</Text>
                      </View>
                    </View>
                    <View style={styles.insideBinContainer}>
                      <View style={styles.nameIcons}>
                        <Text style={styles.binNameText}>
                          {binData.trashbinName}
                        </Text>
                        <View style={styles.editDeleteView}>
                          <TouchableOpacity
                            onPress={() =>
                              navigation.navigate("EditBin", {
                                binDocId: binData.id,
                                binId: binData.trashbinId,
                                binName: binData.trashbinName,
                                binLocation: binData.trashbinLocation,
                              })
                            }
                          >
                            <MaterialCommunityIcons
                              name="pencil"
                              size={21}
                              color="#092635"
                              style={{ marginRight: 5 }}
                            />
                          </TouchableOpacity>
                          <TouchableOpacity
                            onPress={() =>
                              handleTrashIconClick(
                                binData.trashbinName,
                                binData.id
                              )
                            }
                          >
                            <MaterialCommunityIcons
                              name="delete"
                              size={23}
                              color="#092635"
                            />
                          </TouchableOpacity>
                        </View>
                      </View>
                      <View style={styles.labelDataView}>
                        <Text style={styles.idLabel}>Bin ID:</Text>
                        <View style={styles.iconDataView}>
                          <MaterialCommunityIcons
                            name="page-layout-sidebar-left"
                            size={20}
                            color="black"
                            style={{ marginRight: 2 }}
                          />
                          <Text style={styles.idData}>
                            {binData.trashbinId}
                          </Text>
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
                ))
              ) : (
                <View className="flex flex-row justify-center align-middle mt-3">
                  <Text className="font-bold text-xl mt-4">No data found</Text>
                </View>
              )}
            </ScrollView>
          </>
        )}
      </View>
    </SafeAreaView>
  );
}

// Styles for the modal
const styles = StyleSheet.create({
  container: {
    backgroundColor: "#EEF0E5",
    flex: 1,
    position: "relative",
  },
  topBarView: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignSelf: "center",
    width: "100%",
    backgroundColor: "#163020",
    padding: 10,
  },
  titleText1: {
    color: "white",
    fontSize: 20,
    marginLeft: 20,
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
    marginRight: 12,
  },
  screenTitleDiv: {
    borderColor: "#000",
    borderWidth: 1,
    width: "85%",
    alignSelf: "center",
    padding: 20,
    marginTop: 30,
  },
  screenTitleText: {
    textAlign: "center",
    fontSize: 18,
    color: "#000",
  },
  addDiv: {
    flexDirection: "row",
    backgroundColor: "#B6C4B6",
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
    borderColor: "#092635",
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
  nameIcons: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  editDeleteView: {
    flexDirection: "row",
    alignItems: "center",
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
  noBinsText: {
    marginVertical: "50%",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "400",
    color: "#8E8E8E",
  },
  buttonText: {
    color: "white",
    textAlign: "center",
  },
  // profilePicture: {
  //   width: 38,
  //   height: 38,
  //   borderRadius: 75,
  //   borderWidth: 4,
  // },
});
