import React, {useContext, useState} from 'react';
import {AuthContext} from '../navigation/AuthNavigator';
import {NavigationContainer} from '@react-navigation/native';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {Loading} from '../view/Buffer';
import {ChallengeUsersView} from '../view/trivia/headtohead/ChallengeAUserView';
import {PendingChallengesView} from '../view/trivia/headtohead/PendingChallengesView';
import {IncomingChallengesView} from '../view/trivia/headtohead/IncomingChallengesView';
import {CompletedChallengesView} from '../view/trivia/headtohead/CompletedChallengesView';
import UserModel from '../model/UserModel';
import TriviaChallengeModel from '../model/TriviaChallengeModel';
import TriviaLandingView from '../view/trivia/TriviaLandingView';
import {Appbar, Button} from 'react-native-paper';
import {View} from 'react-native';
import TriviaModel from '../model/TriviaModel';

const Tab = createMaterialTopTabNavigator();

export const HeadToHeadTabs = ({navigation}) => {
const user = useContext(AuthContext);

  return (
    <>
      <Button onPress={() => navigation.navigate('Trivia')}>Back</Button>
      <Tab.Navigator
        tabBarOptions={{
          labelStyle: {
            fontSize: 12,
            margin: 0,
            padding: 0,
          },
        }}
      >
        <Tab.Screen name={'Challenge Users'} component={ChallengeUsers} />
        <Tab.Screen name={'Pending'} component={PendingChallenges} />
        <Tab.Screen name={'Incoming'} component={IncomingChallenges} />
        <Tab.Screen name={'History'} component={ChallengeResults} />
      </Tab.Navigator>
    </>
  );
};

function ChallengeUsers({navigation, route}) {
  const user = useContext(AuthContext);
  const {routeUserList, routePage} =
    route.params === undefined
      ? {routeUserList: [], routePage: -1}
      : route.params;

  const perPage = 20;
  const [userList, setUserList] = useState(routeUserList);
  const [page, setPage] = useState(routePage);

  function loadMore({distanceFromEnd}) {
    setPage(page + 1);
    UserModel.getRegisteredUsers(page * perPage, perPage).then((snapshot) => {
      const list = userList;
      snapshot.docs.forEach((doc) => {
        // console.log(doc)
        if (doc.id === user.uid) {
          return;
        }
        let lastSeen = doc.data().last_login;
        let text = (Date.now() - lastSeen) / (1000 * 60 * 60 * 24);
        text = Math.round(text * 10) / 10;
        doc.data();
        list.push({
          uid: doc.id,
          displayName: doc.data().profile.displayName,
          lastSeen: text,
        });
      });
      setUserList(list);
      console.log('list', list);
      navigation.navigate('Challenge Users', {
        params: {routeUserList: userList, routePage: page},
      });
    });
  }

  if (page === -1) {
    loadMore({distanceFromEnd: 0});
  }

  function onChallenge(userToChallengeUid) {
    // todo route to play
    navigation.navigate('TriviaStartGameController', {
      mode: 'head',
      userToChallengeUid,
    });
  }

  return ChallengeUsersView({userList, loadMore, onChallenge, page});
  // return TriviaLandingView();
}

function IncomingChallenges({navigation, route}) {
  const user = useContext(AuthContext);

  const {routeChallengeList} =
    route.params === undefined ? {routeChallengeList: []} : route.params;
  const [listState, setListState] = useState(routeChallengeList);
  const [initState, setInitState] = useState(false);

  function load() {
    TriviaChallengeModel.getIncomingChallenges(user.uid).then((doc) => {
      console.log(doc)
      // TriviaChallengeModel.getIncomingChallenges('user1').then((doc) => {
      let list = listState;
      const d = doc.data();
      Object.keys(d).forEach((k) => {
        d[k].id = k;
        list.push(d[k]);
      });
      setListState(list);
      navigation.navigate('Incoming', {
        routeChallengeList: listState,
      });
    });
  }

  if (listState.length === 0 && !initState) {
    load();
    setInitState(true);
  }

  function onChallenge(challengerUid, questions, challengerScore, challengeID) {
    // todo route to play
    navigation.navigate('TriviaStartGameController', {
      mode: 'headIncoming',
      challengerUid,
      questions,
      challengerScore,
      challengeID,
    });
  }

  return IncomingChallengesView({listState, onChallenge});
}

function PendingChallenges({navigation, route}) {
  const user = useContext(AuthContext);

  const {routePendingList} =
    route.params === undefined ? {routePendingList: []} : route.params;
  const [listState, setListState] = useState(routePendingList);
  const [initState, setInitState] = useState(false);

  function load() {
    TriviaChallengeModel.getPendingChallenges(user.uid).then((doc) => {
      let list = listState;
      const d = doc.data();
      Object.keys(d).forEach((k) => {
        d[k].id = k;
        list.push(d[k]);
      });
      setListState(list);
      navigation.navigate('Pending', {routePendingList: listState});
    });
  }

  if (listState.length === 0 && !initState) {
    load();
    setInitState(true);
  }

  return PendingChallengesView({listState});
}

function ChallengeResults({navigation, route}) {
  const user = useContext(AuthContext);

  const {routeList} =
    route.params === undefined ? {routeList: []} : route.params;
  const [listState, setListState] = useState(routeList);
  const [initState, setInitState] = useState(false);

  function load() {
    TriviaModel.getUserHistory(user.uid).then((doc) => {
      // TriviaModel.getUserHistory('user1').then((doc) => {
      let list = listState;
      const d = doc.data();
      Object.keys(d).forEach((k) => {
        d[k].id = k;
        d[k].date =
          Math.round((Date.now() - k) / (1000 * 60 * 60 * 24)) + ' days ago';
        list.push(d[k]);
      });
      setListState(list);
      // console.log(JSON.stringify(list, null, 2))
      navigation.navigate('History', {routeList: listState});
    });
  }

  if (listState.length === 0 && !initState) {
    load();
    setInitState(true);
  }

  return CompletedChallengesView({listState});
}
