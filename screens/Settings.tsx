import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Dimensions, Alert } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { getAuth } from "firebase/auth";
import { doc, updateDoc, arrayUnion } from "firebase/firestore";
import { db } from "../FirebaseConfig";
import { Ionicons } from "@expo/vector-icons";

const { width, height } = Dimensions.get("window");

export function SettingsScreen({ navigation }: any) {
  const [feedback, setFeedback] = useState("");

  const handleFeedbackSubmit = async () => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      Alert.alert("Error", "You must be signed in to submit feedback.");
      return;
    }

    if (!feedback) {
      Alert.alert("Error", "Please enter your feedback.");
      return;
    }

    try {
      const userDocRef = doc(db, "users", user.uid);
      await updateDoc(userDocRef, {
        feedback: arrayUnion({
          feedback: feedback,
          timestamp: new Date(),
        }),
      });
      Alert.alert("Success", "Thank you for your feedback!");
      setFeedback(""); // Clear the feedback input
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert("Error", error.message);
      } else {
        Alert.alert("Error", "An unknown error occurred.");
      }
    }
  };

  return (
    <LinearGradient colors={["#1A1A1A", "#0F0F0F"]} style={styles.container}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={32} color="white" />
        </TouchableOpacity>
        <Text style={styles.screenTitle}>Settings</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.sectionTitle}>Feedback</Text>
        <TextInput
          style={styles.input}
          placeholder="Write your feedback..."
          placeholderTextColor="#B0BEC5"
          value={feedback}
          onChangeText={setFeedback}
          multiline
        />
        <TouchableOpacity style={styles.button} onPress={handleFeedbackSubmit}>
          <Text style={styles.buttonText}>Submit Feedback</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: width * 0.05,
    alignItems: "center",
  },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    marginBottom: height * 0.03,
  },
  screenTitle: {
    fontSize: width * 0.05,
    fontWeight: "bold",
    color: "white",
  },
  content: {
    width: "100%",
    padding: width * 0.05,
    backgroundColor: "#2C3E50",
    borderRadius: 16,
    alignItems: "center",
  },
  sectionTitle: {
    fontSize: width * 0.045,
    fontWeight: "bold",
    color: "white",
    marginBottom: height * 0.02,
  },
  input: {
    width: "100%",
    backgroundColor: "#1F1F1F",
    color: "white",
    paddingVertical: height * 0.018,
    paddingHorizontal: width * 0.04,
    borderRadius: 10,
    fontSize: width * 0.045,
    marginBottom: height * 0.02,
    borderWidth: 1,
    borderColor: "#34495E",
    textAlignVertical: "top",
    height: height * 0.2,
  },
  button: {
    backgroundColor: "#2980B9",
    paddingVertical: height * 0.02,
    borderRadius: 15,
    alignItems: "center",
    width: "100%",
    marginTop: height * 0.03,
  },
  buttonText: {
    color: "white",
    fontSize: width * 0.045,
    fontWeight: "bold",
  },
});

export default SettingsScreen;