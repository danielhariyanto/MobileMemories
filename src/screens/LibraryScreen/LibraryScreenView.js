import React from 'react';
import T from 'prop-types';
import { View } from 'react-native';
import SegmentedControlTab from 'react-native-segmented-control-tab';
import { getParamOr } from '../../utils/navHelpers';
import { globalStyles, headerStyle } from '../../styles';
import { MediaList, AudioPlayer } from '../../components';
import { AudioItem } from './components';
import s from './styles';

const tabs = [
  'Audio'
];

const LibraryScreenView = ({
  selectedTabIndex,
  audioItems,
  playingAudio,
  playAudio,
  stopPlayingAudio,
  removeAudio,
  isPlaying,
  position,
  duration,
  isLoading,
  onTogglePlaying,
  onCompleteSliding,
  onStartSliding,
  showPlayer
}) => (
  <View style={[globalStyles.fillAll, globalStyles.withWhiteBackground]}>
    <View style={s.container}>
      {selectedTabIndex === 0 /* Audio */ && (
        <View style={s.container}>
          <MediaList
            items={audioItems}
            playAudio={playAudio}
            stopPlayingAudio={stopPlayingAudio}
            noItemsTitle="There are no items yet"
            noItemsCaption="Your recorded audio will be appear here"
            ListItem={AudioItem}
            playingAudioId={playingAudio() && playingAudio().id}
            removeAudio={removeAudio}
            needSeparator
          />
          {showPlayer &&
            <AudioPlayer
              title={playingAudio() && playingAudio().title}
              isPlaying={isPlaying}
              position={position}
              duration={duration}
              isLoading={isLoading}
              onTogglePlaying={onTogglePlaying}
              onCompleteSliding={onCompleteSliding}
              onStartSliding={onStartSliding}
            />}
        </View>
      )}
    </View>
  </View>
);

LibraryScreenView.propTypes = {
  selectedTabIndex: T.number,
  audioItems: T.arrayOf(T.object),
  playingAudio: T.func,
  playAudio: T.func,
  stopPlayingAudio: T.func,
  removeAudio: T.func,
  isPlaying: T.bool,
  position: T.number,
  duration: T.number,
  isLoading: T.bool,
  onTogglePlaying: T.func,
  onCompleteSliding: T.func,
  onStartSliding: T.func,
  showPlayer: T.bool
};

LibraryScreenView.navigationOptions = ({ navigation }) => ({
  headerTitle: (
    <SegmentedControlTab
      values={tabs}
      selectedIndex={getParamOr(navigation, 'selectedTabIndex', 0)}
      onTabPress={getParamOr(navigation, 'changeTab', () => {})}
      tabsContainerStyle={s.tabsContainer}
      tabTextStyle={s.tabText}
      activeTabStyle={s.activeTab}
      tabStyle={s.tabStyle}
    />
  ),
  ...headerStyle,
  title: 'Library',
});

export default LibraryScreenView;
