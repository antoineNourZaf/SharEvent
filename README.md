# SharEvent

## Intro

## Endpoints

### FrontEnd

| Endpoint                      | Description |
| ----------------------------- | ----------- |
| `sharevent.com`        		|             |
| `sharevent.com/signin`        |             |
| `sharevent.com/signup`        |             |
| `sharevent.com/user/`         |             |
| `sharevent.com/event/`        |             |
| `sharevent.com/home`          |             |
| `sharevent.com/search/top`    |             |
| `sharevent.com/search/users`  |             |
| `sharevent.com/search/events` |             |
| `sharevent.com/search/tags`   |             |

### Backend

| Endpoint                       | Type Request | Description                                 |
| ------------------------------ | ------------ | ------------------------------------------- |
| `/api/users`                   | `GET`        | Retourne tous les users                     |
| `/api/users/{id}`              | `GET`        | Retourne le user n°{id}                     |
| `/api/events`                  | `GET`        | Retourne tous les events                    |
| `/api/events/{id}`             | `GET`        | Retourne le user n°{id}                     |
| `/api/tags`                    | `GET`        | Retourne tous les tags                      |
| `/api/tags/{id}`               | `GET`        | Retourne le tag n°{id}                      |
| `/api/search/top?q={query}`    | `GET`        | Permet de chercher parmi tout ce qui existe |
| `/api/search/users?q={query}`  | `GET`        | Permet de chercher parmi tous les users     |
| `/api/search/events?q={query}` | `GET`        | Permet de chercher parmi tous les events    |
| `/api/search/tags?q={query}`   | `GET`        | Permet de chercher parmi tous les tags      |

/api/users?orderBy=[location,]			 	(tous les users triés par lieu )
/api/events?orderBy=[date,]&filter=[ska,] 		(tous les events liés au tag ska triés par date)