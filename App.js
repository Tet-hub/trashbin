import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";

export default function App() {
  return (
    <View className="flex-1 items-center justify-center bg-white">
      <Text className="text-#[#111111]">
        React Native Basecode with tailwindcss
      </Text>
      <StatusBar style="auto" />
    </View>
  );
}
