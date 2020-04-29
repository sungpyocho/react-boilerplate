import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { loginUser } from '../../../_actions/user_action';

function LoginPage(props) {
    const dispatch = useDispatch();

    const [Email, setEmail] = useState("")
    const [Password, setPassword] = useState("")

    const emailHandler = (event) => {
        setEmail(event.currentTarget.value);
    }

    const passwordHandler = (event) => {
        setPassword(event.currentTarget.value);
    }

    const submitHandler = (event) => {
        event.preventDefault(); // page refresh 방지

        let body = {
            email: Email,
            password: Password
        }

        // _actions/user_action.js의 loginUser로 보내져서, Axios로 처리
        dispatch(loginUser(body))
            .then(response => {
                if (response.payload.loginSuccess) {
                    // 페이지를 이동할 때는 props.history.push를 사용
                    props.history.push('/')
                } else {
                    alert('Error')
                }
            })


    }

    return (
        <div style={{
            display: 'flex', justifyContent: 'center', alignItems: 'center',
            width: '100%', height: '100vh'
        }}>
        
            <form style={{ display: 'flex', flexDirection: 'column'}}
                onSubmit={submitHandler}
            >
                <label>Email</label>
                <input type="email" value={Email} onChange={emailHandler} />
                <label>Password</label>
                <input type="password" value={Password} onChange={passwordHandler} />
                <br />
                <button type="submit">
                    Login
                </button>
            </form>
        </div>
    )
}

export default LoginPage
