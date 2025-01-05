import { useState, ChangeEvent, FormEvent } from "react";
import Head from "next/head";
import styles from "./styles.module.scss";
import { Header } from "../../components/Header";
import Footer from "../../components/Footer";

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
  const [categorySelected, setCategorySelected] = useState(0);

  function handleFile(e: ChangeEvent<HTMLInputElement>) {
    if (!e.target.files) {
      return;
    }

    const image = e.target.files[0];

    if (!image) {
      return;
    }

    if (
      image.type === "image/jpeg" ||
      image.type === "image/png" ||
      image.type === "image/webp"
    ) {
      setImageAvatar(image);
      setAvatarUrl(URL.createObjectURL(image));
    }
  }

  function handleChangeCategory(event: ChangeEvent<HTMLSelectElement>) {
    setCategorySelected(Number(event.target.value));
  }

  async function handleRegister(event: FormEvent) {
    event.preventDefault();

    if (name === "" || price === "" || description === "") {
      toast.warning("Preencha todos os campos obrigatórios!", {
        toastId: "warning-toast",
      });
      return;
    }

    try {
      const data = new FormData();

      data.append("name", name);
      data.append("price", price);
      data.append("description", description);
      data.append("category_id", categories[categorySelected].id);

      // Só adicione a imagem se ela estiver presente
      if (imageAvatar) {
        data.append("banner", imageAvatar);
      }

      const apiClient = setupAPIClient();
      await apiClient.post("/product", data);

      toast.success("Produto cadastrado com sucesso!", {
        toastId: "success-toast",
      });

      // Limpar os campos após o cadastro
      setName("");
      setPrice("");
      setDescription("");
      setImageAvatar(null);
      setAvatarUrl("");
    } catch (err) {
      console.error(err);
      toast.error("Ops... Erro ao cadastrar!", {
        toastId: "error-toast",
      });
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
              <span>
                <FiUpload size={30} color="#FFF" />
              </span>

              <input
                type="file"
                accept="image/png, image/jpeg, image/webp"
                onChange={handleFile}
              />

              {avatarUrl && (
                <img
                  className={styles.preview}
                  src={avatarUrl}
                  alt="Foto do produto"
                  width={250}
                  height={250}
                />
              )}
            </label>

            <select value={categorySelected} onChange={handleChangeCategory}
            data-testid="category-select"
            name="category"
            required
            >
              <option value="" disabled>Selecione uma categoria</option>
              {categories.map((item) => (
                <option key={item.id} value={item.id} data-testid={`category-option-${item.id}`}>
                  {item.name}
                </option>
              ))}
            </select>

            <input
              type="text"
              data-testid="name-product"
              placeholder="Digite o nome do produto..."
              className={styles.input}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <input
              type="text"
              data-testid="price-product"
              placeholder="Preço do produto..."
              className={styles.input}
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />

            <textarea
              placeholder="Descreva o produto..."
              data-testid="description-product"
              className={styles.input}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />

            <button
              className={styles.buttonAdd}
              type="submit"
              data-testid="btn-cadastrar"
            >
              Cadastrar
            </button>
          </form>
        </main>

        {/* Adicionando o Footer */}
        <Footer />
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
