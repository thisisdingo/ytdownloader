/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useEffect, useRef, useState} from 'react';
import {
  ActivityIndicator,
  Dimensions,
  Image,
  Platform,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import {Colors} from 'react-native/Libraries/NewAppScreen';
import Search from '../components/Search';
import ytdl from 'react-native-ytdl';
import Video from 'react-native-video';
import {Slider} from '@miblanchard/react-native-slider';
import Speed from '../components/Speed';
import {useSafeAreaInsets, SafeAreaView} from 'react-native-safe-area-context';

const back = require('../assets/back.png');
const play = require('../assets/play.png');
const force = require('../assets/force.png');
const pause = require('../assets/pause.png');

const screenDimensions = Dimensions.get('screen');

const App: React.FC = () => {
  // Screen properties
  const [screenWidth, setScreenWidth] = useState(screenDimensions.width);
  const [isPortrait, setIsPortrait] = useState(
    screenDimensions.width < screenDimensions.height,
  );

  // Подписываемся на изменение размеров экрана
  useEffect(() => {
    const subscription = Dimensions.addEventListener(
      'change',
      ({window, screen}) => {
        setScreenWidth(screen.width);
        setIsPortrait(screen.width < screen.height);
      },
    );
    return () => subscription?.remove();
  });

  // Safe area
  const insets = useSafeAreaInsets();

  // Ссылка которую ввел пользователь
  const [youTubeLink, setYouTubeLink] = useState('');

  // Ссылка файла на видео которое нужно воспроизвести
  const [videoUrl, setVideoUrl] = useState<string | null>(null);

  // Плеер
  let playerRef = useRef<Video | null>(null);

  // Позиция для слайдера от 0 до 1
  const [position, setPosition] = useState(0);

  // Текущая секунда
  const [currentTime, setCurrentTime] = useState(0);

  // Длина видео
  const [videoDuration, setVideoDuration] = useState(0);

  // Флаг на скачивание видео
  const [fetchingVideoUrl, setIsFetchingUrl] = useState(false);
  const [downloadingProgress, setDownloadingProgress] = useState(0);

  // Текущая скорость
  const [currentSpeed, setCurrentSpeed] = useState(1);

  // is playing
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (youTubeLink.length == 0 || fetchingVideoUrl) {
      return;
    }

    setIsFetchingUrl(true);
    setVideoUrl(null);
    setVideoDuration(0);
    setCurrentTime(0);
    setIsPlaying(false);
    setPosition(0);

    // Получение ссылки с ютуба
    ytdl.getInfo(youTubeLink).then((info: any) => {
      let acceptFormats = (info.formats as Array<any>)
        .filter(format => {
          if (Platform.OS == 'ios') {
            return (
              format.mimeType.startsWith('video/mp4') &&
              (format.mimeType.includes('av01') ||
                format.mimeType.includes('avc1')) &&
              format.hasAudio &&
              format.hasVideo
            );
          } else {
            return (
              format.mimeType.startsWith('video/mp4') &&
              (format.mimeType.includes('opus') ||
                format.mimeType.includes('vp9') ||
                format.mimeType.includes('mp4a')) &&
              format.hasAudio &&
              format.hasVideo
            );
          }
        })
        // Сортируем для самого низкого качества
        .sort((a, b) => {
          return a.width - b.width;
        });
      if (!acceptFormats.length) {
        return;
      }
      console.log(acceptFormats[0]);
      setIsFetchingUrl(false);
      setVideoUrl(acceptFormats[0].url);
      setVideoDuration(parseInt(acceptFormats[0].approxDurationMs) / 1000);
      setIsPlaying(true);
    });
  }, [youTubeLink]);

  const Back: React.FC = () => {
    return (
      <TouchableOpacity
        onPress={() => {
          playerRef.current?.seek(currentTime - 5);
        }}>
        <Image source={back} style={{height: '100%'}} resizeMode="contain" />
      </TouchableOpacity>
    );
  };

  const PauseOrPlay: React.FC = () => {
    return (
      <TouchableOpacity
        onPress={() => {
          setIsPlaying(!isPlaying);
        }}>
        <Image
          source={isPlaying ? pause : play}
          style={{height: '100%'}}
          resizeMode="contain"
        />
      </TouchableOpacity>
    );
  };

  const Forward: React.FC = () => {
    return (
      <TouchableOpacity
        onPress={() => {
          playerRef.current?.seek(currentTime + 5);
        }}>
        <Image source={force} style={{height: '100%'}} resizeMode="contain" />
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={{backgroundColor: Colors.black}}>
      <StatusBar barStyle={'light-content'} />
      <View
        style={{
          position: 'absolute',
          top: insets.top + 16,
          left: isPortrait ? 16 : screenWidth * 0.2,
          right: isPortrait ? 16 : screenWidth * 0.2,
          zIndex: 10,
        }}>
        <Search didLinkEntered={setYouTubeLink} />
      </View>
      <View
        style={{
          height: '100%',
          paddingTop: 16,
        }}>
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          {!isPortrait && videoUrl != null ? (
            <View
              style={{
                position: 'absolute',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 10,
              }}>
              <View
                style={{
                  backgroundColor: 'rgba(37,37,37,0.82)',
                  height: 48,
                  width: 48,
                  borderRadius: 24,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Back />
              </View>
              <View
                style={{
                  backgroundColor: 'rgba(37,37,37,0.82)',
                  height: 72,
                  width: 72,
                  borderRadius: 36,
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: 8,
                  marginLeft: 48,
                  marginRight: 48,
                }}>
                <PauseOrPlay />
              </View>
              <View
                style={{
                  backgroundColor: 'rgba(37,37,37,0.82)',
                  height: 48,
                  width: 48,
                  borderRadius: 24,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Forward />
              </View>
            </View>
          ) : null}
          {fetchingVideoUrl ? (
            <View>
              <ActivityIndicator />
              <Text style={{color: 'white', marginTop: 8}}>Loading...</Text>
            </View>
          ) : videoUrl != null ? (
            <Video
              rate={currentSpeed}
              paused={!isPlaying}
              source={{
                uri: videoUrl,
              }}
              ref={playerRef}
              resizeMode="cover"
              onProgress={data => {
                setCurrentTime(data.currentTime);
                setPosition(data.currentTime / videoDuration);
              }}
              onLoad={e => {
                console.log(e);
              }}
              onError={e => {
                console.log(e);
              }}
              style={{
                height: 300,
                width: '100%',
              }}
            />
          ) : null}
        </View>

        {videoUrl != null ? (
          <View>
            <View style={{flexDirection: 'row'}}>
              <Text style={{color: 'white', flex: 1, marginLeft: 8}}>
                {(() => {
                  let seconds = Math.round(currentTime);
                  return (
                    (seconds - (seconds %= 60)) / 60 +
                    (9 < seconds ? ':' : ':0') +
                    seconds.toFixed(0)
                  );
                })()}
              </Text>
              <Text style={{color: 'white', marginRight: 8}}>
                {(() => {
                  let seconds = videoDuration;
                  return (
                    (seconds - (seconds %= 60)) / 60 +
                    (9 < seconds ? ':' : ':0') +
                    seconds.toFixed(0)
                  );
                })()}
              </Text>
            </View>
            <Slider
              value={position}
              thumbTintColor="#FF375F"
              minimumTrackTintColor="#FF375F"
              maximumTrackTintColor="#2B2B2E"
              animateTransitions
              onValueChange={values => {
                playerRef.current?.seek(videoDuration * values[0]);
              }}
            />
            {isPortrait ? (
              <View
                style={{
                  height: 80,
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <View
                  style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Speed
                    currentSpeed={currentSpeed}
                    onSpeedRateChanged={setCurrentSpeed}
                  />
                </View>
                <View
                  style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: 47,
                  }}>
                  <Back />
                </View>
                <View
                  style={{
                    height: 60,
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <PauseOrPlay />
                </View>
                <View
                  style={{
                    flex: 1,
                    height: 47,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Forward />
                </View>
              </View>
            ) : null}
          </View>
        ) : null}
      </View>
    </SafeAreaView>
  );
};

export default App;
