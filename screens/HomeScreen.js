import { View, Text, TouchableOpacity } from "react-native";
import React, { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { signOut } from "firebase/auth";
import { auth } from "../config/firebase";
import { getDatabase, ref, onValue, off } from "firebase/database";

export default function HomeScreen() {
  const [data, setData] = useState(null);

  const handleLogout = async () => {
    await signOut(auth);
  };

  //get the data from the realtime database
  useEffect(() => {
    const auth = getDatabase();
    const dataRef = ref(auth, "trashbin");

    const fetchData = () => {
      onValue(dataRef, (snapshot) => {
        const fetchedData = snapshot.val();
        setData(fetchedData);
      });
    };

    fetchData();

    return () => {
      off(dataRef);
    };
  }, []);

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
      </View>
      {/* Display fetched data */}
      <View className="flex flex-row justify-center mt-10">
        <Text>Data from Database:</Text>
        <Text>{JSON.stringify(data)}</Text>
      </View>
    </SafeAreaView>
  );
}
