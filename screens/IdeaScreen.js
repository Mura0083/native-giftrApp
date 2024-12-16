import { useRoute } from "@react-navigation/native";
import {usePeople} from "../contexts/PeopleContext";
import { useState, useEffect } from "react";
import { View, Image, Text, Pressable, SafeAreaView, FlatList, Platform, StyleSheet, } from "react-native";
import CustomModal from "../components/CustomModal";

export default function IdeaScreen({ navigation }) {
  const route = useRoute();
  const {personId} = route.params;
  const {getIdeas, deleteIdea, people} = usePeople();
  const [ideas, setIdeas] = useState([]);
  const [personName, setPersonName] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [modalConfig, setModalConfig] = useState({});

  useEffect(() => {
    const fetchIdeas = async () => {
      try {
        const ideas = await getIdeas(personId);
        const person = people.find((person) => person.id === personId);
        setPersonName(person?.name || '');
        setIdeas(ideas);
      } catch (error) {
        setModalConfig({
          title: 'Error',
          message: 'Could not load the ideas. Please try again.',
          buttons: [{ label: 'OK', onPress: () => setModalVisible(false), type: 'errorButton' }],
        });
        setModalVisible(true);
      }
    };
    fetchIdeas();

    const unsubscribe = navigation.addListener('beforeRemove', (e) => {
      e.preventDefault();
      navigation.navigate('People');
    });
    return unsubscribe;
  }, [personId, people, navigation]);

  const handleDelete = async (ideaId) => {
    try {
      await deleteIdea(personId, ideaId);
      setIdeas((prevIdeas) => prevIdeas.filter((idea) => idea.id !== ideaId));
    } catch (error) {
      setModalConfig({
        title: 'Error',
        message: 'Could not delete the idea. Please try again.',
        buttons: [{ label: 'OK', onPress: () => setModalVisible(false), type: 'errorButton' }],
      });
      setModalVisible(true);
    }
  };

  const renderIdea = ({item: idea}) => {
    return (
      <View style={styles.ideaContainer}>
        <Image source={{uri: idea.img}} style={styles.image} />
        <Text style={styles.text}>{idea.text}</Text>
        <Pressable onPress={() => handleDelete(idea.id)} style={styles.deleteButton}>
          <Text style={styles.deleteText}>Delete Idea</Text>
        </Pressable>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>{personName}'s Ideas</Text>
      {ideas.length === 0 ? (
        <Text style={styles.noIdeas}>No ideas added yet</Text>
      ) : (
        <FlatList
          data={ideas}
          keyExtractor={(idea) => idea.id.toString()}
          renderItem={renderIdea}
        />
      )}
      {Platform.OS === 'ios' && (
        navigation.setOptions({
          headerRight: () => (
            <Pressable 
              onPress={() => navigation.navigate('AddIdea', {personId})}
              style={styles.headerNav}
            >
              <Text style={styles.headerText}>Add Idea</Text>
            </Pressable>
          ),
        })
      )}
      {Platform.OS === 'android' && (
        <Pressable 
          onPress={() => navigation.navigate('AddIdea', {personId})}
          style={styles.fab}
        >
          <Text style={styles.fabText}>+</Text>
        </Pressable>
      )}

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
    backgroundColor: "white",
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    fontWeight: "bold",
  },
  noIdeas: {
    fontSize: 18,
    textAlign: "center",
    color: "gray",
    marginTop: 20,
  },
  ideaContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 10,
    marginBottom: 20,
    backgroundColor: "#f9f9f9",
    borderRadius: 5,
    elevation: 2,
  },
  image: {
    width: 60,
    height: 90,
    marginBottom: 10,
  },
  text: {
    flex: 1,
    fontSize: 16,
    marginHorizontal: 10,
  },
  deleteButton: {
    backgroundColor: "red",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
    alignItems: "center",
  },
  deleteText: {
    color: "white",
    fontWeight: "bold",
  },
  headerNav: {
    marginRight: 16,
    backgroundColor: "blue",
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  headerText: {
    fontWeight: "bold",
    color: "blue",
  },
  fab: {
    position: "absolute",
    bottom: 20,
    right: 20,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "blue",
    justifyContent: "center",
    alignItems: "center",
  },
  fabText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
  errorButton: {
    backgroundColor: "red",
  },
});