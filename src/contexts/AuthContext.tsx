import { createContext, ReactNode, useState, useEffect } from "react";
import { api } from "../services/apiClient";
import { destroyCookie, setCookie, parseCookies } from "nookies";
import Router from "next/router";
import { toast } from "react-toastify";

type AuthContextData = {
  user: UserProps | undefined;
  isAuthenticated: boolean;
  signIn: (credentials: SignInProps) => Promise<void>;
  signOut: () => void;
  signUp: (credentials: SignUpProps) => Promise<void>;
};

type UserProps = {
  id: string;
  name: string;
  email: string;
};

type SignInProps = {
  email: string;
  password: string;
};

type SignUpProps = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string; // Adiciona confirmPassword
};

type AuthProviderProps = {
  children: ReactNode;
};

export const AuthContext = createContext({} as AuthContextData);

export function signOut() {
  try {
    destroyCookie(undefined, "@nextauth.token");
    Router.push("/");
  } catch {
    console.log("erro ao deslogar");
  }
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<UserProps | undefined>(undefined);
  const isAuthenticated = !!user;

  useEffect(() => {
    const { "@nextauth.token": token } = parseCookies();

    if (token) {
      api
        .get("/user/detail")
        .then((response) => {
          const { id, name, email } = response.data;
          setUser({ id, name, email });
        })
        .catch(() => {
          signOut();
        });
    }
  }, []);

  async function signIn({ email, password }: SignInProps) {
    try {
      const response = await api.post("/session", { email, password });
      const { id, name, token } = response.data;

      setCookie(undefined, "@nextauth.token", token, {
        maxAge: 60 * 60 * 24 * 30,
        path: "/",
      });

      setUser({ id, name, email });
      api.defaults.headers["Authorization"] = `Bearer ${token}`;
      toast.success("Login realizado com sucesso!");
      Router.push("/dashboard");
    } catch (err) {
      toast.error("Erro ao acessar, verifique suas credenciais de acesso!");
    }
  }

  async function signUp({
    name,
    email,
    password,
    confirmPassword,
  }: SignUpProps) {
    try {
      const response = await api.post("/user", {
        name,
        email,
        password,
        confirmPassword,
      });

      toast.success("Cadastro realizado com sucesso!");
      Router.push("/");
    } catch (err: any) {
      toast.error(
        "Erro ao realizar cadastro. Tente novamente ou verifique um outro e-mail."
      );
      console.error(
        "Erro ao realizar cadastro: ",
        err.response?.data || err.message
      );
    }
  }

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated, signIn, signOut, signUp }}
    >
      {children}
    </AuthContext.Provider>
  );
}
