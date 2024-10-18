import { Route, Routes } from "react-router-dom";
import RootLayout from "./layouts/RootLayout";
import BookOverview from "./pages/bookoverview/BookOverview";
import Home from "./pages/home/Home";
import WishList from "./pages/wishlist/WishList";

// const HomeLazy = lazy(() => import("./pages/home/Home"));
// const WishListLazy = lazy(() => import("./pages/wishlist/WishList"));
// const BookOverviewLazy = lazy(
//   () => import("./pages/bookoverview/BookOverview")
// );

function App() {
  return (
    <Routes>
      <Route path="/" element={<RootLayout />}>
        <Route
          index
          element={
            // <Suspense fallback={<Fallback />}>
            <Home />
            // </Suspense>
          }
        />
        <Route
          path="/wishlist"
          element={
            // <Suspense fallback={<Fallback />}>
            <WishList />
            // </Suspense>
          }
        />

        <Route
          path="/:id"
          element={
            // <Suspense fallback={<Fallback />}>
            <BookOverview />
            // </Suspense>
          }
        />
      </Route>
    </Routes>
  );
}

export default App;
