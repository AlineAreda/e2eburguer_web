import { useState, useEffect } from "react";
import Head from "next/head";
import styles from "./styles.module.scss";
import { Header } from "../../components/Header";
import Footer from "../../components/Footer";

import { setupAPIClient } from "../../services/api";
import { toast } from "react-toastify";
import { FiEdit, FiTrash2 } from "react-icons/fi";

type ProductProps = {
  id: string;
  name: string;
  description: string;
  price: string;
  banner?: string;
  category_id: string;
};

type CategoryProps = {
  id: string;
  name: string;
};

export default function Products() {
  const [products, setProducts] = useState<ProductProps[]>([]);
  const [categories, setCategories] = useState<CategoryProps[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editProduct, setEditProduct] = useState<ProductProps | null>(null);

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    async function loadCategories() {
      const apiClient = setupAPIClient();
      const response = await apiClient.get("/category/list");
      setCategories(response.data);
    }

    async function loadProducts() {
      const apiClient = setupAPIClient();
      const response = await apiClient.get("/category/product/all");
      setProducts(response.data);
    }

    loadCategories();
    loadProducts();
  }, []);

  async function handleFilterByCategory(categoryId: string) {
    const apiClient = setupAPIClient();
    const response = await apiClient.get(`/category/product/${categoryId}`);
    setProducts(response.data);
  }

  async function handleDeleteProduct(productId: string) {
    const apiClient = setupAPIClient();
    try {
      await apiClient.delete(`/product/remove/${productId}`);
      toast.success("Produto excluído com sucesso!");
      setProducts(products.filter((product) => product.id !== productId));
    } catch (error) {
      toast.error("Erro ao excluir o produto.");
    }
  }

  async function handleUpdateProduct(event: React.FormEvent) {
    event.preventDefault();

    if (!editProduct) return;

    const apiClient = setupAPIClient();
    try {
      const data = {
        name,
        price,
        description,
        category_id: editProduct.category_id,
      };

      await apiClient.patch(`/product/${editProduct.id}`, data);
      toast.success("Produto atualizado com sucesso!");

      setProducts(
        products.map((product) =>
          product.id === editProduct.id ? { ...product, ...data } : product
        )
      );

      setIsEditing(false);
      setEditProduct(null);
      setName("");
      setPrice("");
      setDescription("");
    } catch (error) {
      toast.error("Erro ao atualizar o produto.");
    }
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

          {/* Filtro por Categoria */}
          <select
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              handleFilterByCategory(e.target.value);
            }}
            className={styles.select}
          >
            <option value="">Todas as Categorias</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>

          {/* Lista de Produtos */}
          <ul className={styles.productList}>
            {products.map((product) => (
              <li key={product.id} className={styles.productItem}>
                <div className={styles.productInfo}>
                  <strong>{product.name}</strong>
                  <span>{product.description}</span>
                  <span>R$ {parseFloat(product.price).toFixed(2)}</span>
                  {product.banner && (
                    <img src={product.banner} alt={product.name} />
                  )}
                </div>
                <div className={styles.actions}>
                  <button
                    onClick={() => {
                      setIsEditing(true);
                      setEditProduct(product);
                      setName(product.name);
                      setPrice(product.price);
                      setDescription(product.description);
                    }}
                  >
                    <FiEdit size={20} color="#fff" />
                  </button>
                  <button onClick={() => handleDeleteProduct(product.id)}>
                    <FiTrash2 size={20} color="#fff" />
                  </button>
                </div>
              </li>
            ))}
          </ul>

          {/* Formulário de Edição */}
          {isEditing && editProduct && (
            <form onSubmit={handleUpdateProduct} className={styles.editForm}>
              <h2 className={styles.editTitle}>Editando Produto</h2>
              <input
                type="text"
                placeholder="Nome do produto"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <input
                type="text"
                placeholder="Preço"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
              <textarea
                placeholder="Descrição"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
              <div className={styles.formActions}>
                <button type="submit">Salvar</button>
                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(false);
                    setEditProduct(null);
                    setName("");
                    setPrice("");
                    setDescription("");
                  }}
                >
                  Cancelar
                </button>
              </div>
            </form>
          )}
        </main>
        <Footer />
      </div>
    </>
  );
}
