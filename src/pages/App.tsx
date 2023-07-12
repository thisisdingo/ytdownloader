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
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import {Colors} from 'react-native/Libraries/NewAppScreen';
import Search from '../components/Search';
import ytdl from 'react-native-ytdl';
import Video from 'react-native-video';
import RNFS from 'react-native-fs';
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
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadingProgress, setDownloadingProgress] = useState(0)

  // Текущая скорость
  const [currentSpeed, setCurrentSpeed] = useState(1);

  // is playing
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (youTubeLink.length == 0) {
      return;
    }
    // Получение ссылки с ютуба
    ytdl(youTubeLink, {
      quality: 'lowestvideo',
      filter: (format: any) => {
        return format.container === 'mp4';
      },
    }).then((links: any) => {
      const savePath =
        RNFS.DocumentDirectoryPath + `/video-${new Date().getTime()}.mp4`;

      setIsDownloading(true);
      // Скачиваем его в локальный файл
      RNFS.downloadFile({
        fromUrl: links[0].url,
        toFile: savePath,
        background: true,
        cacheable: true,
        begin: (res) => {
          console.log("Response begin ===\n\n");
          console.log(res);
        },
        progress: (progress) => {
          console.log(progress);
          setDownloadingProgress(progress.bytesWritten / progress.contentLength)
        }
      })
        .promise.then(res => {
          // Отображаем
          setVideoUrl(`file:///${savePath}`);
        })
        .finally(() => {
          setIsDownloading(false);
        });
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
          {isDownloading ? (
            <View>
              <ActivityIndicator />
              <Text style={{color: 'white', marginTop: 8}}>Downloading {(downloadingProgress * 100).toFixed(2)}%...</Text>
            </View>
          ) : videoUrl != null ? (
            <Video
              rate={isPlaying ? currentSpeed : 0}
              source={{
                uri: videoUrl,
              }}
              ref={playerRef}
              resizeMode="cover"
              onLoad={data => {
                setVideoDuration(data.duration);
              }}
              onProgress={data => {
                setCurrentTime(data.currentTime);
                setPosition(data.currentTime / data.playableDuration);
              }}
              onLoadStart={() => {
                console.log('Starting load...');
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
              <Text style={{color: 'white', flex: 1}}>
                {(() => {
                  let seconds = currentTime;
                  return (
                    (seconds - (seconds %= 60)) / 60 +
                    (10 < seconds ? ':' : ':0') +
                    seconds.toFixed(0)
                  );
                })()}
              </Text>
              <Text style={{color: 'white'}}>
                {(() => {
                  let seconds = videoDuration;
                  return (
                    (seconds - (seconds %= 60)) / 60 +
                    (10 < seconds ? ':' : ':0') +
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
                  }}>
                  <Back />
                </View>
                <View
                  style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <PauseOrPlay />
                </View>
                <View
                  style={{
                    flex: 1,
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
