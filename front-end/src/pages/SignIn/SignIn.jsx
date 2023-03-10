import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { signin } from "../../apis/auth";
import Cookies from "js-cookie";
import { getProfile } from "../../apis/profile";
import style from "./SignIn.module.css";

const SignIn = () => {
  const [error, setError] = useState(false);
  const { register, handleSubmit } = useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      const connectionUser = await signin(data);
      const { token } = connectionUser?.body;
      Cookies.set("token", token);
      const profile = await getProfile(token);
      if (profile) {
        dispatch({
          type: "SET_PROFILE",
          payload: profile,
        });
        dispatch({
          type: "SET_TOKEN",
          payload: token,
        });
        navigate("/Account");
      }
    } catch (e) {
      setError(true);
      console.log(e);
    }
  };

  return (
    <main className={`${style.main} bg-dark`}>
      <section className={style.signInContent}>
        <i className={`fa fa-user-circle ${style.signInIcon}`}></i>
        <h1>Sign In</h1>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className={style.inputWrapper}>
            <label htmlFor="username">Username</label>
            <input
              {...register("email")}
              type="email"
              id="username"
              autoComplete="username"
            />
          </div>
          <div className={style.inputWrapper}>
            <label htmlFor="password">Password</label>
            <input
              {...register("password")}
              type="password"
              id="password"
              autoComplete="current-password"
            />
          </div>
          <div className={style.inputRemember}>
            <input type="checkbox" id="remember-me" />
            <label htmlFor="remember-me">Remember me</label>
          </div>
          <button type="submit" className={style.signInButton}>
            Sign In
          </button>
          {error && (
            <p className={style.error}>
              Votre email ou mot de passe est incorrect !
            </p>
          )}
        </form>
      </section>
    </main>
  );
};

export default SignIn;
