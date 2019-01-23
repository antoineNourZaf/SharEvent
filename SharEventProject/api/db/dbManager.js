const firebase = require("firebase-admin");
const { databaseOptions } = require('../config');

//configuration file of the firestore database
const serviceAccount = require("../sharevent-heig-firebase-adminsdk-dqbhx-343d3d8b9b.json");
// required to manipulate array Fields in the firestore database
const FieldValue = require('firebase-admin').firestore.FieldValue;

// Declaration of private methods
const _createTag = Symbol('createTag');
const _userExist = Symbol('userExist');
const _get = Symbol('get');
const _getCollectionList = Symbol('getCollectionList');
const _getCollectionById = Symbol('getCollectionById');
const _getLastidNb = Symbol('getLastidNb');
const _collectionExist = Symbol('collectionExist');
const _tagExist = Symbol('tagExist');
const _getCollectionReference = Symbol('getCollectionReference');
const _createPlace = Symbol('createPlace');
const _placeExist = Symbol('placeExist');
const _getPlace = Symbol('getPlace');
const _createEventCreated = Symbol('createEventCreated');
const _createTagRelation = Symbol('createTagRelation');
const _createCollectionIndex = Symbol('createCollectionIndex');
const _createNotification = Symbol('createNotification');

let instance;

/**
 *  DBManager is the main acces to the database.
 *  It provide an API to create and get properly items on the firestore database.
 *  It manage also the logic of creation of notifications and
 *  the creation of invertedIndex for the mains Items of the database :
 *      -users
 *      -event combined with tags and place
 *      -tags
 *  This class is a Singleton.
 */
class DBManager {

    /**
     * constructeur initializing the database connection with the credential
     * It also define the fixed length of pages in case of pagination
     */
    constructor() {
        if(instance) {
            return instance;
        }
        instance = this;
        firebase.initializeApp({
            credential: firebase.credential.cert(serviceAccount),
            databaseURL: 'https://sharevent-heig.firebaseio.com'
        });
        this.db = firebase.firestore();
        this.pageLength = 10;
    }

    //////////////////////// Public methods ////////////////////////
    
    /**
     * get all users of the database. with pagination if page parameter is provided
     * @param {optional parameter for the pagination} page 
     */
    getUsers(page) {
        return this[_getCollectionList](page, 'users', "idNb");
    }


    /**
     * get a specific user given his username
     * @param {*} username 
     */
    getUserById(username) {
        return this[_getCollectionById]("username", username, 'users');
    }


    /**
     * get all event of the database. with pagination if page parameter is provided
     * @param {optional parameter for the pagination} page 
     */
    getEventsList(page) {
        return this[_getCollectionList](page, 'event', "date");
    }


    getEventById(id) {
        return this[_getCollectionById]("idNb", id, 'event');
    }

    /**
     * get all tags of the database.
     * no pagination is provided because the application
     * level will need all tags when using this method.
     * (get all tags to runtime tag propositions at user input)
     */
    getTagsList() {
        return this[_getCollectionList](undefined, 'tags', "alias");
    }


    /**
     * get a specific tag given his alias
     * (not currently usefull but we could think of
     * complexify the tags table with more informations that just an alias)
     * @param {*} alias 
     */
    getTagById(alias) {
        return this[_getCollectionById]("alias", alias, 'tags');
    }


    /**
     * get the DocumentReference of a tag given his alias.
     * @param {*} alias 
     */
    getTagId(alias) {
        return this[_getCollectionReference]('tags', alias, "alias");
    }


    /**
     * get the DocumentReference of a user given his username
     * @param {*} username 
     */
    getUserId(username) {
        return this[_getCollectionReference]('users', username, "username");
    }

    /**
     * get the DocumentReference of a event given his idNb
     * @param {*} id 
     */
    getEventId(id) {
        return this[_getCollectionReference]('event', id, "idNb");
    }


    /**
     * get the relevant notifications of a user
     * It means we get the notifications of the users that username follows yet
     * @param {username of the user that we want the notifications} username 
     */
    getNotifications(username) {
        let waitingArray = []
        let notificationsArray = []
        // get the user documentreference
        waitingArray.push(this.getUserId(username).then(userRef => {
            // get all the users that username follows yet
            const query = this.db.collection('followUsers').where('followerUser', '==', userRef)
            return this[_get](query).then(followUsersList => {
                // for each followed user we get their notifications
                followUsersList.forEach(followUserTable => {
                    const query2 = this.db.collection('notifications').where('owner', '==', followUserTable.followedUser)
                    notificationsArray.push(this[_get](query2).then(notificationList => {
                        return notificationList;
                    }))
                })
            })
        }))
        // we wait for all promises resolves
        return Promise.all(waitingArray).then(() => {
            return Promise.all(notificationsArray).then(result => {
                return result;
            })
        })
    }


