import styled from 'styled-components';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../SubPage/AuthContext';

import CustomFont from '../../../Components/Container/CustomFont';
import CustomColumn from '../../../Components/Container/CustomColumn';
import CustomRow from '../../../Components/Container/CustomRow';

const ContainerCenter = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  width: 100%;
`;

const PageContainer = styled(ContainerCenter)`
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  padding-top: 8vh;
  padding-bottom: 5vh;
  gap: 20px;
  position: relative;
  background-color: white;
`;

const Tabs = styled.div`
  display: flex;
  justify-content: space-around;
  width: 80%;
  background-color: #f0f8e0;
  padding: 1rem;
  border-radius: 20px;
`;

const Tab = styled.div`
  font-size: 1.2rem;
  font-weight: bold;
  color: ${props => (props.active ? '#78AB34' : '#B2B2B2')};
  border-bottom: ${props => (props.active ? '2px solid #78AB34' : 'none')};
  cursor: pointer;
`;

const PurpleBox = styled.div`
  background-color: #fdeaf1;
  border-radius: 20px;
  padding: 1rem;
  margin: 1rem 0;
  width: 80%;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const LikeButton = styled.button`
  background: url('icon_like_button.png') no-repeat center;
  background-size: cover;
  border: none;
  cursor: pointer;
  width: 40px;
  height: 40px;
  transition: width 0.2s, height 0.2s;

  &:active {
    width: 30px;
    height: 30px;
  }
`;

const Divide = styled.div`
width: 80%;
height: 1px;
background-color: #D389C7;
`;

const DocRound = styled.div`
background-color: white;
display: flex;
flex-direction: column;
border-radius: 20px;
width: 100%;
`;

const DocContent = styled.div`
display: flex;
flex-direction: column;
min-height: 100px;
width: 100%;
margin: 10px;
line-height: 1.2rem;

align-items: center;
justify-content: center;
`;

const Circle = styled.div`
  width: 10px;
  height: 10px;
  border-radius: 10px;
  background-color: ${props => props.color || '#F0F0F0'};
  border: none;
`;

const DocHeader = styled.div`
width: 100%;
height: 20px;
background-color: #3C3C3C;
display: flex;
align-items: center;
justify-content: flex-start;
gap: 1rem;
border-top-left-radius: 10px;
  border-top-right-radius: 10px;
`;

