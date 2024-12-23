import "./Home.css";
import Landing from "../../../../components/Website/Landing/Landing";
import LatestSaleProducts from "../../../../components/Website/Product/SaleProducts/ShowLatestSaleProducts";
import ShowTopRated from "../../../../components/Website/Product/TopRated/ShowTopRated";
import { Container } from "react-bootstrap";
import ShowLatestProducts from "../../../../components/Website/Product/LatestProducts/ShowLatestProduct";

export default function HomePage() {
  return (
    <div>
      <Landing />
      <LatestSaleProducts />
      
      <Container>
        <div className="d-flex flex-wrap mt-5 align-items-start">
          <ShowTopRated />
          <ShowLatestProducts />
        </div>
      </Container>
    </div>
  );
}
