import { NextRequest, NextResponse } from 'next/server'
 
export async function GET(request: NextRequest) {

  const uri =  encodeURIComponent(request.nextUrl.searchParams.get("movie") as string)
  const apiKey = process.env.OMDb_API_KEY
  const requestURI = `http://www.omdbapi.com/?i=tt3896198&apikey=${apiKey}&t=${uri}`
  const res = await fetch(requestURI)
  const data = await res.json()
  console.log(data.Poster)
 
  return NextResponse.json({ data })
}