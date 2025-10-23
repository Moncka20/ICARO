import Layout from "../components/Layout";
import styles from '../styles/layout.module.css';

export default function Inventario() {
  return (
    <Layout>
      <div className={styles.header}>
        <div className={styles.headerText}>
          <div className={styles.title}>Inventario</div>
          <div className={styles.subtitle}>
            Desde aquí podrás gestionar tus productos.
          </div>
        </div>
      </div>
    </Layout>
  );
}
