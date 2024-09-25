import { useEffect, useState } from "react";

const PlanItem = (props) => {
  const {
    plan,
    timeOptionsArr,
    backServer,
    setEdited,
    editPlanList,
    setEditPlanList,
  } = props;
  const [editPlan, setEditPlan] = useState({}); // 수정할 정보 저장

  useEffect(() => {
    setEditPlan({
      planNo: plan.planNo,
      planMemo: plan.planMemo,
      planTime: plan.planTime,
    }); // 수정할 정보 저장
  }, [plan]);

  // 시간, 메모 변경 시 editPlanList 배열에 저장
  const changeInput = (e) => {
    setEditPlan({ ...editPlan, [e.target.id]: e.target.value });
    setEdited(true);
    const newPlanList = editPlanList.filter((item) => {
      return item.planNo !== editPlan.planNo;
    });
    newPlanList.push(editPlan);
    setEditPlanList([...newPlanList]);
  };

  return (
    <div className="plan-item">
      <div className="plan-seq-info-box">
        <div className="plan-seq-icon">{plan.planSeq}</div>
        <div className="plan-time">
          <select
            id="planTime"
            onChange={changeInput}
            defaultValue={plan.planTime}
          >
            <option>시간 미정</option>
            {timeOptionsArr.map((time, index) => {
              return (
                <option key={"time-option-" + index} value={time}>
                  {time}
                </option>
              );
            })}
          </select>
        </div>
      </div>
      <div className="plan-info-box">
        <div className="plan-name">{plan.planName}</div>
        <div className="plan-memo">
          <input
            id="planMemo"
            value={editPlan.planMemo ? editPlan.planMemo : ""}
            placeholder="메모를 입력해 주세요."
            onChange={changeInput}
          ></input>
        </div>
      </div>
      <div className="plan-image-box">
        <img
          src={
            plan.planImg
              ? `${backServer}/foreign/${plan.planImg}`
              : "/image/default_img.png"
          }
        ></img>
      </div>
    </div>
  );
};

export default PlanItem;
