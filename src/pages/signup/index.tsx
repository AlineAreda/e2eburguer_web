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
  const [isGestao, setIsGestao] = useState<boolean | null>(null); // Valor do perfil

  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [profileError, setProfileError] = useState("");

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

  async function handleSignUp(event: FormEvent) {
    event.preventDefault();

    setNameError("");
    setEmailError("");
    setPasswordError("");
    setConfirmPasswordError("");
    setProfileError("");

    let hasError = false;

    // Validações de formulário
    if (!name) {
      setNameError("O campo de nome é obrigatório.");
      hasError = true;
    } else if (name.trim().split(" ").length < 2) {
      setNameError("Preencha com nome e sobrenome.");
      hasError = true;
    }

    if (!email) {
      setEmailError("O campo de e-mail é obrigatório.");
      hasError = true;
    } else if (!/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/.test(email)) {
      setEmailError("Por favor, insira um e-mail válido.");
      hasError = true;
    }

    if (!password) {
      setPasswordError("O campo de senha é obrigatório.");
      hasError = true;
    } else if (!validatePassword(password)) {
      setPasswordError(
        "A senha deve conter entre 8 e 12 caracteres, incluindo ao menos uma letra maiúscula, um número e um caractere especial."
      );
      hasError = true;
    }

    if (!confirmPassword) {
      setConfirmPasswordError("Confirme sua senha.");
      hasError = true;
    } else if (password !== confirmPassword) {
      setConfirmPasswordError("As senhas não coincidem.");
      hasError = true;
    }

    if (isGestao === null) {
      setProfileError("Por favor, selecione o perfil.");
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
      await signUp({ name, email, password, confirmPassword, isGestao });
      toast.success("Cadastro realizado com sucesso!", {
        toastId: "success-toast",
      });
      router.push("/");
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.error ||
        "Erro ao realizar cadastro. Tente novamente.";
      toast.error(errorMessage, { toastId: "error-toast" });
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
          <form onSubmit={handleSignUp}>
            <Input
              placeholder="Digite seu nome"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            {nameError && <p className={styles.errorText}>{nameError}</p>}

            <Input
              placeholder="Digite seu e-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {emailError && <p className={styles.errorText}>{emailError}</p>}

            <Input
              placeholder="Sua senha"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {passwordError && (
              <p className={styles.errorText}>{passwordError}</p>
            )}

            <Input
              placeholder="Confirme sua senha"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            {confirmPasswordError && (
              <p className={styles.errorText}>{confirmPasswordError}</p>
            )}

            <div className={styles.profileSelection}>
              <label>
                <input
                  type="radio"
                  name="profile"
                  value="gestao"
                  checked={isGestao === true}
                  onChange={() => setIsGestao(true)}
                />
                Usuário Gestão
              </label>
              <label>
                <input
                  type="radio"
                  name="profile"
                  value="salao"
                  checked={isGestao === false}
                  onChange={() => setIsGestao(false)}
                />
                Usuário Salão
              </label>
              {profileError && (
                <p className={styles.errorText}>{profileError}</p>
              )}
            </div>

            <Button loading={loading}>Cadastrar</Button>
          </form>
          <Link href="/">Já possui uma conta? Faça seu login!</Link>
        </div>
      </div>
    </>
  );
}
