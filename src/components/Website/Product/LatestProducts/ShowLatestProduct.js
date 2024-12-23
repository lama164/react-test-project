import { useEffect, useState } from "react";
import { Axios } from "../../../../Api/axios";
import { Latest } from "../../../../Api/Api";
import Product from "../SaleProducts/SaleProducts";
import SkeletonShow from "../../Skeleton/Skeleton";

export default function ShowLatestProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Axios.get(`${Latest}`)
      .then((res) => setProducts(res.data))
      .finally(() => setLoading(false));
  }, []);
  console.log(products);
  const productsShow = products.map((product) => (
    <Product
      title={product.title}
      description={product.description}
      img={product.images[0].image}
      sale
      price={product.price}
      discount={product.discount}
      rating={product.rating}
      cal="6"
      id={product.id}
    />
  ));
  return (
    <div className="col-md-6 col-12">
        <div className="ms-md-3">
            <h1>Latest Products</h1>
            <div className="d-flex align-items-stretch justify-content-center flex-wrap row-gap-2 mb-5">
                {loading ? (
                <>
                    <SkeletonShow
                    height="300px"
                    length="4"
                    classes="col-md-6 col-12"
                    />
                </>
                ) : (
                productsShow
                )}
            </div>
        </div>
    </div>
);
}
