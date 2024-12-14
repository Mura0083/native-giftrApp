import { useRoute, useNavigation } from "@react-navigation/native";
import { usePeople } from "../contexts/PeopleContext";
import { useState, useRef, useEffect } from "react";
import { Camera } from 'expo-camera';
import { Dimensions,View, Text, SafeAreaView, KeyboardAvoidingView, Platform, TextInput, Pressable, StyleSheet } from "react-native";
import Ionicons from '@expo/vector-icons/Ionicons';
import CustomModal from "../components/CustomModal";

export default function AddIdeaScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { personId} = route.params;
  const { addIdea, people } = usePeople();
  const [text, setText] = useState('');
  const [personName, setPersonName] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [modalConfig, setModalConfig] = useState({});

  const [image, setImage] = useState(null);
  const aspectRatio = 2/3;
  const cameraRef = useRef();
  const [cameraPermission, setCameraPermission] = useState(false);
  const [availableSizes, setAvailableSizes] = useState('1200x1800');

  const screenWidth = Dimensions.get('window').width;
  const imageWidth = screenWidth * 0.63;
  const imageHeight = imageWidth * aspectRatio;

  const requestCameraPermission = async () => {
    const { status } = await Camera.requestCameraPermissionsAsync();
    setCameraPermission(status === 'granted');
  };

  const takePicture = async () => {
    if (cameraRef.current) {
      const options = {
        quality: 0.8,
        pictureSize: availableSizes,
        skipProcessing: false,
      };
      const picture = await cameraRef.current.takePictureAsync(options);
      setImage(picture.uri);
    }
  };

  const handleSave = async () => {
    if (!text.trim() || !image) {
      setModalConfig({
        title: 'Validation Error',
        message: 'Please enter both a gift idea and take a picture.',
        buttons: [{ label: 'OK', onPress: () => setModalVisible(false), type: 'errorButton' }],
      });
      setModalVisible(true);
      return;
    }
    try {
      await addIdea(personId, text, image, imageWidth, imageHeight);
      navigation.navigate('Ideas', { personId });
    } catch (error) {
      setModalConfig({
        title: 'Error',
        message: 'Could not save the idea. Please try again.',
        buttons: [{ label: 'OK', onPress: () => setModalVisible(false), type: 'errorButton' }],
      });
      setModalVisible(true);
    }
  };

  const handleCancel = () => {
    navigation.goBack();
  };

  useEffect(() => {
    const person = people.find((person) => person.id === personId);
    setPersonName(person?.name || '');

    const initializeCamera = async () => {
      await requestCameraPermission();
      if (cameraRef.current) {
        const sizes = await Camera.getAvailablePictureSizesAsync();
        console.log("Available sizes:", sizes);
        setAvailableSizes(sizes[1] || "1200x1800");
      }
    };
    initializeCamera();

    return () => {
      if (cameraRef.current) {
        cameraRef.current.stop();
      }
    }
  }, [personId, people]);

  useEffect(() => {
    if (!cameraPermission) {
      setModalConfig({
        title: "Error",
        type: "cameraPermission",
        message: "Camera permission is required to take a picture.",
        buttons: [{ label: "OK", onPress: () => setModalVisible(false), type: "errorButton" }],
      });
      setModalVisible(true);
    }
  }, [cameraPermission]);

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <Text style={styles.title}>Add Gift Idea for {personName} </Text>
        <TextInput 
        style={styles.input}
        value={text}
        onChangeText={setText}
        placeholder="Enter a gift idea"
      />

      <View style={styles.imageContainer}>
        {image ? (
          <Image source={{ uri: image }} style={{ width: imageWidth, height: imageHeight }} />
        ) : (
          <Camera
            ref={cameraRef}
            style={{ width: imageWidth, height: imageHeight }}
            ratio={aspectRatio}
          ></Camera>
        )}
        <Pressable style={styles.cameraButton} onPress={takePicture}>
          <Ionicons name="camera" size={24} color="white" />
        </Pressable>
      </View>

      <View style={styles.buttonContainer}>
        <Pressable style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Save</Text>
        </Pressable>
        <Pressable style={styles.cancelButton} onPress={handleCancel}>
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </Pressable>
      </View>
      </KeyboardAvoidingView>

      <CustomModal
        visible={modalVisible}
        type={modalConfig.type || 'default'}
        message={modalConfig.message || ''}
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
    fontSize: 16,
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  cameraButton: {
    backgroundColor: 'purple',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  saveButton: {
    backgroundColor: 'green',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: 'center',
  },
  saveButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  cancelButton: {
    backgroundColor: 'red',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
})