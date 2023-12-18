import React, { useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "../screens/HomeScreen";
import WelcomeScreen from "../screens/WelcomeScreen";
import LoginScreen from "../screens/LoginScreen";
import SignUpScreen from "../screens/SignUpScreen";
import useAuth from "../hooks/useAuth";
import LoadingIndicator from "../components/LoadingIndicator";

const Stack = createNativeStackNavigator();

export default function AppNavigation() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [appReady, setAppReady] = useState(false);

  useEffect(() => {
    if (user !== null) {
      setLoading(false);
    } else {
      setLoading(false);
    }
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
          {user ? (
            <Stack.Screen
              name="Home"
              options={{ headerShown: false }}
              component={HomeScreen}
            />
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