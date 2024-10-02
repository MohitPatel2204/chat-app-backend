import App from "./app";
import AuthenticationRoutes from "./src/routers/authentication.route";

const app = new App([new AuthenticationRoutes()]);
app.listen();
