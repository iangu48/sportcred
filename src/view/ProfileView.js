import * as React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  Image,
  TouchableOpacity,
  RefreshControl,
  Dimensions
} from 'react-native';
import {
  LineChart
} from 'react-native-chart-kit'
import {Button} from 'react-native-paper';

import {Colors} from 'react-native/Libraries/NewAppScreen';
import {EditableText} from './../components/index.js';

const ProfileView = (props) => {
  const [promptingPictureChange, setPromptingPictureChange] = React.useState(
    true,
  );
  const [profilePic, setProfilePic] = React.useState({
    uri: props.user.photoURL,
  });
  const [ACS, setACS] = React.useState(0);
  const [ACSHistory, setACSHistory] = React.useState({}); // object with 2 arrays (labels, data)
  const [ACSHistoryFetched, setACSHistoryFetched] = React.useState(false);
  const [refreshing, setRefreshing] = React.useState(false);
  
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setACS(0);
    setRefreshing(false);
    setACSHistoryFetched(false);
  }, []);

  const getACS = () => {
    props.getACSScore().then(score => setACS(score));
  };

  const getACSHistory = () => {
      props.getACSHistory().then(async acsHistory => {
        setACSHistory(acsHistory);
        setACSHistoryFetched(true);
      });
  };

  if (ACS === 0) getACS();
  if (!ACSHistoryFetched) getACSHistory();

  const renderChart = () => {
    console.log('Reached renderChart');
    if (Object.keys(ACSHistory).length === 0) {
      console.log('ACSHistory is undefined');
      return (<></>);
    }
    return (
      <LineChart
          data={ACSHistory}
          width={350} // from react-native
          height={220}
          yAxisInterval={5}
          chartConfig={{
            backgroundColor: "#FF652F",
            backgroundGradientFrom: "#FF652F",
            backgroundGradientTo: "#FF652F",
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            style: {
              borderRadius: 16,
            },
            propsForDots: {
              r: "6",
              strokeWidth: "2",
            }
          }}
          bezier
          style={{
            marginVertical: 8,
            borderRadius: 16,
            paddingTop: 20,
            paddingLeft: 8,
          }}
        />
    );
  }

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView>
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          style={styles.scrollView}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }>
          <View style={styles.introBody}>
            {promptingPictureChange ? (
              <View>
                <TouchableOpacity
                  style={styles.btn}
                  onPress={() => setPromptingPictureChange(false)}>
                  <View style={styles.absoluteView} />
                  <Image source={profilePic.uri ? profilePic : require('./../../assets/defaultProfilePic.jpg')} style={styles.profilePic} />
                </TouchableOpacity>
              </View>
            ) : (
              <View>
                <Button mode='contained' onPress={() =>
                    props.profilePicChange(
                      setProfilePic,
                      setPromptingPictureChange,
                    )
                  }
                  style={styles.changeButton}>Change Profile Picture</Button>
                  <Button mode='contained' onPress={() => setPromptingPictureChange(true)}>Cancel</Button>
              </View>
            )}
            <View style={styles.profileDescription}>
              <Text style={styles.displayNameText}>
                {props.userDoc.profile.displayName}
              </Text>
              <Text style={styles.sectionDescription}>
                <Text style={styles.highlight}>ACS: </Text>
                { ACS }
              </Text>
            </View>
          </View>
          {/*<EditableText textTitle='Status' presetText{props.userDoc.profile.}/>*/}
          <EditableText
            textTitle="About Me"
            presetText={props.userDoc.profile.about}
            setText={props.setAboutMe}
            sendData={() => {}}
            style = {styles.aboutMe}
          />
          <View style={styles.body}>
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>ACS History</Text>
              { renderChart() }
            </View>
          </View>
          <View style={styles.body}>
            <View style={styles.sectionContainer}>
            <Button mode='contained' onPress={() => props.signOut()}>Logout</Button>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  absoluteView: {
    flex: 1,
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    zIndex: 10,
  },
  aboutMe: {
    fontSize: 18,
    fontWeight: '500',
    color: Colors.dark,
  },
  changeButton: {
    marginBottom: 20
  },
  introBody: {
    backgroundColor: Colors.white,
    flexDirection: 'column',
    alignItems: 'center',
    paddingTop: 50
  },
  profilePic: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
    marginTop: 50
  },
  profileDescription: {
    paddingHorizontal: 24,
    marginTop: 32,
    marginBottom: 32,
    alignItems: 'center'
  },
  titleText: {
    fontWeight: '300',
    textAlign: 'center',
    fontSize: 40,
  },
  logo: {
    width: '100%',
    height: 100,
    resizeMode: 'contain',
  },
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
    paddingHorizontal: 24,
    marginTop: 32,
    marginBottom: 32,
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
  displayNameText: {
    marginTop: 8,
    fontSize: 24,
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

export default ProfileView;

