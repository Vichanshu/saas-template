import { clerkMiddleware,createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const  isAdminRoute=createRouteMatcher(["/admin/:path*"]);

export default clerkMiddleware(async(auth, req) => {
  const { pathname } = new URL(req.url)
  if(pathname === "/signin" || pathname === "/signup"){
    if ((await auth()).sessionClaims) {
      const url = new URL('/dashboard', req.url)
      return NextResponse.redirect(url)
    }
  }

  if (isAdminRoute(req) && (await auth()).sessionClaims?.metadata?.role !== 'admin') {
    const url = new URL('/signup', req.url)
    return NextResponse.redirect(url)
  }

});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for Clerk's auto-proxy path
    "/__clerk/:path*",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
