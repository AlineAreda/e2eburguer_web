import { useContext, useState, FormEvent } from "react";
import Link from "next/link";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";
import { AuthContext } from "../contexts/AuthContext";
import { toast } from "react-toastify";
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
    <div className={styles.containerCenter}>
      {/* Seção do Banner */}
      <div className={styles.banner}>
        <img
          src="/banner-e2eburguer.png"
          alt="Banner Hambúrguer"
          className={styles.bannerImage}
        />
      </div>

      {/* Seção do Formulário */}
      <div className={styles.login}>
        <img
          src="/logo.svg"
          alt="Logo E2E Burguer"
          className={styles.logo}
        />
        <form className={styles.loginForm} onSubmit={handleLogin}>
          <Input
            id="email"
            placeholder="Digite seu e-mail"
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {emailError && <p className={styles.errorText}>{emailError}</p>}

          <Input
            id="password"
            placeholder="Sua senha"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {passwordError && (
            <p className={styles.errorText}>{passwordError}</p>
          )}

          <Button type="submit" loading={loading}>
            Acessar
          </Button>
        </form>
        {/* Link atualizado para corrigir o erro */}
        <Link href="/signup" className={styles.text}>
          Já possui uma conta? Faça seu login
        </Link>
      </div>
    </div>
  );
}
