import React, { useCallback } from 'react';
import { Link } from 'react-router-dom';
import { PopperBox } from './PopperStyle';
import Button from '../../../Common/Button/Button';
import { Group } from '../../../../pages/Detail/Detailcontent/detailType';

type PopperListProps = {
  groups: Group[];
  setCurrentID: React.Dispatch<React.SetStateAction<number>>;
  setCurrentRender: React.Dispatch<React.SetStateAction<string>>;
};
const PopperList: React.FC<PopperListProps> = ({
  groups,
  setCurrentID,
  setCurrentRender,
}) => {
  const clickList = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    const { currentTarget } = e;
    const value = parseInt(currentTarget.value);
    setCurrentRender('Detail');
    setCurrentID(value);
  }, []);
  return (
    <PopperBox>
      <h2 className="popperTitle">지금 이 영화를 같이 보고 싶어하는 팝퍼🍿</h2>
      <div className="popperList">
        <ul>
          {groups.map(item => {
            const itemDate = item.date;
            const year = itemDate.split('-')[0];
            const month = itemDate.split('-')[1];
            const date = itemDate.split('-')[2];
            return (
              <li key={item.groupId}>
                <button onClick={clickList} value={item.groupId}>
                  <h4>{item.title}</h4>
                  <div>
                    <ol>
                      <li>
                        일시 : {year}년 {month}월 {date}일 저녁 8시
                      </li>
                      <li>장소: {item.location}</li>
                      <li>
                        모집 인원: {item.users.length}/{item.max}
                      </li>
                    </ol>
                    <div className="profileImgWrap">
                      {item.users.map(user => {
                        return (
                          <div className="imgBox" key={user.userId}>
                            <img src={user.profileImage} alt="프로필 사진" />
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
      <div className="popperButtonWrap">
        <Button
          onClick={() => {
            setCurrentRender('Write');
          }}
          value="등록하기"
          width="100%"
          type="variant"
        />
      </div>
    </PopperBox>
  );
};

export default PopperList;
