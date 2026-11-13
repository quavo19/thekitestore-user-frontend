import { ShopAssistant } from "@/components/assistant/ShopAssistant";
import { AppProvider } from "@/contexts/AppContext";
import { CartProvider } from "@/contexts/CartContext";
import { SidebarProvider } from "@/contexts/SidebarContext";
import { UserProvider } from "@/contexts/UserContext";
import { WishlistProvider } from "@/contexts/WishlistContext";
import { AppRouter } from "@/routes/AppRouter";

function App() {
  return (
    <AppProvider>
      <UserProvider>
        <SidebarProvider>
          <WishlistProvider>
            <CartProvider>
              <AppRouter />
              <ShopAssistant />
            </CartProvider>
          </WishlistProvider>
        </SidebarProvider>
      </UserProvider>
    </AppProvider>
  );
}

export default App;
