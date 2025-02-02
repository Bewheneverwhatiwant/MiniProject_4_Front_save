import styled from 'styled-components';
import CustomFont from '../../../../../Components/Container/CustomFont';
import CustomColumn from '../../../../../Components/Container/CustomColumn';
import CustomRow from '../../../../../Components/Container/CustomRow';
import StyledImg from '../../../../../Components/Container/StyledImg';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../../AuthContext';
import { useNavigate } from 'react-router-dom';

const ContainerCenter = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  width: 100%;
`;

const PageContainer = styled(ContainerCenter)`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  padding-top: 8vh;
  padding-bottom: 5vh;
  gap: 20px;
  position: relative;
  background-color: white;
`;

const BuyButton = styled.button`
display: flex;
align-items: center;
justify-content: center;
cursor: pointer;
padding: 0.5rem;
border: none;
border-radius: 10px;
width: 150px;
color: white;
background-color: #8CC63F;
`;

const MyTicketContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  background-color: #C1EEA580;
  border: none;
  border-radius: 20px;
  padding-top: 10px;
  padding-bottom: 10px;
  width: 100%;
  height: 250px;
  gap: 10px;
  overflow-y: auto;

  &::-webkit-scrollbar {
    width: 10px;
  }

  &::-webkit-scrollbar-thumb {
    background-color: #8CC63F;
    border-radius: 10px;
  }

  &::-webkit-scrollbar-track {
    background-color: #f0f0f0;
    border-radius: 10px;
  }
`;

const Divider = styled.div`
  height: 1px;
  width: 100%;
  background-color: white;
`;

