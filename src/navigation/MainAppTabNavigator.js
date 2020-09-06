import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import * as TabBarBottom from './components/TabBarBottom/';
import screens from './screens';
import LibraryNavigator from './LibraryNavigator';
import RecordAudioNavigator from './RecordAudioNavigator';
import { colors, fontSizes } from '../styles';

const Tab = createBottomTabNavigator();

export default function MainAppTabNavigator() {
  return (
    <Tab.Navigator>
      <Tab.Screen 
        name = "LibraryTab" 
        component = { TabBarBottom }
        options = {{
          tabBarLabel: 'Audio Recording',
          tabBarIcon: TabIcon('package')
        }}
      />
      <Tab.Screen 
        name = "RecordAudioTab" 
        component = { RecordAudioNavigator }
        options = {{
          tabBarLabel: 'Audio Recording',
          tabBarIcon: TabIcon('mic')
        }}
      />
    </Tab.Navigator>
  );
}

const tabConfig = {
  initialRouteName: screens.LibraryTab,
  tabBarComponent: TabBarBottom,
  tabBarPosition: 'bottom',
  tabBarOptions: {
    activeTintColor: colors.tabNavigator.activeTabIcon,
    labelStyle: {
      fontSize: fontSizes.smallest,
      fontWeight: '600',
    },
    style: {
      backgroundColor: colors.tabNavigator.background,
      borderTopWidth: 0,
    }
  },
  animationEnabled: false,
  swipeEnabled: false,
};

// const TabRoutes = {
//   [screens.LibraryTab]: {
//     screen: LibraryNavigator,
//     navigationOptions: {
//       title: 'Library',
//       tabBarIcon: TabIcon('package'),
//     },
//   },
//   [screens.RecordAudioTab]: {
//     screen: RecordAudioNavigator,
//     navigationOptions: {
//       title: 'Audio Recording',
//       tabBarIcon: TabIcon('mic'),
//     },
//   },
//   // [screens.ShowDataTab]: {
//   //   screen: ShowDataNavigator,
//   //   navigationOptions: {
//   //     title: 'Data',
//   //     tabBarIcon: TabIcon('data'),
//   //   },
//   // },
// };
