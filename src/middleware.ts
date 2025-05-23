import { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export function middleware (request :NextRequest){
    const token =  request.cookies.get('username')?.value;
    if(!token && request.nextUrl.pathname !== '/login')
        return NextResponse.redirect(new URL ('/login', request.url));
    if(token && request.nextUrl.pathname === '/login')
        return NextResponse.redirect(new URL ('/subjects', request.url));
return NextResponse.next();
}
export const config = {
    matcher: ['/exam','/subjects','/login']
  } 