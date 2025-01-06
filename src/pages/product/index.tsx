import { useState, ChangeEvent, FormEvent } from "react";
import Head from "next/head";
import styles from "./styles.module.scss";
import { Header } from "../../components/Header";
import { canSSRAuth } from "../../utils/canSSRAuth";
import { FiUpload } from "react-icons/fi";
import { setupAPIClient } from "../../services/api";
import { toast } from "react-toastify";

type ItemProps = {
  id: string;
  name: string;
};

interface CategoryProps {
  categoryList: ItemProps[];
}

export default function Product({ categoryList }: CategoryProps) {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [imageAvatar, setImageAvatar] = useState<File | null>(null);
  const [categories, setCategories] = useState(categoryList || []);
  const [categorySelected, setCategorySelected] = useState("");

  function handleFile(e: ChangeEvent<HTMLInputElement>) {
    if (!e.target.files) return;

    const image = e.target.files[0];

    if (
      image.type === "image/jpeg" ||
      image.type === "image/png" ||
      image.type === "image/webp"
    ) {
      setImageAvatar(image);
      setAvatarUrl(URL.createObjectURL(image));
    }
  }

  function handlePriceChange(e: ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    if (/^[0-9]*[.,]?[0-9]*$/.test(value)) {
      setPrice(value.replace(",", "."));
    }
  }

  function handlePriceBlur() {
    if (price) {
      const formattedPrice = parseFloat(price).toFixed(2).replace(".", ",");
      setPrice(formattedPrice);
    }
  }

  function handleChangeCategory(event: ChangeEvent<HTMLSelectElement>) {
    setCategorySelected(event.target.value);
  }

  async function handleRegister(event: FormEvent) {
    event.preventDefault();

    if (!categorySelected || name === "" || price === "" || description === "") {
      toast.warning("Preencha todos os campos obrigatórios!");
      return;
    }

    const formattedPrice = price.replace(",", ".");

    try {
      const data = new FormData();
      data.append("name", name);
      data.append("price", formattedPrice);
      data.append("description", description);
      data.append("category_id", categorySelected);

      if (imageAvatar) {
        data.append("banner", imageAvatar);
      }

      const apiClient = setupAPIClient();
      await apiClient.post("/product", data);

      toast.success("Produto cadastrado com sucesso!");

      setName("");
      setPrice("");
      setDescription("");
      setImageAvatar(null);
      setAvatarUrl("");
      setCategorySelected("");
    } catch (err) {
      console.error(err);
      toast.error("Erro ao cadastrar produto!");
    }
  }

  return (
    <>
      <Head>
        <title>Novo produto - E2E Burguer</title>
      </Head>
      <div>
        <Header />
        <main className={styles.container}>
          <h1>Novo produto</h1>
          <form className={styles.form} onSubmit={handleRegister}>
            <label className={styles.labelAvatar}>
              {avatarUrl ? (
                <img src={avatarUrl} alt="Foto do produto" />
              ) : (
                <span>
                  <FiUpload size={30} color="#FFF" />
                </span>
              )}
              <input
                type="file"
                accept="image/png, image/jpeg, image/webp"
                onChange={handleFile}
              />
            </label>

            <select
              value={categorySelected}
              onChange={handleChangeCategory}
              className={styles.selectCategory}
            >
              <option value="" disabled>
                Selecione uma categoria
              </option>
              {categories.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
            {!categorySelected && (
              <p className={styles.errorMessage}>
                Selecione uma categoria para continuar.
              </p>
            )}

            <input
              type="text"
              placeholder="Digite o nome do produto..."
              className={styles.input}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <input
              type="text"
              placeholder="Preço do produto..."
              className={styles.input}
              value={price}
              onChange={handlePriceChange}
              onBlur={handlePriceBlur}
            />

            <textarea
              placeholder="Descreva o produto..."
              className={styles.input}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />

            <button className={styles.buttonAdd} type="submit">
              Cadastrar
            </button>
          </form>
        </main>
      </div>
    </>
  );
}

export const getServerSideProps = canSSRAuth(async (ctx) => {
  const apiClient = setupAPIClient(ctx);
  const response = await apiClient.get("/category/list");

  return {
    props: {
      categoryList: response.data,
    },
  };
});
