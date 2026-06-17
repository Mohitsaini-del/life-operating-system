import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/login",
  },
});

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/habits/:path*",
    "/goals/:path*",
    "/notes/:path*",
    "/assistant/:path*",
  ],
};
