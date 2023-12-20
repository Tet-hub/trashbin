import { View, Text, TouchableOpacity, Image, TextInput } from "react-native";
import React, { useState } from "react";
import { themeColors } from "../theme";
import { SafeAreaView } from "react-native-safe-area-context";
import { ArrowLeftIcon } from "react-native-heroicons/solid";
import { useNavigation } from "@react-navigation/native";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../config/firebase";
import { collection, setDoc, doc } from "firebase/firestore";
import { ArrowIcon } from "../components/ArrowIcon";

export default function SignUpScreen() {
  const navigation = useNavigation();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [nameError, setNameError] = useState("");
  const [Emailerror, setEmailError] = useState("");
  const [PasswordError, setPasswordError] = useState("");

  const handleSubmit = async () => {
    setError("");
    setNameError("");
    setEmailError("");
    setPasswordError("");

    if (name.trim() === "") {
      setNameError("Please input your name");
      return;
    }

    if (email.trim() === "") {
      setEmailError("Please input your email");
      return;
    }

    if (!email.trim().includes("@") || !email.trim().includes(".com")) {
      setEmailError("Please enter a valid email address");
      return;
    }

    if (password.trim() === "") {
      setPasswordError("Please input your password");
      return;
    }
    if (password.trim().length < 6) {
      setPasswordError("Password should be at least 6 characters");
      return;
    }

    if (email && password) {
      try {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        const user = userCredential.user;
        const uid = user.uid;

        // Access the 'users' collection
        const usersCollection = collection(db, "users");

        // Add a new document with the user's UID as the document ID
        await setDoc(doc(usersCollection, uid), {
          name: name,
          email: email,
        });
      } catch (err) {
        if (err.code) {
          setError(err.code);
        } else {
          setError("Signup error", error);
          console.log("signup error", err);
        }
      }
    }
  };

  return (
    <View
      className="flex-1 bg-white"
      style={{ backgroundColor: themeColors.bg }}
    >
      <SafeAreaView className="flex">
        <View className="flex-row justify-start bg-[#163020] p-2">
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className="p-2 rounded-tr-2xl rounded-bl-2xl"
          >
            <ArrowIcon />
          </TouchableOpacity>
        </View>
        <View className="flex-row justify-center my-1">
          <Image
            source={require("../assets/images/trashbin_signup-removebg-preview.png")}
            style={{ width: 150, height: 150 }}
          />
        </View>
      </SafeAreaView>
      <View
        className="flex-1 bg-white px-8 pt-3"
        style={{ borderTopLeftRadius: 50, borderTopRightRadius: 50 }}
      >
        <Text className="text-red-700 ml-4 p font-bold text-center">
          {error}
        </Text>
        <View className="form space-y-2">
          <Text className="text-gray-700 ml-1 font-semibold">Name</Text>
          <TextInput
            className="p-4 bg-gray-100 text-gray-700 rounded-2xl"
            value={name}
            onChangeText={(value) => setName(value)}
            placeholder="Enter Name"
          />
          <Text className="text-red-700 p font-bold ml-4">{nameError}</Text>
          <Text className="text-gray-700 ml-1 font-semibold">
            Email Address
          </Text>
          <TextInput
            className="p-4 bg-gray-100 text-gray-700 rounded-2xl"
            value={email}
            onChangeText={(value) => setEmail(value)}
            placeholder="Enter Email"
          />
          <Text className="text-red-700 ml-4 p font-bold">{Emailerror}</Text>
          <Text className="text-gray-700 ml-1 font-semibold">Password</Text>
          <TextInput
            className="p-4 bg-gray-100 text-gray-700 rounded-2xl"
            secureTextEntry
            value={password}
            onChangeText={(value) => setPassword(value)}
            placeholder="Enter Password"
          />
          <Text className="text-red-700 ml-4 p font-bold mb-2">
            {PasswordError}
          </Text>
          <TouchableOpacity
            className="py-3 bg-[#B6C4B6] rounded-xl"
            onPress={handleSubmit}
          >
            <Text className="text-xl font-bold text-center text-gray-700">
              Sign Up
            </Text>
          </TouchableOpacity>
        </View>
        <View className="flex-row justify-center mt-7">
          <Text className="text-gray-500 font-semibold">
            Already have an account?
          </Text>
          <TouchableOpacity onPress={() => navigation.navigate("Login")}>
            <Text className="font-semibold text-[#304D30]"> Login</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
