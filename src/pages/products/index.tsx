import { useState, useEffect } from "react";
import Head from "next/head";
import styles from "./styles.module.scss";
import { Header } from "../../components/Header";
import Footer from "../../components/Footer";
import { setupAPIClient } from "../../services/api";
import { toast } from "react-toastify";

type ProductProps = {
  id: string;
  name: string;
  description: string;
  price: string;
  category: string;
};

export default function Products() {
  const [products, setProducts] = useState<ProductProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false); // Estado de erro separado

  useEffect(() => {
    async function loadProducts() {
      const apiClient = setupAPIClient();
      try {
        const response = await apiClient.get("/products");

        if (Array.isArray(response.data)) {
          setProducts(response.data);
          setError(false); // Sem erro
        } else {
          throw new Error("Formato inesperado dos dados.");
        }
      } catch (error) {
        setError(true); // Marca que houve erro
        toast.error(
          "Erro ao carregar produtos. Verifique sua conexão ou tente novamente mais tarde."
        );
      } finally {
        setLoading(false);
      }
    }

    loadProducts();
  }, []);

  return (
    <>
      <Head>
        <title>Produtos - E2E Burguer</title>
      </Head>
      <div>
        <Header />
        <main
          className={styles.container}
          id="product-container"
          data-testid="product-container"
        >
          <h1
            className={styles.title}
            id="product-title"
            data-testid="product-title"
          >
            Produtos
          </h1>

          {loading ? (
            <p
              className={styles.loading}
              id="loading-message"
              data-testid="loading-message"
            >
              Carregando produtos...
            </p>
          ) : error ? (
            <p
              className={styles.error}
              id="error-message"
              data-testid="error-message"
            >
              Não foi possível carregar os produtos. Tente novamente mais tarde.
            </p>
          ) : products.length === 0 ? (
            <p
              className={styles.noProducts}
              id="no-products-message"
              data-testid="no-products-message"
            >
              Nenhum produto encontrado.
            </p>
          ) : (
            <ul
              className={styles.productList}
              id="product-list"
              data-testid="product-list"
            >
              {products.map((product) => (
                <li
                  key={product.id}
                  className={styles.productItem}
                  id={`product-item-${product.id}`}
                  data-testid={`product-item-${product.id}`}
                >
                  <strong
                    className={styles.productName}
                    id={`product-name-${product.id}`}
                    data-testid={`product-name-${product.id}`}
                  >
                    {product.name}
                  </strong>
                  <p
                    className={styles.productDescription}
                    id={`product-description-${product.id}`}
                    data-testid={`product-description-${product.id}`}
                  >
                    {product.description}
                  </p>
                  <span
                    className={styles.productPrice}
                    id={`product-price-${product.id}`}
                    data-testid={`product-price-${product.id}`}
                  >
                    R$ {parseFloat(product.price).toFixed(2)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </main>
      </div>
    </>
  );
}
