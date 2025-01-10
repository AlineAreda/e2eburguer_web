import { useContext, useState, FormEvent } from "react";
import Link from "next/link";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";
import { AuthContext } from "../contexts/AuthContext";
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

    if (email.trim() === "") {
      setEmailError("O campo de e-mail é obrigatório.");
      hasError = true;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError("Por favor, insira um e-mail válido.");
      hasError = true;
    }

    if (password.trim() === "") {
      setPasswordError("O campo de senha é obrigatório.");
      hasError = true;
    }

    if (hasError) {
      return;
    }

    setLoading(true);
    await signIn({ email, password });
    setLoading(false);
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
