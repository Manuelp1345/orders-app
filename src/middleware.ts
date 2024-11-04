import { auth } from "@/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  console.log(req.nextUrl.pathname);
  if (
    (req.nextUrl.pathname.includes("/orders") ||
      req.nextUrl.pathname.includes("/products")) &&
    !req.auth
  ) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  if (req.nextUrl.pathname === "/" && req.auth) {
    return NextResponse.redirect(new URL("/orders", req.url));
  }

  return NextResponse.next();
});
