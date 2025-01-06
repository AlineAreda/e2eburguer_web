import { useState, useEffect } from "react";
import Head from "next/head";
import styles from "./styles.module.scss";
import { Header } from "../../components/Header";
import { setupAPIClient } from "../../services/api";
import { toast } from "react-toastify";
import { FiEdit, FiTrash } from "react-icons/fi";

type ProductProps = {
  id: string;
  name: string;
  description: string;
  price: string;
  category: string;
};

type CategoryProps = {
  id: string;
  name: string;
};

export default function Products() {
  const [products, setProducts] = useState<ProductProps[]>([]);
  const [categories, setCategories] = useState<CategoryProps[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadInitialData() {
      const apiClient = setupAPIClient();
      try {
        const categoryResponse = await apiClient.get("/category/list");
        setCategories(categoryResponse.data);

        const productResponse = await apiClient.get("/products");
        setProducts(productResponse.data);
      } catch (error) {
        toast.error("Erro ao carregar dados. Tente novamente mais tarde.");
      } finally {
        setLoading(false);
      }
    }

    loadInitialData();
  }, []);

  async function filterProductsByCategory(categoryId: string) {
    setLoading(true);
    const apiClient = setupAPIClient();
    try {
      if (categoryId) {
        const response = await apiClient.get(`/category/product/${categoryId}`);
        setProducts(response.data);
      } else {
        const response = await apiClient.get("/products");
        setProducts(response.data);
      }
    } catch (error) {
      toast.error("Erro ao filtrar produtos.");
    } finally {
      setLoading(false);
    }
  }

  async function deleteProduct(productId: string) {
    const apiClient = setupAPIClient();
    try {
      await apiClient.delete(`/product/remove/${productId}`);
      toast.success("Produto deletado com sucesso!");
      setProducts((prev) => prev.filter((product) => product.id !== productId));
    } catch (error) {
      toast.error("Erro ao deletar produto.");
    }
  }

  function openUpdateForm(product: ProductProps) {
    // Lógica para abrir o formulário de atualização
    toast.info(`Abrindo formulário para atualizar o produto: ${product.name}`);
    // Implementar modal ou redirecionar para página de edição com os dados
  }

  return (
    <>
      <Head>
        <title>Produtos - E2E Burguer</title>
      </Head>
      <div>
        <Header />
        <main className={styles.container}>
          <h1 className={styles.title}>Produtos</h1>

          {/* Filtro por categoria */}
          <select
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              filterProductsByCategory(e.target.value);
            }}
            className={styles.filter}
          >
            <option value="">Todas as categorias</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>

          {loading ? (
            <p>Carregando produtos...</p>
          ) : products.length === 0 ? (
            <p>Nenhum produto encontrado.</p>
          ) : (
            <ul className={styles.productList}>
              {products.map((product) => (
                <li key={product.id} className={styles.productItem}>
                  <strong className={styles.productName}>{product.name}</strong>
                  <p className={styles.productDescription}>
                    {product.description}
                  </p>
                  <span className={styles.productPrice}>
                    R$ {parseFloat(product.price).toFixed(2)}
                  </span>
                  <div className={styles.actions}>
                    <button
                      onClick={() => openUpdateForm(product)}
                      className={styles.editButton}
                    >
                      <FiEdit size={20} />
                    </button>
                    <button
                      onClick={() => deleteProduct(product.id)}
                      className={styles.deleteButton}
                    >
                      <FiTrash size={20} />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </main>
      </div>
    </>
  );
}
