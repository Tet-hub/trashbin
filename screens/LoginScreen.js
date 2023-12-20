import { View, Text, TouchableOpacity, Image, TextInput } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { ArrowLeftIcon } from "react-native-heroicons/solid";
import { themeColors } from "../theme";
import { useNavigation } from "@react-navigation/native";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../config/firebase";
import { ArrowIcon } from "../components/ArrowIcon";
import LoadingIndicator from "../components/LoadingIndicator";

export default function LoginScreen() {
  const navigation = useNavigation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [Emailerror, setEmailError] = useState("");
  const [PasswordError, setPasswordError] = useState("");
  const [loading, setLoading] = useState(false);

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
      setLoading(true);
      try {
        await signInWithEmailAndPassword(auth, email, password);
      } catch (err) {
        if (err.code) {
          setError(err.code);
        } else {
          setError("Signup error");
          console.log("Signup error:", err.message);
        }
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <View
      className="flex-1 bg-white"
      style={{ backgroundColor: themeColors.bg }}
    >
      {loading ? (
        <LoadingIndicator />
      ) : (
        <>
          <SafeAreaView className="flex ">
            <View className="flex-row justify-start bg-[#163020] p-2">
              <TouchableOpacity
                onPress={() => navigation.goBack()}
                className="p-2 rounded-tr-2xl rounded-bl-2xl"
              >
                <ArrowIcon />
              </TouchableOpacity>
            </View>
            <View className="flex-row justify-center">
              <Image
                source={require("../assets/images/trashbin_login-removebg-preview.png")}
                style={{ width: 200, height: 200 }}
              />
            </View>
          </SafeAreaView>
          <View
            style={{ borderTopLeftRadius: 50, borderTopRightRadius: 50 }}
            className="flex-1 bg-white px-8 pt-8"
          >
            <Text className="text-red-700 ml-4 p font-bold text-center">
              {error}
            </Text>
            <View className="form space-y-2">
              <Text className="text-gray-700 ml-4">Email Address</Text>
              <TextInput
                className="p-4 bg-gray-100 text-gray-700 rounded-2xl"
                placeholder="Enter Email"
                value={email}
                onChangeText={(value) => setEmail(value)}
              />
              <Text className="text-red-700 ml-4 p font-bold">
                {Emailerror}
              </Text>
              <Text className="text-gray-700 ml-4">Password</Text>
              <TextInput
                className="p-4 bg-gray-100 text-gray-700 rounded-2xl mb-2"
                secureTextEntry
                placeholder="Enter Password"
                value={password}
                onChangeText={(value) => setPassword(value)}
              />
              <Text className="text-red-700 ml-4 p font-bold">
                {PasswordError}
              </Text>
              <TouchableOpacity
                className="py-3 bg-[#B6C4B6] rounded-xl"
                onPress={handleSubmit}
              >
                <Text className="text-xl font-bold text-center text-gray-700">
                  Login
                </Text>
              </TouchableOpacity>
            </View>
            <View className="flex-row justify-center mt-7">
              <Text className="text-gray-500 font-semibold">
                Don't have an account?{" "}
              </Text>
              <TouchableOpacity onPress={() => navigation.navigate("SignUp")}>
                <Text className="font-semibold text-[#304D30]"> Sign Up</Text>
              </TouchableOpacity>
            </View>
          </View>
        </>
      )}
    </View>
  );
}
