import { useState } from "react";
import { useRecoilState } from "recoil";
import { loginEmailState } from "../utils/RecoilData";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ProductFrm from "./ProductFrm";
import ToastEditor from "../utils/ToastEditor";
import Swal from "sweetalert2";

const ProductWrite = () => {
  const backServer = process.env.REACT_APP_BACK_SERVER;
  const navigate = useNavigate();
  console.log(1);

  // 로그인 회원 정보
  const [loginEmail, setLoginEmail] = useRecoilState(loginEmailState);

  const [productName, setProductName] = useState("");
  const [productSubName, setProductSubName] = useState("");
  const [thumbnail, setThumbnail] = useState(null);
  const [productPrice, setProductPrice] = useState(0);
  const [productInfo, setProductInfo] = useState("");
  const [productLatitude, setProductLatitude] = useState(0);
  const [productLongitude, setProductLongitude] = useState(0);
  const [productStatus, setProductStatus] = useState(1);
  const [productFile, setProductFile] = useState([]);

  // 상품명 입력
  const inputProductName = (e) => {
    setProductName(e.target.value);
  };

  // 상품 서브명 입력
  const inputProductSubName = (e) => {
    setProductSubName(e.target.value);
  };

  // 가격 입력
  const inputProductPrice = (e) => {
    setProductPrice(e.target.value);
  };

  // 위도 입력
  const inputProductLatitude = (e) => {
    setProductLatitude(e.target.value);
  };

  // 경도 입력
  const inputProductLongitude = (e) => {
    setProductLongitude(e.target.value);
  };

  const writeProduct = () => {
    if (productName !== "" && productSubName !== "" && productInfo !== "") {
      const form = new FormData();
      form.append("productName", productName);
      form.append("productSubName", productSubName);
      form.append("productPrice", productPrice);
      form.append("productInfo", productInfo);
      form.append("productLatitude", productLatitude);
      form.append("productLongitude", productLongitude);
      form.append("productWriter", loginEmail);
      form.append("productStatus", productStatus);

      // 썸네일 있는 경우에만 추가
      if (thumbnail !== null) {
        form.append("thumbnail", thumbnail);
      }
      // 첨부파일도 있는 경우에만 추가
      for (let i = 0; i < productFile.length; i++) {
        form.append("productFile", productFile[i]);
      }
      axios
        .post(`${backServer}/product`, form, {
          headers: {
            contentType: "multipart/form-data",
            processData: false,
          },
        })
        .then((res) => {
          if (res.data) {
            navigate("/product/list");
          } else {
            Swal.fire({
              title: "상품 등록에 실패하였습니다.",
              text: "입력값을 확인하세요.",
              icon: "error",
            });
          }
        })
        .catch((err) => {
          console.log(err);
          if (err.response) {
            console.log("Response data:", err.response.data);
            console.log("Response status:", err.response.status);
            console.log("Response headers:", err.response.headers);
          }
        });
    }
  };
  return (
    <section className="section sec">
      <div style={{ textAlign: "center" }} className="section-title">
        상품 등록
      </div>
      <form
        className="product-write-frm"
        onSubmit={(e) => {
          e.preventDefault();
          writeProduct();
        }}
      >
        <ProductFrm
          loginEmail={loginEmail}
          productName={productName}
          setProductName={inputProductName}
          productSubName={productSubName}
          setProductSubName={inputProductSubName}
          thumbnail={thumbnail}
          setThumbnail={setThumbnail}
          productPrice={productPrice}
          setProductPrice={inputProductPrice}
          productLatitude={productLatitude}
          setProductLatitude={inputProductLatitude}
          productLongitude={productLongitude}
          setProductLongitude={inputProductLongitude}
          productStatus={productStatus}
          setProductStatus={setProductStatus}
          productFile={productFile}
          setProductFile={setProductFile}
        />

        <div
          style={{ width: "90%", margin: "150px auto", marginBottom: "0" }}
          className="product-info-wrap"
        >
          <label>본문 내용</label>
          <ToastEditor
            productInfo={productInfo}
            setProductInfo={setProductInfo}
            type={0}
          />
        </div>
        <div className="buttonBox">
          <button type="submit" className="btn-primary lg">
            등록
          </button>
        </div>
      </form>
    </section>
  );
};

export default ProductWrite;
