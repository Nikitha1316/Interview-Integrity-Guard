import React, { useCallback } from "react"
import { View, Text, StyleSheet, TouchableOpacity } from "react-native"
import { useFocusEffect } from "@react-navigation/native"

export function HelpScreen({ navigation }: any) {
  useFocusEffect(
    useCallback(() => {
      return () => {
        console.log("Help screen closed") // Debugging logs (can be removed)
      }
    }, [])
  )

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Help Center</Text>
      <Text style={styles.text}>
        Need assistance? Contact support or refer to the user guide.
      </Text>

      {/* Ensure TouchableOpacity has a Text inside it */}
      <TouchableOpacity style={styles.button} onPress={() => navigation.goBack()}>
        <Text style={styles.buttonText}>Go Back</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#A3B1CC",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  text: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
  },
  button: {
    marginTop: 10,
    backgroundColor: "#1A3B6D",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
  },
})

export default HelpScreen