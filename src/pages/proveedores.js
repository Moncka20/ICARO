import Layout from "../components/Layout";
import styles from '../styles/layout.module.css';

export default function Proveedores() {
  return (
    <Layout>
      <div className={styles.header}>
        <div className={styles.headerText}>
          <div className={styles.title}>Proveedores</div>
          <div className={styles.subtitle}>
            Desde aquí podrás gestionar tus proveedores.
          </div>
        </div>
      </div>
    </Layout>
  );
}
