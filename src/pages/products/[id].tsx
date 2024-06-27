import styles from "./[id].module.css";
import { Product } from "@/types";
import Image from "next/image";

type ProductDetailProps = {
  product?: Product;
};

// Todo if type doesn't include optional properties why we check for them?

export default function ProductPageComponent({ product }: ProductDetailProps) {
  if (!product) {
    return (
      <div>Oops! It looks like we had some trouble rendering this data.</div>
    );
  }

  return (
    <div>
      <a onClick={() => (window.location.href = "/")}>
        <span>Go Back</span>
      </a>
      <section className={styles.card}>
        <div className={styles.image}>
          <Image
            src={product?.thumbnail}
            alt={product?.description}
            fill
          />
        </div>
        <div className={styles.detail}>
          <h1>{product?.title}</h1>
          <p>{product?.description}</p>
          <h5>${product?.price.toFixed(2)}</h5>
        </div>
      </section>
    </div>
  );
}

export const getServerSideProps = async (context: any) => {
  if (!+context.params?.id) return { props: {} };

  const response = await fetch(
    `https://dummyjson.com/products/${context.params?.id}`,
  );

  return await response.json().then((product) => {
    return { props: { product: product } };
  });
};
