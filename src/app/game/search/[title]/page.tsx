import { Container } from "@/components/container";
import { GameCard } from "@/components/gameCard";
import { Input } from "@/components/input";
import { GameProps } from "@/utils/types/game";

interface PageParams {
  params: Promise<{
    title: string
  }>
};

async function getPageData(gameTitle: string) {
  try {
    const decodedGameTitle = decodeURI(gameTitle);
    const res = await fetch(`${process.env.NEXT_API_URL}/next-api/?api=game&title=${gameTitle}`);

    return res.json();
  } catch (error) {
    return null;
  }
}

export default async function Search({ params }: PageParams) {
  const { title } = await params;
  const games: GameProps[] = await getPageData(title);
  return (
    <main className='w-full text-black'>
      <Container>
        <Input />

        <h1 className='font-bold text-x1 mt-8 mb-5'>
          Veja o que encontramos na nossa base
        </h1>

        {!games && (
          <p>Esse jogo não foi encontrado...</p>
        )}

        <section
          className="grid gap-7 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
        >
          {
            games && games.map(game => {
              return (
                <GameCard
                  gameData={game}
                  key={game.id}
                />
              );
            })
          }
        </section>
      </Container>
    </main>
  );
};