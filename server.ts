import App from "./app";
import AuthenticationRoutes from "./src/routers/authentication.route";
import UserRoutes from "./src/routers/user.route";

const app = new App([new AuthenticationRoutes(), new UserRoutes()]);
app.listen();
