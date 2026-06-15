import React from 'react';
import { StyleSheet, Text, View, SafeAreaView } from 'react-native';

export default function DescriptionScreen() {
  return (
    <SafeAreaView style={styles.kontejner}>
      <View style={styles.obsah}>
        <Text style={styles.nadpis}>Description of App 📝</Text>
        <Text style={styles.text}>
          Tato mobilní aplikace slouží ke správě každodenních úkolů / eventů. 
          Všechna data se bezpečně ukládají do lokální paměti vašeho telefonu pomocí AsyncStorage.
        </Text>
        <Text style={styles.autor}>Created by @dH</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  kontejner: {
    flex: 1,
    backgroundColor: '#fff',
  },
  obsah: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },
  nadpis: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  text: {
    fontSize: 16,
    textAlign: 'center',
    color: '#555',
    lineHeight: 24,
  },
  autor: {
    marginTop: 40,
    fontSize: 14,
    fontWeight: '600',
    color: '#007AFF',
  },
});
