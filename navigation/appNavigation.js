import React, { useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { View } from "react-native";
import HomeScreen from "../screens/HomeScreen";
import WelcomeScreen from "../screens/WelcomeScreen";
import LoginScreen from "../screens/LoginScreen";
import SignUpScreen from "../screens/SignUpScreen";
import AddBinScreen from "../screens/AddBinScreen";
import NotificationScreen from "../screens/NotificationScreen";
import MenuScreen from "../screens/MenuScreen";
import useAuth from "../hooks/useAuth";
import LoadingIndicator from "../components/LoadingIndicator";

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
    }, 2000);
  }, []);

  if (loading) {
    return <LoadingIndicator />;
  }

  return (
    <NavigationContainer>
      {appReady ? (
        <Stack.Navigator>
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
            <Stack.Screen
              name="AddBin"
              options={{
                headerTitle: () => <View></View>,
                headerStyle: {
                  backgroundColor: "#092635",
                },
                headerTintColor: "#9EC8B9",
              }}
              component={AddBinScreen}
            />
            <Stack.Screen
              name="Notification"
              options={{
                headerTitle: () => <View></View>,
                headerStyle: {
                  backgroundColor: "#092635",
                },
                headerTintColor: "#9EC8B9",
              }}
              component={NotificationScreen}
            />
            <Stack.Screen
              name="Menu"
              options={{
                headerTitle: () => <View></View>,
                headerStyle: {
                  backgroundColor: "#092635",
                },
                headerTintColor: "#9EC8B9",
              }}
              component={MenuScreen}
            />
            <Stack.Screen
              name="Home"
              options={{ headerShown: false }}
              component={HomeScreen}
            />
          </>
        </Stack.Navigator>
      ) : (
        <LoadingIndicator />
      )}
    </NavigationContainer>
  );
}
