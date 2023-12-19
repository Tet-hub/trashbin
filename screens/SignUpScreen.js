import { View, Text, TouchableOpacity, Image, TextInput } from "react-native";
import React, { useState } from "react";
import { themeColors } from "../theme";
import { SafeAreaView } from "react-native-safe-area-context";
import { ArrowLeftIcon } from "react-native-heroicons/solid";
import { useNavigation } from "@react-navigation/native";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../config/firebase";

export default function SignUpScreen() {
  const navigation = useNavigation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [Emailerror, setEmailError] = useState("");
  const [PasswordError, setPasswordError] = useState("");

  const handleSubmit = async () => {
    setError("");
    setEmailError("");
    setPasswordError("");

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
        await createUserWithEmailAndPassword(auth, email, password);
      } catch (err) {
        if (err.code === "auth/email-already-in-use") {
          setEmailError("Email is already in use");
        } else {
          setError("Signup error", error);
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
        <View className="flex-row justify-start">
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className="bg-[#91C8E4] p-2 rounded-tr-2xl rounded-bl-2xl ml-4"
          >
            <ArrowLeftIcon size="20" color="black" />
          </TouchableOpacity>
        </View>
        <View className="flex-row justify-center mb-3">
          <Image
            source={require("../assets/images/trashbin_signup-removebg-preview.png")}
            style={{ width: 200, height: 200 }}
          />
        </View>
      </SafeAreaView>
      <View
        className="flex-1 bg-white px-8 pt-8"
        style={{ borderTopLeftRadius: 50, borderTopRightRadius: 50 }}
      >
        <Text className="text-red-700 ml-4 p font-bold text-center mb-2">
          {error}
        </Text>
        <View className="form space-y-2">
          <Text className="text-gray-700 ml-4">Email Address</Text>
          <TextInput
            className="p-4 bg-gray-100 text-gray-700 rounded-2xl mb-2"
            value={email}
            onChangeText={(value) => setEmail(value)}
            placeholder="Enter Email"
          />
          <Text className="text-red-700 ml-4 p font-bold">{Emailerror}</Text>
          <Text className="text-gray-700 ml-4">Password</Text>
          <TextInput
            className="p-4 bg-gray-100 text-gray-700 rounded-2xl mb-2"
            secureTextEntry
            value={password}
            onChangeText={(value) => setPassword(value)}
            placeholder="Enter Password"
          />
          <Text className="text-red-700 ml-4 p font-bold mb-2">
            {PasswordError}
          </Text>
          <TouchableOpacity
            className="py-3 bg-[#91C8E4] rounded-xl"
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
            <Text className="font-semibold text-[#749BC2]"> Login</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