    /**
     * update the database properly when a user follows an event
     * It means:
     *  -create the link between the user and the followed event
     *  -create the notification that username followed the event
     * @param {username of the user that follows the event} username 
     * @param {idNb of the event that will be followed} eventIdNumber 
     */
    followEvent(username, eventIdNumber) {
        // get the user DocumentReference
        return this.getUserId(username).then(userRef => {
            // get the event DocumentReference
            return this.getEventId(eventIdNumber).then(eventRef => {
                // create the followEvent link table entry
                const followEventTable = {
                    followedEvent: eventRef,
                    followerUser: userRef
                }
                return this.db.collection('followEvent').add(followEventTable)
                    .then(ref => {
                        // create the notification
                        this[_createNotification](userRef, 1, eventRef)
                        return ref;
                    });
            });
        });
    }


    /**
     * update the database properly when a user follows an other user
     * It means:
     *  -create the link between the user and the followed user
     *  -create the notification that username followed usernameToFollow
     * @param {username of the user that follows the user} username 
     * @param {username of the user that will be followed} usernameToFollow 
     */

    followUser(username, usernameToFollow) {
        // get the follower user DocumentReference
        return this.getUserId(username).then(followerUserRef => {
            // get the followed user documentReference
            return this.getUserId(usernameToFollow).then(followedUserRef => {
                //create the folowUsers link table
                const followUsersTable = {
                    followedUser: followedUserRef,
                    followerUser: followerUserRef
                }
                return this.db.collection('followUsers').add(followUsersTable)
                    .then(ref => {
                        //create the notification
                        this[_createNotification](followerUserRef, 2, followedUserRef)
                        return ref;
                    });
            });
        });
    }


    /**
     * method allowing to search by word the mains items of the database:
     *  -users
     *  -event
     *  -tags
     * To be able to find effectively we use inverted index tables
     * @param {array of the collection we wish to search in} collections 
     * @param {array of words we are looking for} words 
     */
    find(collections, words) {
        let waitingArray = []
        let resultArray = []
        let dictionnary = {}
        collections.forEach(collection =>{
            words.forEach(word =>{
                // look in the inverted index of the concerned collection if we find the word
                var docRef = this.db.collection(collection.toLowerCase() + "Index").doc(word)
                waitingArray.push(docRef.get().then(result => {
                    let collectionResultArray = []
                    if (result.exists) {
                        result.data().listRef.forEach(ref => {
                            collectionResultArray.push(this.db.collection(collection).doc(ref.id).get().then(resultItem => {
                                return resultItem.data();
                            }))
                        })
                    }
                    // classify the results in a dictionnary
                    resultArray.push(Promise.all(collectionResultArray).then(finalResult => {
                        if (finalResult.length > 0){
                            if(!(collection in dictionnary)) {
                                dictionnary[collection] = [];
                            }
                            dictionnary[collection].push(finalResult);
                        }
                    }))
                }))
            })
        })
        // wait for all promises to finish
        return Promise.all(waitingArray).then(() => {
            return Promise.all(resultArray).then(() => {
                return dictionnary
            })
        })
    }


    /**
     * method allowing to create a user properly in the database
     * throw an Error if the username already exist in the database
     * add all words of the String fields of the user (except the password) to the usersIndex table
     * @param {*} lastname 
     * @param {*} firstname 
     * @param {*} email 
     * @param {*} username 
     * @param {*} password 
     */
    createUser(lastname, firstname, email, username, password) {
        const userData = {
            lastname: lastname,
            firtname: firstname,
            email: email,
            username: username,
            password: password
        }
        return this[_userExist](username).then(exist => {
            if (exist) {
                throw new Error('username already exist in database : ' + username);
            } else {
                return this[_getLastidNb]('users').then(lastIndex => {
                    userData.idNb = lastIndex + 1;
                    const {password, ...cleanedUser} = userData;
                    return this[_createCollectionIndex](userData, cleanedUser, 'users');
                });
            }
        });
    }


