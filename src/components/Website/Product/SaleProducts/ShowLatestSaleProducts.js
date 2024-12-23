import { useEffect, useState } from "react";
import { Axios } from "../../../../Api/axios";
import { LatestSale } from "../../../../Api/Api";
import Product from "./SaleProducts";
import { Container } from "react-bootstrap";
import SkeletonShow from "../../Skeleton/Skeleton";

export default function LatestSaleProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Axios.get(`${LatestSale}`)
      .then((res) => setProducts(res.data))
      .finally(() => setLoading(false));
  }, []);

  const productsShow = products.map((product) => (
    <Product
      title={product.title}
      description={product.description}
      img={product.images[0].image}
      sale
      price={product.price}
      discount={product.discount}
      rating={product.rating}
      col="3"
      id={product.id}
    />
  ));
  console.log(products)
  return (
    <Container>
      <h1 className="mt-5">Latest Sale Products</h1>
      <div className="d-flex align-items-stretch justify-content-center flex-wrap row-gap-2 mb-5">
        {loading ? (
          <>
            <SkeletonShow
              height="300px"
              length="4"
              classes="col-lg-3 col-md-6 col-12"
            />
          </>
        ) : (
          productsShow
        )}
      </div>
    </Container>
  );
}
