import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { auth } from "../_actions/user_actions";

export default (SpecificComponent, option, adminRoute = null) => {
  // option에 대한 설명
  // null => 아무나 출입이 가능한 페이지
  // true => 로그인한 유저만 출입이 가능한 페이지
  // false => 로그인한 유저는 출입 불가능한 페이지

  // adminRoute는?
  // true라면 admin user만 출입 가능

  function AuthenticationCheck(props) {
    const dispatch = useDispatch();
    useEffect(() => {
      // 페이지 이동할 때마다 dispatch가 작동해서 백엔드에 계속 request를 보냄
      dispatch(auth()).then((response) => {
        // 로그인하지 않은 상태
        if (!response.payload.isAuth) {
          // 로그인하지 않았는데 로그인한 사람만 들어갈 수 있는 페이지 들어가려 한다면
          // 로그인페이지로 보내버린다.
          if (option) {
            props.history.push("/login");
          }
        } else {
          // 로그인 한 상태
          // 어드민이 아닌데 어드민 전용 페이지 들어갈려고 하면
          if (adminRoute && !response.payload.isAdmin) {
            props.history.push("/");
          } else {
            // 로그인은 했는데 로그인한 사람은 못들어가는 페이지(로그인 등)을 들어가려고 하면
            if (option === false) props.history.push("/");
          }
        }
      });
    }, [dispatch, props.history]);

    return <SpecificComponent {...props} />;
  }

  return AuthenticationCheck;
};
