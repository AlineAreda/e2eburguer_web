import { useContext, useState, FormEvent } from "react";
import Link from "next/link";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";
import { AuthContext } from "../contexts/AuthContext";
import { toast } from "react-toastify";
import { decodeToken } from "../utils/decodeToken";
import Router from "next/router";
import styles from "../../styles/home.module.scss";

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
      toast.warning("Preencha os campos corretamente!", {
        toastId: "warning-toast",
      });
      return;
    }

    setLoading(true);

    try {
      const response = (await signIn({ email, password })) as unknown as {
        ok: boolean;
        data: { token: string };
      };

      if (response?.ok) {
        const { token } = response.data;
        const decoded = decodeToken(token);

        if (!token || !decoded) {
          toast.error("Erro inesperado. Realize o login novamente.", {
            toastId: "error-toast",
          });
          return;
        }

        // Remove todas as mensagens de toast anteriores
        toast.dismiss();

        // Fluxo baseado no perfil do usuário
        if (decoded.isGestao) {
          toast.success("Login realizado com sucesso!", {
            toastId: "success-toast",
          });
          localStorage.setItem("@nextauth.token", token);
          Router.push("/dashboard");
        } else {
          toast.warning("Acesse através do app!", {
            toastId: "warning-toast",
          });
          localStorage.removeItem("@nextauth.token");
          Router.push("/app-info");
        }
      } else {
        toast.dismiss(); // Remove mensagens de sucesso ativas
        toast.warning("Credenciais inválidas. Verifique seu e-mail e senha.", {
          toastId: "warning-toast",
        });
      }
    } catch (error) {
      console.error("Erro no login:", error);
    } finally {
      setLoading(false);
    }
  }
  return (
    <div className={styles.containerCenter}>
      <div className={styles.banner}>
        <img
          src="/banner-e2eburguer.png"
          alt="Banner Hambúrguer"
          className={styles.bannerImage}
        />
      </div>
      <div className={styles.login}>
        <img src="/logo.svg" alt="Logo E2E Burguer" className={styles.logo} />
        <h1 className={styles.title}>Faça seu login</h1>
        <form className={styles.loginForm} onSubmit={handleLogin}>
          <Input
            id="email"
            placeholder="Digite seu e-mail"
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="username"
          />
          {emailError && <p className={styles.errorText}>{emailError}</p>}

          <Input
            id="password"
            placeholder="Sua senha"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
          />
          {passwordError && <p className={styles.errorText}>{passwordError}</p>}

          <Button type="submit" loading={loading}>
            Acessar
          </Button>
        </form>
        <Link href="/signup" className={styles.text}>
          Não possui uma conta? Faça seu Cadastro!
        </Link>
      </div>
    </div>
  );
}
