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
  isGestao?: boolean;
};

type SignInProps = {
  email: string;
  password: string;
};

type SignUpProps = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  isGestao: boolean | null;
};

type AuthProviderProps = {
  children: ReactNode;
};

export const AuthContext = createContext({} as AuthContextData);

export function signOut() {
  try {
    destroyCookie(undefined, "@nextauth.token");
    Router.push("/");
  } catch (err) {
    console.error("Erro ao deslogar:", err);
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
          const { id, name, email, isGestao } = response.data;
          setUser({ id, name, email, isGestao });
        })
        .catch((err) => {
          console.error("Erro ao validar token:", err);
          signOut();
        });
    }
  }, []);

  async function signIn({ email, password }: SignInProps) {
    try {
      const response = await api.post("/session", { email, password });
      const { id, name, token, isGestao } = response.data;

      setCookie(undefined, "@nextauth.token", token, {
        maxAge: 60 * 60 * 24 * 30,
        path: "/",
      });

      setUser({ id, name, email, isGestao });
      api.defaults.headers["Authorization"] = `Bearer ${token}`;

      toast.dismiss(); // Remove outros toasts antes de exibir o novo

      if (isGestao) {
        toast.success("Login realizado com sucesso!", { toastId: "login-success" });
        Router.push("/dashboard");
      } else {
        toast.warning("Acesse através do app.", { toastId: "login-warning" });
        Router.push("/app-info");
      }
    } catch (err) {
      console.error("Erro ao realizar login:", err);
      toast.error("Credenciais inválidas. Verifique seu e-mail e senha.", {
        toastId: "login-error",
      });
    }
  }

  async function signUp({
    name,
    email,
    password,
    confirmPassword,
    isGestao,
  }: SignUpProps) {
    try {
      await api.post("/user", {
        name,
        email,
        password,
        confirmPassword,
        isGestao,
      });

      toast.success("Cadastro realizado com sucesso!", { toastId: "signup-success" });
      Router.push("/");
    } catch (err: any) {
      console.error("Erro ao realizar cadastro:", err.response?.data || err);

      if (err.response?.status === 409) {
        toast.error("E-mail já cadastrado. Tente usar outro e-mail.", {
          toastId: "signup-email-error",
        });
      } else {
        toast.error("Erro ao realizar cadastro. Tente novamente.", {
          toastId: "signup-error",
        });
      }
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
