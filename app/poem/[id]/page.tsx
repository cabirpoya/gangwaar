import Link from 'next/link'
import { notFound } from 'next/navigation'

interface Verse {
  poem_id: number;
  text: string;
  position: number;
}

interface Poem {
  id: number;
  title: string;
  poet_id: number;
}

async function getPoem(id: number): Promise<Poem | null> {
  const { getDb } = await import('../../../lib/db');
  const db = await getDb();
  const poem = await db.get(`
    SELECT p.id, p.title, c.poet_id 
    FROM poem p 
    JOIN cat c ON p.cat_id = c.id 
    WHERE p.id = ?
  `, id);
  return poem as Poem | null;
}

async function getVerses(poemId: number): Promise<Verse[]> {
  const { getDb } = await import('../../../lib/db');
  const db = await getDb();
  const verses = await db.all('SELECT poem_id, text, position FROM verse WHERE poem_id = ? ORDER BY position', poemId);
  return verses;
}

export default async function PoemPage({ params }: { params: { id: string } }) {
  const poemId = parseInt(params.id);
  let poem: Poem | null = null;
  let verses: Verse[] = [];

  try {
    poem = await getPoem(poemId);
    if (poem) {
      verses = await getVerses(poemId);
    }
  } catch (error) {
    console.error('Error fetching poem or verses:', error);
  }

  if (!poem) {
    notFound();
  }

  return (
    <main className="container mx-auto p-4">
      <Link href={`/poet/${poem.poet_id}`} className="text-blue-500 hover:underline mb-4 inline-block">&larr; Back to Poems</Link>
      <h1 className="text-2xl font-bold mb-4">{poem.title}</h1>
      <div className="prose max-w-none">
        {verses && verses.length > 0 ? verses.map((verse) => (
          <p key={verse.position} className="mb-2 text-right" dir="rtl">
            {verse.text}
          </p>
        )) : (
          <p>No verses found for this poem.</p>
        )}
      </div>
    </main>
  )
}