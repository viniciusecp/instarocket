import React from 'react';
import {StatusBar} from 'react-native';
import {YellowBox} from 'react-native';

YellowBox.ignoreWarnings(['Unrecognized WebSocket']);

import Routes from './routes';

export default function App() {
  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="#f5f5f5" />
      <Routes />
    </>
  );
}
