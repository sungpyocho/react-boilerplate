import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { registerUser } from '../../../_actions/user_action';

function RegisterPage(props) {
    const dispatch = useDispatch();

    const [Email, setEmail] = useState("")
    const [Name, setName] = useState("")
    const [Password, setPassword] = useState("")
    const [ConfirmPassword, setConfirmPassword] = useState("")

    const emailHandler = (event) => {
        setEmail(event.currentTarget.value)
    }

    const nameHandler = (event) => {
        setName(event.currentTarget.value)
    }

    const passwordHandler = (event) => {
        setPassword(event.currentTarget.value)
    }

    const confirmPasswordHandler = (event) => {
        setConfirmPassword(event.currentTarget.value)
    }

    const submitHandler = (event) => {
        event.preventDefault();

        if (Password !== ConfirmPassword) {
            return alert('비밀번호와 비밀번호 확인을 똑같이 입력해주세요.');
        }

        let body = {
            email: Email,
            name: Name,
            password: Password
        }
        dispatch(registerUser(body))
            .then(response => {
                if (response.payload.success) {
                    props.history.push('/login');
                } else {
                    alert ('Sign up failed');
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
                <label>Name</label>
                <input type="text" value={Name} onChange={nameHandler} />
                <label>Password</label>
                <input type="password" value={Password} onChange={passwordHandler} />
                <label>Confirm Password</label>
                <input type="password" value={ConfirmPassword} onChange={confirmPasswordHandler} />

                <br />
                <button type="submit">
                    회원 가입
                </button>
            </form>
        </div>
    )
}

export default RegisterPage
