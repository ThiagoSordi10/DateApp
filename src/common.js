import { Alert, Platform } from 'react-native'

const server = 'https://datingwebservice.herokuapp.com'

function showError(err) {
    if(err.response && err.response.data) {
        Alert.alert('Ops! There was a problem!', `Message: ${err.response.data.erro}`)
    } else {
        Alert.alert('Ops! There was a problem!', `Message: ${err}`)
    }
}

function showSuccess(msg) {
    Alert.alert('Success!', msg)
}

export { server, showError, showSuccess }