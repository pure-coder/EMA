import store from '../store'
import {refreshToken} from "../actions/authenticationActions";

const checkExp = () => {
    const auth = store.getState();
    if (auth.authenticatedUser.isAuthenticated) {
        const init = auth.authenticatedUser.user.iat; // initiated token time
        const expiredTime = auth.authenticatedUser.user.exp; // expiration time against initiated token time

        const refreshPeriod = 300; // period in seconds (refeshes token 5 mins (60*5 = 300) before expiration if still active!)
        const currentTime = Date.now();
        const countDown = ((currentTime - (init* 1000)) / 1000);
        const marker = (expiredTime - init) - refreshPeriod;

        if(countDown > marker){
            store.dispatch(refreshToken());
        }
    }
};

export default checkExp;
