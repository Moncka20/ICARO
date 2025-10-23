import Layout from "../components/Layout";
import styles from '../styles/layout.module.css';

export default function Ventas() {
  return (
    <Layout>
      <div className={styles.header}>
        <div className={styles.headerText}>
          <div className={styles.title}>Ventas</div>
          <div className={styles.subtitle}>
            Desde aquí podrás gestionar tus ventas.
          </div>
        </div>
      </div>
    </Layout>
  );
}
