import { AppProvider } from "@/contexts/AppContext";
import { CartProvider } from "@/contexts/CartContext";
import { SidebarProvider } from "@/contexts/SidebarContext";
import { WishlistProvider } from "@/contexts/WishlistContext";
import { AppRouter } from "@/routes/AppRouter";

function App() {
  return (
    <AppProvider>
      <SidebarProvider>
        <WishlistProvider>
          <CartProvider>
            <AppRouter />
          </CartProvider>
        </WishlistProvider>
      </SidebarProvider>
    </AppProvider>
  );
}

export default App;
