import { useState, FormEvent, useContext } from 'react';
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import logoImg from '../../../public/logo.svg';
import styles from '../../../styles/home.module.scss';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { AuthContext } from '../../contexts/AuthContext';
import { toast } from 'react-toastify';

export default function SignUp() {
  const { signUp } = useContext(AuthContext);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const [loading, setLoading] = useState(false);

  function validatePassword(password: string): boolean {
    const minLength = 8;
    const maxLength = 12;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    return password.length >= minLength &&
           password.length <= maxLength &&
           hasUpperCase &&
           hasNumber &&
           hasSpecialChar;
  }

  async function handleSignUp(event: FormEvent) {
    event.preventDefault();

    // Resetando mensagens de erro
    setNameError('');
    setEmailError('');
    setPasswordError('');

    let hasError = false;

    // Validação de nome
    if (name === '') {
      setNameError("O campo de nome é obrigatório.");
      hasError = true;
    } else if (name.trim().split(' ').length < 2) {
      setNameError("Preencha com nome e sobrenome.");
      hasError = true;
    }

    // Validação de e-mail
    if (email === '') {
      setEmailError("O campo de e-mail é obrigatório.");
      hasError = true;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError("Por favor, insira um e-mail válido.");
      hasError = true;
    }

    // Validação de senha
    if (password === '') {
      setPasswordError("O campo de senha é obrigatório.");
      hasError = true;
    } else if (!validatePassword(password)) {
      setPasswordError("A senha deve conter entre 8 e 12 caracteres, incluindo ao menos uma letra maiúscula, um número e um carácter especial.");
      hasError = true;
    }

    // Se houver erro, exibe um único toast e para a execução
    if (hasError) {
      toast.warning("Preencha os campos corretamente!");
      return;
    }

    setLoading(true);

    try {
      const response = (await signUp({ name, email, password })) as unknown as {
        ok: boolean;
        status?: number;
        error?: string;
      };

      if (response.ok) {
        toast.success("Cadastro realizado com sucesso! Realize seu login.");
      } else {
        let errorMessage = "Erro ao realizar cadastro.Tente novamente ou verifique um outro e-mail.";

        if (response.status === 409) {
          errorMessage = response.error || "E-mail já cadastrado. Verifique um outro e-mail ou faça login.";
        } else if (response.status === 400) {
          errorMessage = response.error || "Preencha os campos corretamente.";
        } else if (response.status === 500) {
          errorMessage = response.error || "Erro interno no servidor.";
        }

        toast.error(errorMessage);
      }
    } catch (error) {
 //     toast.error("Ocorreu um erro. Tente novamente.");
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
              onChange={(e) => setEmail(e.target.value)}
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
            {passwordError && <p className={styles.errorText}>{passwordError}</p>}

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
            <span className={styles.text}>Já possui uma conta? Faça seu login</span>
          </Link>
        </div>
      </div>
    </>
  );
}
