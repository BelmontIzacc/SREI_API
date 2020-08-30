import dev from './cert/cer-dev';
import service from './cert/cer-firebase';
export const environment = {
    version: "1.0.0",
    desarrollo: {
        credencial: dev,
        serviceAccount: service,
        databaseURL: 'https://srei-dc583.firebaseio.com'
    },
    getCert: (): any => {
        return environment.desarrollo.serviceAccount;
    },
}
