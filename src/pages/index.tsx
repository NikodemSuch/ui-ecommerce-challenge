import styles from "@/styles/Home.module.css";
import Image from "next/image";
import Pagination from "@/components/Pagination/Pagination";
import { calculateSkip, getPaginationControls } from "@/helpers";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { usePathname, useSearchParams } from 'next/navigation';
import { useDebouncedCallback } from 'use-debounce';
import { SearchResults } from '@/types';

type HomeProps = {};

export default function Page(props: HomeProps) {
  const [productData, setProductData] = useState<any>([]);
  const [pagination, setPagination] = useState<{
    pageStart: number;
    pageEnd: number;
  }>({ pageStart: 0, pageEnd: 0});
  const [total, setTotal] = useState<number>(0);

  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const page = Number(searchParams.get('page')) || 1;
  const query = searchParams.get('query') || '';

  useEffect(() => {
    fetch(
      `https://dummyjson.com/products/search?q=${query}&limit=10&skip=${calculateSkip(10, page)}`,
    )
      .then((res) => res.json())
      .then(({ total, products }: SearchResults) => {
        const paginationControls = getPaginationControls(10, page, total);
        setTotal(total);
        setPagination(paginationControls);
        setProductData(products);
      });
  }, [searchParams]);

  const handleSearchChange = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams);
    params.delete('page');
    if (term) {
      params.set('query', term);
    } else {
      params.delete('query');
    }
    replace(`${pathname}?${params.toString()}`);
  }, 300)

  return (
    <>
      <main>
        <section style={{ display: "flex", flexFlow: "column wrap" }}>
          <div>
            <h1>Shop Products</h1>
          </div>
          <div className={styles.wrapper_Container}>
            <input
              type="text"
              name="search"
              placeholder="Search here..."
              defaultValue={searchParams.get('query')?.toString()}
              onChange={(e) => handleSearchChange(e.target.value)}
            />
          </div>
          <div style={{ margin: "5rem 0" }} className={styles.productList}>
            {productData &&
              productData.length > 0 &&
              productData.map((data: any) => (
                <a
                  href={`/products/${data.id}`}
                  className={styles.CardComponent}
                  key={data.id}
                >
                  <div className={styles.cardImage}>
                    <Image
                      src={data.thumbnail}
                      alt={data.description}
                      loading="eager"
                      fill
                    />
                  </div>

                  <h5>{data.title}</h5>
                  <p>{data.description}</p>
                </a>
              ))}
          </div>
          {pagination && (
            <Pagination
              page={page}
              recordTotal={total}
              recordStart={pagination.pageStart}
              recordEnd={pagination.pageEnd}
            />
          )}
        </section>
      </main>
    </>
  );
}
