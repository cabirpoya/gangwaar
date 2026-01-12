import { NextResponse } from 'next/server'
import { getDb } from '../../../lib/db'

export async function GET() {
  try {
    const db = await getDb()
    const poets = await db.all('SELECT id, name FROM poet ORDER BY name')
    return NextResponse.json(poets)
  } catch (error) {
    console.error('Database error:', error)
    return NextResponse.json({ error: 'Failed to fetch poets' }, { status: 500 })
  }
}