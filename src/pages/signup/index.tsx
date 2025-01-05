import { useState, FormEvent, useContext } from "react";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import logoImg from "../../../public/logo.svg";
import styles from "../../../styles/signup.module.scss";
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
  const [isGestao, setIsGestao] = useState<boolean | null>(null);

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    profile: "",
  });

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

    setErrors({
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      profile: "",
    });

    let hasError = false;

    if (!name.trim()) {
      setErrors((prev) => ({
        ...prev,
        name: "O campo de nome é obrigatório.",
      }));
      hasError = true;
    } else if (name.trim().split(" ").length < 2) {
      setErrors((prev) => ({
        ...prev,
        name: "Preencha com nome e sobrenome.",
      }));
      hasError = true;
    }

    if (!email.trim()) {
      setErrors((prev) => ({
        ...prev,
        email: "O campo de e-mail é obrigatório.",
      }));
      hasError = true;
    } else if (!/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/.test(email)) {
      setErrors((prev) => ({
        ...prev,
        email: "Por favor, insira um e-mail válido.",
      }));
      hasError = true;
    }

    if (!password) {
      setErrors((prev) => ({
        ...prev,
        password: "O campo de senha é obrigatório.",
      }));
      hasError = true;
    } else if (!validatePassword(password)) {
      setErrors((prev) => ({
        ...prev,
        password:
          "A senha deve conter entre 8 e 12 caracteres, incluindo ao menos uma letra maiúscula, um número e um caractere especial.",
      }));
      hasError = true;
    }

    if (!confirmPassword) {
      setErrors((prev) => ({
        ...prev,
        confirmPassword: "Confirme sua senha.",
      }));
      hasError = true;
    } else if (password !== confirmPassword) {
      setErrors((prev) => ({
        ...prev,
        confirmPassword: "As senhas não coincidem.",
      }));
      hasError = true;
    }

    if (isGestao === null) {
      setErrors((prev) => ({
        ...prev,
        profile: "Por favor, selecione o perfil.",
      }));
      hasError = true;
    }

    if (hasError) {
      toast.warning("Preencha os campos corretamente!");
      return;
    }

    setLoading(true);

    try {
      await signUp({ name, email, password, confirmPassword, isGestao });
      toast.success("Cadastro realizado com sucesso!");
      router.push("/");
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.error ||
        "Erro ao realizar cadastro. Tente novamente.";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Head>
        <title>E2E Burguer - Cadastro</title>
      </Head>
      <div className={styles.containerCenter}>
        <div className={styles.signup}>
          <Image
            src={logoImg}
            alt="Logo E2E Burguer"
            className={styles.logo}
            data-testid="signup-logo"
          />
          <h1>Crie sua conta</h1>
          <form
            onSubmit={handleSignUp}
            className={styles.signupForm}
            data-testid="signup-form"
          >
            <Input
              id="signup-name"
              placeholder="Digite seu nome"
              value={name}
              onChange={(e) => setName(e.target.value)}
              data-testid="input-name"
            />
            {errors.name && <p className={styles.errorText}>{errors.name}</p>}

            <Input
              id="signup-email"
              placeholder="Digite seu e-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              data-testid="input-email"
            />
            {errors.email && <p className={styles.errorText}>{errors.email}</p>}

            <Input
              id="signup-password"
              placeholder="Sua senha"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              data-testid="input-password"
            />
            {errors.password && (
              <p className={styles.errorText}>{errors.password}</p>
            )}

            <Input
              id="signup-confirm-password"
              placeholder="Confirme sua senha"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              data-testid="input-confirm-password"
            />
            {errors.confirmPassword && (
              <p className={styles.errorText}>{errors.confirmPassword}</p>
            )}

            <div className={styles.profileSelection}>
              <label>Qual seu perfil de usuário?</label>
              <div>
                <input
                  type="radio"
                  id="profile-gestao"
                  name="profile"
                  value="gestao"
                  checked={isGestao === true}
                  onChange={() => setIsGestao(true)}
                  data-testid="radio-gestao"
                />
                <label htmlFor="profile-gestao">Gestão</label>
                <input
                  type="radio"
                  id="profile-salao"
                  name="profile"
                  value="salao"
                  checked={isGestao === false}
                  onChange={() => setIsGestao(false)}
                  data-testid="radio-salao"
                />
                <label htmlFor="profile-salao">Salão</label>
              </div>
              {errors.profile && (
                <p className={styles.errorText}>{errors.profile}</p>
              )}
            </div>

            <Button loading={loading} data-testid="signup-button">
              Cadastrar
            </Button>
          </form>
          <Link href="/" className={styles.text} data-testid="login-link">
            Já possui uma conta? Faça seu login!
          </Link>
        </div>
      </div>
    </>
  );
}
