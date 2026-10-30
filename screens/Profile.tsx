import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Modal, TextInput, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { getAuth, signOut, updatePassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../FirebaseConfig";

const { width, height } = Dimensions.get("window");

export function Profile({ navigation }: any) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [newPassword, setNewPassword] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      const auth = getAuth();
      const user = auth.currentUser;
      if (user) {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          setUsername(userDoc.data().username);
          setEmail(userDoc.data().email);
          setFullName(userDoc.data().fullName);
        } else {
          console.log("No such document!");
        }
      }
    };

    fetchUserData();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(getAuth());
      navigation.navigate("SignIn");
    } catch (error) {
      console.error("Error logging out: ", error);
    }
  };

  const handleChangePassword = async () => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (user) {
      try {
        await updatePassword(user, newPassword);
        Alert.alert("Success", "Password updated successfully!");
        setModalVisible(false);
        setNewPassword("");
      } catch (error) {
        Alert.alert("Error", (error as any).message);
      }
    }
  };

  return (
    <View style={styles.container}>
      {/* Top Bar with Back Button */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={32} color="white" />
        </TouchableOpacity>
        <Text style={styles.screenTitle}>Profile</Text>
        <TouchableOpacity onPress={() => console.log("Edit Profile")}>
          <Ionicons name="create-outline" size={32} color="white" />
        </TouchableOpacity>
      </View>

      {/* Profile Card */}
      <LinearGradient colors={["#2C3E50", "#34495E"]} style={styles.profileCard}>
        <Ionicons name="person-circle" size={90} color="white" />
        <Text style={styles.profileName}>{fullName}</Text>
        <Text style={styles.profileUsername}>{username}</Text>
        <Text style={styles.profileEmail}>{email}</Text>
      </LinearGradient>

      {/* Action Buttons */}
      <TouchableOpacity style={[styles.actionButton, styles.action1]}>
        <Text style={styles.buttonText}>Edit Profile</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.actionButton, styles.action2]} onPress={() => setModalVisible(true)}>
        <Text style={styles.buttonText}>Change Password</Text>
      </TouchableOpacity>

      {/* Logout Button */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>

      {/* Change Password Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.modalView}>
          <Text style={styles.modalText}>Change Password</Text>
          <TextInput
            style={styles.input}
            placeholder="New Password"
            placeholderTextColor="#B0BEC5"
            secureTextEntry
            value={newPassword}
            onChangeText={setNewPassword}
          />
          <TouchableOpacity style={styles.modalButton} onPress={handleChangePassword}>
            <Text style={styles.buttonText}>Update Password</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.modalButton} onPress={() => setModalVisible(false)}>
            <Text style={styles.buttonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1A1A1A",
    paddingTop: height * 0.05,
    paddingHorizontal: width * 0.05,
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
  profileCard: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: height * 0.03,
    paddingHorizontal: width * 0.08,
    borderRadius: 15,
    width: "90%",
    marginBottom: height * 0.04,
  },
  profileName: {
    color: "white",
    fontSize: width * 0.06,
    fontWeight: "bold",
    marginTop: height * 0.01,
  },
  profileUsername: {
    color: "#D3D3D3",
    fontSize: width * 0.05,
    marginTop: height * 0.005,
  },
  profileEmail: {
    color: "#D3D3D3",
    fontSize: width * 0.04,
    marginTop: height * 0.005,
  },
  actionButton: {
    width: "85%",
    paddingVertical: height * 0.02,
    borderRadius: 15,
    alignItems: "center",
    marginBottom: height * 0.02,
  },
  action1: {
    backgroundColor: "#2980B9",
    borderBottomRightRadius: 40,
  },
  action2: {
    backgroundColor: "#3498DB",
    borderBottomLeftRadius: 40,
  },
  action3: {
    backgroundColor: "#1F618D",
    borderBottomRightRadius: 40,
  },
  buttonText: {
    color: "white",
    fontSize: width * 0.045,
    fontWeight: "bold",
  },
  logoutButton: {
    marginTop: height * 0.04,
    backgroundColor: "#C0392B",
    paddingVertical: height * 0.02,
    width: "85%",
    alignItems: "center",
    borderRadius: 10,
  },
  logoutText: {
    color: "white",
    fontSize: width * 0.045,
    fontWeight: "bold",
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
    fontSize: width * 0.05,
    fontWeight: "bold",
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
  },
  modalButton: {
    backgroundColor: "#2980B9",
    paddingVertical: height * 0.02,
    borderRadius: 15,
    alignItems: "center",
    width: "100%",
    marginTop: height * 0.02,
  },
});

export default Profile;