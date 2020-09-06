import { Platform } from 'react-native';

export const APPBAR_HEIGHT = 56;
export const STATUSBAR_HEIGHT = 0;
export const HEADER_HEIGHT = APPBAR_HEIGHT + STATUSBAR_HEIGHT;
export const calendars = {
  sameDay: '[Today]',
  nextDay: '[Tomorrow]',
  nextWeek: 'dddd',
  lastDay: '[Yesterday]',
  lastWeek: '[Last] dddd',
  sameElse: 'MM/DD/YYYY',
};
