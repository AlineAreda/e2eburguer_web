import { useContext, FormEvent, useState } from "react";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import logoImg from "../../public/logo.svg";

import styles from "../../styles/home.module.scss";

import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";

import { toast } from "react-toastify";

import { AuthContext } from "../contexts/AuthContext";

import { canSSRGuest } from "../utils/canSSRGuest";

export default function Home() {
  const { signIn } = useContext(AuthContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const [loading, setLoading] = useState(false);

  async function handleLogin(event: FormEvent) {
    event.preventDefault();


    setEmailError("");
    setPasswordError("");

    let hasError = false;


    if (email === "") {
      setEmailError("O campo de e-mail é obrigatório.");
      hasError = true;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError("Por favor, insira um e-mail válido.");
      hasError = true;
    }


    if (password === "") {
      setPasswordError("O campo de senha é obrigatório.");
      hasError = true;
    }


    if (hasError) {
      toast.warning("Preencha os campos corretamente!");
      return;
    }

    setLoading(true);

    try {
      const response = (await signIn({ email, password })) as unknown as {
        ok: boolean;
        status?: number;
        error?: string;
      };

      if (response.ok) {
        toast.success("Login realizado com sucesso!");
      } else {
        let errorMessage =
          "Erro ao acessar, verifique suas credenciais de acesso!";

        if (response.status === 401) {
          errorMessage = response.error || "Usuário e/ou Senha incorretos.";
        } else if (response.status === 400) {
          errorMessage = response.error || "E-mail e senha são obrigatórios.";
        } else if (response.status === 500) {
          errorMessage = response.error || "Erro interno no servidor.";
        }

        toast.error(errorMessage);
      }
    } catch (error) {
      //   toast.error("Ocorreu um erro. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Head>
        <title>E2E Burguer - Faça seu login</title>
      </Head>
      <div className={styles.containerCenter}>
        <Image src={logoImg} alt="Logo E2E Burguer" />
        <div className={styles.login}>
          <form onSubmit={handleLogin} noValidate>
            <Input
              id="email"
              data-testid="email-input"
              placeholder="Digite seu e-mail"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {emailError && <p className={styles.errorText}>{emailError}</p>}

            <Input
              id="senha"
              data-testid="senha-input"
              placeholder="Sua senha"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {passwordError && (
              <p className={styles.errorText}>{passwordError}</p>
            )}

            <Button
              id="btn-acessar"
              data-testid="botton-submit"
              type="submit"
              loading={loading}
            >
              Acessar
            </Button>
          </form>
          <Link href="/signup">
            <span className={styles.text}>
              Já possui uma conta? Faça seu login
            </span>
          </Link>
        </div>
      </div>
    </>
  );
}

export const getServerSideProps = canSSRGuest(async (ctx) => {
  return {
    props: {},
  };
});
