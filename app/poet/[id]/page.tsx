import Link from 'next/link'
import { notFound } from 'next/navigation'

interface Poem {
  id: number;
  title: string;
  url: string;
}

interface Poet {
  id: number;
  name: string;
}

async function getPoet(id: number): Promise<Poet | null> {
  const { getDb } = await import('../../../lib/db');
  const db = await getDb();
  const poet = await db.get('SELECT id, name FROM poet WHERE id = ?', id);
  return poet as Poet | null;
}

async function getPoems(poetId: number): Promise<Poem[]> {
  const { getDb } = await import('../../../lib/db');
  const db = await getDb();
  const poems = await db.all(`
    SELECT p.id, p.title, p.url 
    FROM poem p 
    JOIN cat c ON p.cat_id = c.id 
    WHERE c.poet_id = ? 
    ORDER BY p.title
  `, poetId);
  return poems;
}

export default async function PoetPage({ params }: { params: { id: string } }) {
  const poetId = parseInt(params.id);
  let poet: Poet | null = null;
  let poems: Poem[] = [];

  try {
    poet = await getPoet(poetId);
    if (poet) {
      poems = await getPoems(poetId);
    }
  } catch (error) {
    console.error('Error fetching poet or poems:', error);
  }

  if (!poet) {
    notFound();
  }

  return (
    <main className="container mx-auto p-4">
      <Link href="/" className="text-blue-500 hover:underline mb-4 inline-block">&larr; Back to Poets</Link>
      <h1 className="text-2xl font-bold mb-2">{poet.name}</h1>
      <h2 className="text-xl mb-4">Poems</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {poems && poems.length > 0 ? poems.map((poem) => (
          <div key={poem.id} className="border p-4 rounded">
            <h3 className="font-semibold">{poem.title}</h3>
            <Link href={`/poem/${poem.id}`} className="text-blue-500 hover:underline">
              Read Poem
            </Link>
          </div>
        )) : (
          <p>No poems found for this poet.</p>
        )}
      </div>
    </main>
  )
}