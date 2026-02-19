import { createBrowserRouter } from "react-router";
import { Root } from "./pages/Root";
import { Home } from "./pages/Home";
import { Contact } from "./pages/Contact";
import { WhoWeAre } from "./pages/WhoWeAre";
import { Products } from "./pages/Products";
import { ProductDetail } from "./pages/ProductDetail";
import { Sustainability } from "./pages/Sustainability";
import { Careers } from "./pages/Careers";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      { index: true, Component: Home },
      { path: "who-we-are", Component: WhoWeAre },
      { path: "products", Component: Products },
      { path: "products/:slug", Component: ProductDetail },
      { path: "sustainability", Component: Sustainability },
      { path: "careers", Component: Careers },
      { path: "contact", Component: Contact },
    ],
  },
]);
