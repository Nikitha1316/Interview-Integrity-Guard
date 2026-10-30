import React, { useState } from "react";
import { View, Text, TouchableOpacity, TextInput, StyleSheet, Alert, Modal } from "react-native";
import * as DocumentPicker from "expo-document-picker";
import { Ionicons } from "@expo/vector-icons";
import { getAuth } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../FirebaseConfig";

export default function UploadVideoFileScreen({ navigation }: any) {
  const [selectedFile, setSelectedFile] = useState<DocumentPicker.DocumentPickerResult | null>(null);
  const [candidateName, setCandidateName] = useState("");
  const [dob, setDob] = useState("");
  const [interviewDate, setInterviewDate] = useState("");
  const [interviewTime, setInterviewTime] = useState("");
  const [uploading, setUploading] = useState(false);
  const [showDobPicker, setShowDobPicker] = useState(false);
  const [showInterviewDatePicker, setShowInterviewDatePicker] = useState(false);
  const [tempYear, setTempYear] = useState<string>("");
  const [tempMonth, setTempMonth] = useState<string>("");
  const [tempDay, setTempDay] = useState<string>("");

  const pickVideo = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({ type: "video/*" });
      if (result && result.assets && result.assets.length > 0) {
        setSelectedFile(result);
      }
    } catch (error) {
      console.error("Error picking video: ", error);
    }
  };

  const handleSubmit = async () => {
    if (!selectedFile || !selectedFile.assets || !candidateName || !dob || !interviewDate || !interviewTime) {
      Alert.alert("Error", "Please fill all fields and select a video.");
      return;
    }

    setUploading(true);
    const auth = getAuth();
    const user = auth.currentUser;

    try {
      // Upload video to server
      const formData = new FormData();
      const file = selectedFile.assets[0];
      formData.append("file", {
        uri: file.uri,
        name: file.name || "video.mp4",
        type: file.mimeType || "video/mp4",
      } as any);

      const response = await fetch("http://192.168.233.123:8081/upload", {  // Replace with your IP
        method: "POST",
        body: formData,
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (!response.ok) throw new Error("Server error");
      const result = await response.json(); // Safely parse JSON

      // Save to Firestore
      if (user) {
        const reportDoc = doc(db, "reports", `${user.uid}_${Date.now()}`);
        await setDoc(reportDoc, {
          userId: user.uid,
          candidateName,
          dob,
          interviewDate,
          interviewTime,
          aiAnalysis: result.ai_analysis,
          totalFrames: result.total_frames,
          engagedFrames: result.engaged_frames,
          engagementPercentage: result.engagement_percentage,
          transcription: result.transcription,  // Add transcription to Firestore
          timestamp: new Date().toISOString(),
        });

        Alert.alert("Success", "Video analyzed and report saved!");
        navigation.navigate("Reports");
      }
    } catch (error) {
      console.error("Error uploading video: ", error);
      Alert.alert("Error", "Failed to process video.");
    } finally {
      setUploading(false);
    }
  };

  const handleDateConfirm = (isDob: boolean) => {
    if (tempYear && tempMonth && tempDay) {
      const formattedDate = `${tempYear}-${tempMonth.padStart(2, '0')}-${tempDay.padStart(2, '0')}`;
      if (isDob) {
        setDob(formattedDate);
        setShowDobPicker(false);
      } else {
        setInterviewDate(formattedDate);
        setShowInterviewDatePicker(false);
      }
    }
    setTempYear("");
    setTempMonth("");
    setTempDay("");
  };

  const renderDatePicker = (isDob: boolean) => (
    <Modal
      visible={isDob ? showDobPicker : showInterviewDatePicker}
      transparent
      animationType="slide"
    >
      <View style={styles.modalContainer}>
        <View style={styles.datePickerContainer}>
          <Text style={styles.datePickerTitle}>
            {isDob ? "Select Date of Birth" : "Select Interview Date"}
          </Text>
          <View style={styles.dateInputs}>
            <TextInput
              style={styles.dateInput}
              placeholder="YYYY"
              value={tempYear}
              onChangeText={setTempYear}
              keyboardType="numeric"
              maxLength={4}
            />
            <TextInput
              style={styles.dateInput}
              placeholder="MM"
              value={tempMonth}
              onChangeText={setTempMonth}
              keyboardType="numeric"
              maxLength={2}
            />
            <TextInput
              style={styles.dateInput}
              placeholder="DD"
              value={tempDay}
              onChangeText={setTempDay}
              keyboardType="numeric"
              maxLength={2}
            />
          </View>
          <View style={styles.datePickerButtons}>
            <TouchableOpacity
              style={styles.dateButton}
              onPress={() => isDob ? setShowDobPicker(false) : setShowInterviewDatePicker(false)}
            >
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.dateButton}
              onPress={() => handleDateConfirm(isDob)}
            >
              <Text style={styles.buttonText}>Confirm</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Upload Video File</Text>
      <TextInput style={styles.input} placeholder="Enter Candidate Name" value={candidateName} onChangeText={setCandidateName} />
      
      {/* Date of Birth Picker */}
      <TouchableOpacity style={styles.input} onPress={() => setShowDobPicker(true)}>
        <Text style={{ color: dob ? 'white' : 'black' }}>
          {dob || "Date of Birth (YYYY-MM-DD)"}
        </Text>
      </TouchableOpacity>
      {renderDatePicker(true)}

      {/* Interview Date Picker */}
      <TouchableOpacity style={styles.input} onPress={() => setShowInterviewDatePicker(true)}>
        <Text style={{ color: interviewDate ? 'white' : 'black' }}>
          {interviewDate || "Date of Interview (YYYY-MM-DD)"}
        </Text>
      </TouchableOpacity>
      {renderDatePicker(false)}

      <TextInput style={styles.input} placeholder="Time of Interview (HH:MM AM/PM)" value={interviewTime} onChangeText={setInterviewTime} />
      {selectedFile && selectedFile.assets ? (
        <View style={styles.fileInfo}>
          <Ionicons name="document-text-outline" size={24} color="white" />
          <Text style={styles.fileName}>{selectedFile.assets[0]?.name}</Text>
        </View>
      ) : (
        <Text style={styles.placeholderText}>No file selected</Text>
      )}
      <TouchableOpacity style={styles.uploadButton} onPress={pickVideo}>
        <Ionicons name="cloud-upload-outline" size={24} color="white" />
        <Text style={styles.buttonText}>Pick a Video</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit} disabled={uploading}>
        <Ionicons name="checkmark-circle-outline" size={24} color="white" />
        <Text style={styles.buttonText}>{uploading ? "Processing..." : "Submit Details"}</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={24} color="white" />
        <Text style={styles.buttonText}>Back</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1A1A1A",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 20,
    color: "white",
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    width: "100%",
    backgroundColor: "#6495ED",
    color: "white",
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
  },
  placeholderText: {
    color: "gray",
    marginBottom: 20,
  },
  fileInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  fileName: {
    color: "white",
    marginLeft: 10,
  },
  uploadButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#3498DB",
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
  },
  submitButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#27AE60",
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2C3E50",
    padding: 12,
    borderRadius: 8,
  },
  buttonText: {
    color: "white",
    marginLeft: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  datePickerContainer: {
    backgroundColor: "#1A1A1A",
    padding: 20,
    borderRadius: 8,
    width: "80%",
  },
  datePickerTitle: {
    color: "white",
    fontSize: 18,
    marginBottom: 15,
    textAlign: "center",
  },
  dateInputs: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  dateInput: {
    backgroundColor: "#6495ED",
    color: "white",
    padding: 10,
    borderRadius: 4,
    width: "30%",
    textAlign: "center",
  },
  datePickerButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  dateButton: {
    backgroundColor: "#3498DB",
    padding: 10,
    borderRadius: 4,
    width: "45%",
    alignItems: "center",
  },
});