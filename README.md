# SharEvent

## Intro

## Endpoints

### FrontEnd

| Endpoint                      | Description |
| ----------------------------- | ----------- |
| `sharevent.com`        		| page de signin |
| `sharevent.com/signup`        |             |
| `sharevent.com/user/`         | amène sur la liste des événement d'un créateur |
| `sharevent.com/day?date=23mai2018` | affiche la page de détail des événement d'un jour X |
| `sharevent.com/event/{id}`    | affiche la page de détail des événement d'un jour X |
| `sharevent.com/home`          | amène sur notre calendrier des événements |
| `sharevent.com/search`        | amène sur la page de recherche et de filtrage d'événement |

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
| `/api/users?user={User}`       | `POST`       | crée un créateur |
| `/api/events?event={Event}`    | `POST`       | crée un événement |
| `/api/tags?tag={string}`       | `POST`       | crée un événement |

/api/users?orderBy=[location,]			 	(tous les users triés par lieu )
/api/events?orderBy=[date,]&filter=[ska,] 		(tous les events liés au tag ska triés par date)