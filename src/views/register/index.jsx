import DarkModeSwitcher from "@/components/dark-mode-switcher/Main";
import dom from "@left4code/tw-starter/dist/js/dom";
import logoUrl from "@/assets/images/logo.svg";
import illustrationUrl from "@/assets/images/illustration.svg";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import CommonServices from "../../services/common";
import AuthService from "../../services/auth";
import { Lucide, Notification } from "../../base-components";

function Main() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isNext, setIsNext] = useState(false);
  const [notifError, setNotifError] = useState("");
  const notifRef = useRef();
  const notifRefFailed = useRef();

  const validateUser = async () => {
    if(username == "" || email == "" || password == "" || confirmPassword == ""){
      setNotifError("*Input cant empty")
    }else if (password != confirmPassword) {
      setNotifError("*Confirm password not same")
    } else {
      let req = {
        "username": username,
        "email": email,
      }
      let response = await AuthService.CheckUserExist(req)
      if (response.error == 0) {
        setNotifError("")
        
        let reqReg = {
          "username": username,
          "email": email,
          "password": email,
        }

        let responseReg = await AuthService.SignUp(reqReg);
        if(responseReg.error == 0){
          notifRef.current?.showToast();
          navigate('/login')
        }else{
          notifRefFailed.current?.showToast();
        }
      } else {
        setNotifError("*" + response.message)
      }
    }
  }

  const RenderNotification = () => {
    return (
      <Notification getRef={(el) => {
        notifRef.current = el;
      }}
        options={{
          duration: 3000,
        }}
        className="flex"
      >
        <Lucide icon="CheckCircle" className="text-success" />
        <div className="ml-4 mr-4">
          <div className="font-medium">Register Success</div>
        </div>
      </Notification>
    )
  }


  const RenderFailedNotification = () => {
    return (
      <Notification getRef={(el) => {
        notifRefFailed.current = el;
      }}
        options={{
          duration: 3000,
        }}
        className="flex"
      >
        <Lucide icon="XCircle" className="text-danger" />
        <div className="ml-4 mr-4">
          <div className="font-medium">Register Failed</div>
        </div>
      </Notification>
    )
  }

  useEffect(() => {
    dom("html").addClass("dark");
    dom("body").removeClass("main").removeClass("error-page").addClass("login");
  }, [notifError]);

  return (
    <>
      <div>
        {/* <DarkModeSwitcher /> */}
        <div className="container sm:px-10">
          <div className="block xl:grid grid-cols-2 gap-4">
            {/* BEGIN: Register Info */}
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
            {/* END: Register Info */}
            {/* BEGIN: Register Form */}
            <div className="h-screen xl:h-auto flex py-5 xl:py-0 my-10 xl:my-0">
              <div className="my-auto mx-auto xl:ml-20 bg-white dark:bg-darkmode-600 xl:bg-transparent px-5 sm:px-8 py-8 xl:p-0 rounded-md shadow-md xl:shadow-none w-full sm:w-3/4 lg:w-2/4 xl:w-auto">
                <h2 className="intro-x font-bold text-2xl xl:text-3xl text-center xl:text-left">
                  Sign Up
                </h2>

                <div className="intro-x mt-8">
                  <input
                    onChange={(e) => { setUsername(e.target.value) }}
                    type="text"
                    className="intro-x login__input form-control py-3 px-4 block"
                    placeholder="Username"
                  />
                  <input
                    onChange={(e) => { setEmail(e.target.value) }}
                    type="text"
                    className="intro-x login__input form-control py-3 px-4 block mt-4"
                    placeholder="Email"
                  />
                  <input
                    onChange={(e) => { setPassword(e.target.value) }}
                    type="password"
                    className="intro-x login__input form-control py-3 px-4 block mt-4"
                    placeholder="Password"
                  />
                  <input
                    onChange={(e) => { setConfirmPassword(e.target.value) }}
                    type="password"
                    className="intro-x login__input form-control py-3 px-4 block mt-4"
                    placeholder="Password Confirmation"
                  />
                </div>
                {notifError != "" && (
                  <div className="intro-x flex text-slate-600 dark:text-slate-500 text-xs sm:text-sm mt-4">
                    <label style={{ color: 'red' }}>{notifError}</label>
                  </div>
                )}
                <div className="intro-x mt-5 xl:mt-8 text-center">
                  <button onClick={validateUser} className="btn btn-primary py-3 px-4 w-full align-top">
                    Next
                  </button>
                </div>
                <div className="intro-x flex text-slate-600 dark:text-slate-500 text-xs sm:text-sm mt-4">
                  <a href="/login">Already have account?</a>
                </div>
              </div>
            </div>
            {/* END: Register Form */}
          </div>
        </div>
      </div>
      <RenderNotification/>
      <RenderFailedNotification/>
    </>
  );
}

export default Main;
