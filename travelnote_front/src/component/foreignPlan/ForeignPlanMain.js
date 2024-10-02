import { useRecoilState, useRecoilValue } from "recoil";
import {
  isLoginState,
  loginEmailState,
  userTypeState,
} from "../utils/RecoilData";
import { Route, Routes, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { getDate, getMonth, getYear } from "date-fns";
import ForeignPlanList from "./ForeignPlanList";
import ForeignPlanSearch from "./ForeignPlanSearch";
import ForeignRegionInfo from "./ForeignRegionInfo";
import ForeignPlanMap from "./ForeignPlanMap";

// path: foreign/plan/:itineraryNo
const ForeignPlanMain = () => {
  const backServer = process.env.REACT_APP_BACK_SERVER;
  const [loginEmail, setLoginEmail] = useRecoilState(loginEmailState);
  const [userType, setUserType] = useRecoilState(userTypeState);
  const isLogin = useRecoilValue(isLoginState);
  const navigate = useNavigate();
  const itineraryNo = useParams().itineraryNo; // 여행 일정 번호
  const [itinerary, setItinerary] = useState({}); // 여행 일정 정보 객체
  const [totalPlanDates, setTotalPlanDates] = useState([]); // 여행 일정표 용 날짜 배열
  const [planDays, setPlanDays] = useState([]); // 현재 조회 중인 날 기준으로 보여주는 날짜 배열
  const [planList, setPlanList] = useState([]); // 해당 날짜의 일정 배열
  const [selectedDay, setSelectedDay] = useState(1); // 현재 조회 중인 날 (기본 1로 세팅)
  const [planPageOption, setPlanPageOption] = useState(2); // 조회 페이지 옵션 (1 조회, 2 수정)
  const [searchInput, setSearchInput] = useState("");
  const [map, setMap] = useState();
  const [regionInfo, setRegionInfo] = useState({});
  const [searchKeyword, setSearchKeyword] = useState("");
  const [searchPlaceList, setSearchPlaceList] = useState([]);
  const [selectedPosition, setSelectedPosition] = useState();
  const [placeInfo, setPlaceInfo] = useState();
  const [isPlanAdded, setIsPlanAdded] = useState(false);
  const [departInfo, setDepartInfo] = useState({});
  const [arrivalInfo, setArrivalInfo] = useState({});
  const [searchDepartAirport, setSearchDepartAirport] = useState("");
  const [searchArrivalAirport, setSearchArrivalAirport] = useState();
  const [timeOptionsArr, setTimeOptionsArr] = useState([]); // 시간 선택 옵션 용 배열
  const [isNextDayButtonChecked, setIsNextDayButtonChecked] = useState(false);
  const [searchAirport, setSearchAirport] = useState(0); // 1이면 Departure, 2면 Arrival

  // 일정 정보 조회
  useEffect(() => {
    axios
      .get(`${backServer}/foreign/getItineraryInfo/${itineraryNo}`)
      .then((res) => {
        if (res.data) {
          setItinerary(res.data);

          // 날짜 배열 생성
          const startDate = new Date(res.data.itineraryStartDate);
          const endDate = new Date(res.data.itineraryEndDate);
          while (startDate <= endDate) {
            const year = getYear(startDate);
            const month = String(getMonth(startDate) + 1).padStart(2, "0");
            const date = String(getDate(startDate)).padStart(2, "0");
            const newDate = year + "-" + month + "-" + date;
            totalPlanDates.push(newDate);
            startDate.setDate(startDate.getDate() + 1);
          }
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  // 지역 정보 조회
  useEffect(() => {
    if (itinerary.regionNo > 0) {
      axios
        .get(`${backServer}/foreign/regionInfo/${itinerary.regionNo}`)
        .then((res) => {
          setRegionInfo(res.data);
          setSearchKeyword("");
          setSearchInput("");
        })
        .catch((err) => {});
    }
  }, [itinerary]);

  // 시간 배열에 값 추가
  useEffect(() => {
    if (timeOptionsArr.length === 0) {
      for (let i = 0; i < 24; i++) {
        let time = "";
        if (i < 10) {
          time = "0" + i;
        } else {
          time = "" + i;
        }
        for (let j = 0; j < 60; j += 30) {
          let timeOption = "";
          if (j === 0) {
            timeOption += time + ":0" + j;
          } else {
            timeOption += time + ":" + j;
          }
          timeOptionsArr.push(timeOption);
          setTimeOptionsArr([...timeOptionsArr]);
        }
      }
    }
  }, []);

  return (
    <div className="plan-view-wrap">
      <ForeignPlanList
        itinerary={itinerary}
        planDays={planDays}
        selectedDay={selectedDay}
        setSelectedDay={setSelectedDay}
        totalPlanDates={totalPlanDates}
        planPageOption={planPageOption}
        setPlanPageOption={setPlanPageOption}
        planList={planList}
        setPlanList={setPlanList}
        isPlanAdded={isPlanAdded}
        setIsPlanAdded={setIsPlanAdded}
        timeOptionsArr={timeOptionsArr}
      />
      {planPageOption === 1 ? (
        <ForeignRegionInfo />
      ) : (
        <ForeignPlanSearch
          searchInput={searchInput}
          setSearchInput={setSearchInput}
          setSearchKeyword={setSearchKeyword}
          searchPlaceList={searchPlaceList}
          setSearchPlaceList={setSearchPlaceList}
          selectedPosition={selectedPosition}
          setSelectedPosition={setSelectedPosition}
          setPlaceInfo={setPlaceInfo}
          selectedDay={selectedDay}
          planList={planList}
          setPlanList={setPlanList}
          backServer={backServer}
          totalPlanDates={totalPlanDates}
          itineraryNo={itineraryNo}
          setIsPlanAdded={setIsPlanAdded}
          departInfo={departInfo}
          setDepartInfo={setDepartInfo}
          arrivalInfo={arrivalInfo}
          setArrivalInfo={setArrivalInfo}
          timeOptionsArr={timeOptionsArr}
          isNextDayButtonChecked={isNextDayButtonChecked}
          setIsNextDayButtonChecked={setIsNextDayButtonChecked}
          searchDepartAirport={searchDepartAirport}
          setSearchDepartAirport={setSearchDepartAirport}
          searchArrivalAirport={searchArrivalAirport}
          setSearchArrivalAirport={setSearchArrivalAirport}
          searchAirport={searchAirport}
          setSearchAirport={setSearchAirport}
        />
      )}
      <ForeignPlanMap
        map={map}
        setMap={setMap}
        regionInfo={regionInfo}
        searchKeyword={searchKeyword}
        setSearchPlaceList={setSearchPlaceList}
        selectedPosition={selectedPosition}
        setSelectedPosition={setSelectedPosition}
        placeInfo={placeInfo}
        setPlaceInfo={setPlaceInfo}
        departInfo={departInfo}
        setDepartInfo={setDepartInfo}
        arrivalInfo={arrivalInfo}
        setArrivalInfo={setArrivalInfo}
        searchDepartAirport={searchDepartAirport}
        setSearchDepartAirport={setSearchDepartAirport}
        searchArrivalAirport={searchArrivalAirport}
        setSearchArrivalAirport={setSearchArrivalAirport}
        searchAirport={searchAirport}
      />
    </div>
  );
};

export default ForeignPlanMain;
