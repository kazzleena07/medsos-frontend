// import DarkModeSwitcher from "@/components/dark-mode-switcher/Main";
import dom from "@left4code/tw-starter/dist/js/dom";
import logoUrl from "@/assets/images/logo.svg";
import illustrationUrl from "@/assets/images/illustration.svg";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthService from "../../services/auth";
import { Lucide, Notification } from "../../base-components"

function Main() {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const notifRef = useRef();
  const [username, setUsername] = useState();
  const [password, setPassword] = useState();
  const [notifMsg, setNotifMsg] = useState('');
  const [isFailed, setIsFailed] = useState(false);
  const [isEmptyUsername, setIsEmptyUsername] = useState(false);
  const [isEmptyPassword, setIsEmptyPassword] = useState(false);
  const [isShowPassword, setIsShowPassword] = useState(false);

  const onChageUsername = (e) => {
    if (!e) setIsEmptyUsername(true);
    else setIsEmptyUsername(false);

    setUsername(e);
  };

  const onChagePassword = (e) => {
    if (!e) setIsEmptyPassword(true);
    else setIsEmptyPassword(false);

    setPassword(e);
  };

  const onShowHidePassword = () => {
    setIsShowPassword(!isShowPassword);
  };

  const onLogin = async (e) => {
    e.preventDefault()
    console.log(username)
    console.log(password)
    let req = {
      "username": username,
      "password": password,
    }
    let response = await AuthService.Login(req);
    if (response.error === 0) {
      setIsFailed(false)
      setNotifMsg('Login Berhasil')
      setTimeout(() => {
        notifRef.current?.showToast();
      }, 1000);
      AuthService.SaveToken(response.data.token);
      localStorage.removeItem("userData")
      localStorage.removeItem("userProfile")
      localStorage.setItem('userData', JSON.stringify(response.data))
      localStorage.setItem('userProfile', JSON.stringify(response.data.profile))
      navigate("/");
      navigate(0);
    } else {
      setNotifMsg('Login Gagal, ' + response.responseMessage)
      setIsFailed(true)
      setTimeout(() => {
        notifRef.current?.showToast();
      }, 1000);
    }

  };

  useEffect(() => {
    if (token) {
      navigate('/');
    }
    dom("html").addClass("dark");
    dom("body").removeClass("main").removeClass("error-page").addClass("login");
  }, []);

  return (
    <>
      <div>
        <div className="container sm:px-10">
          <div className="block xl:grid grid-cols-2 gap-4">
            {/* BEGIN: Login Info */}
            <div className="hidden xl:flex flex-col min-h-screen">
              <a href="" className="-intro-x flex items-center pt-5">
                <img
                  alt="Midone Tailwind HTML Admin Template"
                  className="w-6"
                  src={logoUrl}
                />
                <span className="text-white text-lg ml-3"> MEDSOS </span>
              </a>
              <div className="my-auto">
                <img
                  alt="Midone Tailwind HTML Admin Template"
                  className="-intro-x w-1/2 -mt-16"
                  src={illustrationUrl}
                />
              </div>
            </div>
            {/* END: Login Info */}
            {/* BEGIN: Login Form */}
            <div className="h-screen xl:h-auto flex py-5 xl:py-0 my-10 xl:my-0">
              <div className="my-auto mx-auto xl:ml-20 bg-white dark:bg-darkmode-600 xl:bg-transparent px-5 sm:px-8 py-8 xl:p-0 rounded-md shadow-md xl:shadow-none w-full sm:w-3/4 lg:w-2/4 xl:w-auto">
                <h2 className="intro-x font-bold text-2xl xl:text-3xl text-center xl:text-left">
                  Sign In
                </h2>
                <div className="intro-x mt-8">
                  <input
                    type="text"
                    onChange={(e) => {
                      onChageUsername(e.target.value)
                    }}
                    className={isEmptyUsername ? "intro-x login__input form-control py-3 px-4 block border-danger" : "intro-x login__input form-control py-3 px-4 block"}
                    placeholder="Username"
                  />
                  <div style={{ display: 'flex', flexDirection: 'row' }}>
                    <input
                      aria-describedby="input-group-price"
                      type={isShowPassword ? "text" : "password"}
                      onChange={(e) => {
                        setPassword(e.target.value)
                      }}
                      style={{ borderTopRightRadius: 0, borderBottomRightRadius: 0 }}
                      className={isEmptyPassword ? "intro-x login__input form-control py-3 px-4 block mt-4 border-danger" : "intro-x login__input form-control py-3 px-4 block mt-4"}
                      placeholder="Password"
                    />
                    <div className="mt-4"
                      style={{
                        borderTopRightRadius: "0.375rem", borderBottomRightRadius: "0.375rem",
                        backgroundColor: 'rgb(var(--color-darkmode-800) / var(--tw-bg-opacity))'
                      }}>
                      {isShowPassword ? (
                        <Lucide icon="EyeOff"
                          style={{ marginTop: 10, marginRight: 10 }}
                          onClick={onShowHidePassword} />
                      ) : (
                        <Lucide icon="Eye"
                          style={{ marginTop: 10, marginRight: 10 }}
                          onClick={onShowHidePassword} />
                      )}
                    </div>
                  </div>
                </div>
                <div className="intro-x flex text-slate-600 dark:text-slate-500 text-xs sm:text-sm mt-4">
                  <a href="">Forgot Password?</a>
                </div>
                <div className="intro-x mt-5 xl:mt-8 text-center xl:text-left">
                  <button onClick={onLogin} className="btn btn-primary py-3 px-4 w-full xl:w-32 xl:mr-3 align-top">
                    Login
                  </button>
                  <button onClick={() => { navigate("/register") }} className="btn btn-outline-secondary py-3 px-4 w-full xl:w-32 mt-3 xl:mt-0 align-top">
                    Register
                  </button>
                </div>
              </div>
            </div>
            {/* END: Login Form */}
          </div>
        </div>
        {notifMsg != '' && (
          <Notification getRef={(el) => {
            console.log(el)
            notifRef.current = el;
          }}
            options={{
              duration: 3000,
            }}
            className="flex"
          >
            <Lucide icon={isFailed ? "XCircle" : "CheckCircle"} className={isFailed ? "text-error" : "text-success"} />
            <div className="ml-4 mr-4">
              <div className="font-medium text-black">{notifMsg}</div>
            </div>
          </Notification>
        )}
      </div>
    </>
  );
}

export default Main;
