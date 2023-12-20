import React, { useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { View, TouchableOpacity, Text } from "react-native";
import HomeScreen from "../screens/HomeScreen";
import WelcomeScreen from "../screens/WelcomeScreen";
import LoginScreen from "../screens/LoginScreen";
import SignUpScreen from "../screens/SignUpScreen";
import AddBinScreen from "../screens/AddBinScreen";
import EditBinScreen from "../screens/EditBinScreen";
import NotificationScreen from "../screens/NotificationScreen";
import MenuScreen from "../screens/MenuScreen";
import useAuth from "../hooks/useAuth";
import LoadingIndicator from "../components/LoadingIndicator";
import { auth } from "../config/firebase";
import { signOut } from "firebase/auth";
import { LogoutIcon } from "../components/LogoutIcon";
const Stack = createNativeStackNavigator();

export default function AppNavigation() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [appReady, setAppReady] = useState(false);

  //check the user authentication
  useEffect(() => {
    setLoading(user !== null ? false : false);
  }, [user]);

  useEffect(() => {
    setTimeout(() => {
      setAppReady(true);
    }, 5000);
  }, []);

  if (loading) {
    return <LoadingIndicator />;
  }

  const handleLogout = async () => {
    await signOut(auth);
  };

  return (
    <NavigationContainer>
      {appReady ? (
        <Stack.Navigator>
          {user ? (
            <>
              <Stack.Screen
                name="Home"
                options={{ headerShown: false }}
                component={HomeScreen}
              />
              <Stack.Screen
                name="AddBin"
                options={{
                  headerTitle: () => (
                    <Text className="text-[#EEF0E5] text-xl font-semibold">
                      Add Bin
                    </Text>
                  ),
                  headerStyle: {
                    backgroundColor: "#163020",
                  },
                  headerTintColor: "#EEF0E5",
                }}
                component={AddBinScreen}
              />
              <Stack.Screen
                name="EditBin"
                options={{
                  headerTitle: () => (
                    <Text className="text-[#EEF0E5] text-xl font-semibold">
                      Edit Bin
                    </Text>
                  ),
                  headerStyle: {
                    backgroundColor: "#163020",
                  },
                  headerTintColor: "#EEF0E5",
                }}
                component={EditBinScreen}
              />
              <Stack.Screen
                name="Notification"
                options={{
                  headerTitle: () => <View></View>,
                  headerStyle: {
                    backgroundColor: "#163020",
                  },
                  headerTintColor: "#EEF0E5",
                }}
                component={NotificationScreen}
              />
              <Stack.Screen
                name="Menu"
                options={{
                  headerTitle: () => <View></View>,
                  headerStyle: {
                    backgroundColor: "#163020",
                  },
                  headerTintColor: "#EEF0E5",
                  headerRight: () => (
                    <TouchableOpacity onPress={handleLogout}>
                      <LogoutIcon />
                    </TouchableOpacity>
                  ),
                }}
                component={MenuScreen}
              />
            </>
          ) : (
            <>
              <Stack.Screen
                name="Welcome"
                options={{ headerShown: false }}
                component={WelcomeScreen}
              />
              <Stack.Screen
                name="Login"
                options={{ headerShown: false }}
                component={LoginScreen}
              />
              <Stack.Screen
                name="SignUp"
                options={{ headerShown: false }}
                component={SignUpScreen}
              />
            </>
          )}
        </Stack.Navigator>
      ) : (
        <LoadingIndicator />
      )}
    </NavigationContainer>
  );
}
