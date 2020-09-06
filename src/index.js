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
import { Icon } from "./components";
import { Feather } from "@expo/vector-icons";
import { colors, dimensions } from "./styles";
import { LayoutAnimation } from 'react-native';
import { Audio } from 'expo';
import { setParamsOnDidMount, withClassVariableHandlers } from '.utils/enhancers';
import {
  compose,
  hoistStatics,
  withHandlers,
  withState,
  withPropsOnChange, withStateHandlers, lifecycle,
} from 'recompose';
// import * as RecordAudioNavigator from "./navigation/RecordAudioNavigator/";
import * as RecordAudio from "./screens/RecordAudioScreen/";
// import * as LibraryScreen from './screens/LibraryScreen/LibraryScreenView.js';
import s from './screens/LibraryScreen/styles.js';

const HomeScreen = () => {
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text>Test</Text>
    </View>
  );
}

const mapStateToProps = state => ({
  audioItems: audioSelectors.getAllAudioItems(state)
});

const mapDispatchToProps = {
  removeAudio: audioId => actions.removeAudio(audioId)
};

const LibraryScreen = compose(
    connect(mapStateToProps, mapDispatchToProps),
  withClassVariableHandlers({
    playbackInstance: null,
    isSeeking: false,
    shouldPlayAtEndOfSeek: false,
    playingAudio: null,
  }, 'setClassVariable'),
  withStateHandlers({
    position: null,
    duration: null,
    shouldPlay: false,
    isLoading: true,
    isPlaying: false,
    isBuffering: false,
    showPlayer: false,
  }, {
    setState: () => obj => obj,
    setShowPlayer: () => (showPlayer) => {
      LayoutAnimation.easeInEaseOut();
      return ({ showPlayer });
    },
  }),
  withHandlers({
    soundCallback: props => (status) => {
      if (status.didJustFinish) {
        props.playbackInstance().stopAsync();
      } else if (status.isLoaded) {
        const position = props.isSeeking()
          ? props.position
          : status.positionMillis;
        const isPlaying = (props.isSeeking() || status.isBuffering)
          ? props.isPlaying
          : status.isPlaying;
        props.setState({
          position,
          duration: status.durationMillis,
          shouldPlay: status.shouldPlay,
          isPlaying,
          isBuffering: status.isBuffering,
        });
      }
    },
  }),
  withHandlers({
    loadPlaybackInstance: props => async (shouldPlay) => {
      props.setState({ isLoading: true });

      if (props.playbackInstance() !== null) {
        await props.playbackInstance().unloadAsync();
        props.playbackInstance().setOnPlaybackStatusUpdate(null);
        props.setClassVariable({ playbackInstance: null });
      }
      const { sound } = await Audio.Sound.create(
        { uri: props.playingAudio().audioUrl },
        { shouldPlay, position: 0, duration: 1, progressUpdateIntervalMillis: 50 },
        props.soundCallback,
      );

      props.setClassVariable({ playbackInstance: sound });

      props.setState({ isLoading: false });
    },
    onTogglePlaying: props => () => {
      if (props.playbackInstance() !== null) {
        if (props.isPlaying) {
          props.playbackInstance().pauseAsync();
        } else {
          props.playbackInstance().playAsync();
        }
      }
    },
    onPlay: props => () => {
      if (props.playbackInstance() !== null) {
        props.playbackInstance().playAsync();
      }
    },
    onStop: props => () => {
      if (props.playbackInstance() !== null) {
        props.playbackInstance().stopAsync();

        props.setShowPlayer(false);
        props.setClassVariable({ playingAudio: null });
      }
    },
    onStartSliding: props => (position) => {
      if (props.playbackInstance() !== null && !props.isSeeking()) {
        props.setState({ position, isPlaying: false });
        props.setClassVariable({ isSeeking: true, shouldPlayAtEndOfSeek: props.shouldPlay });
        props.playbackInstance().pauseAsync();
      }
    },
    onCompleteSliding: props => async (value) => {
      if (props.playbackInstance() !== null) {
        if (props.shouldPlayAtEndOfSeek) {
          await props.playbackInstance().playFromPositionAsync(value);
        } else {
          await props.playbackInstance().setPositionAsync(value);
        }
        props.setClassVariable({ isSeeking: false });
      }
    },
  }),

  withHandlers({
    playAudio: props => async (audio) => {
      props.setShowPlayer(true);
      props.setClassVariable({ playingAudio: audio });
      await props.loadPlaybackInstance(true);
    },
    stopPlayingAudio: props => () => {
      props.onStop();
    },
    removeAudio: props => (audioId) => {
      props.onStop();
      LayoutAnimation.easeInEaseOut();
      props.removeAudio(audioId);
    }
  }),
  withState('selectedTabIndex', 'changeTab', 0),
  withPropsOnChange(
    ['selectedTabIndex'],
    props => props.navigation.setParams({ selectedTabIndex: props.selectedTabIndex }),
  ),
  setParamsOnDidMount(props => ({
    changeTab: props.changeTab,
  })),
  lifecycle({
    async componentDidMount() {
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
        playsInSilentModeIOS: true,
        shouldDuckAndroid: true,
        interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
      });
    },
  }),

  // selectedTabIndex,
  // audioItems,
  // playingAudio,
  // playAudio,
  // stopPlayingAudio,
  // removeAudio,
  // isPlaying,
  // position,
  // duration,
  // isLoading,
  // onTogglePlaying,
  // onCompleteSliding,
  // onStartSliding,
  // showPlayer
  );



const Index = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="LibraryTab"
        component={ LibraryScreen }
        options={{
          tabBarLabel: "Library",
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
        component={ HomeScreen }
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
