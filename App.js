import { createStackNavigator } from '@react-navigation/stack';
import { PeopleProvider } from './contexts/PeopleContext';
import { NavigationContainer } from '@react-navigation/native';
import PeopleScreen from './screens/PeopleScreen';
import AddPersonScreen from './screens/AddPersonScreen';
import IdeaScreen from './screens/IdeaScreen';
import AddIdeaScreen from './screens/AddIdeaScreen';


const Stack = createStackNavigator();

export default function App() {
  return (
    <PeopleProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="People">
          <Stack.Screen name="People" component={PeopleScreen} />
          <Stack.Screen name="AddPerson" component={AddPersonScreen} />
          <Stack.Screen name="Ideas" component={IdeaScreen} />
          <Stack.Screen name="AddIdea" component={AddIdeaScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </PeopleProvider>
  );
}
