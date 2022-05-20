import React, { Component } from 'react';
import { ImageBackground, Text, StyleSheet, View, TextInput, TouchableOpacity, Platform, Alert } from 'react-native';

import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

import backgroundImage from '../../assets/imgs/login.jpg';
import commonStyles from '../commonStyles'
import AuthInput from '../components/AuthInput';

import { server, showError, showSuccess } from '../common';

const initialState = {
    nome: '',
    email: '',
    senha: '',
    confirmaSenha: '',
    genero: '',
    generoPreferencia: '',
    stageNew: false
}

export default class Auth extends Component{

    state = {
        ...initialState
    }

    signinOrSignup = () => {
        if(this.state.stageNew) {
            this.signup();
        }else{
            this.signin();
        }
    }

    signup = async () => {
        try{
            await axios.post(`${server}/usuario`, {
                nome: this.state.nome,
                email: this.state.email,
                senha: this.state.senha,
                genero: this.state.genero,
                generoPreferencia: this.state.generoPreferencia,
            });
            showSuccess('User registered');
            this.setState({...initialState});
        }catch(e){
            showError(e);
        }
    }


    signin = async () => {
        try {
            const res = await axios.post(`${server}/usuario/login`, {
                email: this.state.email,
                senha: this.state.senha
            });
            AsyncStorage.setItem('accessToken', JSON.stringify({token: res.headers.authorization}));
            AsyncStorage.setItem('refreshToken', JSON.stringify({token: res.data.refreshToken }));
            axios.defaults.headers.common['Authorization'] = `bearer ${res.headers.authorization}`;
            const res1 = await axios.get(`${server}/usuario`);
            AsyncStorage.setItem('userData', JSON.stringify(res1.data));
            this.props.navigation.navigate('Question', res1.data);
        }catch(e){
            showError(e);
        }
    }


    render() {

        const validations = [];
        validations.push(this.state.email && this.state.email.includes('@'));
        validations.push(this.state.senha && this.state.senha.length >= 8);
        if(this.state.stageNew){
            validations.push(this.state.nome && this.state.nome.trim().length >= 3);
            validations.push(this.state.senha === this.state.confirmaSenha); 
            validations.push(this.state.genero && this.state.genero == "Male" && this.state.genero == "Female");
            validations.push(this.state.generoPreferencia && this.state.generoPreferencia == "Male" && this.state.generoPreferencia == "Female");
        }
        const validForm = validations.reduce((total, atual) => total && atual);

        return (
            <ImageBackground source={backgroundImage} style={styles.background}>
                <Text style={styles.title}>Dating App</Text>
                <View style={styles.formContainer}>
                    <Text style={styles.subtitle}>{this.state.stageNew ? 'Create your account' : 'Enter your data'}</Text>
                    {this.state.stageNew &&
                        <AuthInput icon='user' placeholder='Name' value={this.state.nome} style={styles.input} onChangeText={nome => this.setState({nome})}></AuthInput>
                    }
                    <AuthInput icon='at' placeholder='E-mail' value={this.state.email} style={styles.input} onChangeText={email => this.setState({email})}></AuthInput>
                    <AuthInput icon='lock' placeholder='Password' value={this.state.senha} style={styles.input} secureTextEntry={true} onChangeText={senha => this.setState({senha})}></AuthInput>
                    {this.state.stageNew &&
                        <AuthInput icon='asterisk' placeholder='Confirm your password' value={this.state.confirmaSenha} style={styles.input} secureTextEntry={true} onChangeText={confirmaSenha => this.setState({confirmaSenha})}/>
                    }
                    {this.state.stageNew &&
                        <AuthInput icon='venus-mars' placeholder='Gender (Male, Female)' value={this.state.genero} style={styles.input} onChangeText={genero => this.setState({genero})}/>
                    }
                    {this.state.stageNew &&
                        <AuthInput icon='venus-mars' placeholder='Preference Gender (Male, Female)' value={this.state.generoPreferencia} style={styles.input} onChangeText={generoPreferencia => this.setState({generoPreferencia})}/>
                    }
                    <TouchableOpacity onPress={this.signinOrSignup} disabled={!validForm}>
                        <View style={[styles.button, validForm ? {} : {backgroundColor: '#aaa'}]}>
                            <Text style={styles.buttonText}>
                                {this.state.stageNew ? 'Register' : 'Login'}
                            </Text>
                        </View>
                    </TouchableOpacity>
                </View>
                <TouchableOpacity style={ {padding: 10} } onPress={() => { this.setState({stageNew: !this.state.stageNew})} }>
                    <Text style={styles.buttonText}>
                        {this.state.stageNew ? 'Already have an account?' : "Don't you have an account yet?"}
                    </Text>
                </TouchableOpacity>
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
    title:{
        fontFamily: commonStyles.fontFamily,
        color: commonStyles.colors.secondary,
        fontSize: 70,
        marginBottom: 10,
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