    /**
     * allow to create properly an event in the database
     * It means:
     *  -create the event
     *  -create the place where he is related to (with duplication check)
     *  -create the tags (with duplication check)
     *  -link all those element together
     *  -link the event to his creator
     *  -create the notification for the creator
     * @param {*} title 
     * @param {*} creator 
     * @param {*} description 
     * @param {*} numberPlace 
     * @param {*} streetPlace 
     * @param {*} postalCodePlace 
     * @param {*} cityPlace 
     */
    createEvent(title, creator, description, numberPlace, streetPlace, postalCodePlace, cityPlace) {
        //parse les tags de la description
        let tagsList = description.split('#').map(item => {
            return item.trim();
        });
        const descriptionTrimmed = tagsList[0]
        tagsList = tagsList.slice(1);
        const date = firebase.firestore.Timestamp.now();

        //récupérer référence du créateur (erreur s'il n'existe pas)
        let refCreator = this.getUserId(creator).then(ref => {
            return ref;
        });


        ///récupérer référence de la place (la créér si nécessaire)
        const place = {
            city: cityPlace,
            number: numberPlace,
            postalCode: postalCodePlace,
            street: streetPlace
        }
        let refPlace;

        this[_placeExist](place).then(found => {
            if (found) {
                refPlace = this[_getPlace](place).then(ref => {
                    return ref;
                });
            } else {
                refPlace = this[_createPlace](place).then(ref => {
                    return ref;
                });
            }
        })

        //créer tags qui n'existe pas et récupérer tous les id
        let tagListPromises = []
        let checkIfExistPromises = []

        tagsList.forEach(alias => {
            checkIfExistPromises.push(this[_tagExist](alias).then(found => {
                if (!found) {
                    tagListPromises.push(this[_createTag](alias).then(ref => {
                        return ref;
                    }));
                } else {
                    tagListPromises.push(this.getTagId(alias).then(ref => {
                        return ref;
                    }));
                }
            }))
        })

        //attend de récupérer toutes les références de tag
        Promise.all(checkIfExistPromises).then(() => {
            Promise.all(tagListPromises).then(referencesTag => {
                //attend de récupérer la référence du lieu
                refPlace.then(referencePlace => {
                    //attend de récupérer la référence du createur
                    refCreator.then(referenceCreator => {
                        //créé l'événement
                        this[_getLastidNb]('event').then(number => {
                            const event = {
                                creator: referenceCreator,
                                date: (new Date()),
                                descrption: descriptionTrimmed,
                                idNb: (number + 1),
                                placeRef: referencePlace[0],
                                tagsList: referencesTag,
                                title: title
                            }
                            let cleanedEvent = event
                            cleanedEvent.description = description
                            cleanedEvent.streetPlace = streetPlace
                            cleanedEvent.city = cityPlace
                            return this[_createCollectionIndex](event, cleanedEvent, 'event')
                                .then(eventReference => {
                                    //créé la notification de création d'événement
                                    this[_createNotification](referenceCreator, 0, eventReference)
                                    // crée la createdEvent pour lier créateur et événement
                                    this[_createEventCreated](referenceCreator, eventReference);
                                    referencesTag.forEach(referenceTag => {
                                        this[_createTagRelation](referenceTag, eventReference);
                                    });
                                });
                        })
                    });
                });
            });
        }).catch(err => console.log(err));
    }

    //////////////////////// Private Methods ////////////////////////

    //0 créeation d'événement
    //1 follow événement
    //2 follow user
    [_createNotification](userRef, typeOfNotif, refCollectionConcerned) {
        const notif = {
            type: typeOfNotif,
            owner: userRef,
            notifItem: refCollectionConcerned,
            date: firebase.firestore.Timestamp.now()
        }
        this.db.collection('notifications').add(notif)
    }


    [_createTag](alias) {
        return this[_tagExist](alias).then(found => {
            if (found) {
                throw new Error("tag avec alias " + alias + " exist déjà")
            } else {
                const tag = {alias: alias}
                return this[_createCollectionIndex](tag, tag, 'tags')
                    .then(ref => {return ref.id;});
            }
        });
    }


    [_createPlace](place) {
        return this[_placeExist](place).then(found => {
            if (found) {
                throw new Error("place exist déjà")
            } else {
                return this.db.collection('place').add(place)
                    .then(ref => {return ref;});
            }
        });
    }


