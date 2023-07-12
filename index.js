/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './src/pages/App';
import {name as appName} from './app.json';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import { LogBox } from 'react-native';

function root() {
  return (
    <SafeAreaProvider>
      <App />
    </SafeAreaProvider>
  );
}

LogBox.ignoreLogs(['Warning: ...']);
LogBox.ignoreAllLogs();

AppRegistry.registerComponent(appName, () => root);
