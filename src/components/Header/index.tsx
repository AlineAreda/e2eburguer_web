import { useContext } from "react";
import { useRouter } from "next/router";
import styles from "./styles.module.scss";
import Link from "next/link";
import { FiLogOut } from "react-icons/fi";
import { AuthContext } from "../../contexts/AuthContext";

export function Header() {
  const { signOut, isAuthenticated, user } = useContext(AuthContext);
  const router = useRouter();

  const handleLogoClick = () => {
    const redirectTo = isAuthenticated ? "/dashboard" : "/";
    router.push(redirectTo);
  };

  const userInitials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
    : "U";

  return (
    <header className={styles.headerContainer}>
      <div className={styles.headerContent}>
        <div onClick={handleLogoClick} style={{ cursor: "pointer" }}>
          <img
            src="/logo.svg"
            width={190}
            height={60}
            alt="logo"
            data-testid="dashboard-link"
          />
        </div>

        <nav className={styles.menuNav}>
          <Link href="/category">
            <a
              className={
                router.pathname === "/category" ? styles.activeLink : ""
              }
              data-testid="category-link"
            >
              Cadastrar Categoria
            </a>
          </Link>

          <Link href="/product">
            <a
              className={
                router.pathname === "/product" ? styles.activeLink : ""
              }
              data-testid="cardapio-link"
            >
              Cadastrar Cardápio
            </a>
          </Link>

          <Link href="/products">
            <a
              className={
                router.pathname === "/products" ? styles.activeLink : ""
              }
              data-testid="products-link"
            >
              Gerenciar Cardápio
            </a>
          </Link>

          <div className={styles.userAvatar}>
            <span className={styles.avatar} data-testid="user-avatar">
              {userInitials}
            </span>
            <span className={styles.greeting} data-testid="user-greeting">
              Olá, {user?.name?.split(" ")[0]}!
            </span>
          </div>

          <button onClick={signOut}>
            <FiLogOut color="#FFF" size={24} data-testid="logout-button" />
          </button>
        </nav>
      </div>
    </header>
  );
}
