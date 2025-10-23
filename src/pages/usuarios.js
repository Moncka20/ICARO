import Layout from "../components/Layout";
import styles from '../styles/layout.module.css';

export default function Usuarios() {
  return (
    <Layout>
      <div className={styles.header}>
        <div className={styles.headerText}>
          <div className={styles.title}>Usuarios</div>
          <div className={styles.subtitle}>
            Desde aquí podrás gestionar tus Usuarios.
          </div>
        </div>
      </div>
    </Layout>
  );
}
