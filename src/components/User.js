import React from 'react'
import {
    View,
    Text,
    StyleSheet,
} from 'react-native'
import Swipeable from 'react-native-gesture-handler/Swipeable'

import 'moment/locale/pt-br'

import commonStyles from '../commonStyles'

export default props => {

    return (
        <Swipeable>
            <View style={styles.container}>
                <View style={styles.checkContainer}>
                    <Text style={styles.name}>{props.nome}</Text>
                    <Text style={styles.gender}>{props.genero}</Text>
                </View>
            </View>
        </Swipeable>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        borderColor: '#AAA',
        borderBottomWidth: 1,
        alignItems: 'center',
        paddingVertical: 10,
        backgroundColor: '#FFF'
    },
    checkContainer: {
        marginLeft: 20,
    },
    name: {
        fontFamily: commonStyles.fontFamily,
        color: commonStyles.colors.mainText,
        fontSize: 15
    },
    gender: {
        fontFamily: commonStyles.fontFamily,
        color: commonStyles.colors.subText,
        fontSize: 12
    },
})