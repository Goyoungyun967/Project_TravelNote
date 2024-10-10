import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { userNickState } from "../utils/RecoilData";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import PageNavi from "../utils/PagiNavi";

const ShareTravel = () => {
  const backServer = process.env.REACT_APP_BACK_SERVER;
  const [reqPage, setReqPage] = useState(1);
  const [pi, setPi] = useState({});
  const [shareTravelList, setShareTrevelList] = useState([]);
  const [userNick, setUserNick] = useRecoilState(userNickState);

  useEffect(() => {
    axios
      .get(`${backServer}/user/shareTravelList/${userNick}/${reqPage}`)
      .then((res) => {
        setShareTrevelList(res.data.list);
        setPi(res.data.pi);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [reqPage]);
  return (
    <div className="shareTrevel-content">
      <div className="page-title-info">공유된 일정</div>
      <div>
        {shareTravelList && shareTravelList.length > 0 ? (
          shareTravelList.map((shareTravel, i) => {
            return (
              <ShareTravelItem
                key={"shareTravel" + i}
                shareTravel={shareTravel}
              />
            );
          })
        ) : (
          <div
            style={{
              marginTop: "20px",
              textAlign: "center",
              height: "100px",
              margin: "0 auto",
              lineHeight: "100px",
            }}
          >
            <h3>아직 공유받은 일정이 없습니다.</h3>
          </div>
        )}
      </div>
      <div className="mytravel-page-navi">
        <PageNavi pi={pi} reqPage={reqPage} setReqPage={setReqPage} />
      </div>
    </div>
  );
};

const ShareTravelItem = (props) => {
  const shareTravel = props.shareTravel;
  const navigate = useNavigate();
  const navigateShareTravel = () => {
    if (shareTravel.countryName === "대한민국") {
      navigate(`/schedule/${shareTravel.itineraryNo}`);
    } else {
      navigate(`/foreign/plan/${shareTravel.itineraryNo}`);
    }
  };
  const getImagePath = (city) => {
    switch (city) {
      case "서울":
        return "/images/서울.jpg";
      case "부산":
        return "/images/부산.jpg";
      case "강릉":
        return "/images/강릉.jpg";
      case "대전":
        return "/images/대전.jpg";
      case "인천":
        return "/images/인천.jpg";
      case "제주":
        return "/images/제주.jpg";
      case "가평":
        return "/images/가평.jpg";
      case "거제 통영":
        return "/images/거제 통영.jpg";
      case "경주":
        return "/images/경주.jpg";
      case "군산":
        return "/images/군산.jpg";
      case "남원":
        return "/images/남원.jpg";
      case "목포":
        return "/images/목포.jpg";
      case "수원":
        return "/images/수원.jpg";
      case "안동":
        return "/images/안동.jpg";
      case "여수":
        return "/images/여수.jpg";
      case "영월":
        return "/images/영월.jpg";
      case "전주":
        return "/images/전주.jpg";
      case "제천":
        return "/images/제천.jpg";
      case "춘천":
        return "/images/춘천.jpg";
      case "포항":
        return "/images/포항.jpg";
      default:
        return "/images/default_img.png";
    }
  };
  const imagePath = getImagePath(shareTravel.regionName);
  const backServer = process.env.REACT_APP_BACK_SERVER;
  return (
    <div
      onClick={navigateShareTravel}
      className="reservation-item"
      style={{ marginBottom: "20px", cursor: "pointer" }}
    >
      <div className="reservation-thum">
        {shareTravel.countryName === "대한민국" ? (
          <img className="reservation-img" src={imagePath}></img>
        ) : (
          <img
            className="reservation-img"
            src={
              shareTravel.regionImg !== ""
                ? `${backServer}/foreignImg/${shareTravel.regionImg}`
                : "/image/default_img.png"
            }
          ></img>
        )}
      </div>
      <div className="reservation-table">
        <table>
          <tbody>
            <tr>
              <th>일정명 : </th>
              <td colSpan={2}>{shareTravel.itineraryTitle}</td>
            </tr>
            <tr>
              <td>{shareTravel.itineraryStartDate}</td>
              <td>~</td>
              <td>{shareTravel.itineraryEndDate}</td>
            </tr>
            <tr>
              <td>{shareTravel.countryName}</td>
              <td colSpan={2}>{shareTravel.regionName}</td>
            </tr>
            <tr>
              <td>공유해준 사람 : </td>
              <td colSpan={2}>{shareTravel.sendUser}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ShareTravel;
