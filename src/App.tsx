import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import Fallback from "./components/Fallback";
import RootLayout from "./layouts/RootLayout";

const HomeLazy = lazy(() => import("./pages/home/Home"));
const WishListLazy = lazy(() => import("./pages/wishlist/WishList"));
const BookOverviewLazy = lazy(
  () => import("./pages/bookoverview/BookOverview")
);

function App() {
  return (
    <Routes>
      <Route path="/" element={<RootLayout />}>
        <Route
          index
          element={
            <Suspense fallback={<Fallback />}>
              <HomeLazy />
            </Suspense>
          }
        />
        <Route
          path="/wishlist"
          element={
            <Suspense fallback={<Fallback />}>
              <WishListLazy />
            </Suspense>
          }
        />

        <Route
          path="/:id"
          element={
            <Suspense fallback={<Fallback />}>
              <BookOverviewLazy />
            </Suspense>
          }
        />
      </Route>
    </Routes>
  );
}

export default App;
