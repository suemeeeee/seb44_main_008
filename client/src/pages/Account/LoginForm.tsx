import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { SubmitHandler, useForm } from 'react-hook-form';
import { Login } from '../../api/auth/account/login';
import Button from '../../components/Common/Button/Button';
import Input from '../../components/Common/Input/Input';
import { AccountWrap } from './AccountStyle';
import { useCallback, useState } from 'react';
import { useDispatch } from 'react-redux';
import { setUser } from '../../redux/reducers/user';
import axios from 'axios';
interface LoginType {
  email: string;
  password: string;
}

const LoginForm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { handleSubmit } = useForm<LoginType>();
  const [email, setEmail] = useState<string>('');
  const [emailMsg, setEmailMsg] = useState<string>('');
  const [isEmail, setIsEmail] = useState<boolean>(true);

  const [password, setPassword] = useState<string>('');
  const [isPassword, setIsPassword] = useState<boolean>(true);

  //이메일 유효성
  const emailRegex =
    /([\w-.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
  //비밀번호 유효성
  const passwordRegex = /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,25}$/;

  //이메일 유효성검사
  const onChangeEmail = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const emailCurrent = e.target.value;
      setEmail(emailCurrent);
    },
    [],
  );

  const onChangePassword = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const passwordCurrent = e.target.value;
      setPassword(passwordCurrent);
    },
    [],
  );

  const onSubmit: SubmitHandler<LoginType> = () => {
    if (email.length === 0) {
      setIsEmail(false);
    } else if (!emailRegex.test(email)) {
      setEmailMsg('이메일 형식이 틀렸습니다.');
      setIsEmail(false);
    } else {
      setIsEmail(true);
    }
    if (password.length === 0) {
      setIsPassword(false);
    } else if (passwordRegex.test(password) === false) {
      setIsPassword(false);
    } else {
      setIsPassword(true);
    }
    if (
      email.length !== 0 &&
      emailRegex.test(email) === true &&
      password.length !== 0
    ) {
      SubmitEvent.mutate({
        email: email,
        password: password,
      });
    }
  };

  const SubmitEvent = useMutation({
    mutationFn: (user: LoginType) => Login(user),
    onSuccess(data) {
      if (data?.status === 200) {
        const accessToken = data?.headers.authorization;
        const refreshToken = data?.headers.refresh;
        if (accessToken) {
          localStorage.setItem('token', accessToken);
        }
        if (refreshToken) {
          localStorage.setItem('refreshToken', refreshToken);
        }
        const getUser = async () => {
          try {
            const response = await axios.get(`https://moviepop.site/users`, {
              headers: {
                Authorization: accessToken,
                Refresh: refreshToken,
              },
            });
            dispatch(
              setUser({
                isLoggedIn: true,
                userInfo: {
                  id: response.data.data.userId,
                  name: response.data.data.name,
                  nickname: response.data.data.nickname,
                  user_img: response.data.data.profileImage,
                },
              }),
            );
            navigate('/main');
          } catch (error) {}
        };
        getUser();
      }
    },
    onError(error: any) {
      const errMsg = error.response.data.message;
      alert(errMsg);
    },
  });
  return (
    <AccountWrap>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="inputBox">
          <Input
            id="email"
            type="text"
            placeholder="이메일"
            isvalid={isEmail}
            value={email}
            onChange={onChangeEmail}
          />
          {email.length > 0 && !isEmail ? <span>{emailMsg}</span> : null}
        </div>
        <div className="inputBox">
          <Input
            id="password"
            type="password"
            value={password}
            placeholder="비밀번호"
            isvalid={isPassword}
            onChange={onChangePassword}
          />
        </div>
        <Button value="로그인" width="100%" type="submit" theme="variant" />
      </form>
      <button type="button" className="snsButton"></button>
    </AccountWrap>
  );
};

export default LoginForm;
