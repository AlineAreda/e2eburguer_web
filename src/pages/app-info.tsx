import styles from "../../styles/home.module.scss";

export default function AppInfo() {
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
        <h1 className={styles.title}>Acesso Restrito</h1>
        <p className={styles.text}>
          Esta funcionalidade está disponível apenas no aplicativo móvel.
        </p>
        <p className={styles.text}>
          Para continuar, faça o download do nosso app.
        </p>
        <button className={styles.yellowButton}>
          <a
            href="https://play.google.com" // Substitua pelo link real do app
            target="_blank"
            rel="noopener noreferrer"
            style={{ textDecoration: "none", color: "#161b1c" }}
          >
            Baixar o App
          </a>
        </button>
      </div>
    </div>
  );
}
