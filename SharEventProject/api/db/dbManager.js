const firebase = require("firebase-admin");
const { databaseOptions } = require('../config');

// const serviceAccount = require("../sharevent-heig-firebase-adminsdk-dqbhx-343d3d8b9b.json");
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

// DBManager is a Singleton
class DBManager {
    constructor() {
        firebase.initializeApp({
            credential: firebase.credential.cert(
                {
                    "type": process.env.TYPE,
                    "project_id": process.env.PROJECT_ID,
                    "private_key_id": process.env.PRIVATE_KEY_ID,
                    "private_key": process.env.PRIVATE_KEY,
                    "client_email": process.env.CLIENT_EMAIL,
                    "client_id": process.env.CLIENT_ID,
                    "auth_uri": process.env.AUTH_URI,
                    "token_uri": process.env.TOKEN_URI,
                    "auth_provider_x509_cert_url": process.env.AUTH_PROVIDER_X509_CERT_URL,
                    "client_x509_cert_url": process.env.CLIENT_X509_CERT_URL
                }
            ),
            databaseURL: 'https://sharevent-heig.firebaseio.com'
        });
        this.db = firebase.firestore();
        this.pageLength = 1;
    }

    // Public methods
    
    getUsers(page) {
        return this[_getCollectionList](page, 'users', "idNb");
    }


    getUserById(username) {
        return this[_getCollectionById]("username", username, 'users');
    }


    getEventsList(page) {
        return this[_getCollectionList](page, 'event', "date");
    }


    getEventById(id) {
        return this[_getCollectionById]("idNb", id, 'event');
    }

    
    getTagsList() {
        return this[_getCollectionList](undefined, 'tags', "alias");
    }


    getTagById(alias) {
        return this[_getCollectionById]("alias", alias, 'tags');
    }


    getTagId(alias) {
        return this[_getCollectionReference]('tags', alias, "alias");
    }


    getUserId(username) {
        return this[_getCollectionReference]('users', username, "username");
    }


    getEventId(id) {
        return this[_getCollectionReference]('event', id, "idNb");
    }


    followEvent(username, eventIdNumber) {
        //récupère la référence de l'user
        return this.getUserId(username).then(userRef => {
            //récupère la référence de l'Event
            return this.getEventId(eventIdNumber).then(eventRef => {
                //créé le document followEvent
                const followEventTable = {
                    followedEvent: eventRef,
                    followerUser: userRef
                }
                return this.db.collection('followEvent').add(followEventTable)
                    .then(ref => {return ref;});
            });
        });
    }


    followUser(username, usernameToFollow) {
        //récupère la référence de l'user
        return this.getUserId(username).then(followerUserRef => {
            //récupère la référence de l'user à follow
            return this.getUserId(usernameToFollow).then(followedUserRef => {
                //créé le document followUsers
                const followUsersTable = {
                    followedUser: followedUserRef,
                    followerUser: followerUserRef
                }
                return this.db.collection('followUsers').add(followUsersTable)
                    .then(ref => {return ref;});
            });
        });
    }


    find(collections, words) {
        let waitingArray = []
        let resultArray = []
        let stockResult = {}
        collections.forEach(collection =>{
            words.forEach(word =>{
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
                    resultArray.push(Promise.all(collectionResultArray).then(veryAbsoluteFinalResult => {
                        if (veryAbsoluteFinalResult.length > 0){
                            if(!(collection in stockResult)) {
                                stockResult[collection] = [];
                            }
                            stockResult[collection].push(veryAbsoluteFinalResult);
                        }
                    }))
                }))
            })
        })
        return Promise.all(waitingArray).then(osef => {
            return Promise.all(resultArray).then(finalResult => {
                return stockResult
            })
        })
    }


    createUser(lastname, firstname, email, username, password) {
        const userData = {
            lastname: lastname,
            firstname: firstname,
            email: email,
            username: username,
            password: password
        }
        return this[_userExist](username).then(exist => {
            if (exist) {
                throw new Error('Username already exist in database : ' + username);
            } else {
                return this[_getLastidNb]('users').then(lastIndex => {
                    userData.idNb = lastIndex + 1;
                    const {password, ...cleanedUser} = userData;
                    return this[_createCollectionIndex](userData, cleanedUser, 'users');
                });
            }
        });
    }


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

    // Private Methods

    [_createTag](alias) {
        return this[_tagExist](alias).then(found => {
            if (found) {
                throw new Error("Tag with alias " + alias + " already exist.")
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
                throw new Error("Place already exist.")
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

module.exports = new DBManager();