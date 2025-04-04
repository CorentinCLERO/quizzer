// import { withAuth } from "next-auth/middleware"

// export default withAuth({
//   pages: {
//     signIn: "/login",
//   },
// })
const middlewareConfig = {};
export default middlewareConfig;
export const config = { matcher: ["/api/protected/:path*"] }