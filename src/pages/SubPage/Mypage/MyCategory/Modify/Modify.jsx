import styled from 'styled-components';
import CustomFont from '../../../../../Components/Container/CustomFont';
import CustomColumn from '../../../../../Components/Container/CustomColumn';
import CustomRow from '../../../../../Components/Container/CustomRow';
import StyledImg from '../../../../../Components/Container/StyledImg';
import { useState } from 'react';
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

const LogoutButton = styled.button`
display: flex;
align-items: center;
justify-content: center;
cursor: pointer;
padding: 0.5rem;
border: 1.5px solid #979797;
border-radius: 30px;
width: 150px;
color: #979797;
background-color: transparent;
`

const InfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
  background-color: #C1EEA580;
  border: 2px solid #8CC63F;
  border-radius: 20px;

  padding-top: 10px;
  padding-bottom: 10px;
  width: 100%;
  height: 150px;
`;

const Divider = styled.div`
  height: 1px;
  width: 100%;
  background-color: #8CC63F;
`;

const Button = styled.button`
  font-size: 1.2rem;
  color: white;
  background-color: #C1EEA580;
  border: 2px solid white;
  border-radius: 10px;
  padding: 10px 20px;
  cursor: pointer;
  outline: none;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.2);

  &:hover {
    background-color: #7BB32E;
  }
`;

const LogOutImg = styled.div`
display: flex;
justify-content: center;
align-items: center;
width: 150px;
height:150px;
border-radius: 20px;
`;

const username = 'lny021102';
const userImg = 'ex_myprofile.png';

export default function Component() {

  const [isLoggedOut, setIsLoggedOut] = useState(false); // 로그아웃 상태관리!

  const handleLogout = () => {
    setIsLoggedOut(true);
  };

  const navigate = useNavigate();

  const handleChangePassword = () => {
    const newPassword = prompt('변경할 비밀번호를 입력하세요.');
    if (newPassword !== null) {
      alert('변경이 완료되었습니다. 다시 로그인해주세요.');
      navigate('/');
    }
  };

  return (
    <ContainerCenter>
      <PageContainer>
        <CustomColumn width='80%' justifyContent='center' alignItems='center' gap='1rem'>

          <CustomRow width='100%' justifyContent='flex-start' alignItems='center' gap='1.5rem'>
            {isLoggedOut ? (
              <LogOutImg>로그인해주세요</LogOutImg>
            ) : (
              <StyledImg src={'ex_myprofile.png'} width='150px' height='150px' borderRadius='20px' />
            )}
            <CustomColumn width='100%' justifyContent='flex-start' alignItems='flex-start' gap='1rem'>

              {isLoggedOut ? '로그인해주세요' : `${username}님 환영합니다.`}
              <LogoutButton onClick={handleLogout}>
                <CustomFont color='#979797' font='1rem' fontWeight='bold'>로그아웃</CustomFont>
              </LogoutButton>
            </CustomColumn>
          </CustomRow>

          <InfoContainer>
            <CustomRow width='80%' justifyContent='space-between' alignItems='center'>
              <CustomFont color='#8CC63F' fontWeight='bold' font='1.2rem'>아이디</CustomFont>
              <CustomFont color='#8CC63F' fontWeight='bold' font='1.2rem'>
                {isLoggedOut ? '로그인해주세요' : username}
              </CustomFont>
            </CustomRow>

            <Divider />

            <CustomRow width='80%' justifyContent='space-between' alignItems='center'>
              <CustomFont color='#8CC63F' fontWeight='bold' font='1.2rem'>비밀번호</CustomFont>
              <Button onClick={handleChangePassword}>
                <CustomFont color='white' fontWeight='bold' font='1.2rem'>비밀번호 변경</CustomFont>
              </Button>
            </CustomRow>
          </InfoContainer>

        </CustomColumn>
      </PageContainer>
    </ContainerCenter>
  );
};

/*
 {isLoggedOut ? (
              <LogOutImg>로그인해주세요</LogOutImg>
            ) : (
              <StyledImg src={'ex_myprofile.png'} width='150px' height='150px' borderRadius='20px' />
            )}
*/