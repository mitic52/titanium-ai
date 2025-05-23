import { Drawer } from "vaul";
import "./style.scss";
import mail_icon from "../../assets/icons/mail.svg";
import google_icon from "../../assets/icons/google.svg";
import eye_icon from "../../assets/icons/eye.svg";
import eye_closed_icon from "../../assets/icons/eye-closed.svg";
import return_icon from "../../assets/icons/chevron-left.svg";
import { Ring2 } from "ldrs/react";
import "ldrs/react/Ring2.css";
import { useEffect, useRef, useState } from "react";
import axios from "axios";

const serverUrl = "https://titanium-ai-api.glitch.me";

const Login = () => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [emailUsedForReset, setEmailUsedForReset] = useState("");
  const [verificationInProgress, setVerificationProgress] = useState(false);
  const [loginInProgress, setLoginProgress] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const emailInput = useRef(null);
  const emailInputResetPassword = useRef(null);
  const passwordInput = useRef(null);

  const showPassword = () => {
    setPasswordVisible((prev) => !prev);
  };

  const userAuth = async () => {
    if (loginInProgress) return;
    const errorElem = document.querySelector(".error_text");
    const email = emailInput.current.value.trim();
    const password = passwordInput.current.value;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const showError = (message) => {
      errorElem.innerText = message;
      errorElem.style.height = "1.5rem";
      setTimeout(() => {
        errorElem.style.height = "0";
      }, 1500);
    };

    if (!email || !password) {
      showError("Morate popuniti sva polja");
      return;
    }

    if (!emailRegex.test(email)) {
      showError("Neispravan format email adrese");
      return;
    }

    try {
      setLoginProgress(true);
      const res = await axios.post(`${serverUrl}/users`, { email, password });
      localStorage.setItem("userKey", res.data._id);
      setDrawerOpen(false);
      document.querySelector(".login_wrapper").style.transition = ".4s";
      setTimeout(() => {
        document.querySelector(".login_wrapper").style.opacity = "0";
        setTimeout(() => {
          window.location.reload();
        }, 400);
      }, 10);
    } catch (error) {
      showError(`${error.response.data.error}`);
      setLoginProgress(false);
    }
  };

  const openChangePasswordTab = () => {
    document.querySelector(".main_login").style.transform = "translateX(-100%)";
    document.querySelector(".password_reset_tab").style.transform = "translateX(0%)";
  };

  const closeResetPasswordTab = () => {
    document.querySelector(".main_login").style.transform = "translateX(0%)";
    document.querySelector(".password_reset_tab").style.transform = "translateX(100%)";
  };

  const sendResetLink = async () => {
    const email = emailInputResetPassword.current.value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const errorElem = document.querySelector(".error_text_reset");

    const showError = (message) => {
      errorElem.innerText = message;
      errorElem.style.height = "1.5rem";
      setTimeout(() => {
        errorElem.style.height = "0";
      }, 1500);
    };

    if (!email) {
      showError("Morate uneti email");
      return;
    }

    if (!emailRegex.test(email)) {
      showError("Neispravan format email adrese");
      return;
    }

    try {
      await axios.post(`${serverUrl}/users/passwordless_verification`, { email });
      setEmailUsedForReset(email);
      document.querySelector(".link_verification").style.transform = "translateX(0%)";
      document.querySelector(".password_reset_tab").style.transform = "translateX(-100%)";
    } catch (error) {
      showError(error.response?.data?.error || "Došlo je do greške");
    }
  };

  const confirmPasswordlessVerification = async () => {
    if (verificationInProgress) return;
    const errorElem = document.querySelector(".error_text_verification");
    setVerificationProgress(true);

    const showError = (message) => {
      errorElem.innerText = message;
      errorElem.style.height = "1.5rem";
      setTimeout(() => {
        errorElem.style.height = "0";
      }, 1500);
    };

    try {
      const res = await axios.post(`${serverUrl}/users/check_verification`, { email: emailUsedForReset });
      localStorage.setItem("userKey", res.data.user._id);
      setDrawerOpen(false);
      document.querySelector(".login_wrapper").style.transition = ".4s";
      setTimeout(() => {
        document.querySelector(".login_wrapper").style.opacity = "0";
        setTimeout(() => {
          window.location.reload();
        }, 400);
      }, 10);
    } catch (error) {
      showError(error.response?.data?.error || "Došlo je do greške");
    } finally {
      setVerificationProgress(false);
    }
  };

  const closeVerificationCheckTab = () => {
    document.querySelector(".password_reset_tab").style.transform = "translateX(0%)";
    document.querySelector(".link_verification").style.transform = "translateX(100%)";
  };

  useEffect(() => {
    const logo = document.querySelector(".logo_initials");
    const logo_initials_wrapper = document.querySelector(".logo_initials_wrapper");
    const logo_main_text = document.querySelector(".logo_text");
    const calculatedWidth = logo_main_text.offsetWidth;
    const logo_initials_width_default = logo_initials_wrapper.getBoundingClientRect();
    if (!logo) return;

    const paths = logo.querySelectorAll(".path");
    // logo_initials_wrapper.style.width = `${logo_initials_width_default.width}px`;
    // logo_main_text.style.width = "0px";
    // logo_main_text.style.opacity = "1";

    setTimeout(() => {
      paths.forEach((path) => {
        path.style.strokeDashoffset = "0";
      });
      setTimeout(() => {
        logo.style.transform = "scale(1)";
        logo.style.opacity = "1";
        setTimeout(() => {
          logo_main_text.style.width = `${logo_initials_width_default.width}px`;
          logo_main_text.style.opacity = "1";
          logo_initials_wrapper.style.opacity = "0";
          setTimeout(() => {
            logo_main_text.style.transition = "1s cubic-bezier(.72,.02,.02,.99)";
            logo_main_text.style.width = `${window.innerWidth * 0.9}px`;
            document.querySelector(".bg_video_wrapper").style.opacity = "1";
            document.querySelector(".login_options").style.display = "flex";
            setTimeout(() => {
              document.querySelector(".subhead_text").style.marginBottom = "0";
              document.querySelector(".subhead_text").style.opacity = "1";
              document.querySelectorAll(".login_register_button")[0].style.transform = "translateY(0)";
              document.querySelectorAll(".login_register_button")[0].style.opacity = "1";
              // setTimeout(() => {
              //   document.querySelectorAll(".login_register_button")[1].style.transform = "translateY(0)";
              //   document.querySelectorAll(".login_register_button")[1].style.opacity = "1";
              // }, 100);
            }, 1000);
          }, 50);
        }, 1100);

        // setTimeout(() => {
        //   document.querySelector(".logo_text").style.width = `${logo_initials_width_default.width}px`;
        //   logo_main_text.style.opacity = "1";
        //   logo_initials_wrapper.style.opacity = "0";
        //   setTimeout(() => {
        //     logo_main_text.style.transition = "1s cubic-bezier(.85,0,.15,1)";
        //     setTimeout(() => {
        //       logo_main_text.style.width = `${logo_initials_width_default.offsetWidth}px`;
        //       logo_main_text.style.display = "block";
        //     }, 50);
        //   }, 100);
        // }, 1000);
      }, 100);
    }, 1000);
  }, []);

  return (
    <Drawer.Root open={drawerOpen} onOpenChange={setDrawerOpen}>
      <div className="login_wrapper">
        <div className="video_logo_wrapper">
          <video className="bg_video_wrapper" autoPlay loop muted>
            <source src="/bg-video.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          <div className="logo_initials_wrapper">
            <svg className="logo_initials" width="60" height="51" viewBox="0 0 60 51" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M0.299988 8.20001L46.3 8.20001" stroke="#EFEFEF" strokeWidth="8.5" className="path" />
              <path d="M23.35 12.45V49.95" stroke="#EFEFEF" strokeWidth="8.4" className="path" />
              <path d="M55.1 12.88V50.28" stroke="#EFEFEF" strokeWidth="8.4" className="path" />
              <path d="M55.1 9.14999L55.1 0.749994" stroke="#EFEFEF" strokeWidth="8.35" className="path" />
            </svg>
          </div>
          <h1 className="logo_text">Titanium</h1>
          <p className="subhead_text">workout enhancer</p>
        </div>
        <div className="login_options">
          <Drawer.Trigger className="login_register_button">
            <img src={mail_icon} />
            <p>Nastavi preko Email</p>
          </Drawer.Trigger>
          {/* <button className="login_register_button google_login">
            <img src={google_icon} />
            <p>Use Google account</p>
          </button> */}
        </div>
      </div>
      <Drawer.Portal>
        <Drawer.Overlay className="drawer_overlay" />
        <Drawer.Content aria-describedby="" className="drawer_content">
          <Drawer.Title />
          <div className="drawer_pull_line" />
          <div className="main_login">
            <div className="header_text_wrapper">
              <h1>Dobrodošli</h1>
              <p>Koristite svoju imejl adresu i lozinku za prijavu. Ako nemate nalog, on će biti automatski kreiran za vas.</p>
            </div>
            <div className="inputs">
              <div className="input_wrapper">
                <h3 className="outter_input_placeholder">Email</h3>
                <input ref={emailInput} type="text" className="input_element" placeholder="marko@icloud.com" />
                {/* <p className="error_text">This is error text test</p> */}
              </div>
              <div className="input_wrapper">
                <h3 className="outter_input_placeholder">Lozinka</h3>
                <div className="input_wrapper_with_button">
                  <input ref={passwordInput} type={passwordVisible ? "text" : "password"} className="input_element" placeholder="•••••••••" />
                  <button className="show_password" onClick={showPassword}>
                    <img src={passwordVisible ? eye_closed_icon : eye_icon} />
                  </button>
                </div>
                <p className="error_text">This is error text test</p>
                <p className="reset_password_link" onClick={openChangePasswordTab}>
                  Zaboravili ste lozinku?
                </p>
              </div>
            </div>
            <button className="submit_user_credentials" style={{ display: "grid", placeItems: "center" }} onClick={userAuth}>
              {!loginInProgress ? <>Potvrdi</> : <Ring2 size="30" stroke="4" strokeLength="0.25" bgOpacity="0.1" speed="0.8" color="black" />}
            </button>
          </div>
          <div className="password_reset_tab">
            <div className="return_back" onClick={closeResetPasswordTab}>
              <img src={return_icon} />
            </div>
            <div className="header_text_wrapper">
              <h1>Prijava bez lozinke</h1>
              <p>Ako ste zaboravili lozinku, na vaš email će vam biti poslat verifikacioni link za ponovno pristupanje nalogu.</p>
            </div>
            <div className="inputs">
              <div className="input_wrapper">
                <h3 className="outter_input_placeholder">Email</h3>
                <input ref={emailInputResetPassword} type="text" className="input_element" placeholder="marko@icloud.com" />
                <p className="error_text_reset">This is error text test</p>
              </div>
            </div>
            <button className="submit_user_credentials" onClick={sendResetLink}>
              Pošalji email
            </button>
          </div>
          <div className="link_verification">
            <div className="return_back" onClick={closeVerificationCheckTab}>
              <img src={return_icon} />
            </div>
            <div className="header_text_wrapper">
              <h1>Link je poslat</h1>
              <p style={{ marginTop: ".5rem" }}>
                Klikom na link koji vam je poslat na <i style={{ fontVariationSettings: `'wght' 700` }}>{emailUsedForReset}</i>, otvoriće se stranica
                koja potvrđuje vaš identitet. Nakon toga, možete se vratiti i kliknuti na dugme ispod.
              </p>
            </div>
            <div className="inputs" style={{ marginTop: "-1rem" }}>
              <div className="input_wrapper">
                <p className="error_text_verification">This is error text test</p>
              </div>
            </div>
            <button
              className="submit_user_credentials"
              style={{ marginTop: "-1rem", display: "grid", placeItems: "center" }}
              onClick={confirmPasswordlessVerification}
            >
              {!verificationInProgress ? (
                <>Potvrdi verifikaciju</>
              ) : (
                <Ring2 size="30" stroke="4" strokeLength="0.25" bgOpacity="0.1" speed="0.8" color="black" />
              )}
            </button>
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
};

export default Login;
