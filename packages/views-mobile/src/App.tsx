import React, {useState} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
} from 'react-native';

import {
  Header,
  LearnMoreLinks,
  Colors,
  DebugInstructions,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import {Transports} from '@mcesystems/reflow';
import {
  renderDisplayLayer,
  ReflowDisplayLayerElement,
} from '@mcesystems/reflow-react-display-layer';
import {ThemeType} from '@web-desktop-environment/interfaces/lib/shared/settings';
import * as views from '@views/index';

class ReflowConnectionManager {
  host: string;
  constructor(host: string) {
    this.host = host;
  }
  connect = (port: number, mountPoint?: Element) => {
    const transport = new Transports.WebSocketsTransport<{
      //theme?: ThemeType;
    }>({
      port,
      host: this.host,
    });
    if (mountPoint) {
      renderDisplayLayer({
        element: mountPoint,
        transport,
        views,
        //wrapper: ThemeProvider,
      });
    }
    return {transport, views};
  };
}

export let reflowConnectionManager: ReflowConnectionManager;

export const connectToServer = (host: string, port: number) => {
  reflowConnectionManager = new ReflowConnectionManager(host);

  return reflowConnectionManager.connect(port);
};

declare const global: {HermesInternal: null | {}};

const App = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [host, setHost] = useState('localhost');
  const [port, setPort] = useState(5000);
  return isConnected ? (
    <ReflowDisplayLayerElement {...connectToServer(host, port)} views={views} />
  ) : (
    <View>
      <Text>Login to server</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: Colors.lighter,
  },
  engine: {
    position: 'absolute',
    right: 0,
  },
  body: {
    backgroundColor: Colors.white,
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.black,
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
    color: Colors.dark,
  },
  highlight: {
    fontWeight: '700',
  },
  footer: {
    color: Colors.dark,
    fontSize: 12,
    fontWeight: '600',
    padding: 4,
    paddingRight: 12,
    textAlign: 'right',
  },
});

export default App;
