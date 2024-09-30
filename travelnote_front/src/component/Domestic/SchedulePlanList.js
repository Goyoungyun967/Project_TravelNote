import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import SchedulePlanButton from "./SchedulePlanButton";
import SchedulePlanTime from "./SchedulePlanTime";
import Swal from "sweetalert2";

const SchedulePlanList = (props) => {
  const {
    itinerary,
    planDays,
    selectedDay,
    setSelectedDay,
    totalPlanDates,
    planPageOption,
    setPlanPageOption,
  } = props;

  const backServer = process.env.REACT_APP_BACK_SERVER;
  const navigate = useNavigate();
  const selectedDate = totalPlanDates[selectedDay - 1];
  const [planList, setPlanList] = useState([]); // 조회 중인 일정 목록 배열
  const [timeOptionsArr, setTimeOptionsArr] = useState([]); // 시간 선택 옵션 용 배열
  const [isEditing, setIsEditing] = useState(false); // 수정 모드 상태
  const [editList, setEditList] = useState([]); // 수정할 일정 목록

  // 상세 일정 조회
  useEffect(() => {
    if (itinerary.itineraryNo > 0) {
      setEditList([]); // 초기화
      axios
        .get(`${backServer}/domestic/Plan`, {
          params: {
            itineraryNo: itinerary.itineraryNo,
            planDay: selectedDay,
          },
        })
        .then((res) => {
          console.log(res);
          setPlanList(res.data);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [itinerary, selectedDate]);

  // 시간 배열 생성
  useEffect(() => {
    if (timeOptionsArr.length === 0) {
      const options = [];
      for (let i = 0; i < 24; i++) {
        const hour = i < 10 ? `0${i}` : `${i}`;
        for (let j = 0; j < 60; j += 30) {
          const minute = j < 10 ? `0${j}` : `${j}`;
          options.push(`${hour}:${minute}`);
        }
      }
      setTimeOptionsArr(options);
    }
  }, []);

  // 수정된 일정 저장
  const saveUpdatedPlans = () => {
    if (isEditing) {
      const updateList = JSON.stringify(editList);
      axios
        .patch(`${backServer}/domestic/updatePlan`, updateList, {
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then((res) => {
          if (res.data) {
            Swal.fire({
              icon: "success",
              text: "메모와 시간이 저장되었습니다.",
            });
            setEditList([]); // 수정 목록 초기화
            setIsEditing(false); // 수정 모드 종료
          } else {
            Swal.fire({
              icon: "error",
              text: "처리 중 오류가 발생했습니다.",
            });
          }
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      setPlanPageOption(1); // 기본 조회 페이지로 돌아가기
    }
  };

  // 조회에서 버튼 클릭 시 수정 모드로 전환
  const switchToEditMode = () => {
    setPlanPageOption(2);
    setIsEditing(true); // 수정 모드 활성화
  };

  return (
    <div className="schedule-plan-wrap">
      <div className="schedule-list">
        <h3>{itinerary.itineraryTitle}</h3>
        <h4>
          {itinerary.countryName} {itinerary.regionName}
        </h4>
        <h4>
          {itinerary.itineraryStartDate} {itinerary.itineraryEndDate}
        </h4>
      </div>
      <div className="schedule-box">
        {totalPlanDates.length > 0 ? (
          <>
            <h4>{selectedDate}</h4>
            <SchedulePlanButton
              planDays={planDays}
              selectedDay={selectedDay}
              setSelectedDay={setSelectedDay}
              totalPlanDates={totalPlanDates}
              switchToEditMode={switchToEditMode} // 수정 모드 전환 함수 전달
            />
          </>
        ) : (
          ""
        )}
      </div>
      <div className="schedule-plan-list">
        <div className="schedule-content">
          <div className="schedule-itinerary">
            {planList.length > 0 ? (
              planList.map((plan, index) => (
                <SchedulePlanTime
                  key={"plan-item-" + index}
                  plan={plan}
                  timeOptionsArr={timeOptionsArr}
                  backServer={backServer}
                  setIsEditing={setIsEditing}
                  editList={editList}
                  setEditList={setEditList}
                />
              ))
            ) : (
              <h3></h3>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SchedulePlanList;
