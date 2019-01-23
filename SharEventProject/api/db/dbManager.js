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
const _getPlaceRef = Symbol('getPlaceRef');
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
    createEvent(title, creator, description, dateEvent, numberPlace, streetPlace, postalCodePlace, cityPlace) {
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

        let waitRefPlace = this[_placeExist](place).then(found => {
            if (found) {
                refPlace = this[_getPlaceRef](place).then(ref => {
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
        return Promise.all(checkIfExistPromises).then(osef => {
            return Promise.all(tagListPromises).then(referencesTag => {
                return waitRefPlace.then(() => {
                    //attend de récupérer la référence du lieu
                    return refPlace.then(referencePlace => {
                        //attend de récupérer la référence du createur
                        return refCreator.then(referenceCreator => {
                            //créé l'événement
                            return this[_getLastidNb]('event').then(number => {
                                const event = {
                                    creator: referenceCreator,
                                    date: (new Date()),
                                    dateEvent: dateEvent,
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
                                        return eventReference;
                                    });
                            })
                        });
                    });
                })
                
            });
        }).catch(err => console.log(err));
    }

    //////////////////////// Private Methods ////////////////////////

    //0 créeation d'événement
    //1 follow événement
    //2 follow user
    /**
     * method allowing to create notification of all kinds given the owner DocumentReference,
     * the kind value of the notification and the Documentreference of the Item concerned
     * If typeOfNotif is 0, it means it is a notification that the owner created an event
     * If typeOfNotif is 1, it means it is a notification that the owner followed an event
     * If typeOfNotif is 3, it means it is a notification that the owner followed a user
     * 
     * @param {owner DocumentReference} userRef 
     * @param {type value of the notification} typeOfNotif 
     * @param {pointed item DocumentReference by the notification} refCollectionConcerned 
     */
    [_createNotification](userRef, typeOfNotif, refCollectionConcerned) {
        const notif = {
            type: typeOfNotif,
            owner: userRef,
            notifItem: refCollectionConcerned,
            date: firebase.firestore.Timestamp.now()
        }
        this.db.collection('notifications').add(notif)
    }


    /**
     * allow to create properly a tag
     * throw an Error if the tag already exist
     * @param {*} alias 
     */
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


    /**
     * allow to create properly a place
     * throw an error if the place (with all the same fields) already exist
     * @param {*} place
     */
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


    /**
     * allow to create an inverted index given an item to create,
     * the same item filtered with the fields we don't want to be indexed
     * and the collection concerned by the transaction
     * @param {the item to create} fullObj
     * @param {the item filtered} safeObj
     * @param {the collection concerned by the transaction} collection
     */
    [_createCollectionIndex](fullObj, safeObj, collection) {
        // add the item to the given collection
        return this.db.collection(collection).add(fullObj)
            .then(ref => {
                Object.values(safeObj).forEach(value => {
                    let array = [];
                    // tokenize the string fields of the item
                    if (typeof value === 'string') {
                        // add each token to the related inverted index
                        // create the document if the word has never been seen before or add an aarray entry otherwise
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


    /**
     * check if a user already exist on the database
     * It means verify if the username exist already
     * @param {*} username
     */
    [_userExist](username) {
        return this[_collectionExist]('users', username, 'username');
    }


    /**
     * check if a tag already exist on the database
     * It means verify if the alias exist already
     * @param {*} alias
     */
    [_tagExist](alias) {
        return this[_collectionExist]('tags', alias, 'alias');
    }


    /**
     * check if a place already exist on the database
     * It means verify if a place with all the same fields exist
     * @param {*} place
     */
    [_placeExist](place) {
        const values = [place.city, place.number, place.postalCode, place.street];
        const names = ['city', 'number', 'postalCode', 'street'];
        return this[_collectionExist]('place', values, names);
    }


    /**
     * allow to check genericly if a collection already exist on the database
     * given the collection where we are looking for a duplicate,
     * the attribute value(s) and name(s) that we have to check to exist
     * attributeValue and attributeName can be a simple value or an array of values
     * @param {collection where we are looking for a duplicate} collection
     * @param {value(s) of the field(s) that we check to exist} attributeValue
     * @param {name(s) of the field(s) where we check the corresponding value(s)} attributeName
     */
    [_collectionExist](collection, attributeValue, attributeName) {
        //prepare the query
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
                    // check if field(s) value(s) are identical(s)
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


    /**
     * give the highest idNb field value from all documents of the given collection
     * @param {collection where we are looking for the highest idNb} collection
     */
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


    /**
     * get the given place DocumentReference
     * @param {*} place
     */
    [_getPlaceRef](place) {
        let query = this.db.collection('place')
            .where("city", '==', place.city)
            .where("street", '==', place.street)
            .where("number", '==', place.number)
            .where("postalCode", '==', place.postalCode)
            .limit(1);
        return this[_get](query, true);
    }


    /**
     * create the relation table between an event and his creator given both DocumentReference
     * @param {*} userReference
     * @param {*} eventReference
     */
    [_createEventCreated](userReference, eventReference) {
        const eventUserTable = {
            createdEvent: eventReference,
            creator: userReference
        }
        return this.db.collection('createdEvent').add(eventUserTable)
            .then(ref => {return ref.id;});
    }

    /**
     *  create the relation table between an event and a tag given both DocumentReference
     * @param {*} tagReference
     * @param {*} eventReference
     */
    [_createTagRelation](tagReference, eventReference) {
        const tagEventTable = {
            eventRef: eventReference,
            tagRef: tagReference
        }
        return this.db.collection('tagRelation').add(tagEventTable)
            .then(ref => {return ref.id;});
    }
    

    /**
     * generic get method it takes any kind of query
     * !!!you can provide a second parameter
     * if you want the documentreference of the result query!!!
     * else it just return the datas
     * @param {query to send} request
     * @param {optionnal parameter to dtermine if we wantto get datas or DocumentReference of the request} getRef
     */
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


    /**
     * generic method allowing to get a collection. It allows pagination and classification
     * @param {page number we want} page
     * @param {collection name we want to get} collection
     * @param {fieldName with what we classify the results} orderBy 
     */
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


    /**
     * generic method allowing to get an item given a field name and value of a given collection
     * @param {name of the field where we want to read the value} attributName
     * @param {value that we are looking for} attributValue
     * @param {collection where we are searching in} collection
     * 
     */
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


    /**
     * generic method allowing to get a DocumentReference of an item containing
     * the field identifierAttributeName with the value identifierAttributeValue
     * in the given collection
     * @param {collection where we are looking for} collection
     * @param {value we expect to find} identifierAttributeValue
     * @param {field where we expect to find the value} identifierAttributeName
     */
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