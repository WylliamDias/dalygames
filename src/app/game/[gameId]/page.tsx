import Image from "next/image";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import { Label } from "./components/label";
import { GameCard } from "@/components/gameCard";
import { Container } from "@/components/container";
import { GameProps } from "@/utils/types/game";

interface GameDetailsProps {
  params: Promise<{ gameId: string }>;
}

interface MetadataParams {
  params: Promise<{ gameId: string }>;
}

export async function generateMetadata({ params }: MetadataParams): Promise<Metadata> {
  try {
    const { gameId } = await params;
    if (!gameId) throw new Error('Invalid ID');

    const res = await fetch(`${process.env.NEXT_API_URL}/next-api/?api=game&id=${gameId}`, {
      next: {
        revalidate: 60
      }
    });

    const gameInfo: GameProps = await res.json();

    return {
      title: gameInfo.title,
      description: `${gameInfo.description.slice(0, 100)}...`,
      openGraph: {
        title: gameInfo.title,
        images: [gameInfo.image_url]
      },
      robots: {
        index: true,
        follow: true,
        nocache: true,
        googleBot: {
          index: true,
          follow: true,
          noimageindex: true
        }
      }
    };
  } catch (error) {
    return {
      title: 'DalyGame - Descubra jogos incríveis para se divertir.'
    }
  }
}

async function getGameData(gameId: string) {
  try {
    const res = await fetch(`${process.env.NEXT_API_URL}/next-api/?api=game&id=${gameId}`, {
      next: {
        revalidate: 60
      }
    });
    return res.json();
  } catch (error) {
    return null;
  }
}

async function getSortedGame() {
  try {
    const res = await fetch(`${process.env.NEXT_API_URL}/next-api/?api=game_day`, {
      cache: 'no-store'
    });
    return res.json();
  } catch (error) {
    return null;
  }
}

export default async function GameDetails({ params }: GameDetailsProps) {
  const { gameId } = await params;
  const gameDetailsData: GameProps = await getGameData(gameId);

  const sortedGame: GameProps = await getSortedGame();

  if (!gameDetailsData) {
    redirect('/');
  }

  return (
    <main className='w-full text-black'>
      <div className='w-full bg-black h-80 sm:h-96 relative'>
        <Image
          className="object-cover w-full h-80 sm:h-96 opacity-70"
          src={gameDetailsData.image_url}
          alt="Imagem do jogo"
          priority={true}
          fill={true}
          quality={100}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw"
        />
      </div>
      <Container>
        <h1 className="font-bold text-xl my-4">
          {gameDetailsData.title}
        </h1>
        <p>
          {gameDetailsData.description}
        </p>

        <h2 className="text-bold text-lg mt-7 mb-2">
          Plataformas
        </h2>
        <div className="flex gap-2 flex-wrap">
          {
            gameDetailsData.platforms.map(platform => {
              return (
                <Label key={platform} name={platform} />
              );
            })
          }
        </div>

        <h2 className="text-bold text-lg mt-7 mb-2">
          Categorias
        </h2>
        <div className="flex gap-2 flex-wrap">
          {
            gameDetailsData.categories.map(category => {
              return (
                <Label key={category} name={category} />
              );
            })
          }
        </div>

        <p className="mt-7 mb-2">
          <strong>Data de lançamento:</strong> {gameDetailsData.release}
        </p>

        <h2 className="font-bold text-lg mt-7 mb-2">
          Jogo recomendado
        </h2>
        <div className="flex">
          <div className="flex-grow">
            <GameCard
              gameData={sortedGame}
            />
          </div>
        </div>
      </Container>
    </main>
  );
};