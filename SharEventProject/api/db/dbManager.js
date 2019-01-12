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
    getCollectionList(page, collection, orderBy) {
        let usersRef = this.db.collection(collection);
        if(page !== undefined) {
            usersRef = usersRef.orderBy(orderBy)
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

    getCollectionById(attributName, attributValue, collection) {
        let query = this.db.collection(collection)
            .where(attributName, '==', attributValue);
        return this.get(query).then(item => {
            try {
                item[0][attributValue];
                return item[0];
            } catch (err) {
                throw new Error(collection + " " + attributValue + ' not found');
            }
        });
    }

    getUsers(page) {
        return getCollectionList(page, 'users', "idNb");
    }

    getUserById(username) {
        return getCollectionById("username", username, 'users');
    }

    getEventsList(page) {
        return getCollectionList(page, 'Event', "date");
    }

    getEventById(id) {
        return getCollectionById("idNb", id, 'Event');
    }

    getTagsList() {
        return getCollectionList(undefined, 'tags', "alias");
    }

    getTagById(alias) {
        return getCollectionById("alias", alias, 'tags');
    }

    //find({'users', 'event', 'tags'}, {{name: admin},{'chill', 'concert'},{'ch'}}, {{'place'},{'DATE'}})
    //find({'users', 'event'}, {{name: admin},{'chill', 'concert'}}, {{'place'},{'DATE'}})
    //find({'tags'}, {{ 'ch'}}, {alphabet})
    find(collection, infoLookingFor, classification, page) {

    }

    createUser(lastname, firstname, email, username, password) {
        const userData = {
            lastname: lastname,
            firtname: firstname,
            email: email,
            username: username,
            password: password
        }
        return this.userExist(username).then(exist => {
            if (exist) {
                throw new Error('username already exist in database : ' + username);
            } else {
                return this.getLastidNb('users').then(lastIndex => {
                    userData.idNb = lastIndex + 1;
                    return this.db.collection('users').add(userData)
                        .then(ref => {return ref.id;});
                });
            }
        });
    }

    creatEvent(title, creator, description, place, date) {

    }

    userExist(username) {
        console.log("cherche " + username)
        const query = this.db.collection('users')
            .where('username', '==', username)
            .limit(1);
        return this.get(query).then(user => {
            console.log(user)
            try {
                return user[0].username === username;
            } catch(err) {
                return false
            }
        })
    }

    getLastidNb(collection) {
        let query = this.db.collection(collection)
            .orderBy("idNb", 'desc')
            .limit(1);
        return this.get(query).then(lastElement => {
            return lastElement[0].idNb;
        });
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

module.exports = DBManager;