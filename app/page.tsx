import Link from 'next/link'

interface Poet {
  id: number;
  name: string;
}

async function getPoets(): Promise<Poet[]> {
  const { getDb } = await import('../lib/db');
  const db = await getDb();
  const poets = await db.all('SELECT id, name FROM poet ORDER BY name');
  return poets;
}

export default async function Home() {
  let poets: Poet[] = [];
  try {
    poets = await getPoets();
  } catch (error) {
    console.error('Error fetching poets:', error);
  }

  return (
    <main className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Ganjoor - Persian Poetry</h1>
      <h2 className="text-xl mb-4">Poets</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {poets && poets.length > 0 ? poets.map((poet) => (
          <div key={poet.id} className="border p-4 rounded">
            <h3 className="font-semibold">{poet.name}</h3>
            <Link href={`/poet/${poet.id}`} className="text-blue-500 hover:underline">
              View Poems
            </Link>
          </div>
        )) : (
          <p>No poets found or error loading data.</p>
        )}
      </div>
    </main>
  )
}