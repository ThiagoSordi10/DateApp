import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { Component } from 'react';
import axios from 'axios';
import { server, showError } from '../common';
import {
    View,
    ActivityIndicator,
    StyleSheet
} from 'react-native';

export default class AuthOrApp extends Component {

    componentDidMount = async () => {
        const refreshTokenJson = await AsyncStorage.getItem('refreshToken');
        const accessTokenJson = await AsyncStorage.getItem('accessToken');
        let refreshToken = null;
        let accessToken = null;
        try{
            refreshToken = JSON.parse(refreshTokenJson);
            accessToken = JSON.parse(accessTokenJson);
        }catch(e){
            showError(e);
            this.props.navigation.navigate('Auth');
        }

        if(accessToken && refreshToken){
            this.refresh();
            this.props.navigation.navigate('Question');
        }else{
            this.props.navigation.navigate('Auth');
        }
    }

    refresh = async () => {
        const refreshTokenJson = await AsyncStorage.getItem('refreshToken');
        let refreshToken = null;
        try {
            refreshToken = JSON.parse(refreshTokenJson);
            const res = await axios.post(`${server}/usuario/atualiza_token`, {refreshToken: refreshToken.token});
            AsyncStorage.setItem('accessToken', JSON.stringify({token: res.headers.authorization}));
            AsyncStorage.setItem('refreshToken', JSON.stringify({token: res.data.refreshToken }));
            axios.defaults.headers.common['Authorization'] = `bearer ${res.headers.authorization}`;
        }catch(e){
            showError(e);
        }
    }

    render(){
        return (
            <View style={styles.container}>
                <ActivityIndicator size='large'></ActivityIndicator>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#000'
    }
})