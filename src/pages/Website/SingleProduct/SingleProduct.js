import { useContext, useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import ImageGallery from "react-image-gallery";
import { json, useParams } from "react-router";
import { Axios } from "../../../Api/axios";
import { CART, Pro } from "../../../Api/Api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar as regularStar } from "@fortawesome/free-regular-svg-icons";
import { faStar as solid } from "@fortawesome/free-solid-svg-icons";
import SkeletonShow from "../../../components/Website/Skeleton/Skeleton";
import { Cart } from "../../../Context/CartChangerContext";
import PlusMinusBtn from "../../../components/Website/Btns/PlusMinusBtn";

export default function SingleProduct() {
  const [product, setProduct] = useState({});
  const [productImages, setProductImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [count, setCount] = useState(5);
  const { id } = useParams();
  const {setIsChange} = useContext(Cart)
  const [error, setError] = useState("");
  const [loadingCart, setLoadingCart] = useState(false);

  const roundStars = Math.round(product.rating);
  const stars = Math.min(roundStars, 5);

  const showGoldStars = Array.from({ length: stars }).map((_, index) => (
    <FontAwesomeIcon style={{ color: "gold" }} key={index} icon={solid} />
  ));
  const showEmptyStars = Array.from({ length: 5 - stars }).map((_, index) => (
    <FontAwesomeIcon key={index} icon={regularStar} />
  ));

  useEffect(() => {
    Axios.get(`/${Pro}/${id}`).then((res) => {
      setProductImages(
        res.data[0].images.map((img) => {
          return { original: img.image, thumbnail: img.image };
        })
      );
      setProduct(res.data[0]);
    })
    .finally(() => setLoading(false))
  }, []);

  const checkStock = async () => {
    try{
      setLoadingCart(true);
      const getItems= JSON.parse(localStorage.getItem("product")) || [];
      const productCount = getItems.filter((item) => item.id == id)?.[0]?.count;
      console.log(productCount)

      await Axios.post(`${CART}/check`, {
        product_id: product.id,
        count: count + (productCount ? productCount : 0),
        
      });
      console.log(count)
      return true;
    } catch(err) {
      return false;
    } finally {
        setLoadingCart(false)
      }
    
  };
  const handleSave = async () => {
    const check = await checkStock();
    if(check){
    //old data
    const getItems = JSON.parse(localStorage.getItem("product")) || [];

    const productExit = getItems.findIndex((pro) => pro.id == id);
    
    if(productExit !== -1){
      if(getItems[productExit].count){
        getItems[productExit].count += count;
      } else {
        getItems[productExit].count = count;
      } 
    } else {
        if(count > 1 ){
          product.count = count;
        }
      getItems.push(product);
    }

    
    localStorage.setItem("product", JSON.stringify(getItems));
    setIsChange((prev) => !prev)
  }};

  return (
    <Container className="mt-5">
      <div className="d-flex align-items-start flex-wrap row-gap-5">
        {loading ? (
          <>
            <div className="col-lg-4 col-md-6 col-12">
              <SkeletonShow
                height="250px"
                length="1"
                classes="col-12"
              />{" "}

              <div className="col-12 d-flex mt-1">
                <SkeletonShow
                  height="100px"
                  length="1"
                  classes="col-4"
                />
                <SkeletonShow
                  height="100px"
                  length="1"
                  classes="col-4"
                />
                <SkeletonShow
                  height="100px"
                  length="1"
                  classes="col-4"
                />
              </div>

            </div>
            <div className="col-lg-8 col-md-6 col-12">
              <div className="ms-lg-5">
              <SkeletonShow
                height="20px"
                length="1"
                classes="col-lg-8 col-12"
              />{" "}
              <SkeletonShow
                height="210px"
                length="1"
                classes="col-lg-8 col-12"
              />{" "}
              <hr className="col-lg-8 col-12"/>
              <div className="d-flex align-items-center justify-content-between col-lg-8 col-12">
                <SkeletonShow
                  height="20px"
                  length="1"
                  classes="col-4 mt-2"
                />{" "}
                <SkeletonShow
                height="20px"
                length="1"
                classes="col-4 mt-2"
              />{" "}
              </div>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="col-lg-4 col-md-6 col-12">
              <ImageGallery items={productImages} />
            </div>
            <div className="col-lg-8 col-md-6 col-12">
              <div className="ms-5">
                <h1>{product.title}</h1>
                <p style={{ color: "grey" }}>{product.About}</p>
                <h3 className="fw-normal">{product.description}</h3>

                <div className="d-flex align-items-center justify-content-between mt-2">
                  <div>
                    {product.stock === 1 && (
                      <p className="text-danger">There is only 1 left</p>
                    )}
                    {showGoldStars}
                    {showEmptyStars}
                    <div>
                      <h5 className="m-0 text-primary">{product.discount}$</h5>
                      <h6
                        className="m-0"
                        style={{
                          color: "gray",
                          textDecoration: "line-through",
                        }}
                      >
                        {product.price}$
                      </h6>
                    </div>
                  </div>

                   {/* cart */}
                  {product.stock === 0 ? (
                    <p>This product is unavailable</p>
                  ) : ( 
                  <div className="d-flex align-items-center gap-4">
                    <PlusMinusBtn setCount={(data) => setCount(data)} />
                    <div onClick={handleSave} className="border p-2 rounded">
                      {loadingCart ? (
                        "Loading"
                      ) : (
                      <img
                        src={require("../../../Assets/Icons/download (2).jfif")}
                        alt="cart"
                        width="20px"  
                      />
                    )}
                      </div>
                  </div>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </Container>
  );
}
