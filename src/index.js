import "react-native-gesture-handler";
import * as React from "react";
import { View, Text } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import * as MainAppTabNavigator from "./navigation/MainAppTabNavigator";
import * as LibraryNavigator from "./navigation/LibraryNavigator";
import T from "prop-types";
import { addNavigationHelpers } from "react-navigation";
import { connect } from "react-redux";
import Navigator from "./navigation/Navigator";
import { Icon, RecordAudio, Library } from "./components";
import { Feather } from "@expo/vector-icons";
import { colors, dimensions } from "./styles";
import { LayoutAnimation } from 'react-native';
import { Audio } from 'expo';

const HomeScreen = () => {
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text>Test</Text>
    </View>
  );
}

const Index = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="LibraryTab"
        component={ Library }
        options={{
          tabBarLabel: "Memory Bank",
          tabBarIcon: ({ focused }) => (
            <Icon
              size={28}
              IconSet={Feather}
              iconName={"archive"}
              color={
                focused
                  ? colors.tabNavigator.activeTabIcon
                  : colors.tabNavigator.inactiveTabIcon
              }
            />
          )
        }}
      />
      <Tab.Screen
        name="RecordAudioTab"
        component={ RecordAudio }
        options={{
          tabBarLabel: "Audio Recording",
          tabBarIcon: ({ focused }) => (
            <Icon
              size={28}
              IconSet={Feather}
              iconName={"mic"}
              color={
                focused
                  ? colors.tabNavigator.activeTabIcon
                  : colors.tabNavigator.inactiveTabIcon
              }
            />
          )
        }}
      />
      <Tab.Screen
        name="DataTab"
        component={ HomeScreen }
        options={{
          tabBarLabel: "Data Trends",
          tabBarIcon: ({ focused }) => (
            <Icon
              size={28}
              IconSet={Feather}
              iconName={"activity"}
              color={
                focused
                  ? colors.tabNavigator.activeTabIcon
                  : colors.tabNavigator.inactiveTabIcon
              }
            />
          )
        }}
      />
    </Tab.Navigator>
  );
}

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Mobile Memories" component={ Index } />
      </Stack.Navigator>

      {/*      <Tab.Navigator>
        <Tab.Screen 
          name = "LibraryTab" 
          component = { HomeScreen }
          options = {{
            tabBarLabel: 'Library',
            tabBarIcon: ({ focused }) => (
              <Icon
                size={28}
                IconSet={Feather}
                iconName={'package'}
                color={focused
                  ? colors.tabNavigator.activeTabIcon
                  : colors.tabNavigator.inactiveTabIcon}
              />)
          }}
        />
        <Tab.Screen 
          name = "RecordAudioTab" 
          component = { RecordAudio }
          options = {{
            tabBarLabel: 'Audio Recording',
            tabBarIcon: ({ focused }) => (
              <Icon
                size={28}
                IconSet={Feather}
                iconName={'mic'}
                color={focused
                  ? colors.tabNavigator.activeTabIcon
                  : colors.tabNavigator.inactiveTabIcon}
              />)
          }}
        />
      </Tab.Navigator>*/}
    </NavigationContainer>
  );
}
