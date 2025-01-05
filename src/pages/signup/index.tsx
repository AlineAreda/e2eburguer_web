import { useState, FormEvent, useContext } from "react";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import logoImg from "../../../public/logo.svg";
import styles from "../../../styles/home.module.scss";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { AuthContext } from "../../contexts/AuthContext";
import { toast } from "react-toastify";
import { useRouter } from "next/router";

export default function SignUp() {
  const { signUp } = useContext(AuthContext);
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");

  const [loading, setLoading] = useState(false);

  function validatePassword(password: string): boolean {
    const minLength = 8;
    const maxLength = 12;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    return (
      password.length >= minLength &&
      password.length <= maxLength &&
      hasUpperCase &&
      hasNumber &&
      hasSpecialChar
    );
  }

  function handleEmailChange(e: React.ChangeEvent<HTMLInputElement>) {
    const emailInput = e.target.value.toLowerCase();
    setEmail(emailInput);
  }

  async function handleSignUp(event: FormEvent) {
    event.preventDefault();

    // Resetando mensagens de erro
    setNameError("");
    setEmailError("");
    setPasswordError("");
    setConfirmPasswordError("");

    let hasError = false;

    // Validação de nome
    if (name === "") {
      setNameError("O campo de nome é obrigatório.");
      hasError = true;
    } else if (name.trim().split(" ").length < 2) {
      setNameError("Preencha com nome e sobrenome.");
      hasError = true;
    }

    // Validação de e-mail
    if (email === "") {
      setEmailError("O campo de e-mail é obrigatório.");
      hasError = true;
    } else if (!/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/.test(email)) {
      setEmailError("Por favor, insira um e-mail válido.");
      hasError = true;
    }

    // Validação de senha
    if (password === "") {
      setPasswordError("O campo de senha é obrigatório.");
      hasError = true;
    } else if (!validatePassword(password)) {
      setPasswordError(
        "A senha deve conter entre 8 e 12 caracteres, incluindo ao menos uma letra maiúscula, um número e um caráter especial."
      );
      hasError = true;
    }

    // Validação de confirmação de senha
    if (confirmPassword === "") {
      setConfirmPasswordError("Confirme sua senha.");
      hasError = true;
    } else if (password !== confirmPassword) {
      setConfirmPasswordError("As senhas não coincidem.");
      hasError = true;
    }

    // Se houver erro, exibe um único toast e para a execução
    if (hasError) {
      toast.warning("Preencha os campos corretamente!", {
        toastId: "warning-toast",
      });
      return;
    }

    setLoading(true);

    try {
      // Inclui confirmPassword no objeto enviado para signUp
      await signUp({ name, email, password, confirmPassword });
      toast.success("Cadastro realizado com sucesso!", {
        toastId: "success-toast",
      });
      router.push("/");
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.error ||
        "Erro ao realizar cadastro. Tente novamente ou verifique um outro e-mail.";
      toast.error(errorMessage, { toastId: "error-toast" });
      console.error("Erro ao realizar cadastro:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Head>
        <title>E2E Burguer - Faça seu cadastro agora!</title>
      </Head>
      <div className={styles.containerCenter}>
        <Image src={logoImg} alt="Logo E2E Burguer" />
        <div className={styles.login}>
          <h1>Crie sua conta</h1>
          <form onSubmit={handleSignUp} noValidate>
            <Input
              data-testid="input-name"
              id="seu-nome"
              placeholder="Digite seu nome"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            {nameError && <p className={styles.errorText}>{nameError}</p>}

            <Input
              id="seu-email"
              data-testid="input-email"
              placeholder="Digite seu e-mail"
              type="text"
              value={email}
              onChange={handleEmailChange}
            />
            {emailError && <p className={styles.errorText}>{emailError}</p>}

            <Input
              id="sua-senha"
              data-testid="input-senha"
              placeholder="Sua senha"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {passwordError && (
              <p className={styles.errorText}>{passwordError}</p>
            )}

            <Input
              id="confirmar-senha"
              data-testid="input-confirm-senha"
              placeholder="Confirme sua senha"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            {confirmPasswordError && (
              <p className={styles.errorText}>{confirmPasswordError}</p>
            )}

            <Button
              id="btn-cadastrar"
              data-testid="botton-cadastrar"
              type="submit"
              loading={loading}
            >
              Cadastrar
            </Button>
          </form>
          <Link href="/">
            <span className={styles.text}>
              Já possui uma conta? Faça seu login!
            </span>
          </Link>
        </div>
      </div>
    </>
  );
}
