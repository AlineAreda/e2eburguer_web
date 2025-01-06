import { useState, useEffect, ChangeEvent } from "react";
import Head from "next/head";
import styles from "./styles.module.scss";
import { Header } from "../../components/Header";
import { setupAPIClient } from "../../services/api";
import { toast } from "react-toastify";
import { FiEdit, FiTrash } from "react-icons/fi";
import { FiUpload } from "react-icons/fi";

type ProductProps = {
  id: string;
  name: string;
  description: string;
  price: string;
  category: string;
  banner_url?: string;
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

  const [editingProduct, setEditingProduct] = useState<ProductProps | null>(
    null
  );

  const [banner, setBanner] = useState<File | null>(null);
  const [previewBanner, setPreviewBanner] = useState<string>("");

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
    setEditingProduct(product);
    setPreviewBanner(product.banner_url || "");
  }

  function handleFile(e: ChangeEvent<HTMLInputElement>) {
    if (!e.target.files) return;

    const file = e.target.files[0];
    setBanner(file);
    setPreviewBanner(URL.createObjectURL(file));
  }

  async function handleUpdateProduct(event: React.FormEvent) {
    event.preventDefault();

    if (!editingProduct) return;

    const apiClient = setupAPIClient();
    try {
      const { id, name, description, price, category } = editingProduct;

      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("category", category);

      if (banner) {
        formData.append("banner", banner);
      }

      await apiClient.patch(`/product/${id}`, formData);

      toast.success("Produto atualizado com sucesso!");
      setEditingProduct(null);

      const updatedProducts = await apiClient.get("/products");
      setProducts(updatedProducts.data);
    } catch (error) {
      toast.error("Erro ao atualizar produto.");
    }
  }

  function formatPrice(value: string): string {
    const parsedValue = parseFloat(value.replace(",", "."));
    return `R$ ${parsedValue.toFixed(2).replace(".", ",")}`;
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

          {editingProduct && (
            <form
              className={styles.editForm}
              onSubmit={handleUpdateProduct}
              data-testid="edit-form"
            >
              <h2>Editar Produto</h2>
              <label className={styles.labelAvatar}>
                {previewBanner ? (
                  <img src={previewBanner} alt="Banner do produto" />
                ) : (
                  <span>
                    <FiUpload size={30} color="#FFF" />
                  </span>
                )}
                <input type="file" accept="image/*" onChange={handleFile} />
              </label>
              <input
                type="text"
                value={editingProduct.name}
                onChange={(e) =>
                  setEditingProduct({
                    ...editingProduct,
                    name: e.target.value,
                  })
                }
                placeholder="Nome do produto"
              />
              <textarea
                value={editingProduct.description}
                onChange={(e) =>
                  setEditingProduct({
                    ...editingProduct,
                    description: e.target.value,
                  })
                }
                placeholder="Descrição do produto"
              />
              <input
                type="text"
                value={editingProduct.price}
                onChange={(e) =>
                  setEditingProduct({
                    ...editingProduct,
                    price: e.target.value,
                  })
                }
                placeholder="Preço do produto"
                onBlur={() => {
                  const formattedPrice = parseFloat(editingProduct.price)
                    .toFixed(2)
                    .replace(".", ",");
                  setEditingProduct({
                    ...editingProduct,
                    price: formattedPrice,
                  });
                }}
              />
              <select
                value={editingProduct.category}
                onChange={(e) =>
                  setEditingProduct({
                    ...editingProduct,
                    category: e.target.value,
                  })
                }
              >
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
              <button type="submit">Salvar Alterações</button>
              <button type="button" onClick={() => setEditingProduct(null)}>
                Cancelar
              </button>
            </form>
          )}

          {loading ? (
            <p>Carregando produtos...</p>
          ) : products.length === 0 ? (
            <p>Nenhum produto encontrado!</p>
          ) : (
            <ul className={styles.productList}>
              {products.map((product) => (
                <li key={product.id} className={styles.productItem}>
                  <div className={styles.productHeader}>
                    <strong className={styles.productName}>{product.name}</strong>
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
                  </div>
                  <p className={styles.productDescription}>
                    {product.description}
                  </p>
                  <span className={styles.productPrice}>
                    {formatPrice(product.price)}
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
