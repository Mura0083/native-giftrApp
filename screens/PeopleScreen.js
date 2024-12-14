import { usePeople } from "../contexts/PeopleContext";
import { useEffect } from "react";
import { Platform, Pressable, Text, View, SafeAreaView, FlatList, StyleSheet } from "react-native";
import Swipeable from "react-native-gesture-handler/Swipeable";
import Ionicons from '@expo/vector-icons/Ionicons';

export default function PeopleScreen({ navigation }) {
  const {people, deletePerson} = usePeople();

  useEffect(() => {
    if (Platform.OS === 'ios') {
      navigation.setOptions({
        headerRight: () => (
          <Pressable 
            onPress={() => navigation.navigate('AddPerson')}
            style={styles.headerNav}
          >
            <Text style={styles.headerText}>Add Person</Text>
          </Pressable>
        ),
      });
    }
  }, [navigation]);

  const renderRightActions = (personId) => {
    return(
      <Pressable 
        onPress={() => deletePerson(personId)}
        style={styles.deleteButton}
      >
        <Ionicons name="trash-outline" size={24} color="white"/>
      </Pressable>
    )
  };

  const renderPerson = ({item: person}) => {
    const dob = person.dob;
    const [year,month, day] = dob.split('/');
    const formattedDob = `${month}/${day}`;
    return (
      <Swipeable renderRightActions={() => renderRightActions(person.id)}>
        <View style={styles.personContainer}>
          <View style={styles.textContainer}>
            <Text style={styles.name}>{person.name}</Text>
            <Text style={styles.dob}>{formattedDob}</Text>
          </View>
          <Pressable
            onPress={() =>
              navigation.navigate("Ideas", { personId: person.id })
            }
            style={styles.ideasButton}
          >
            <Ionicons name="bulb-outline" size={24} color="black" />
          </Pressable>
        </View>
      </Swipeable>
    );
  };

  const sortedPeople = [...people].sort((a, b) => {
    const [yearA, monthA, dayA] = a.dob.split('/');
    const [yearB, monthB, dayB] = b.dob.split('/');
    return parseInt(monthA) - parseInt(monthB) || parseInt(dayA) - parseInt(dayB);
  });

  return (
    <SafeAreaView style={styles.container}>
      {sortedPeople.length === 0 ? (
        <Text style={styles.noPeople}>No people saved yet</Text>
      ) : (
        <FlatList
          data={sortedPeople}
          renderItem={renderPerson}
          keyExtractor={(person) => person.id.toString()}
        />
      )}
      {Platform.OS === 'android' && (
        <Pressable 
          onPress={() => navigation.navigate('AddPerson')}
          style={styles.fab}
        >
          <Text style={styles.fabText}>+</Text>
        </Pressable>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  noPeople: {
    fontSize: 20,
    textAlign: 'center',
    marginTop: 20,
    color: 'gray',
  },
  personContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 18,
    borderBottomWidth: 1,
    borderBottomColor: 'lightgray',
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
    marginRight: 10,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  dob: {
    fontSize: 14,
    color: 'gray',
  },
  headerNav: {
    marginRight: 16,
    backgroundColor: 'blue',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 5,
  },
  headerText: {
    color: 'white',
    fontWeight: 'bold',
  },
  ideasButton: {
    backgroundColor: 'lightblue',
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteButton: {
    backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
    width: 100,
    height: '100%',
  },
  fab: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: 'blue',
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fabText: {
    color: 'white',
    fontSize: 30,
    fontWeight: 'bold',
  },
})