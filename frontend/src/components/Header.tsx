import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ShoppingCart, Heart, User, Menu, X, LogOut, Package } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { useWishlistStore } from '@/store/wishlistStore';
import { useAuthStore } from '@/store/authStore';

const Header = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const totalCartItems = useCartStore((s) =>
    s.items.reduce((sum, item) => sum + item.quantity, 0)
  );
  const wishlistItems = useWishlistStore((s) => s.items);
  const { user, isAuthenticated, logout } = useAuthStore();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/?search=${encodeURIComponent(searchQuery)}`);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-50 bg-primary shadow-md">
      <div className="container mx-auto flex items-center gap-4 px-4 py-2.5">
        <Link to="/" className="flex-shrink-0">
          <div className="flex flex-col items-center">
            <span className="text-xl font-bold italic text-primary-foreground">Flipkart</span>
            <span className="text-[10px] italic text-primary-foreground/70">
              Explore <span className="text-accent">Plus</span>
            </span>
          </div>
        </Link>

        <form onSubmit={handleSearch} className="hidden flex-1 md:flex">
          <div className="flex w-full max-w-2xl items-center overflow-hidden rounded-sm bg-card">
            <input
              type="text"
              placeholder="Search for Products, Brands and More"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 px-4 py-2 text-sm text-foreground outline-none"
            />
            <button type="submit" className="px-4 py-2 text-primary hover:bg-muted">
              <Search size={20} />
            </button>
          </div>
        </form>

        <div className="ml-auto flex items-center gap-1 md:gap-4">
          {isAuthenticated ? (
            <>
              <div className="hidden items-center gap-1 md:flex">
                <span className="rounded px-2 py-1.5 text-sm font-medium text-primary-foreground">
                  Hi, {user?.name}
                </span>
              </div>
              <Link
                to="/orders"
                className="hidden items-center gap-1 rounded px-3 py-1.5 text-sm font-medium text-primary-foreground hover:bg-primary-foreground/10 md:flex"
              >
                <Package size={18} />
                <span>Order History</span>
              </Link>
              <button
                onClick={handleLogout}
                className="hidden items-center gap-1 rounded px-3 py-1.5 text-sm font-medium text-primary-foreground hover:bg-primary-foreground/10 md:flex"
              >
                <LogOut size={18} />
                <span>Logout</span>
              </button>
            </>
          ) : (
            <Link
              to="/auth"
              className="hidden items-center gap-1 rounded px-3 py-1.5 text-sm font-medium text-primary-foreground hover:bg-primary-foreground/10 md:flex"
            >
              <User size={18} />
              <span>Login</span>
            </Link>
          )}

          <Link
            to="/wishlist"
            className="relative flex items-center gap-1 rounded px-2 py-1.5 text-sm font-medium text-primary-foreground hover:bg-primary-foreground/10 md:px-3"
          >
            <Heart size={18} />
            {wishlistItems.length > 0 && (
              <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-accent-foreground">
                {wishlistItems.length}
              </span>
            )}
            <span className="hidden md:inline">Wishlist</span>
          </Link>
          <Link
            to="/cart"
            className="relative flex items-center gap-1 rounded px-2 py-1.5 text-sm font-medium text-primary-foreground hover:bg-primary-foreground/10 md:px-3"
          >
            <ShoppingCart size={18} />
            {totalCartItems > 0 && (
              <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-accent-foreground">
                {totalCartItems}
              </span>
            )}
            <span className="hidden md:inline">Cart</span>
          </Link>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-primary-foreground md:hidden"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="border-t border-primary-foreground/10 px-4 py-3 md:hidden">
          <div className="flex flex-col gap-2">
            {isAuthenticated ? (
              <>
                <span className="text-sm font-medium text-primary-foreground">Hi, {user?.name}</span>
                <Link to="/orders" onClick={() => setMobileMenuOpen(false)} className="text-sm text-primary-foreground/80 hover:text-primary-foreground">My Order History</Link>
                <button onClick={() => { handleLogout(); setMobileMenuOpen(false); }} className="text-left text-sm text-primary-foreground/80 hover:text-primary-foreground">Logout</button>
              </>
            ) : (
              <Link to="/auth" onClick={() => setMobileMenuOpen(false)} className="text-sm font-medium text-primary-foreground">Login / Sign Up</Link>
            )}
          </div>
        </div>
      )}

      {/* Mobile search */}
      <div className="border-t border-primary-foreground/10 px-4 py-2 md:hidden">
        <form onSubmit={handleSearch} className="flex items-center overflow-hidden rounded-sm bg-card">
          <input
            type="text"
            placeholder="Search for Products, Brands and More"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 px-3 py-2 text-sm text-foreground outline-none"
          />
          <button type="submit" className="px-3 py-2 text-primary">
            <Search size={18} />
          </button>
        </form>
      </div>
    </header>
  );
};

export default Header;
