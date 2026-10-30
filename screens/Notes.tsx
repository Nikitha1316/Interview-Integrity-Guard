import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const { width, height } = Dimensions.get("window");

export function NotesScreen({ navigation }: any) {
  const [note, setNote] = useState("");
  const [savedNotes, setSavedNotes] = useState<string[]>([]);

  const handleSaveNote = () => {
    if (note.trim()) {
      setSavedNotes([...savedNotes, note]);
      setNote(""); // Clear the input after saving
    }
  };

  return (
    <View style={styles.container}>
      {/* Top Bar */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
        </TouchableOpacity>
        <Text style={styles.title}>My Notes</Text>
      </View>

      {/* Note Input */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Write your note here..."
          placeholderTextColor="#888"
          value={note}
          onChangeText={setNote}
          multiline
        />
        <TouchableOpacity style={styles.saveButton} onPress={handleSaveNote}>
          <Text style={styles.saveButtonText}>Save</Text>
        </TouchableOpacity>
      </View>

      {/* Saved Notes */}
      <ScrollView contentContainerStyle={styles.notesContainer}>
        {savedNotes.length > 0 ? (
          savedNotes.map((savedNote, index) => (
            <View key={index} style={styles.noteCard}>
              <Text style={styles.noteText}>{savedNote}</Text>
            </View>
          ))
        ) : (
          <Text style={styles.noNotesText}>No notes yet!</Text>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1A1A1A",
    paddingTop: height * 0.05,
    paddingHorizontal: width * 0.05,
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: height * 0.03,
  },
  title: {
    fontSize: width * 0.06,
    fontWeight: "bold",
    color: "white",
    marginLeft: width * 0.03,
  },
  inputContainer: {
    marginBottom: height * 0.03,
  },
  input: {
    backgroundColor: "#2C3E50",
    borderRadius: 10,
    padding: width * 0.04,
    color: "white",
    fontSize: width * 0.045,
    height: height * 0.15,
    textAlignVertical: "top",
  },
  saveButton: {
    backgroundColor: "#3498DB",
    borderRadius: 10,
    paddingVertical: height * 0.015,
    paddingHorizontal: width * 0.05,
    alignSelf: "flex-end",
    marginTop: height * 0.01,
  },
  saveButtonText: {
    color: "white",
    fontSize: width * 0.045,
    fontWeight: "bold",
  },
  notesContainer: {
    paddingBottom: height * 0.05,
  },
  noteCard: {
    backgroundColor: "#34495E",
    borderRadius: 10,
    padding: width * 0.04,
    marginBottom: height * 0.02,
  },
  noteText: {
    color: "white",
    fontSize: width * 0.045,
  },
  noNotesText: {
    color: "#888",
    fontSize: width * 0.045,
    textAlign: "center",
  },
});

export default NotesScreen;