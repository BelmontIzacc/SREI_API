import * as admin from 'firebase-admin';
import { variable } from '../variables';

export default class CatalogoCM {
    private db = admin.firestore();
    private refTest = this.db.collection(variable['tester']);

    public test = async (test: string) => {
        const res = await this.refTest.get()
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