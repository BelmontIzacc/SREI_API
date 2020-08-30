import * as admin from 'firebase-admin';
// import { variable } from '../variables';

export default class CatalogoCM {
    private db = admin.firestore();

    public test = async (test: string) => {
        const res = await this.db.collection('TEST').get()
            .then(data => {
                if (data.empty) {
                    return 'nada';
                }
                const d = data.docs.map(dato => dato.data());
                return d;
            })
            .catch(err => {
                return err;
            });
        return res;
    }
}