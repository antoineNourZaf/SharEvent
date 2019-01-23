# SharEvent

## Intro
Nous avons créé une application qui permet aux utilisateurs de créer de événements pour les partager et inviter des gens à y participer. Le principe est de créer un événement auquel tout le monde aura accès, et si l'on veut avoir des notifications d'une personne et savoir si elle fera d'autres événements, on pourra "follow" cette personne (la suivre), et connaître ses prochains événements.
Pour pouvoir utiliser l'application, il faut d'abord registrer un compte avec un nom d'utilisateur unique et un mot de pass (avec aussi un nom, prenom et email de votre compte).

### FrontEnd

| Endpoint                      		| Description 												|
| ------------------------------------- | --------------------------------------------------------- |
| `sharevent.com`        				| Page de Sign In 											|
| `sharevent.com/signup`        		| Page de Sign Up 											|
| `sharevent.com/user/`         		| Amène sur la liste des événement d'un créateur 			|
| `sharevent.com/day?date=23mai2018`	| Affiche la page de détail des événement d'un jour X 		|
| `sharevent.com/event/{id}`    		| Affiche la page de détail des événement d'un jour X 		|
| `sharevent.com/home`          		| Amène sur notre calendrier des événements 				|
| `sharevent.com/search/top`    		| Amène sur la page de recherche et de filtrage d'événement |
| `sharevent.com/search/users`  		| Amène sur la page de recherche des users 					|
| `sharevent.com/search/events` 		| Amène sur la page de recherche des events 				|
| `sharevent.com/search/tags`   		| Amène sur la page de recherche des tags 					|

### Backend (Endpoints)

| Endpoint                       																					| Type Request | Description                                 	 |
| ----------------------------------------------------------------------------------------------------------------- | ------------ | ----------------------------------------------- |
| `/api/users?page=:nbPage` 	           							      											| `GET`        | Retourne tous les users                     	 |
| `/api/users/:username`              																				| `GET`        | Retourne le user n°{id}                     	 |
| `/api/events?page=:nbPage`                  																		| `GET`        | Retourne tous les events                    	 |
| `/api/events/:id`             																					| `GET`        | Retourne le user n°{id}                     	 |
| `/api/tags?page=:nbPage`                    																		| `GET`        | Retourne tous les tags                      	 |
| `/api/tags/:alias`              																					| `GET`        | Retourne le tag n°{id}                      	 |
| `/api/search/:query`        																						| `GET`        | Permet de chercher parmi tout ce qui existe 	 |
| `/api/users/user/:lastname/:firstname/:email/:username/:password`       											| `POST`       | Crée un créateur 							 	 |
| `/api/events/event/:title/:creator/:description/:dateEvent/:numberPlace/:streetPlace/:postalCodePlace/:cityPlace`	| `POST`       | Crée un événement 						     	 |
| `/api/users/:idUsername/user/:username`    																		| `POST`       | Un utilisateur peut suivre un autre utilisateur |
| `/api/events/:id/event/:username`    																				| `POST`       | Un utilisateur peut suivre un événement 	 	 |
| `/api/notifications/:username'`    																				| `GET`        | Obtient les notifications de l'utilisateur	 	 |

## API/Database
Nous avons choisi de faire une API REST pour travailler avec Firebase. L'utilisation était plus simple que devoir comprendre à utiliser GrapheQL depuis le début car on avait déjà utilisé ce type d'API auparavant. 
Pour la base de données, nous avons choisi Firebase à partir de la recommendation du professeur de TWEB et par la contrainte de la donnée de devoir utiliser une base de donnée NoSQL (et le fait de ne pas avoir tout le monde qui utilise la même base de donnée NoSQL)

## Requêtes/données

## Déploiement
Le déploiement de l'application a été fait sur Heroku. Malheureusement, à cause d'un problème de parsing des fins de lignes `('\n')`, il n'est pas possible de se connecter à la base de données de Firebase. En cherchant l'erreur, on tombe sur la même manière pour corriger l'erreur, mais ne la corrige pas dans notre cas. En nous laissant un code d'erreur ressemblant dans les 2 cas, sans et avec le patch.
Sinon, le fonctionnement en local est correct. On arrive à communiquer avec la base de données et à récuperer/insérer des données en faisant des appels avec l'api et les bons paramètres. Si des répétitions de valeurs uniques dans la base de données, une erreur est lancée pour informer de l'erreur.

Pour pouvoir utiliser l'application en local, il faut télécharger le dossier SharEventProject, aller dans ce dossier et suivre les instructions du README.md, lequel informe comment installer d'abord les dépendences et ensuite comment lancer en local l'application.

## Utilisation
D'abord, il faut créer un compte utilisateur. Après la création de votre compte, vous serez redirigé vers la page de Login pour pouvoir vous connecter.
Une fois la connexion faite, vous irez dans la page Home, dans laquelle vous aurez un calendrier qui vous dira quand est-ce que le suivant événement auquel vous êtes souscrit va avoir lieu, ou dans son défaut, un des événements que vous avez créé.
Par la suite, vous pouvez aller à votre profil dans le menu situé à votre gauche dans l'écran. Sur votre profil vous pourrez voir vos données personnels ainsi que le nombre de personnes qui vous suivent et que vous suivez, ainsi que vos événements.
Comme pas suivant, vous pouvez aller dans le menu de création d'événement pour pouvoir créer votre propre événement et le partager avec les autres utilisateurs de l'application.
Pour finir, il y a un onglet de recherche dans lequel vous pourrez rechercher ce que vous voulez dans l'application, comme par exemple le nom d'un utilisateur, le titre d'un événement ou les hashtags dans la description d'un événement.

## Auto-évaluation