export default function Component() {
  useEffect(() => {
    window.scrollTo(0, 0); // 페이지 로딩 시 스크롤을 맨 위로 설정
  }, []);

  // 매일 5번 무료 질문 가능한, 24시간 단위 갱신되는 티켓 개수
  const [remainingFreeQuestions, setRemainingFreeQuestions] = useState(null); // 초기값을 null로 설정
  const { isLoggedIn } = useAuth(); // useAuth 훅에서 로그인 상태와 유저 정보를 가져옴
  // 닉네임, 보유 무료티켓(매일 5개 무료 x, 이벤트 등 보유하고 있는 무료 티켓 o), 보유 유료티켓
  const [userData, setUserData] = useState({ username: '', free_tickets: 0, paid_tickets: 0 });
  const [ticketUsageHistory, setTicketUsageHistory] = useState([]); // 티켓 사용 내역 상태 추가
  const [ticketHistory, setTicketHistory] = useState([]); // 티켓 결제 내역 상태 추가

  const navigate = useNavigate();

  // 데이터 가져오기 함수 통합
  useEffect(() => {
    const fetchData = async () => {
      if (isLoggedIn) {
        try {
          console.log('사용자 데이터 불러오는 중...');
          const userResponse = await axios.get(`${process.env.REACT_APP_SERVER_IP}/user_total_info`);
          const userData = userResponse.data.find(u => u.username === isLoggedIn);
          if (userData) {
            setUserData({
              username: userData.username,
              freeTickets: userData.freeTickets,
              paidTickets: userData.paidTickets
            });
          }

          console.log('티켓 사용 내역 불러오는 중...');
          const usageResponse = await axios.get(`${process.env.REACT_APP_SERVER_IP}/get_ticket_history`, {
            params: { user_name: userData.username }
          });
          setTicketUsageHistory(usageResponse.data);

          console.log('티켓 결제 내역 불러오는 중...');
          const paymentResponse = await axios.get(`${process.env.REACT_APP_SERVER_IP}/return_payment`, {
            params: { user_name: userData.username }
          });
          setTicketHistory(paymentResponse.data);

          console.log('무료 티켓 개수 불러오는 중...');
          const freeTicketResponse = await axios.get(`${process.env.REACT_APP_SERVER_IP}/today_free_ask`, {
            params: { user_name: userData.username }
          });
          setRemainingFreeQuestions(freeTicketResponse.data);
        } catch (error) {
          console.error(error);
        }
      } else {
        console.log('User is not logged in or user data is not available.');
      }
    };

    fetchData();
  }, [isLoggedIn]);

  const BuyTrue = () => {
    navigate('/buyticketpage');
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Invalid date'; // 유효하지 않은 날짜 처리
    const date = new Date(dateString);
    if (isNaN(date)) return 'Invalid date'; // 유효하지 않은 날짜 처리
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    return `${year}년 ${month}월 ${day}일 ${hours}시 ${minutes}분`;
  };

  const GoAdmin = () => {
    navigate('/adminpage');
  };

  return (
    <ContainerCenter>
      <PageContainer>
        <CustomColumn width='80%' justifyContent='center' alignItems='center' gap='2rem'>

          <CustomRow width='100%' justifyContent='space-between' align-items='center'>
            <CustomRow>
              <CustomFont color='black' fontWeight='bold' font='1.5rem'>오늘 남은 무료 질문 횟수</CustomFont>
              <CustomFont color='#8CC63F' fontWeight='bold' font='2rem'>
                {remainingFreeQuestions !== null ? `(${remainingFreeQuestions}/5)` : 'Loading...'}
              </CustomFont>
            </CustomRow>

            <BuyButton>
              <CustomFont color='white' fontWeight='bold' font='1.5rem' onClick={BuyTrue}>티켓 구매</CustomFont>
            </BuyButton>
          </CustomRow>

          <MyTicketContainer>
            <CustomRow width='90%' justifyContent='space-between' alignItems='center'>
              <CustomRow>
                <StyledImg src={'icon_ticket.png'} />
                <CustomFont color='#8CC63F' font='1.3rem'>내 보유 유료 티켓</CustomFont>
              </CustomRow>

              <CustomFont color='#8CC63F' fontWeight='bold' font='1.3rem'>{userData.paidTickets}장</CustomFont>
            </CustomRow>

            <Divider />

            <CustomRow width='90%' justifyContent='space-between' alignItems='center'>
              <CustomRow>
                <StyledImg src={'icon_ticket.png'} />
                <CustomFont color='#8CC63F' font='1.3rem'>내 보유 무료 티켓</CustomFont>
              </CustomRow>

              <CustomFont color='#8CC63F' fontWeight='bold' font='1.3rem'>{userData.freeTickets}장</CustomFont>
            </CustomRow>
          </MyTicketContainer>

          <CustomRow width='100%' justifyContent='flex-start' align-items='center'>
            <CustomFont color='black' fontWeight='bold' font='1.5rem'>티켓 결제 내역</CustomFont>
          </CustomRow>

          <MyTicketContainer>
            {ticketHistory.length > 0 ? (
              ticketHistory.map((ticket, index) => (
                <React.Fragment key={index}>
                  <CustomRow width='90%' justifyContent='space-between' alignItems='center'>
                    <CustomFont color='black' font='1rem'>{formatDate(ticket.paidTime)}</CustomFont>
                    <CustomFont color='black' font='1rem'>티켓 {ticket.ticket}장</CustomFont>
                    <CustomFont color='black' font='1rem'>{ticket.price}원</CustomFont>
                  </CustomRow>
                  {index < ticketHistory.length - 1 && <Divider key={`divider-${index}`} />}
                </React.Fragment>
              ))
            ) : (
              <CustomFont color='black' fontWeight='bold' font='1.3rem'>아직 결제하신 내역이 없습니다.</CustomFont>
            )}
          </MyTicketContainer>

          <CustomRow width='100%' justifyContent='flex-start' align-items='center'>
            <CustomFont color='black' fontWeight='bold' font='1.5rem'>티켓 사용 내역</CustomFont>
          </CustomRow>

          <MyTicketContainer>
            {ticketUsageHistory.length > 0 ? (
              ticketUsageHistory.map((ticket, index) => (
                <React.Fragment key={index}>
                  <CustomRow width='90%' justifyContent='space-between' alignItems='center'>
                    <CustomFont color='black' font='1rem'>{formatDate(ticket.createdAt)}</CustomFont>
                    <CustomFont color='black' font='1.rem'>{ticket.ticketType}</CustomFont>
                  </CustomRow>
                  {index < ticketUsageHistory.length - 1 && <Divider key={`divider-${index}`} />}
                </React.Fragment>
              ))
            ) : (
              <CustomFont color='black' fontWeight='bold' font='1.3rem'>아직 티켓을 사용하신 내역이 없습니다.</CustomFont>
            )}
          </MyTicketContainer>
          <button onClick={GoAdmin}>미프 전용 관리자 계정 엿보기</button>

        </CustomColumn>
      </PageContainer>
    </ContainerCenter>
  );
};
