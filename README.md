# DalyGames
DalyGames is a simple website to suggest you some cool games. You can search for games, see their information, like platform where they are available, categories that they apply for and when they were released. There are also some a game recommendation and a profile page (which is static, but with some client interaction).


The application have some pages like [`<HomePage />`](#homepage), [`<GamePage />`](#gamepage), [`<ProfilePage />`](#profilepage), all their details will be shown in their headers. Some of the features are the [`<SearchBar />`](#search-game) where you can search for games, more details on its Header. 


## Used Technologies
| Technology   | Link           |
| :---:        |     :---:      |
| TailWindCSS   |  https://tailwindcss.com/docs/responsive-design  |
| NextJS Framework (with typescript)     |   https://nextjs.org/docs     |
|SujeitoProgramador API| https://sujeitoprogramador.com/next-api/ |

## About the API

Used endpoints:
- `/?api=game_day`: To get the game of the day, it's shown in the HomePage;
- `/?api=games`: To get all games available from the API;
- `/?api=game&id=${gameId}`: To get all information about a specific game;
- `/?api=game&title=${gameTitle}`: To search for a game that matches the given title;


## HomePage

In the main page you'll see all the games available, the header contains a link to your profile (which is a static page) and a link to the homepage, the top of the page has a banner suggesting you a new game to take a look at, below it is a search bar where you can search for a game name, the rest of the page shows you a list of all the games from the API.

**Desktop Version:**

![MainPageResponsive-Desktop-GIF](https://github.com/user-attachments/assets/00639df0-f533-4110-92c0-5a12532ce6ce)


**Mobile Version:**
<p align="center">
  <img width="571" height="878" alt="image" src="https://github.com/user-attachments/assets/1cc05a16-bed9-459c-9e21-1ec70bd09684" />
</p>


---


The next GIF shows the responsivity of the application, all of it was made with [TailWindCSS responsive](https://tailwindcss.com/docs/responsive-design) features.

<p align="center">
<img alt="gif" src="https://github.com/user-attachments/assets/9732ca6f-7c1d-4b5e-aeba-8377f6550b67" />
</p>

## Search Game

In the application you'll be able to search for a specific game, if the informed word matches some part of the title of a game, the page will show all games with it.

When you hit the search button the SearchPage will be loaded, the page receives the parameter to search in the API via URL, for example searching for "dark" will result in an URL like this: `game/search/dark`. With this, you can extract the `title` from the URL via the params in the page component.

```ts
async function getPageData(gameTitle: string) {
  try {
    const decodedGameTitle = decodeURI(gameTitle);
    const res = await fetch(`${process.env.NEXT_API_URL}/next-api/?api=game&title=${gameTitle}`);
...
}

export default async function Search({ params }: PageParams) {
  const { title } = await params;
  const games: GameProps[] = await getPageData(title);
  return (...)
}
```

![Search](https://github.com/user-attachments/assets/0391961a-7dba-45e1-856f-540f38597974)


## GamePage
This page is responsible to show all the given `gameId` information, release date, platforms with it and categories.

In the top we have a picture of the game, along with its title, description and the details listed above.

Also in the bottom of this page is shown a recommended game.

```ts
async function getGameData(gameId: string) {
  try {
    const res = await fetch(`${process.env.NEXT_API_URL}/next-api/?api=game&id=${gameId}`, {
      next: {
        revalidate: 60
      }
    });
    return res.json();
...
}

async function getSortedGame() {
  try {
    const res = await fetch(`${process.env.NEXT_API_URL}/next-api/?api=game_day`, {
      cache: 'no-store'
    });
    return res.json();
...
}

export default async function GameDetails({ params }: GameDetailsProps) {
  const { gameId } = await params;
  const gameDetailsData: GameProps = await getGameData(gameId);

  const sortedGame: GameProps = await getSortedGame();

  if (!gameDetailsData) {
    redirect('/');
  }

  return (...)
}
```

![GamePage](https://github.com/user-attachments/assets/368ea362-4c05-48c7-88e2-62c68ed45b82)


## ProfilePage
The profile page was a bonus to do, the page itself is static, there isn't a login system, the image an username are hardcoded.
The intention was to exercise some of the features from `NextJS`, which is the directives for client components. 
The `<Profile />` component is a Server Component, but it has three Client Components, the `<FavoriteCard />` ones.
It's a single component, but it's used three times in the page.

The `<FavoriteCard />` component has three states:
- One to handle the input from the user;
- One to handle the visible state of the input;
- One to show, if existent, the game name that the user inserted.

```ts
import { FavoriteCard } from "./components/favorite";

export const metadata: Metadata = {
  title: 'Meu Perfil - DalyGames sua plataforma de jogos!',
  description: 'Perfil Wylliam Dev | Daly Games sua plataofrma de jogos!'
}

export default function Profile() {
  return (...
    <section className='flex flex-wrap gap-5 flex-col md:flex-row'>
      <div className="flex-grow flex-wrap">
        <FavoriteCard />
      </div>
      <div className="flex-grow flex-wrap">
        <FavoriteCard />
      </div>
      <div className="flex-grow flex-wrap">
        <FavoriteCard />
      </div>
    </section>
  ...)
}

// Favorite Component from /profile/components/favorite
'use client';

import { useState } from "react";
import { FiEdit, FiX } from "react-icons/fi";

export function FavoriteCard() {
  const [input, setInput] = useState('');
  const [showInput, setShowInput] = useState(false);
  const [gameName, setGameName] = useState('');

  function handleButton() {
    setShowInput(!showInput);
    setInput('');

    if (input !== '') {
      setGameName(input);
    }
  }

  return (
    <div
      className="w-full bg-gray-900 p-4 h-44 text-white rounded-lg flex justify-between flex-col "
    >
      {
        showInput && (
          <div className="flex items-center justify-center gap-3">
            <input
              className="w-full rounded-md h-8 text-black px-3 bg-white"
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
            />

            <button onClick={handleButton}>
              <FiX size={24} color="#FFF" />
            </button>
          </div>
        ) || (
          <button
            className="self-start hover:scale-110 duration-200 transition-all"
            onClick={handleButton}
          >
            <FiEdit size={24} color="#FFF" />
          </button>
        )
      }

      {
        gameName && (
          <div>
            <span className="text-white">Jogo Favorito: </span>
            <p className="font-bold text-white">{gameName}</p>
          </div>
        ) || (
          <p className="font-bold text-white">Adicionar jogo</p>
        )
      }
    </div>
  )
}
```

![ProfilePage](https://github.com/user-attachments/assets/1c68f0d8-5023-495f-bfb3-28be721bdb55)


---


# Running the project

Necessary environment variables (`.env.local`):
- NEXT_API_URL: The URL to the used API from `sujeitoprogramador`;
- PROJECT_URL: The URL to this current project, for standard it'll be `localhost:3000`, but if you deploy it you'll need to change it.

To run the development server:

```bash
npm run dev
```

To learn more about deploying it: [NextJS Deploy Docs](https://nextjs.org/docs/app/getting-started/deploying)
