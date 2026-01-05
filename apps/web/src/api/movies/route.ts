import { NextRequest, NextResponse } from 'next/server'
 
export async function GET(request: NextRequest) {

  const uri =  encodeURIComponent(request.nextUrl.searchParams.get("movie") as string)
  const apiKey = process.env.OMDBAPI_KEY
  const requestURI = `http://www.omdbapi.com/?t=${uri}&apikey=${apiKey}`
  console.log(requestURI,'requestURI')
  const res = await fetch(requestURI)
  const data = await res.json()
  console.log(data.Poster)
 
  return NextResponse.json({ data })
}