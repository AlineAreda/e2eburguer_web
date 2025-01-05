import { useContext } from "react";
import { useRouter } from "next/router";
import styles from "./styles.module.scss";
import Link from "next/link";
import { FiLogOut } from "react-icons/fi";
import { AuthContext } from "../../contexts/AuthContext";

export function Header() {
  const { signOut, isAuthenticated, user } = useContext(AuthContext); // Obtendo o nome do usuário
  const router = useRouter();

  const handleLogoClick = () => {
    const redirectTo = isAuthenticated ? "/dashboard" : "/";
    router.push(redirectTo);
  };

  // Obter iniciais do nome do usuário
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

        {/* Links com destaque para a página ativa */}
        <Link href="/category">
          <a
            className={router.pathname === "/category" ? styles.activeLink : ""}
            data-testid="category-link"
          >
            Cadastrar Categoria
          </a>
        </Link>

        <Link href="/product">
          <a
            className={router.pathname === "/product" ? styles.activeLink : ""}
            data-testid="cardapio-link"
          >
            Cadastrar Cardápio
          </a>
        </Link>

        {/* Novo link para a página de produtos */}
        <Link href="/products">
          <a
            className={router.pathname === "/products" ? styles.activeLink : ""}
            data-testid="products-link"
          >
            Gerenciar Cardápio
          </a>
        </Link>

        <nav className={styles.menuNav}>
          {/* Saudação com o avatar */}
          <div className={styles.userAvatar}>
            <span className={styles.avatar} data-testid="user-name">{userInitials}</span>
            <span className={styles.greeting} data-testid="greeting">
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
