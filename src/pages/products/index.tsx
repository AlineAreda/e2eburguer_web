import { useState, useEffect } from "react";
import Head from "next/head";
import styles from "./products.module.scss";
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

  useEffect(() => {
    async function loadProducts() {
      const apiClient = setupAPIClient();
      try {
        const response = await apiClient.get("/products");
        setProducts(response.data);
      } catch {
        toast.error("Erro ao carregar produtos.");
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
        <main className={styles.container}>
          <h1>Produtos</h1>
          <ul className={styles.productList}>
            {products.map((product) => (
              <li key={product.id} className={styles.productItem}>
                <strong>{product.name}</strong>
                <p>{product.description}</p>
                <span>R$ {parseFloat(product.price).toFixed(2)}</span>
              </li>
            ))}
          </ul>
        </main>
        <Footer />
      </div>
    </>
  );
}
