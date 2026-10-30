import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import { getAuth } from "firebase/auth";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../FirebaseConfig";

const ReportsScreen = () => {
  const [reports, setReports] = useState<any[]>([]);

  useEffect(() => {
    const fetchReports = async () => {
      const auth = getAuth();
      const user = auth.currentUser;
      if (user) {
        const q = query(collection(db, "reports"), where("userId", "==", user.uid));
        const querySnapshot = await getDocs(q);
        const reportsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        // Reverse the array to put the latest report first
        setReports(reportsData.reverse());
      }
    };
    fetchReports();
  }, []);

  const renderReport = ({ item }: { item: any }) => (
    <View style={styles.reportCard}>
      <Text style={styles.reportTitle}>Candidate: {item.candidateName}</Text>
      <Text style={styles.reportText}>DOB: {item.dob}</Text>
      <Text style={styles.reportText}>Interview Date: {item.interviewDate}</Text>
      <Text style={styles.reportText}>Interview Time: {item.interviewTime}</Text>
      <Text style={styles.reportSection}>🔍 AI Content Analysis Report:</Text>
      <Text style={styles.reportText}>AI Analysis Result: {JSON.stringify(item.aiAnalysis)}</Text>
      <Text style={styles.reportSection}>📊 Engagement Analysis Report:</Text>
      <Text style={styles.reportText}>Total Frames: {item.totalFrames}</Text>
      <Text style={styles.reportText}>Engaged Frames: {item.engagedFrames}</Text>
      <Text style={styles.reportText}>Engagement Percentage: {item.engagementPercentage.toFixed(2)}%</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Reports</Text>
      <FlatList
        data={reports}
        renderItem={renderReport}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1A1A1A",
    padding: 20,
  },
  title: {
    fontSize: 24,
    color: "white",
    fontWeight: "bold",
    marginBottom: 20,
  },
  listContainer: {
    paddingBottom: 20,
  },
  reportCard: {
    backgroundColor: "#2C3E50",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  reportTitle: {
    fontSize: 18,
    color: "white",
    fontWeight: "bold",
  },
  reportText: {
    fontSize: 16,
    color: "white",
    marginTop: 5,
  },
  reportSection: {
    fontSize: 16,
    color: "#3498DB",
    fontWeight: "bold",
    marginTop: 10,
  },
});

export default ReportsScreen;