import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Define routes that should NOT require authentication
const PUBLIC_ROUTES = ["/user/login", "/user/register", "/admin/login"];

export function middleware(req: NextRequest) {}
//     const authToken = req.cookies.get("auth_token")?.value; // Get JWT token from cookies
//     const pathname = req.nextUrl.pathname;

//     // Allow access to public routes
//     if (PUBLIC_ROUTES.includes(pathname)) {
//         return NextResponse.next();
//     }

//     // If no token is found, redirect based on the requested path
//     if (!authToken) {
//         if (pathname.startsWith("/user/")) {
//             return NextResponse.redirect(new URL("/user/login", req.url));
//         } else if (pathname.startsWith("/admin/")) {
//             return NextResponse.redirect(new URL("/admin/login", req.url));
//         } else {
//             return NextResponse.redirect(new URL("/user/login", req.url)); // Default redirect
//         }
//     }

//     return NextResponse.next(); // Allow access if authenticated
// }

// Apply middleware to all routes except static files and API routes
export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
