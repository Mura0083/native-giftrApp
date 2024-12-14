import { createContext, useEffect, useState, useContext } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Crypto from "expo-crypto";


const PeopleContext = createContext();

export function PeopleProvider({ children }) {
  const [people, setPeople] = useState([]);

  useEffect(() => {
    async function loadPeople() {
      try {
        const storedPeople = await AsyncStorage.getItem('people');
        if (storedPeople) {
          setPeople(JSON.parse(storedPeople));
        } 
      } catch (error) {
        console.log( 'Error loading people from Async Storage:' , error);
      }
    }
    loadPeople();
  }, []);

  useEffect(() => {
    async function savePeople() {
      try {
        await AsyncStorage.setItem('people', JSON.stringify(people));
      } catch (error) {
        console.log('Error saving people to Async Storage:', error);
      }
    }
    savePeople();
  }, [people]);

  const addPerson = async (name, dob) => {
    // const formattedDob = new Date(dob).toISOString();
    const newPerson = {
      id: Crypto.randomUUID(),
      name,
      dob,
      ideas: [],
    };
    setPeople((prevPeople) => [...prevPeople, newPerson]);
  };

  const deletePerson = async (id) => {
    setPeople((prevPeople) => prevPeople.filter((person) => person.id !== id));
  };

  const getIdeas = async (personId) => {
    const person = people.find((person) => person.id === personId);
    return person ? person.ideas : [];
  }

  const addIdea = async (personId, text, img, width, height) => {
    const newIdea = {
      id: Crypto.randomUUID(),
      text,
      img,
      width,
      height,
    };
    setPeople((prevPeople) =>
      prevPeople.map((person) =>
        person.id === personId
          ? { ...person, ideas: [...person.ideas, newIdea] }
          : person
      )
    );
  };

  const deleteIdea = async (personId, ideaId) => {
    setPeople((prevPeople) =>
      prevPeople.map((person) =>
        person.id === personId
          ? {
              ...person,
              ideas: person.ideas.filter((idea) => idea.id !== ideaId),
            }
          : person
      )
    );
  };

  return (
    <PeopleContext.Provider
      value={{ people, addPerson, deletePerson, getIdeas, addIdea, deleteIdea }}
    >
      {children}
    </PeopleContext.Provider>
  );
}

export function usePeople() {
  const context = useContext(PeopleContext);
  if (!context) {
    throw new Error("usePeople must be used within a PeopleProvider");
  }
  return context;
}
