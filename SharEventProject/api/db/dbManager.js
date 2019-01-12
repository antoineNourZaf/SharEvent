const firebase = require("firebase-admin");
const { databaseOptions } = require('../config');

const serviceAccount = require("../sharevent-heig-firebase-adminsdk-dqbhx-343d3d8b9b.json");

class DBManager {
    constructor() {
        firebase.initializeApp({
            credential: firebase.credential.cert(serviceAccount),
            databaseURL: 'https://sharevent-heig.firebaseio.com'
        });
        this.db = firebase.firestore();
        this.pageLength = 1;
    }

    /**
     * return all users
     */
    getUsersList(page) {
        let usersRef = this.db.collection('users');
        if(page !== undefined) {
            console.log("debut " + this.pageLength * page)
            console.log("taille " + this.pageLength)
            usersRef = usersRef.orderBy("idNb")
                .startAt(this.pageLength * page)
                .limit(this.pageLength);
        }
        return this.get(usersRef).then(userList => {
            for (let i = 0; i < userList.length; i++) {
                const {password, ...userCleaned} = userList[i];
                userList[i] = userCleaned;
            }
            return userList;
        });
    }

    getUserById(id) {

    }

    getEventsList(page) {

    }

    getEventById(id) {

    }

    getTagsList(page) {

    }

    getTagById(id) {

    }

    //find({'users', 'event', 'tags'}, {{name: admin},{'chill', 'concert'},{'ch'}}, {{'place'},{'DATE'}})
    //find({'users', 'event'}, {{name: admin},{'chill', 'concert'}}, {{'place'},{'DATE'}})
    //find({'tags'}, {{ 'ch'}}, {alphabet})
    find(collection, infoLookingFor, classification, page) {

    }

    createUser(lastname, firstname, mail, username, password) {

    }

    creatEvent(title, creator, description, place, date) {

    }
    



    get(request) {
        return request.get()
            .then(snapshot => {
                let result = [];
                snapshot.forEach(response => {
                    result.push(response.data())
                });
                return result;
            })
            .catch(err => {
                console.log('Error getting documents', err);
            });
    }
}

/* pour ajouter en db
db.collection(collection).add(documentData)
.then(ref => {
    console.log("Document written with ID: ", ref.id);
});
*/
module.exports = DBManager;