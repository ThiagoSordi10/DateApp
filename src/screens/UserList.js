import React, { Component } from 'react'
import {
    View,
    StyleSheet,
    FlatList,
    TouchableOpacity,
} from 'react-native'

import AsyncStorage from "@react-native-async-storage/async-storage"
import axios from 'axios'
import Icon from 'react-native-vector-icons/FontAwesome'
import 'moment/locale/pt-br'


import { server, showError } from '../common'
import commonStyles from '../commonStyles'
import User from '../components/User'

const initialState = {
    usuarios: []
}

export default class UserList extends Component {
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
        try {
            const res = await axios.get(`${server}/semelhantes`)
            this.setState({ usuarios: res.data })
        } catch(e) {
            showError(e)
        }
    }


    render() {
        return (
            <View style={styles.container}>
                <View style={styles.iconBar}>
                    <TouchableOpacity onPress={() => this.props.navigation.openDrawer()}>
                        <Icon name='bars'
                            size={20} color={commonStyles.colors.primary} />
                    </TouchableOpacity>
                </View>
                <View style={styles.userList}>
                    <FlatList data={this.state.usuarios}
                        keyExtractor={item => `${item.id}`}
                        renderItem={({item}) => <User {...item} />} />
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    userList: {
        flex: 7
    },
    iconBar: {
        flexDirection: 'row',
        marginHorizontal: 20,
        justifyContent: 'space-between',
        marginTop: Platform.OS === 'ios' ? 40 : 10,
        marginBottom: 20
    },
});