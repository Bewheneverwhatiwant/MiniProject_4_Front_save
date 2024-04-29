import styled from 'styled-components';

const ContainerCenter = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  width: 100%;
  min-height: 100vh;
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

export default function Component() {
    return (
        <ContainerCenter>
            <PageContainer>
                여기는 로그인 후 보이는 마이페이지!
            </PageContainer>
        </ContainerCenter>
    );
};