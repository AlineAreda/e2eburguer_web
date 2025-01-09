import styles from "../../styles/appinfo.module.scss";

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
        <h1 className={styles.title}>Acesso pelo APP E2E Burguer</h1>
        <p className={styles.text}>
          Em breve disponível funcionalidades no aplicativo móvel!.
        </p>
        <p className={styles.text}>
          Você será avisado para que faça o download do nosso app.
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
