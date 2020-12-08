import React, {useContext, useEffect, useState} from "react";
import {View, FlatList, Text} from 'react-native'
import  {Caption,Button, List, Modal, Portal, ProgressBar, Snackbar, Colors} from "react-native-paper";
import Slider from '@react-native-community/slider';


export const DebateListView = (props) => {
    const [modalVisible, setModalVisible] = useState(false);
    const [sbVisible, setSbVisible] = useState(false);
    const [uid, setUid] = useState('')
    const [questionId, setQuestionId] = useState('')
    const [scale, setScale] = useState(0.5)
    const [response, setResponse] = useState('')

    const showModal = (item) => {
        setResponse(item.response)
        setUid(item.uid)
        setQuestionId(item.qid)
        setModalVisible(true);
    };
    const hideModal = () => setModalVisible(false);
    const containerStyle = {backgroundColor: 'white', padding: 20, alignItems: 'center', justifyContent: 'center'};

    const renderItem = ({item}) => {
        return (
            <List.Item
                title={item.question}
                description={item.response}
                descriptionNumberOfLines={10}
                onPress={() => showModal(item)}
            />
        );
    };

    const setRating = () => {
        props.addRating(uid, props.user.uid, scale, questionId, showSnackbar)
    }

    const showSnackbar = () => {
        setSbVisible(true)
    }

    const hideSnackbar = () => {
        setSbVisible(false)
    }

    const emptyList = () => {
        return <></>;
    };

    function ratingModal() {
        return (
            <>
                <Text> I agree {(scale * 100).toFixed(0)}%</Text>
                <Slider
                    style={{width: 200, height: 40}}
                    minimumValue={0}
                    maximumValue={1}
                    value={scale}
                    step={0.01}
                    onSlidingComplete={setScale}
                    minimumTrackTintColor="#FF6060"
                    maximumTrackTintColor="#000000"
                />
                <Button onPress={() => {
                    setRating();
                    hideModal();
                }
                }>
                    Submit rating
                </Button>
                <Button onPress={hideModal}> Cancel </Button>
            </>
        )
    }

    function viewingModal() {
        const p = props.personal[questionId]
        let c = null
        if (p > 0.7)
            c = Colors.green600
        else if (p > 0.35)
            c = Colors.yellow600
        else
            c = Colors.red600


        return (
            <>
                <Text>{isNaN(p) ? 'You have not received a rating yet.' : 'Your response received a ' + p*100+ '% rating!'}</Text>
                <ProgressBar progress={p} color={c} style={{width: 350, marginVertical: 10}}/>
                <Caption>{response}</Caption>
                <Button onPress={hideModal}> Close </Button>
            </>
        )
    }

    return (
        <View>
            <Portal>
                <Modal visible={modalVisible} onDismiss={hideModal} contentContainerStyle={containerStyle}>
                    {props.user.uid === uid ? viewingModal() : ratingModal()}
                </Modal>
            </Portal>

            <FlatList
                onRefresh={() => props.setFetched(false)}
                refreshing={!props.fetched}
                data={props.list}
                renderItem={renderItem}
                keyExtractor={(item) => item.uid}
                ListEmptyComponent={emptyList}
            />

            <Snackbar
                visible={sbVisible}
                onDismiss={hideSnackbar}
            >
                Rating sent!
            </Snackbar>
        </View>
    )
}