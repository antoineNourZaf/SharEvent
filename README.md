# SharEvent

## Intro

## Endpoints

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

### Backend

| Endpoint                       | Type Request | Description                                 |
| ------------------------------ | ------------ | ------------------------------------------- |
| `/api/users`                   | `GET`        | Retourne tous les users                     |
| `/api/users/{id}`              | `GET`        | Retourne le user n°{id}                     |
| `/api/events`                  | `GET`        | Retourne tous les events                    |
| `/api/events/{id}`             | `GET`        | Retourne le user n°{id}                     |
| `/api/tags`                    | `GET`        | Retourne tous les tags                      |
| `/api/tags/{id}`               | `GET`        | Retourne le tag n°{id}                      |
| `/api/search?q={query}`        | `GET`        | Permet de chercher parmi tout ce qui existe |
| `/api/users?user={User}`       | `POST`       | Crée un créateur 							  |
| `/api/events?event={Event}`    | `POST`       | Crée un événement 						  |

/api/users?orderBy=[location,]			 		(Tous les users triés par lieu)
/api/events?orderBy=[date,]&filter=[ska,] 		(Tous les events liés au tag ska triés par date)

