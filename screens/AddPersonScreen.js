import { usePeople } from "../contexts/PeopleContext";
import { useState } from "react";
import {
  SafeAreaView,
  KeyboardAvoidingView,
  Text,
  TextInput,
  View,
  Pressable,
  StyleSheet,
  Platform,
} from "react-native";
import DatePicker from 'react-native-modern-datepicker';
import CustomModal from "../components/CustomModal";

export default function AddPersonScreen({ navigation }) {
  const { addPerson } = usePeople();
  const [name, setName] = useState('');
  const [dob, setDob] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [modalConfig, setModalConfig] = useState({});

  const handleSave = async() => {
    if (!name .trim() || !dob.trim()) {
      setModalConfig({
        title: 'Error',
        message: 'Please enter both a name and date of birth.',
        buttons: [{ label: 'OK', onPress: () => setModalVisible(false), type: 'errorButton' }],
      });
      setModalVisible(true);
      return;
    }
    
    try {
      await addPerson(name, dob);
      navigation.goBack();
    } catch (error) {
      setModalConfig({
        title: 'Error',
        message: 'Could not save the person. Please try again.',
        buttons: [{ label: 'OK', onPress: () => setModalVisible(false), type: 'errorButton' }],
      });
      setModalVisible(true);
    }
  };

  const handleCancel = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
        style={styles.formContainer}
      >
        <Text style={styles.label}>Person Name</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
        />
        <Text style={styles.label}>Date of Birth</Text>
        <DatePicker
          mode="calendar"
          onSelectedChange={(date) => setDob(date)}
          options={{
            mainColor: 'purple',
          }}
        />
        <View style={styles.buttonContainer}>
          <Pressable style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.buttonText}>Save</Text>
          </Pressable>
          <Pressable style={styles.cancelButton} onPress={handleCancel}>
            <Text style={styles.buttonText}>Cancel</Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
      <CustomModal 
        visible={modalVisible}
        type={modalConfig.type || 'default'}
        message={modalConfig.message}
        buttons={modalConfig.buttons || []}
        onClose={() => setModalVisible(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 20,
  },
  formContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    fontSize: 16,
    padding: 10,
    borderWidth: 1,
    borderColor: 'lightgray',
    borderRadius: 5,
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  saveButton: {
    backgroundColor: 'purple',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  cancelButton: {
    backgroundColor: 'gray',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
})
