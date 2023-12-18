import React, { useState, useEffect } from "react";
import {
  Modal,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { signOut } from "firebase/auth";
import { auth, db } from "../config/firebase";
import { getDatabase, ref, onValue, off } from "firebase/database";
import { getCurrentUserUid } from "../service/getCurrentUserId";
import { collection, query, where, getDocs, addDoc } from "firebase/firestore";

export default function HomeScreen() {
  const [data, setData] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [trashbinId, setTrashbinId] = useState("");
  const [trashbinName, setTrashbinName] = useState("");
  const [trashbinLoc, setTrashbinLoc] = useState("");
  const [trashbinData, setTrashbinData] = useState([]);

  const currentUserUid = getCurrentUserUid();
  console.log("currentUserUid: ", currentUserUid);

  const handleLogout = async () => {
    await signOut(auth);
  };
  //get the trashbinId from firestore
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
          fetchedData.push(trashbinData.trashbinId);
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

  //get the data from realtime database base on the trashbinId from firestore
  useEffect(() => {
    const fetchDataForId = (id) => {
      const dbRealtime = getDatabase();
      const dataRef = ref(dbRealtime, id);

      onValue(dataRef, (snapshot) => {
        const fetchedData = snapshot.val();
        setData((prevData) => ({
          ...prevData,
          [id]: fetchedData,
        }));
      });
    };

    trashbinData.forEach((id) => {
      fetchDataForId(id);
    });

    return () => {
      trashbinData.forEach((id) => {
        const dbRealtime = getDatabase();
        const dataRef = ref(dbRealtime, id);
        off(dataRef);
      });
    };
  }, [trashbinData]);

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

      setIsModalVisible(false);
    } catch (error) {
      console.error("Error adding data: ", error);
    }
  };

  return (
    <SafeAreaView>
      <View className="flex flex-row justify-center items-center">
        <Text className="text-lg">Home Screen - </Text>
        <TouchableOpacity
          onPress={handleLogout}
          className="p-1 bg-red-400 rounded-lg w-[100px] flex items-center justify-center"
        >
          <Text className="text-white text-lg font-bold">Logout</Text>
        </TouchableOpacity>
        {/* Add button to open modal */}
        <TouchableOpacity
          onPress={() => setIsModalVisible(true)}
          className="p-1 bg-blue-400 rounded-lg w-[100px] flex items-center justify-center ml-2"
        >
          <Text className="text-white text-lg font-bold">Add</Text>
        </TouchableOpacity>
      </View>

      {/* Modal */}
      <Modal
        visible={isModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <TextInput
              onChangeText={(text) => setTrashbinId(text)}
              placeholder="Enter trashbin ID"
              style={styles.input}
            />
            <TextInput
              onChangeText={(text) => setTrashbinName(text)}
              placeholder="Enter Trashbin Name"
              style={styles.input}
            />
            <TextInput
              onChangeText={(text) => setTrashbinLoc(text)}
              placeholder="Enter Location"
              style={styles.input}
            />
            <TouchableOpacity onPress={handleAddData} style={styles.addButton}>
              <Text style={styles.buttonText}>Add Bin</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setIsModalVisible(false)}
              style={styles.cancelButton}
            >
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Display fetched data */}
      <View className="flex flex-row justify-center mt-10">
        <Text>Data from Database:</Text>
        <Text>{JSON.stringify(data)}</Text>
      </View>
    </SafeAreaView>
  );
}

// Styles for the modal
const styles = StyleSheet.create({
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
