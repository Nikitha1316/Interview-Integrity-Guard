import React, { useState } from "react";
import { View, Text, TextInput, Button, Alert, Linking } from "react-native";
import { createZoomMeeting } from "../utils/zoomService";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../FirebaseConfig"; // Import Firebase instance

export default function ScheduleMeetingScreen({ navigation }: any) {
  const [candidateName, setCandidateName] = useState("");
  const [candidateEmail, setCandidateEmail] = useState("");
  const [meetingDate, setMeetingDate] = useState("");

  const handleScheduleMeeting = async () => {
    if (!candidateName || !candidateEmail || !meetingDate) {
      Alert.alert("Error", "Please fill in all fields.");
      return;
    }

    try {
      // ✅ Step 1: Save candidate details to Firebase
      await addDoc(collection(db, "candidates"), {
        name: candidateName,
        email: candidateEmail,
        meetingDate,
      });

      console.log("Candidate details saved to Firebase");

      // ✅ Step 2: Create Zoom Meeting
      const meetingData = await createZoomMeeting(candidateEmail);
      if (!meetingData) {
        Alert.alert("Error", "Failed to create Zoom meeting.");
        return;
      }

      console.log("Zoom Meeting Created:", meetingData);

      // ✅ Step 3: Notify user & Open Zoom meeting link
      Alert.alert("Success", "Meeting Scheduled Successfully!");
      Linking.openURL(meetingData.join_url); // Open Zoom meeting link in Zoom app
    } catch (error) {
      console.error("Error scheduling meeting:", error);
      Alert.alert("Error", "Failed to schedule meeting.");
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#121212", padding: 20 }}>
      <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 10, color: "#ffffff" }}>
        Schedule Interview
      </Text>

      <TextInput
        placeholder="Candidate Name"
        placeholderTextColor="#aaaaaa"
        value={candidateName}
        onChangeText={setCandidateName}
        style={{ borderWidth: 1, borderColor: "#444", backgroundColor: "#222", color: "#ffffff", padding: 10, marginBottom: 10, borderRadius: 5 }}
      />

      <TextInput
        placeholder="Candidate Email"
        placeholderTextColor="#aaaaaa"
        value={candidateEmail}
        onChangeText={setCandidateEmail}
        keyboardType="email-address"
        style={{ borderWidth: 1, borderColor: "#444", backgroundColor: "#222", color: "#ffffff", padding: 10, marginBottom: 10, borderRadius: 5 }}
      />

      <TextInput
        placeholder="Meeting Date (YYYY-MM-DD)"
        placeholderTextColor="#aaaaaa"
        value={meetingDate}
        onChangeText={setMeetingDate}
        style={{ borderWidth: 1, borderColor: "#444", backgroundColor: "#222", color: "#ffffff", padding: 10, marginBottom: 10, borderRadius: 5 }}
      />

      <Button title="Schedule Meeting" onPress={handleScheduleMeeting} color="#1E90FF" />
    </View>
  );
}
