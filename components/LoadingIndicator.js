import React from "react";
import { SafeAreaView, View, ActivityIndicator } from "react-native";

const LoadingIndicator = () => {
  return (
    <SafeAreaView className="flex-1 flex-row justify-center item-center">
      <View className="flex justify-center item-center">
        <ActivityIndicator size="large" color="#163020" style={`mr-4`} />
      </View>
    </SafeAreaView>
  );
};

export default LoadingIndicator;
