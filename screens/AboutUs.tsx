import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export function AboutUsScreen({ navigation }: any) {
  return (
    <View style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={30} color="white" />
      </TouchableOpacity>

      {/* About Content */}
      <View style={styles.content}>
        <Text style={styles.title}> INTEGRITY GUARD FOR INTERVIEW</Text>
        <Text style={styles.version}>version 1.0.0</Text>
        <Text style={styles.copyright}>©2025 IGI Inc.</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  backButton: {
    position: "absolute",
    top: 40,
    left: 20,
  },
  content: {
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
    marginBottom: 10,
  },
  version: {
    fontSize: 16,
    color: "#AAAAAA",
    marginBottom: 10,
  },
  copyright: {
    fontSize: 14,
    color: "#777777",
  },
});

export default AboutUsScreen;