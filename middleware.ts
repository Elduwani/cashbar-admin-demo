// middleware.ts
import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
   if (request.nextUrl.pathname.startsWith('/api/seed')) {
      if (process.env.NODE_ENV !== 'development') {
         /**
          * A middleware can not alter response's body. 
          * Learn more: https://nextjs.org/docs/messages/returning-response-body-in-middleware
          * Rewrite to undefined route
          */
         return NextResponse.rewrite(new URL('/404', request.url))
      }
   }
}