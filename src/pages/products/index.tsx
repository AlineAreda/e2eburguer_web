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
  const [loading, setLoading] = useState(true); // Adicionado para exibir estado de carregamento

  useEffect(() => {
    async function loadProducts() {
      const apiClient = setupAPIClient();
      try {
        const response = await apiClient.get("/products");

        // Verificação se os dados estão no formato esperado
        if (Array.isArray(response.data)) {
          setProducts(response.data);
        } else {
          throw new Error("Formato inesperado dos dados.");
        }
      } catch (error) {
        toast.error(
          "Erro ao carregar produtos. Verifique sua conexão ou tente novamente mais tarde."
        );
      } finally {
        setLoading(false); // Garantir que o estado de carregamento seja atualizado
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