export default function Component() {
    const { isLoggedIn } = useAuth(); // useAuth 훅에서 로그인 상태와 유저 정보를 가져옴
    const [userData, setUserData] = useState({ username: '', free_tickets: 0, paid_tickets: 0 });
    const [activeTab, setActiveTab] = useState(0);
    const [content, setContent] = useState([]);
    const [loading, setLoading] = useState(true);


    const navigate = useNavigate();

    const handleTabClick = (index) => {
        setActiveTab(index);
        let type = '';
        switch (index) {
            case 0:
                type = 'sorry';
                break;
            case 1:
                type = 'notice';
                break;
            case 2:
                type = 'letter';
                break;
            case 3:
                type = 'poster';
                break;
            case 4:
                type = 'job';
                break;
            case 5:
                type = 'hire';
                break;
            default:
                type = '';
        }
        fetchData(type);
    };


    const handleLikeClick = async (index) => {
        const doc = content[index];

        // 좋아요 클릭 시 즉시 프론트엔드 상태 업데이트
        setContent(prevContent => {
            const newContent = [...prevContent];
            newContent[index].liked = true;
            newContent[index].like_count = (newContent[index].like_count || 0) + 1; // 초기값 설정
            return newContent;
        });

        try {

            console.log('시작');

            // 서버에 좋아요 증가 요청
            await axios.put(`${process.env.REACT_APP_SERVER_IP}/add_like_count`, null, {
                params: {
                    doc_name: doc.name,
                    user_name: isLoggedIn
                }
            });

            console.log('좋아요 post 끝');

            // 서버에서 최신 좋아요 수 가져와서 업데이트
            const response = await axios.get(`${process.env.REACT_APP_SERVER_IP}/get_like_count`, {
                params: {
                    doc_name: encodeURIComponent(doc.name),
                    user_name: isLoggedIn
                }
            });

            console.log('좋아요 개수 업데이트 끝');

            const updatedLikeCount = response.data;

            console.log(updatedLikeCount);

            // 서버에서 받은 최신 좋아요 수가 유효한지 확인 후 상태 업데이트
            if (typeof updatedLikeCount === 'number') {
                setContent(prevContent => {
                    const newContent = [...prevContent];
                    newContent[index].like_count = updatedLikeCount;
                    return newContent;
                });
            } else {
                console.error('서버로부터 유효하지 않은 좋아요 수를 받았습니다:', updatedLikeCount);
            }
        } catch (error) {
            console.log(doc.name);
            console.log(isLoggedIn);
            console.error('좋아요 추가 실패', error);
        }
    };

    const fetchData = async (type) => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_SERVER_IP}/shared_documents`);
            const documents = response.data.filter(doc => doc.type === type).map(doc => ({ ...doc, like: doc.like_count || 0 }));
            setContent(documents);
            setLoading(false);
        } catch (error) {
            console.error('데이터 불러오기 실패', error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData('sorry'); // 처음 로드할 때는 사과문 카테고리를 로드합니다.
    }, []);

    return (
        <ContainerCenter>
            <PageContainer>
                <CustomColumn width='80%' justifyContent='center' alignItems='center' gap='2rem'>

                    <Tabs>
                        <Tab active={activeTab === 0} onClick={() => handleTabClick(0)}>사과문</Tab>
                        <Tab active={activeTab === 1} onClick={() => handleTabClick(1)}>보고서/시말서</Tab>
                        <Tab active={activeTab === 2} onClick={() => handleTabClick(2)}>편지</Tab>
                        <Tab active={activeTab === 3} onClick={() => handleTabClick(3)}>광고/포스터</Tab>
                        <Tab active={activeTab === 4} onClick={() => handleTabClick(4)}>이력서</Tab>
                        <Tab active={activeTab === 5} onClick={() => handleTabClick(5)}>모집/채용공고</Tab>
                    </Tabs>

                    {loading ? (
                        <p>Loading...</p>
                    ) : (
                        content.length > 0 ? (
                            content.map((item, index) => (
                                <PurpleBox key={index}>
                                    <CustomFont color='#D389C7' font='1.5rem' fontWeight='bold'>
                                        {item.name}
                                    </CustomFont>
                                    <CustomFont color='#D389C7' font='1rem'>
                                        작성자: {item.user_name}
                                    </CustomFont>

                                    <CustomFont color='#D389C7' font='1rem'>
                                        대상: {item.content}
                                    </CustomFont>

                                    <DocRound>
                                        <DocHeader>
                                            <CustomRow width='10%' alignItems='center' justifyContent='space-around'>
                                                <Circle color='#EC6A5E' />
                                                <Circle color='#F4BF4F' />
                                                <Circle color='#61C554' />
                                            </CustomRow>
                                        </DocHeader>
                                        <DocContent>
                                            <CustomFont color='#D389C7' font='1rem'>
                                                {item.target}
                                            </CustomFont>
                                        </DocContent>
                                    </DocRound>

                                    <Divide />

                                    <CustomRow width='100%' alignItems='center' justifyContent='flex-start'>
                                        <LikeButton onClick={() => handleLikeClick(index)} />
                                        <CustomFont color='#D389C7' font='1.2rem' fontWeight='bold'>
                                            좋아요 {item.like_count}개
                                        </CustomFont>
                                    </CustomRow>
                                </PurpleBox>
                            ))
                        ) : (
                            <p>아직 공유된 문서가 없어요.</p>
                        )
                    )}

                </CustomColumn>
            </PageContainer>
        </ContainerCenter>
    );
}
