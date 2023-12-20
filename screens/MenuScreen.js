import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Text,
  View,
  StatusBar,
  Image,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { SafeAreaView } from "react-native-safe-area-context";
import { signOut } from "firebase/auth";
import { auth, db, getAuth } from "../config/firebase";
import {
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  doc,
} from "firebase/firestore";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { getCurrentUserUid } from "../service/getCurrentUserId";

export default function MenuScreen() {
  const userId = getCurrentUserUid();
  console.log("userId: ", userId);

  const [selectedImage, setSelectedImage] = useState(null);
  const storage = getStorage();
  const [error, setError] = useState("");
  const [trashbinData, setTrashbinData] = useState([]);
  const [Name, onChangeText] = useState(`${trashbinData.name}`);
  const [number, onChangeNumber] = useState(`${trashbinData.phoneNumber}`);
  const [Email, onChangeEmail] = useState(`${trashbinData.email}`);
  const [profilePicture, setProfilePicture] = useState(null);

  const updateUserAccount = async () => {
    setError("");

    if (Name.trim() === "") {
      setError("Please input name");
      return;
    }

    try {
      const user = auth.currentUser;
      console.log("user", user);

      // Create a reference to the Users collection
      const usersRef = collection(db, "users");

      // Create a query against the collection
      const q = query(usersRef, where("__name__", "==", userId));

      // Execute the query
      const querySnapshot = await getDocs(q);

      // Check if any documents were returned
      if (!querySnapshot.empty) {
        // Get the first document
        const userDoc = querySnapshot.docs[0];

        // Get a DocumentReference to the document
        const userDocRef = doc(db, "users", userDoc.id);

        // Upload the selected image to Firebase Storage
        if (selectedImage) {
          const fileExtension = selectedImage.split(".").pop();
          const fileName = `${Name}.${fileExtension}`;
          const storageRef = ref(storage, `Profile/${fileName}`);
          const downloadURL = await uploadImage(selectedImage, storageRef);

          // Update the profilePicture field with the download URL
          await updateDoc(userDocRef, {
            profilePicture: downloadURL,
          });
        }

        // Update other user account information
        await updateDoc(userDocRef, {
          name: Name,
          phoneNumber: number,
        });

        alert("Profile updated successfully.");
        // console.log("old Document data:", userDoc.data());
      } else {
        const errorMessage = "UIDs do not match";
        console.log(errorMessage);
        setError(errorMessage);

        console.log("user:", user ? user.uid : "No data");
        console.log("userId:", userId);
      }
    } catch (error) {
      console.error("An error occurred:", error);
      setError("An error occurred while updating user information");
    }
  };

  const uploadImage = async (imageUri, storageRef) => {
    const response = await fetch(imageUri);
    const blob = await response.blob();
    const uploadTask = uploadBytesResumable(storageRef, blob);

    return new Promise((resolve, reject) => {
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          // You can use this to monitor the progress of the upload if you want
        },
        (error) => {
          // Handle unsuccessful uploads
          reject(error);
        },
        () => {
          // Handle successful uploads on complete
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            resolve(downloadURL);
          });
        }
      );
    });
  };

  const openImagePickerAsync = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      alert("Permission to access media library is required!");
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 1,
    });
    if (!result.canceled) {
      if (result.assets && result.assets.length > 0) {
        const selectedAsset = result.assets[0];
        setSelectedImage(selectedAsset.uri);
      } else {
        alert("You did not select any image.");
      }
    } else {
      alert("Image selection was canceled.");
    }
  };

  useEffect(() => {
    (async () => {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        alert("Permission to access media library is required!");
      }
    })();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const trashbinCollection = collection(db, "users");
        const q = query(trashbinCollection, where("__name__", "==", userId));
        const querySnapshot = await getDocs(q);

        const fetchedData = [];
        querySnapshot.forEach((doc) => {
          const trashbinData = doc.data();
          fetchedData.push({
            id: doc.id,
            userId: trashbinData.userId,
            name: trashbinData.name,
            phoneNumber: trashbinData.phoneNumber,
            email: trashbinData.email,
            profilePicture: trashbinData.profilePicture,
          });
        });

        if (fetchedData.length > 0) {
          setTrashbinData(fetchedData);
          setProfilePicture(fetchedData[0].profilePicture);
          // console.log("fecthed data", fetchedData);

          // Update state variables here
          onChangeText(fetchedData[0].name);
          onChangeNumber(fetchedData[0].phoneNumber);
          onChangeEmail(fetchedData[0].email);
        }
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };

    fetchData();
  }, [userId, profilePicture]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.bodyDiv}>
        <View style={{ bottom: 140 }}>
          <TouchableOpacity onPress={openImagePickerAsync}>
            <View className="flex flex-row justify-center align-middle">
              {selectedImage ? (
                <Image
                  source={{ uri: selectedImage }}
                  style={styles.profilePicture}
                />
              ) : profilePicture ? (
                <Image
                  source={{ uri: profilePicture }}
                  style={styles.profilePicture}
                />
              ) : (
                <Image
                  source={require("../assets/images/default-profile-picture.png")}
                  style={styles.profilePicture}
                />
              )}
            </View>
          </TouchableOpacity>
          <Text className="text-red-700 font-bold text-center my-3">
            {error}
          </Text>
          <Text style={styles.Label}>Email Address</Text>
          <TextInput
            style={styles.input}
            value={Email}
            editable={false}
            placeholder="Enter Email"
            className="font-normal text-black"
          />

          <StatusBar backgroundColor="white" barStyle="dark-content" />
          <Text style={styles.Label}>Name</Text>
          <TextInput
            style={styles.input}
            value={Name}
            onChangeText={(value) => onChangeText(value)}
            placeholder="Enter Name"
          />
          <Text style={styles.Label}>Phone Number</Text>
          <TextInput
            style={styles.input}
            value={number}
            onChangeText={(value) => onChangeNumber(value)}
            placeholder="Enter Number"
            keyboardType={Platform.OS === "android" ? "numeric" : "number-pad"}
          />

          <TouchableOpacity
            style={styles.addDiv}
            onPress={updateUserAccount}
            className="justify-center ml-4 mr-5"
          >
            <Text className="font-bold">Update Account</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#304D30",
    flex: 1,
    position: "relative",
  },
  profilePicture: {
    width: 150,
    height: 150,
    borderRadius: 75,
    borderWidth: 4,
    borderColor: "black",
  },
  bodyDiv: {
    backgroundColor: "white",
    flex: 1,
    width: "100%",
    marginTop: 150,
    borderTopRightRadius: 35,
    borderTopLeftRadius: 35,
    paddingTop: 65,
  },
  addDiv: {
    flexDirection: "row",
    backgroundColor: "#B6C4B6",
    paddingTop: 15,
    paddingBottom: 15,
    paddingLeft: 15,
    paddingRight: 15,
    borderRadius: 20,
    marginTop: 20,
  },
  input: {
    margin: 12,
    padding: 10,
    width: 240,
    borderRadius: 10,
    overflow: "hidden",
    backgroundColor: "white",
    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 6,
    width: "90%",
  },
  Label: {
    left: 15,
  },
});
