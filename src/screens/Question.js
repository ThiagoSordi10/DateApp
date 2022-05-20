import React, { Component } from 'react';
import { ImageBackground, Text, StyleSheet, View, TextInput, TouchableOpacity, Platform, Alert } from 'react-native';

import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

import backgroundImage from '../../assets/imgs/login.jpg';
import commonStyles from '../commonStyles'
import AuthInput from '../components/AuthInput';

import { server, showError, showSuccess } from '../common';

const initialState = {
    pergunta: '',
    resposta: '',
    num_pergunta: 1
}

export default class Question extends Component{

    state = {
        ...initialState
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


    componentDidMount = async () => {
        this.refresh();
        this.loadQuestion();
    }

    loadQuestion = async () => {
        try {
            const res = await axios.get(`${server}/perguntas/${this.state.num_pergunta}`); 
            this.setState({ pergunta: res.data.pergunta })
        } catch(e) {
            showError(e)
        }
    }

    sendAnswer = async () => {
        this.refresh();
        try {
            const res = await axios.post(`${server}/resposta/`, {
                resposta: this.state.resposta,
                perguntaId: this.state.num_pergunta
            });
            if(this.state.num_pergunta == 3){
                const userDataJson = await AsyncStorage.getItem('userData');
                const userData = JSON.parse(userDataJson);
                this.props.navigation.navigate('Home', userData);
            }else{
                this.setState({ num_pergunta: this.state.num_pergunta+1, resposta: ''});
                this.loadQuestion();
            }
        } catch(e) {
            showError(e)
        }
    }

    render() {

        const validations = [];
        validations.push(this.state.resposta && this.state.resposta.trim().length >= 3);
        const validForm = validations.reduce((total, atual) => total && atual);

        return (
            <ImageBackground source={backgroundImage} style={styles.background}>
                <View style={styles.formContainer}>
                    <Text style={styles.subtitle}>Pergunta #{this.state.num_pergunta}</Text>
                    <Text style={styles.buttonText}>
                                {this.state.pergunta}
                    </Text>
                    <AuthInput icon='share' placeholder="Resposta" value={this.state.resposta} style={styles.input} onChangeText={resposta => this.setState({resposta})}></AuthInput>
                    <TouchableOpacity onPress={this.sendAnswer} disabled={!validForm}>
                        <View style={[styles.button, validForm ? {} : {backgroundColor: '#aaa'}]}>
                            <Text style={styles.buttonText}>
                                Enviar
                            </Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </ImageBackground>
        )
    }
}

const styles = StyleSheet.create({
    background: {
        flex: 1,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center'
    },
    subtitle:{
        fontFamily: commonStyles.fontFamily,
        color: '#fff',
        fontSize: 20,
        textAlign: 'center',
        marginBottom: 10
    },
    input: {
        marginTop: 10,
        backgroundColor: '#fff'
    },
    formContainer: {
        backgroundColor: 'rgba(0,0,0,0.8)',
        padding: 20,
        width: '90%',
    },
    button: {
        backgroundColor: '#080',
        marginTop: 10,
        padding: 10,
        alignItems: 'center',
        borderRadius: 7
    },
    buttonText: {
        fontFamily: commonStyles.fontFamily,
        color: '#fff',
        fontSize: 20
    }
})