    [_createCollectionIndex](fullObj, safeObj, collection) {
        return this.db.collection(collection).add(fullObj)
            .then(ref => {
                Object.values(safeObj).forEach(value => {
                    let array = [];
                    if (typeof value === 'string') {
                        (value.split(/[\s,#]+/)).forEach(s => {
                                if (s !== undefined) {
                                const indexName = collection + "Index"
                                this.db.collection(indexName).doc(s).get().then(doc => {
                                    if (doc.exists) {
                                        this.db.collection(indexName).doc(s).update({
                                            listRef: FieldValue.arrayUnion(ref)
                                        })
                                    } else {
                                        this.db.collection(indexName).doc(s).set({
                                            listRef: FieldValue.arrayUnion(ref)
                                        })
                                    }
                                });
                            }
                        });
                    }
                });
                return ref.id;
            });
    }


    [_userExist](username) {
        return this[_collectionExist]('users', username, 'username');
    }


    [_tagExist](alias) {
        return this[_collectionExist]('tags', alias, 'alias');
    }


    [_placeExist](place) {
        const values = [place.city, place.number, place.postalCode, place.street];
        const names = ['city', 'number', 'postalCode', 'street'];
        return this[_collectionExist]('place', values, names);
    }


    [_collectionExist](collection, attributeValue, attributeName) {
        let query = this.db.collection(collection)
        if (attributeValue.constructor === Array) {
            for (let i = 0; i < attributeValue.length; i++) {
                query = query.where(attributeName[i], '==', attributeValue[i])
            }
        } else {
            query = query.where(attributeName, '==', attributeValue)
        }
        query = query.limit(1);
        return this[_get](query)
            .then(user => {
                try {
                    if (attributeValue.constructor === Array) {
                        let same = true;
                        for (let i = 0; i < attributeValue.length; i++) {
                            same && user[0][attributeName[i]] === attributeValue[i];
                        }
                        return same;
                    } else {
                        return user[0][attributeName] === attributeValue;
                    }
                    
                } catch(err) {
                    return false
                }
            }).catch(err => {return false})
    }


    // Takes the nost recent collection member
    [_getLastidNb](collection) {
        let query = this.db.collection(collection)
            .orderBy("idNb", 'desc')
            .limit(1);
        return this[_get](query).then(lastElement => {
            try {
                return lastElement[0].idNb;
            } catch (err) {
                return -1
            }
        });
    }


    [_getPlace](place) {
        let query = this.db.collection('place')
            .where("city", '==', place.city)
            .where("street", '==', place.street)
            .where("number", '==', place.number)
            .where("postalCode", '==', place.postalCode)
            .limit(1);
        return this[_get](query, true);
    }


    // Relation Table between event and users (creators)
    [_createEventCreated](userReference, eventReference) {
        const eventUserTable = {
            createdEvent: eventReference,
            creator: userReference
        }
        return this.db.collection('createdEvent').add(eventUserTable)
            .then(ref => {return ref.id;});
    }

    // Relation Table between event and tags
    [_createTagRelation](tagReference, eventReference) {
        const tagEventTable = {
            eventRef: eventReference,
            tagRef: tagReference
        }
        return this.db.collection('tagRelation').add(tagEventTable)
            .then(ref => {return ref.id;});
    }
    

    [_get](request, getRef) {
        return request.get()
            .then(snapshot => {
                let result = [];
                snapshot.forEach(response => {
                    if (getRef) {
                        result.push(response.ref)
                    } else {
                        result.push(response.data())
                    }
                });
                return result;
            })
            .catch(err => {
                console.log('Error getting documents', err);
            });
    }


    [_getCollectionList](page, collection, orderBy) {
        let collectionRef = this.db.collection(collection);
        if(page !== undefined) {
            collectionRef =collectionRef.orderBy(orderBy)
                .startAt(this.pageLength * page)
                .limit(this.pageLength);
        }
        return this[_get](collectionRef).then(collectionList => {
            for (let i = 0; i < collectionList.length; i++) {
                const {password, ...userCleaned} = collectionList[i];
                collectionList[i] = userCleaned;
            }
            return userList;
        });
    }


    [_getCollectionById](attributName, attributValue, collection) {
        let query = this.db.collection(collection)
            .where(attributName, '==', attributValue);
        return this[_get](query).then(item => {
            try {
                item[0][attributValue];
                return item[0];
            } catch (err) {
                throw new Error(collection + " " + attributValue + ' not found');
            }
        });
    }


    [_getCollectionReference](collection, identifierAttributeValue, identifierAttributeName) {
        let query = this.db.collection(collection)
            .where(identifierAttributeName, '==', identifierAttributeValue);
        return this[_get](query, true).then(item => {
            try {
                return item[0];
            } catch (err) {
                throw new Error(collection + " " + identifierAttributeValue + ' not found');
            }
        });
    }
}

module.exports = DBManager;