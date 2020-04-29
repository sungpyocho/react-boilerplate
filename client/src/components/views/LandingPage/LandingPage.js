import React, { useEffect } from 'react'
import axios from 'axios';

function LandingPage(props) {

    // useEffect는 클래스형 컴포넌트의 ComponentDidMount()랑 같은 기능을 한다.
    useEffect(() => {
        /* 의미: '/api/hello'엔드포인트에서 get요청을 서버에 보낸다.
                그리고, 서버에서 돌아온 응담 res를 콘솔창에다가 출력
         문제: 서버 엔드포인트 URI를 어떻게 설정할 것인가?
               http://localhost:5000/api/hello로 보내면
               CORS정책에 의해 막혀버린다.
               두개의 다른 포트를 가지고 있는 서버는 아무 설정 없이 Request를 보낼 수 없다.
         해결:  여러가지 방법이 있으나, Proxy를 이용해서 해결할 것이다.
        */
        axios.get('/api/hello')
        .then(res => console.log(res.data))
    }, [])

    const onClickHandler = () => {
        axios.get('/api/users/logout')
            .then(response => {
                if (response.data.success) {
                    props.history.push('/login');
                } else {
                    alert('로그아웃 실패');
                }
            })
    }

    return (
        <div>
            여기는 홈페이지에요.
            <button onClick={onClickHandler}>
                로그아웃
            </button>
        </div>
    )
}

export default LandingPage
