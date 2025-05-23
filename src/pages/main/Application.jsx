import { createRoot } from "react-dom/client";
import { Reuleaux } from "ldrs/react";
import { Leapfrog } from "ldrs/react";
import "ldrs/react/Reuleaux.css";
import "ldrs/react/Leapfrog.css";
import "./style.scss";
import muscles_svg from "../../assets/icons/muscles.svg";
import muscles_pump_svg from "../../assets/icons/muscles-pump.svg";
import chevron_up_svg from "../../assets/icons/chevron-up.svg";
import move_left_svg from "../../assets/icons/move-left.svg";
import send_svg from "../../assets/icons/send.svg";
import ghosting_svg from "../../assets/icons/message-ghost.svg";
import ghosting_response_svg from "../../assets/icons/message-ghost-response.svg";
import circle_plus_svg from "../../assets/icons/circle-plus.svg";
import double_check_svg from "../../assets/icons/check-check.svg";
import x_svg from "../../assets/icons/x.svg";
import plus_svg from "../../assets/icons/plus.svg";
import logout_svg from "../../assets/icons/log-out.svg";
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { color, motion, useAnimation } from "motion/react";
import { Haptics } from "@capacitor/haptics";
import { StatusBar } from "@capacitor/status-bar";
import { Keyboard } from "@capacitor/keyboard";

const serverapi = "https://titanium-ai-api.glitch.me";

const workout_history = [
  { name: "Push Day", colorCombo: 0, duration: "1h 32m", date: "14/03/2025", exercises: [1, 2, 3, 4, 5] },
  { name: "Pull Day", colorCombo: 1, duration: "1h 17m", date: "13/03/2025", exercises: [1, 2, 3, 4, 5, 6, 7] },
  { name: "Legs Day", colorCombo: 2, duration: "57m", date: "11/03/2025", exercises: [1, 2, 3] },
  { name: "Push Day", colorCombo: 0, duration: "1h 32m", date: "10/03/2025", exercises: [1, 2, 3, 4, 5] },
  { name: "Pull Day", colorCombo: 1, duration: "1h 17m", date: "09/03/2025", exercises: [1, 2, 3, 4, 5, 6, 7] },
  { name: "Legs Day", colorCombo: 2, duration: "57m", date: "08/03/2025", exercises: [1, 2, 3] },
];

const colors = ["#A2C729", "#6829C7", "#C7292C", "#29AAC7"];

// const workoutTableTemplate = [{ name: "", weights: [], reps: [] }];

const Application = () => {
  const [user, setUser] = useState(null);
  const timeoutRef = useRef(null);
  const [completed, setCompleted] = useState(false);
  const [isHolding, setIsHolding] = useState(false);
  const [shakeIntensity, setShakeIntensity] = useState(0);
  const [allowMessageRequest, setAllowMessageRequest] = useState(true);
  const [quote, setQuote] = useState("");
  const [motivation_quotes] = useState(["Veruj sebi", "Budi uporan", "Veruj procesu", "Napreduj stalno"]);
  const [chatMessages, setChatMessages] = useState([]);
  const [isAnimatedTextChat, setIsAnimatedTextChat] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [workoutSessionInfo, setWorkoutSessionInfo] = useState({
    type: "",
    workouts: [],
    startTime: "",
    endTime: "",
  });
  const [tempWorkout, setTempWorkout] = useState([]);
  const [workoutFinishListener, setWorkoutFinishListener] = useState(false);
  const [workoutFinishStep, setWorkoutFinishStep] = useState(0);
  const buttonRef = useRef(null);
  const tabRef = useRef(null);
  const [colorIndex, setColorIndex] = useState(0);
  const [workoutList, setWorkoutList] = useState([]);
  const [animateWL, setAnimateWL] = useState(false);
  const shakeIntervalRef = useRef(null);
  const textareaRef = useRef(null);
  const chatAbilitiesInterval = useRef(null);
  const wrapperExercisesRef = useRef(null);
  const duration = 1;

  useEffect(() => {
    setQuote(motivation_quotes[Math.floor(Math.random() * motivation_quotes.length)]);
    StatusBar.hide();
  }, []);

  useEffect(() => {
    setTimeout(async () => {
      document.querySelector(".loading_wrapper").style.opacity = "1";

      try {
        const data = await axios.get(`${serverapi}/users/data?uid=${localStorage.getItem("userKey")}`);
        setUser(data.data);
        setTimeout(() => {
          document.querySelector(".loading_wrapper").style.opacity = "0";
          setTimeout(() => {
            document.querySelector(".loading_wrapper").style.display = "none";
            loadApp();
          }, 300);
        }, 500);
      } catch (err) {
        localStorage.clear();
        window.location.reload();
      }
    }, 1000);
  }, []);

  const loadApp = () => {
    const months = ["Januar", "Februar", "Mart", "April", "Maj", "Jun", "Jul", "Avgust", "Septembar", "Oktobar", "Novembar", "Decembar"];
    const date = new Date();
    document.querySelector(".date_set_box").innerText = `${date.getDate()}. ${months[date.getMonth()]}`;
    document.querySelector(".main_wrapper").style.display = "block";
    document.querySelector(".thumbnail_active").style.width = `${document.querySelector(".holdToBegin_wrapper").getBoundingClientRect().width}px`;
    renderWorkouts();
    animateElements();
  };

  const renderWorkouts = () => {};

  const startFill = () => {
    setCompleted(false);
    document.querySelector(".thumbnail_active_wrapper").style.transition = "1s linear";
    document.querySelector(".holdToBegin_wrapper").style.border = "0rem solid transparent";
    setTimeout(() => {
      document.querySelector(".thumbnail_active_wrapper").style.width = "100%";
    }, 10);

    timeoutRef.current = setTimeout(() => {
      setCompleted(true);
      const coords = document.querySelector(".holdToBegin_wrapper").getBoundingClientRect();
      const clone = document.querySelector(".holdToBegin_wrapper").cloneNode(true);
      clone.style.position = "absolute";
      clone.style.top = `${coords.y}px`;
      clone.classList.add("clonedHoldWrapper");
      document.querySelector(".main_wrapper").appendChild(clone);
      runStartWorkoutAnimation();
      setTimeout(() => {
        setCompleted(false);
      }, 1000);
    }, 1000);
  };

  const cancelFill = () => {
    clearTimeout(timeoutRef.current);
    if (!completed) {
      document.querySelector(".holdToBegin_wrapper").style.border = "0.25rem solid #2d2d2d";
      document.querySelector(".thumbnail_active_wrapper").style.transition = ".5s ease";
      setTimeout(() => {
        document.querySelector(".thumbnail_active_wrapper").style.width = "0%";
      }, 10);
    }
  };

  const animateElements = () => {
    document.querySelector(".text_wrapper").style.opacity = "1";
    document.querySelector(".text_wrapper").style.transform = "translateX(0)";
    document.querySelector(".menu_toggle").style.opacity = "1";
    document.querySelector(".menu_toggle").style.transform = "translateX(0)";
    setTimeout(() => {
      document.querySelector(".holdToBegin_wrapper").style.opacity = "1";
      document.querySelector(".holdToBegin_wrapper").style.marginTop = "0";
      setTimeout(() => {
        document.querySelector(".title_text").style.opacity = "1";
        setTimeout(() => {
          setAnimateWL((prev) => !prev);
          setTimeout(() => {
            document.querySelector(".chat_activation_tab").style.opacity = "1";
            document.querySelector(".chat_activation_tab").style.transform = "translateX(-50%) translateY(0)";
          }, 100);
        }, 150);
      }, 200);
    }, 200);
  };

  useEffect(() => {
    if (user?.workouts) {
      setWorkoutList(user.workouts);
    }
  }, [user]);

  useEffect(() => {
    if (workoutList.length > 0) {
      workoutList.map((_, index) => {
        setTimeout(() => {
          document.querySelectorAll(".workout_session_info")[index].style.opacity = "1";
          document.querySelectorAll(".workout_session_info")[index].style.transform = "translateY(0)";
        }, index * 150);
      });
    } else {
      if (document.querySelector(".infoWorkoutsEmpty")) {
        document.querySelector(".infoWorkoutsEmpty").style.opacity = ".3";
        document.querySelector(".infoWorkoutsEmpty").style.transform = "translateY(0)";
      }
    }
  }, [animateWL]);

  useEffect(() => {
    const tab = document.querySelector(".chat_activation_tab");
    if (!tab) return;

    let startY = 0;
    let isSwiping = false;

    const textEl = tab.querySelector(".text");
    const swipeAnimEl = tab.querySelector(".swipe_up_animation");

    const resetSwipe = () => {
      textEl.style.transition = "transform 0.2s ease";
      swipeAnimEl.style.transition = "transform 0.2s ease";

      textEl.style.transform = "translateY(0) translateX(-50%)";
      swipeAnimEl.style.transform = "translateY(0) translateX(-50%)";

      setTimeout(() => {
        textEl.style.transition = "none";
        swipeAnimEl.style.transition = "none";
      }, 200);
    };

    const onTouchStart = (e) => {
      startY = e.touches[0].clientY;
      isSwiping = true;
      textEl.style.transition = "none";
      swipeAnimEl.style.transition = "none";
    };

    const onTouchMove = (e) => {
      if (!isSwiping) return;

      const currentY = e.touches[0].clientY;
      const deltaY = startY - currentY;
      const screenHeight = window.innerHeight;
      const progress = Math.min(Math.max(deltaY / (screenHeight / 5), 0), 1);

      const offset = 2 * progress;
      textEl.style.transform = `translateY(-${offset * 0.5}rem) translateX(-50%)`;
      swipeAnimEl.style.transform = `translateY(-${offset * 1.25}rem) translateX(-50%)`;
    };

    const onTouchEnd = (e) => {
      if (!isSwiping) return;

      const endY = e.changedTouches[0].clientY;
      const deltaY = startY - endY;
      const screenHeight = window.innerHeight;

      if (deltaY > screenHeight / 5) {
        openChat();
        resetSwipe();
      } else {
        resetSwipe();
      }

      isSwiping = false;
    };

    tab.addEventListener("touchstart", onTouchStart);
    tab.addEventListener("touchmove", onTouchMove);
    tab.addEventListener("touchend", onTouchEnd);

    return () => {
      tab.removeEventListener("touchstart", onTouchStart);
      tab.removeEventListener("touchmove", onTouchMove);
      tab.removeEventListener("touchend", onTouchEnd);
    };
  }, []);

  const openChat = () => {
    document.querySelector(".chat_tab").querySelector(".text").style.top = `${
      document.querySelector(".chat_activation_tab").getBoundingClientRect().top + 93
    }px`;
    document.querySelector(".navigation").style.opacity = "0";
    document.querySelector(".holdToBegin_wrapper").style.opacity = "0";
    document.querySelector(".workout_history_wrapper").style.opacity = "0";
    document.querySelector(".objects_wrapper").style.opacity = "0";
    document.querySelector(".swipe_up_animation").style.opacity = "0";
    setTimeout(() => {
      document.querySelector(".chat_tab").style.display = "block";
      setTimeout(() => {
        document.querySelector(".chat_tab").querySelector(".text").style.top = "5rem";
        document.querySelector(".chat_tab").querySelector(".text").style.transform = "translateX(-49%)";
        animateChatTab();
      }, 10);
    }, 500);
  };

  const animateChatTab = () => {
    let counter = 0;
    document.querySelector(".closeChat").style.opacity = "1";
    setTimeout(() => {
      document.querySelector(".blob_animated").style.opacity = "1";
      setTimeout(() => {
        document.querySelector(".title_wrapper_animated").querySelector("h2").style.transform = "translateY(0)";
        document.querySelector(".title_wrapper_animated").querySelector("h2").style.opacity = "1";

        const transformWrapper = () => {
          if (counter == 4) {
            document.querySelector(".transform_wrapper_inner").style.width = `${
              document.querySelector(".abilities").querySelectorAll("h3")[counter].getBoundingClientRect().width
            }px`;
            document.querySelector(".transform_wrapper_inner").style.transform = `translateY(-${counter * 2.1}rem)`;
            counter = 0;
            setTimeout(() => {
              document.querySelector(".transform_wrapper_inner").style.transition = "0s";
              setTimeout(() => {
                document.querySelector(".transform_wrapper_inner").style.transform = `translateY(-${0}rem)`;
                setTimeout(() => {
                  document.querySelector(".transform_wrapper_inner").style.transition = ".5s cubic-bezier(.85,0,.21,1)";
                  setTimeout(() => {
                    document.querySelector(".transform_wrapper_inner").style.width = `${
                      document.querySelector(".abilities").querySelectorAll("h3")[counter].getBoundingClientRect().width
                    }px`;
                    document.querySelector(".transform_wrapper_inner").style.transform = `translateY(-${counter * 2.1}rem)`;
                    counter++;
                  }, 10);
                }, 10);
              }, 10);
            }, 500);
            return;
          }
          document.querySelector(".transform_wrapper_inner").style.width = `${
            document.querySelector(".abilities").querySelectorAll("h3")[counter].getBoundingClientRect().width
          }px`;
          document.querySelector(".transform_wrapper_inner").style.transform = `translateY(-${counter * 2.1}rem)`;
          counter++;
        };

        setTimeout(() => {
          setTimeout(() => {
            document.querySelector(".questionmark").style.transform = "translateX(0)";
            document.querySelector(".questionmark").style.opacity = "1";

            setTimeout(() => {
              document.querySelectorAll(".askQuestion_button_element").forEach((el, index) => {
                setTimeout(() => {
                  el.style.transform = "translateY(0)";
                  el.style.opacity = "1";
                }, index * 100);
              });

              setTimeout(() => {
                document.querySelector(".input_wrapper_box").style.transform = "translateY(0) translateX(-50%)";
                document.querySelector(".input_wrapper_box").style.opacity = "1";
              }, 200);
            }, 300);
          }, 150);

          transformWrapper();

          if (chatAbilitiesInterval.current) {
            clearInterval(chatAbilitiesInterval.current);
          }

          chatAbilitiesInterval.current = setInterval(() => {
            transformWrapper();
          }, 2000);
        }, 300);
      }, 350);
    }, 150);
  };

  const handleTextarea = () => {
    const textarea = textareaRef.current;
    textarea.style.height = "auto";
    textarea.style.height = `${textarea.scrollHeight + 25}px`;

    const maxHeight = parseFloat(getComputedStyle(textarea).lineHeight) * 4.8;
    if (textarea.scrollHeight > maxHeight) {
      textarea.style.overflowY = "auto";
      textarea.style.height = `${maxHeight}px`;
    } else {
      textarea.style.overflowY = "hidden";
    }
  };

  useEffect(() => {
    const sendBtn = document.querySelector(".sendMessage");
    const focusAnimation = (e) => {
      if (e.target.value.length > 0) {
        sendBtn.style.background = "#6124BC";
      } else {
        sendBtn.style.background = "#242424";
      }
    };

    textareaRef.current.addEventListener("input", focusAnimation);

    return () => {
      textareaRef.current.removeEventListener("input", focusAnimation);
    };
  }, []);

  const Message = (classInsert, message) => {
    return () => {
      <div className={`chat_box_wrap ${classInsert}`}>
        <div className="message">{message}</div>
        <img className="ghosting" src={classInsert == "user" ? ghosting_svg : ghosting_response_svg} />
      </div>;
    };
  };

  const sendMessage = (classInsert, message) => {
    if (message.length === 0 || !allowMessageRequest) return;

    setAllowMessageRequest(false);
    document.querySelector(".sendMessage").style.background = "#242424";
    document.querySelector(".input_areabox").value = "";

    if (classInsert === "user") {
      setChatMessages((prevMessages) => {
        const newMessages = [
          ...prevMessages,
          ...(prevMessages.length == 0
            ? [
                {
                  role: "system",
                  content: `Use this as a workout data: ${JSON.stringify(user?.workouts)}`,
                },
              ]
            : []),
          {
            role: "user",
            content: message,
          },
        ];

        axios
          .post(`${serverapi}/ai-api/ask`, newMessages)
          .then((response) => {
            const msgWrapper = document.querySelectorAll(".message")[document.querySelectorAll(".message").length - 1];
            const splittedMsg = response.data.reply.split(" ");
            msgWrapper.innerHTML = "";
            const wrapper = document.querySelector(".text_box_flex");

            for (let word in splittedMsg) {
              setTimeout(() => {
                msgWrapper.innerHTML += ` ${splittedMsg[word]}`;
                wrapper.scrollTo({
                  top: wrapper.scrollHeight,
                  behavior: "auto",
                });
              }, 50 * word);
            }

            setChatMessages((prev) => [
              ...prev,
              {
                role: "system",
                content: response.data.reply,
              },
            ]);
          })
          .catch((error) => {
            console.error(error);
          })
          .finally(() => {
            setAllowMessageRequest(true);
          });

        return newMessages;
      });
    }

    document.querySelector(".text_box_flex").innerHTML += `<div class="chat_box_wrap ${classInsert}">
    ${
      classInsert !== "user"
        ? `<svg width="16" height="21" viewBox="0 0 16 21" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M1.22428 18.7307C6.56961 12.5768 7.46917 5.61413 7.66667 0L16 15.5C15.3573 19.4504 7.35634 20.2727 2.16102 20.7089C1.18629 20.7908 0.582839 19.4692 1.22428 18.7307Z" fill="#242424"/>
</svg>`
        : ""
    }
    <div class="message">${classInsert === "user" ? message : ""}</div>
    ${
      classInsert === "user"
        ? `<svg width="16" height="21" viewBox="0 0 16 21" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M14.7757 18.7307C9.43039 12.5768 8.53083 5.61413 8.33333 0L0 15.5C0.642723 19.4504 8.64366 20.2727 13.839 20.7089C14.8137 20.7908 15.4172 19.4692 14.7757 18.7307Z" fill="#5320A0"/>
</svg>`
        : ""
    }
  </div>`;

    handleTextarea();

    const messageContainer = document.querySelectorAll(".message")[document.querySelectorAll(".message").length - 1];
    if (classInsert !== "user") {
      const reactRoot = createRoot(messageContainer);
      reactRoot.render(message);
    }

    setTimeout(() => {
      const wrapper = document.querySelector(".text_box_flex");
      wrapper.scrollTo({
        top: wrapper.scrollHeight,
        behavior: "smooth",
      });

      setTimeout(() => {
        const lastWrapper = document.querySelectorAll(".chat_box_wrap")[document.querySelectorAll(".chat_box_wrap").length - 1];
        setTimeout(() => {
          lastWrapper.style.opacity = "1";
          lastWrapper.style.transform = "translateX(0)";
        }, 100);
      }, 100);
    }, 10);
  };

  const shortcutFunction = (msg) => {
    document.querySelector(".centerWrapper").style.opacity = "0";
    setTimeout(() => {
      sendMessage("user", msg);
      document.querySelector(".centerWrapper").style.display = "none";
      setTimeout(() => {
        sendMessage("response", <Leapfrog size="30" speed="2.5" color="white" />);
      }, 1000);
    }, 300);
  };

  const closeChat = () => {
    setChatMessages([]);
    document.querySelector(".closeChat").style.opacity = "0";
    document.querySelector(".input_wrapper_box").style.opacity = "0";
    document.querySelector(".centerWrapper").style.opacity = "0";
    document.querySelector(".input_wrapper_box").style.transform = "translateX(-50%) translateY(2rem)";
    document.querySelector(".text_box_flex").style.opacity = "0";
    setTimeout(() => {
      document.querySelector(".text_box_flex").innerHTML = "";
      document.querySelector(".chat_tab").querySelector(".text").style.top = `${
        document.querySelector(".chat_activation_tab").getBoundingClientRect().top + 93
      }px`;
      setTimeout(() => {
        document.querySelector(".navigation").style.opacity = "1";
        document.querySelector(".workout_history_wrapper").style.opacity = "1";
        document.querySelector(".swipe_up_animation").style.opacity = ".4";
        document.querySelector(".objects_wrapper").style.opacity = "1";
        document.querySelector(".holdToBegin_wrapper").style.opacity = "1";
        setTimeout(() => {
          const elements = document.querySelectorAll(".workout_session_info");
          const sliced = Array.from(elements).slice(0, 3);

          sliced.forEach((el, index) => {
            setTimeout(() => {
              el.style.transition = "transform 0.3s ease, opacity 0.3s ease";
              el.style.transform = "translateY(0)";
              el.style.opacity = "1";
            }, index * 100);
          });
        }, 500);
        clearInterval(chatAbilitiesInterval.current);
        setTimeout(() => {
          document.querySelector(".chat_tab").style.display = "none";
          setTimeout(() => {
            document.querySelector(".centerWrapper").style.opacity = "";
            document.querySelector(".centerWrapper").style.display = "";
            document.querySelector(".blob_animated").style.opacity = "0";
            document.querySelector(".title_wrapper_animated").querySelector("h2").style.opacity = "0";
            document.querySelector(".title_wrapper_animated").querySelector("h2").style.transform = "translateY(1rem)";
            document.querySelector(".questionmark").style.transform = "translateX(1rem)";
            document.querySelector(".questionmark").style.opacity = "0";
            document.querySelector(".transform_wrapper_inner").style.transform = "translateY(20%)";
            document.querySelector(".transform_wrapper_inner").style.width = "5rem";
            for (let btn of document.querySelectorAll(".askQuestion_button_element")) {
              btn.style.opacity = "0";
              btn.style.transform = "translateY(1rem)";
            }
            document.querySelector(".text_box_flex").style.opacity = "";
          }, 300);
        }, 10);
      }, 350);
    }, 300);
  };

  const handleFocus = () => {};

  const handleBlur = () => {
    document.querySelector(".input_wrapper_box").style.bottom = `calc(4.5rem)`;
    document.querySelector(".buttons_wrapper").style.opacity = `1`;
    document.querySelector(".centerWrapper").style.transform = `translate(-50%, -50%)`;
  };

  Keyboard.addListener("keyboardWillShow", (info) => {
    try {
      document.querySelector(".input_wrapper_box").style.bottom = `calc(1rem + ${info.keyboardHeight}px)`;
      if (info.keyboardHeight > 0) {
        document.querySelector(".buttons_wrapper").style.opacity = `0`;
        document.querySelector(".centerWrapper").style.transform = `translate(-50%, -60%)`;
      } else {
        setTimeout(() => {
          document.querySelector(".buttons_wrapper").style.opacity = `1`;
          document.querySelector(".centerWrapper").style.transform = `translate(-50%, -50%)`;
        }, 300);
      }
    } catch (err) {}
  });

  const runStartWorkoutAnimation = () => {
    document.querySelector(".clonedHoldWrapper").style.maxWidth = "9999rem";
    document.querySelector(".clonedHoldWrapper").style.transition = ".5s cubic-bezier(.81,0,.24,1)";
    document.querySelector(".clonedHoldWrapper").style.background = "#fff";
    document.querySelector(".clonedHoldWrapper").innerHTML = "";
    document.querySelector(".holdToBegin_wrapper").style.transform = "translateX(-50%)";
    setTimeout(() => {
      cancelFill();
      document.querySelector(".clonedHoldWrapper").style.width = "100vw";
      document.querySelector(".clonedHoldWrapper").style.height = "100vh";
      document.querySelector(".clonedHoldWrapper").style.top = "0";
      document.querySelector(".clonedHoldWrapper").style.left = "0";
      document.querySelector(".clonedHoldWrapper").style.borderRadius = "0";
      document.querySelector(".clonedHoldWrapper").style.transform = "translateX(0)";
      document.querySelector(".clonedHoldWrapper").style.zIndex = "5";
      setTimeout(() => {
        document.querySelector(".workout_tab").style.display = "block";
        setTimeout(() => {
          document.querySelector(".workout_tab").style.opacity = "1";
          setTimeout(() => {
            document.querySelector(".workout_tab").querySelector(".loader").style.opacity = "0";
            setTimeout(() => {
              document.querySelector(".workout_name_tab").style.transform = "translateX(0)";
              document.querySelector(".clonedHoldWrapper").remove();
            }, 150);
          }, 2000);
        }, 5);
      }, 500);
    }, 10);
  };

  const checkWorkoutNameLength = (e) => {
    if (e.target.value.length > 0) {
      document.querySelector(".inner_border_progressive").style.width = "100%";
      document.querySelector(".continue_button").style.opacity = "1";
    } else {
      document.querySelector(".inner_border_progressive").style.width = "0";
      document.querySelector(".continue_button").style.opacity = ".3";
    }
  };

  const openWorkoutPlan = () => {
    const input = document.querySelector(".workout_name_tab input");
    const workoutName = input?.value?.trim();

    if (workoutName?.length > 0) {
      document.querySelector(".workoutName").innerHTML = workoutName;
      document.querySelector(".workout_name_tab").style.transform = "translateX(-100%)";
      document.querySelector(".workout_plan_manager_tab").style.transform = "translateX(0)";
      setWorkoutSessionInfo((prev) => {
        const updated = { ...prev, type: workoutName, startTime: new Date() };
        return updated;
      });
    }
  };

  const addNewExercise = () => {
    document.querySelector(".exercise_input_wrapper").style.display = "flex";
    setTimeout(() => {
      document.querySelector(".exercise_input_wrapper").style.opacity = "1";
      document.querySelector(".exercise_input_wrapper").style.transform = "translateY(0) translateX(-50%)";
      document.querySelector(".doneExercises_wrapper").style.transform = "translateY(3rem)";
      setTimeout(() => {
        document.querySelector(".exercise_name_input").focus();
      }, 200);
    }, 10);
  };

  const closeExerciseNameInput = () => {
    document.querySelector(".exercise_input_wrapper").style.opacity = "0";
    document.querySelector(".exercise_input_wrapper").style.transform = "translateY(.5rem) translateX(-50%)";
    document.querySelector(".doneExercises_wrapper").style.transform = "translateY(0rem)";
    setTimeout(() => {
      document.querySelector(".exercise_name_input").value = "";
    }, 200);
  };

  const addExercise = () => {
    const exerciseName = document.querySelector(".exercise_input_wrapper").querySelector("input").value.trim();
    if (exerciseName.length > 0) {
      closeExerciseNameInput();
      document.querySelector(".exercise_name_title").innerHTML = exerciseName;
      setTimeout(() => {
        document.querySelector(".workoutName").style.opacity = ".3";
        document.querySelector(".colorType").style.opacity = "0";
        document.querySelector(".action_bar_wrapper").style.transform = "translateX(-100%)";
        document.querySelector(".exerciseTab").style.transform = "translateX(0)";
        document.querySelector(".getBackButton").style.transform = "translateX(-100%)";
        document.querySelector(".doneExercises_wrapper").style.transform = "translateX(-100%)";
      }, 100);
    }
  };

  const addStatsElement = (wrapperSelector) => {
    const wrapper = document.querySelector(wrapperSelector).querySelector(".tableWrapper").querySelector(".stats_wrapper");
    const classListCheck = document.querySelector(wrapperSelector).querySelector(".tableWrapper").classList;

    const stats = document.createElement("div");
    stats.className = `stats${classListCheck.contains("table_wrap_warmup") ? " warmup" : ""}`;

    const reps = document.createElement("input");
    reps.type = "number";
    reps.className = "reps";

    const weight = document.createElement("input");
    weight.type = "number";
    weight.className = "weight";

    const removeWrapper = document.createElement("div");
    removeWrapper.className = "removeStats";

    const removeImg = document.createElement("img");
    removeImg.className = "removeStatsImg";
    removeImg.src = x_svg;

    removeWrapper.appendChild(removeImg);
    stats.appendChild(reps);
    stats.appendChild(weight);
    stats.appendChild(removeWrapper);
    wrapper.appendChild(stats);
  };

  const addNewSetWarmup = () => addStatsElement(".warpum_wrapper");
  const addNewSetActive = () => addStatsElement(".active_sets_wrapper");

  const checkIfDeleting = (e) => {
    if (e.target.className === "removeStatsImg" || e.target.className === "removeStats") {
      const parentStats = e.target.closest(".stats");
      if (parentStats) {
        parentStats.remove();
      }
    }
  };

  const finishExercise = () => {
    const wrappers = document.querySelectorAll(".stats");
    const exportExercise = { name: "", reps: [], weights: [], warmup: 0 };
    exportExercise.name = `${document.querySelector(".exercise_name_title").innerText}`;
    let returnToTab = true;
    Array.from(wrappers).map((wrapper) => {
      const rep = wrapper.querySelector(".reps").value;
      const weight = wrapper.querySelector(".weight").value;

      if (rep == "" || weight == "") {
        alertInfouser("Morate popuniti sva polja.");
        returnToTab = false;
        return;
      }

      if (wrapper.classList.contains("warmup")) {
        exportExercise.warmup = exportExercise.warmup + 1;
      }

      exportExercise.reps.push(rep);
      exportExercise.weights.push(weight);
    });

    if (!returnToTab) return;

    setTimeout(() => {
      document.querySelector(".workoutName").style.opacity = "1";
      document.querySelector(".colorType").style.opacity = "1";
      document.querySelectorAll(".stats_wrapper")[0].innerHTML = "";
      document.querySelectorAll(".stats_wrapper")[1].innerHTML = "";
      if (wrapperExercisesRef.current) {
        if (tempWorkout.length > 1) {
          setTimeout(() => {
            // wrapperExercisesRef.current.scrollTo({
            //   top: 0,
            //   behavior: "smooth",
            // });
          }, 500);
        }
      }
    }, 300);

    if (wrappers.length != 0) {
      setTempWorkout((prev) => [...prev, exportExercise]);
    }

    document.querySelector(".action_bar_wrapper").style.transform = "translateX(0)";
    document.querySelector(".exerciseTab").style.transform = "translateX(100vw)";
    document.querySelector(".getBackButton").style.transform = "translateX(-50%)";
    document.querySelector(".doneExercises_wrapper").style.transform = "translateX(0)";
  };

  const alertInfouser = (msg) => {
    document.querySelector(".infoAlertWrapper").style.display = "grid";
    document.querySelector(".infoAlertWrapper").innerHTML = `${msg}`;
    setTimeout(() => {
      document.querySelector(".infoAlertWrapper").style.opacity = "1";
      setTimeout(() => {
        document.querySelector(".infoAlertWrapper").style.opacity = "0";
        setTimeout(() => {
          document.querySelector(".infoAlertWrapper").style.display = "none";
        }, 200);
      }, 2000);
    }, 10);
  };

  const closeExitAlert = () => {
    document.querySelector(".exitAlertInfo").style.opacity = "0";
    setTimeout(() => {
      document.querySelector(".exitAlertInfo").style.display = "none";
    }, 200);
  };

  const closeWorkout = () => {
    document.querySelector(".exitAlertInfo").style.display = "flex";
    setTimeout(() => {
      document.querySelector(".exitAlertInfo").style.opacity = "1";
    }, 10);
  };

  const closeWorkoutFunction = () => {
    document.querySelector(".workout_tab").style.opacity = "0";
    setTimeout(() => {
      setTempWorkout([]);
      closeExitAlert();
      document.querySelector(".workout_tab").style.display = "none";
      document.querySelector(".workout_tab").querySelector(".loader").style.opacity = "1";
      document.querySelector(".workout_name_tab").style.transform = "translateX(100%)";
      document.querySelector(".workout_plan_manager_tab").style.transform = "translateX(100%)";
      document.querySelector(".continue_button").opacity = ".3";
      document.querySelector(".workout_name_tab").querySelector("input").value = "";
      document.querySelector(".inner_border_progressive").style.width = "0";
      document.querySelector(".continue_button").style.opacity = ".3";

      setTimeout(() => {
        const elements = document.querySelectorAll(".workout_session_info");
        const sliced = Array.from(elements).slice(0, 3);

        sliced.forEach((el, index) => {
          setTimeout(() => {
            el.style.transition = "transform 0.3s ease, opacity 0.3s ease";
            el.style.transform = "translateY(0)";
            el.style.opacity = "1";
          }, index * 100);
        });
      }, 500);
    }, 300);
  };

  const finishWorkout = () => {
    setWorkoutFinishListener(true);
  };

  useEffect(() => {
    document.querySelector(".finishWorkout").addEventListener("click", finishWorkout);
    return () => {
      document.querySelector(".finishWorkout").removeEventListener("click", finishWorkout);
    };
  }, []);

  useEffect(() => {
    if (!workoutFinishListener) return;
    if (tempWorkout.length === 0) return;

    const endTimeWorkout = new Date();

    setWorkoutSessionInfo((prev) => ({
      ...prev,
      type: `${document.querySelector(".workoutName").innerText}`,
      workouts: tempWorkout,
      endTime: endTimeWorkout,
    }));

    setWorkoutFinishListener(false);
    setTimeout(() => {
      closeWorkoutFunction();
    }, 150);
  }, [workoutFinishListener]);

  const changeColorType = () => {
    if (colorIndex >= 3) {
      setColorIndex(0);
      return;
    }
    setColorIndex((prev) => prev + 1);
  };

  useEffect(() => {
    if (workoutSessionInfo.endTime) {
      renderWorkoutsList();
    }
  }, [workoutSessionInfo]);

  const renderWorkoutsList = () => {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    axios
      .post(
        `${serverapi}/users/addWorkout`,
        { uid: localStorage.getItem("userKey"), workout: { ...workoutSessionInfo, colorIndex: colorIndex } },
        config
      )
      .then((response) => {
        setUser(response.data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });

    setWorkoutSessionInfo({
      type: "",
      workouts: [],
      startTime: "",
      endTime: "",
    });

    setColorIndex(0);
  };

  const expandWorkoutHistory = (e) => {
    if (!document.querySelector(".workout_history_wrapper").classList.contains("active")) {
      if (e.target.classList.contains("closeWorkoutHistory") || e.target.classList.contains("closeWorkoutHistoryImg")) {
        return;
      }
      document.querySelector(".workout_history_wrapper").classList.add("active");
      document.querySelector(".holdToBegin_wrapper").style.opacity = "0";
      document.querySelector(".navigation").style.opacity = "0";
      document.querySelector(".chat_activation_tab").style.opacity = "0";
      document.querySelector(".title_text").style.color = "#fff";
      document.querySelector(".chat_activation_tab").style.transform = "translateY(1rem) translateX(-50%)";
      document.querySelector(".closeWorkoutHistory").style.display = "flex";
      setTimeout(() => {
        document.querySelector(".extensionCounter").style.width = "0";
        document.querySelector(".workout_history_wrapper").style.top = "-8.5rem";
        document.querySelector(".workout_history_wrapper").style.height = "87vh";
        document.querySelector(".closeWorkoutHistory").style.opacity = "1";
        document.querySelector(".workout_sessions_wrapper_overview").style.overflow = "auto";
        const allExercises = document.querySelector(".workout_sessions_wrapper_overview").querySelectorAll(".workout_session_info");
        Array.from(allExercises).map((el, index) => {
          setTimeout(() => {
            el.querySelector(".dataWrapperOuter").style.height = `${el.querySelector(".dataWrapper").offsetHeight + 20}px`;
          }, 90 * index);
        });
      }, 150);

      setTimeout(() => {
        document.querySelector(".chat_activation_tab").style.display = "none";
      }, 500);
    }
  };

  useEffect(() => {
    document.querySelector(".workout_history_wrapper").addEventListener("click", expandWorkoutHistory);
    return () => {
      document.querySelector(".workout_history_wrapper").removeEventListener("click", expandWorkoutHistory);
    };
  }, []);

  const formatTimeDifference = (startISO, endISO) => {
    const startDate = new Date(startISO);
    const endDate = new Date(endISO);

    const diffMs = Math.abs(endDate - startDate);
    const diffMinutes = Math.floor(diffMs / 60000);
    const hours = Math.floor(diffMinutes / 60);
    const minutes = diffMinutes % 60;

    let result = "";
    if (hours > 0) result += `${hours}h `;
    if (minutes > 0 || hours === 0) result += `${minutes}m`;

    return result.trim();
  };

  const formatDateToDDMMYYYY = (date) => {
    const d = new Date(date);
    if (isNaN(d)) return "Invalid Date";

    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();

    return `${day}/${month}/${year}`;
  };

  const closeWorkoutHistory = () => {
    document.querySelector(".extensionCounter").style.width = "4.7rem";
    document.querySelector(".workout_history_wrapper").style.top = "7rem";
    document.querySelector(".workout_history_wrapper").style.height = "42vh";
    document.querySelector(".closeWorkoutHistory").style.opacity = "0";
    document.querySelector(".workout_sessions_wrapper_overview").style.overflow = "hidden";
    document.querySelector(".workout_sessions_wrapper_overview").scrollTo({
      top: 0,
      behavior: "smooth",
    });

    document.querySelector(".workout_history_wrapper").classList.remove("active");
    document.querySelector(".chat_activation_tab").style.display = "flex";
    document.querySelector(".closeWorkoutHistory").style.display = "flex";

    setTimeout(() => {
      document.querySelector(".holdToBegin_wrapper").style.opacity = "1";
      document.querySelector(".navigation").style.opacity = "1";
      document.querySelector(".chat_activation_tab").style.opacity = "1";
      document.querySelector(".title_text").style.color = "#fff";
      document.querySelector(".chat_activation_tab").style.transform = "translateY(0) translateX(-50%)";
    }, 300);

    const allExercises = document.querySelector(".workout_sessions_wrapper_overview").querySelectorAll(".workout_session_info");
    Array.from(allExercises).map((el, index) => {
      setTimeout(() => {
        el.querySelector(".dataWrapperOuter").style.height = `${0}px`;
      }, 90 * index);
    });
  };

  useEffect(() => {
    document.querySelector(".closeWorkoutHistory").addEventListener("click", closeWorkoutHistory);
    return () => {
      document.querySelector(".closeWorkoutHistory").removeEventListener("click", closeWorkoutHistory);
    };
  }, []);

  const logout = () => {
    document.querySelector(".logoutInfoWrapper").style.display = "flex";
    setTimeout(() => {
      document.querySelector(".logoutInfoWrapper").style.opacity = "1";
    }, 10);
  };

  const logoutFunc = () => {
    document.querySelector(".main_wrapper").style.transition = ".2s";
    setTimeout(() => {
      document.querySelector(".main_wrapper").style.opacity = "0";
      localStorage.clear();
      window.location.reload();
    }, 10);
  };

  const cancelLogout = () => {
    document.querySelector(".logoutInfoWrapper").style.opacity = "0";
    setTimeout(() => {
      document.querySelector(".logoutInfoWrapper").style.display = "none";
    }, 200);
  };

  const getTreningLabel = (count) => {
    if (count % 10 === 1 && count % 100 !== 11) {
      return "trening";
    } else if ([2, 3, 4].includes(count % 10) && ![12, 13, 14].includes(count % 100)) {
      return "treninga";
    } else {
      return "treninga";
    }
  };

  return (
    <div className="app">
      <div className="loading_wrapper">
        <Reuleaux size="45" stroke="6" strokeLength="0.15" bgOpacity="0.1" speed=".7" color="#fff" />
      </div>
      <div className="main_wrapper">
        <div className="navigation">
          <div className="text_wrapper">
            <p className="date">
              Danas je <span className="date_set_box"></span>
            </p>
            <h1 className="motivation_text">{quote}</h1>
          </div>
          <div className="menu_toggle" onClick={logout}>
            <img src={logout_svg} />
          </div>
        </div>
        <div className="logoutInfoWrapper">
          Da li ste sigurni da želite da se odjavite?
          <div className="buttons">
            <button className="confirm button" onClick={logoutFunc}>
              Potvrdi
            </button>
            <button className="cancel button" onClick={cancelLogout}>
              Otkaži
            </button>
          </div>
        </div>
        <motion.div
          className="holdToBegin_wrapper"
          onTouchStart={startFill}
          onTouchEnd={cancelFill}
          onMouseDown={startFill}
          onMouseUp={cancelFill}
          onMouseLeave={cancelFill}
        >
          <div className="thumbnail_holder">
            <img src={muscles_svg} className="muscles" />
            <h1 className="text">
              Pritisni
              <br />
              za start
            </h1>
          </div>
          <motion.div className="thumbnail_active_wrapper" initial={{ width: "0%" }}>
            <div className="thumbnail_active">
              <img src={muscles_pump_svg} className="muscles" />
              <h1 className="text">
                Pritisni
                <br />
                za start
              </h1>
            </div>
          </motion.div>
        </motion.div>

        <div className="workout_history_wrapper">
          <h1 className="title_text">
            <div className="closeWorkoutHistory">
              <img className="closeWorkoutHistoryImg" src={move_left_svg} />
            </div>
            Istorija treninga{" "}
            <span className="number_of_workouts">
              ({user?.workouts.length}
              <span className="extensionCounter">&nbsp;{getTreningLabel(user?.workouts.length)}</span>)
            </span>
          </h1>
          <div className="workout_sessions_wrapper_overview">
            {user?.workouts.length == 0 ? <p className="infoWorkoutsEmpty">Još nema zebeleženih treninga</p> : ""}
            {user?.workouts.toReversed().map((workout) => {
              return (
                <div className={`workout_session_info colorCombo${workout.colorIndex + 1}`} key={Math.random()}>
                  <div className="header_wrapper">
                    <div>
                      <h2 className="workout_name">{workout.type}</h2>
                      <p className="number_of_exercises">{workout.workouts.length} exercises</p>
                    </div>
                  </div>
                  <div className="dataWrapperOuter">
                    <div className="dataWrapper">
                      <table>
                        <thead>
                          <tr>
                            <th>Naziv</th>
                            <th>Težina</th>
                            <th>Ponav.</th>
                          </tr>
                        </thead>
                        <tbody>
                          {workout.workouts.toReversed().map((data, workoutIndex) => {
                            return data.reps.map((reps, index) => {
                              return (
                                <tr key={`${workoutIndex}-${index}`}>
                                  <td className={`exerciseName ${index === 0 ? "mainExerciseName" : ""}`}>{data.name}</td>
                                  <td>
                                    {data.weights[index]}
                                    <span className="weightUnit">kg</span>
                                  </td>
                                  <td>x{reps}</td>
                                </tr>
                              );
                            });
                          })}
                        </tbody>
                      </table>

                      <div className="stats_workout">
                        <h2 className="totalDuration">
                          Ukupno trajanje <span className="durationTime">{formatTimeDifference(workout.startTime, workout.endTime)}</span>
                        </h2>
                        <h3 className="date">{formatDateToDDMMYYYY(workout.startTime)}</h3>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="chat_activation_tab">
          <div className="text">
            <h3>Workout Helper</h3>
            <p>Y1</p>
          </div>
          <div className="swipe_up_animation">
            <div className="chevrons_wrapper">
              <img src={chevron_up_svg} />
              <img src={chevron_up_svg} />
            </div>
            <p className="info">Prevuci na gore</p>
          </div>
          <div className="objects_wrapper">
            <div className="objects">
              <div className="obj obj1" />
              <div className="obj obj2" />
              <div className="obj obj3" />
            </div>
          </div>
          <div className="fader" />
        </div>

        <div className="chat_tab">
          <button className="closeChat" onClick={closeChat}>
            <img src={move_left_svg} />
          </button>
          <div className="text">
            <h3>Workout Helper</h3>
            <p>Y1</p>
          </div>
          <div className="centerWrapper">
            <div className="blob_animated">
              <div className="blob blob1" />
              <div className="blob blob2" />
              <div className="blob blob3" />
            </div>
            <div className="title_wrapper_animated">
              <h2>Psst, mogu da ti napravim</h2>
              <div className="transform_wrapper_outer">
                <div className="transform_wrapper_inner">
                  <div className="abilities">
                    <h3>plan treninga</h3>
                    <h3>analizu napretka</h3>
                    <h3>plan ishrane</h3>
                    <h3>biofeedback analizu</h3>
                    <h3>plan treninga</h3>
                  </div>
                </div>
                <h3 className="questionmark">?</h3>
              </div>
            </div>
            <div className="buttons_wrapper">
              <div>
                <button onClick={() => shortcutFunction("Brzi plan treninga")} className="askQuestion_button askQuestion_button_element">
                  Brzi plan treninga
                </button>
                <button onClick={() => shortcutFunction("Šta su makrosi?")} className="askQuestion_button askQuestion_button_element">
                  Šta su makrosi?
                </button>
              </div>
              <button onClick={() => shortcutFunction("Šta da jedem za večeru?")} className="askQuestion_button_sep askQuestion_button_element">
                Šta da jedem za večeru?
              </button>
            </div>
          </div>
          <div className="input_wrapper_box">
            <textarea
              className="input_areabox"
              ref={textareaRef}
              rows={1}
              onInput={handleTextarea}
              onFocus={handleFocus}
              onBlur={handleBlur}
              placeholder="Ovde kucaj..."
              style={{ overflowY: "hidden", resize: "none" }}
            ></textarea>
            <button
              className="sendMessage"
              onClick={() => {
                if (document.querySelector(".centerWrapper").style.opacity != "0") {
                  document.querySelector(".centerWrapper").style.opacity = "0";
                  setTimeout(() => {
                    document.querySelector(".centerWrapper").style.display = "none";
                  }, 300);
                }
                setTimeout(() => {
                  sendMessage("user", document.querySelector(".input_areabox").value);
                  setTimeout(() => {
                    sendMessage("response", <Leapfrog size="30" speed="2.5" color="white" />);
                  }, 500);
                }, 10);
              }}
            >
              <img src={send_svg} />
            </button>
          </div>
          <div className="text_box_flex"></div>
        </div>

        <div className="workout_tab">
          <div className="loader">
            <h1>Priprema beleški</h1>
          </div>
          <div className="workout_name_tab">
            <h1>Tip treninga</h1>
            <div className="input_wrapper">
              <input type="text" placeholder="Unesi ovde..." onInput={checkWorkoutNameLength} />
              <div className="bottom_border_input">
                <div className="inner_border_progressive" />
              </div>
            </div>
            <div className="continue_button" onClick={openWorkoutPlan}>
              Nastavi <img src={move_left_svg} style={{ transform: "rotate(180deg)" }} />
            </div>
          </div>
          <div className="workout_plan_manager_tab">
            <div className="getBackButton" onClick={closeWorkout}>
              <img src={move_left_svg} />
            </div>
            <div className="head">
              <h2 className="workoutName"></h2>
              <div className="colorType" onClick={changeColorType} style={{ backgroundColor: colors[colorIndex] }}></div>
            </div>
            <div className="exercise_input_wrapper">
              <input type="text" placeholder="Naziv vežbe..." className="exercise_name_input" onBlur={closeExerciseNameInput} />
              <div className="confirm_exercise_name" onClick={addExercise}>
                Potvrdi
              </div>
            </div>
            <div className="doneExercises_wrapper" ref={wrapperExercisesRef}>
              {tempWorkout.length > 0 ? "" : <p className="info">Jos nije odrađena nijedna vežba...</p>}
              {tempWorkout.toReversed().map((exerciseInfo, index) => {
                return (
                  <div className="exercise_wrapper_info" key={Math.random()}>
                    <h2 className="exercise_name_info">{exerciseInfo.name}</h2>
                    {exerciseInfo.warmup == 0 ? (
                      ""
                    ) : (
                      <div className="warmup_info sets_reps_weight">
                        <h4 className="title">Zagrevanje</h4>
                        <div className="separator" />
                        <div className="sets_table">
                          <div className="placeholders">
                            <p>Set</p>
                            <p>Ponavljanja</p>
                            <p>
                              Težina<span className="metric">kg</span>
                            </p>
                          </div>
                          <div className="stats_info_done_wrapper">
                            {Array.from({ length: exerciseInfo.warmup }).map((_, i) => (
                              <div className="stats_info" key={Math.random()}>
                                <input type="number" className="set" disabled value={i + 1} />
                                <input type="number" className="reps" disabled value={exerciseInfo.reps[i]} />
                                <input type="number" className="weight" disabled value={exerciseInfo.weights[i]} />
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                    {exerciseInfo.reps.length - exerciseInfo.warmup == 0 ? (
                      ""
                    ) : (
                      <div className="active_sets_info sets_reps_weight">
                        <h4 className="title">Aktivni setovi</h4>
                        <div className="separator" />
                        <div className="sets_table">
                          <div className="placeholders">
                            <p>Set</p>
                            <p>Ponavljanja</p>
                            <p>
                              Težina<span className="metric">kg</span>
                            </p>
                          </div>
                          <div className="stats_info_done_wrapper">
                            {Array.from({ length: exerciseInfo.reps.length - exerciseInfo.warmup }).map((_, i) => (
                              <div className="stats_info" key={Math.random()}>
                                <input type="number" className="set" disabled value={i + 1} />
                                <input type="number" className="reps" disabled value={exerciseInfo.reps[i + exerciseInfo.warmup]} />
                                <input type="number" className="weight" disabled value={exerciseInfo.weights[i + exerciseInfo.warmup]} />
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            <div className="action_bar_wrapper">
              <div className="action_bar">
                <div className="add_exercise" onClick={addNewExercise}>
                  Dodaj vežbu
                  <img src={circle_plus_svg} />
                </div>
                <div className="finishWorkout">
                  <img className="finishWorkoutImg" src={double_check_svg} />
                </div>
                <div className="notifyFinishWorkout">Potvrdite završetak treninga</div>
              </div>
            </div>
            <div className="exerciseTab">
              <h3 className="exercise_name_title"></h3>
              <div className="scrollAuto_wrapper_table">
                <div className="warpum_wrapper table_full_wrapper">
                  <div className="header">
                    Zagrevanje
                    <div className="line" />
                  </div>
                  <div className="tableWrapper table_wrap_warmup">
                    <div className="placeholders">
                      <p>Ponavljanje</p>
                      <p>
                        Težina<span className="metric">kg</span>
                      </p>
                      <p className="empty"></p>
                    </div>
                    <div className="stats_wrapper" onClick={checkIfDeleting}></div>
                    <div className="addSet" onClick={addNewSetWarmup}>
                      <img src={plus_svg} />
                    </div>
                  </div>
                </div>
                <div className="active_sets_wrapper table_full_wrapper">
                  <div className="header">
                    Aktivni setovi
                    <div className="line" />
                  </div>
                  <div className="tableWrapper table_wrap_active">
                    <div className="placeholders">
                      <p>Ponavljanje</p>
                      <p>
                        Težina<span className="metric">kg</span>
                      </p>
                      <p className="empty"></p>
                    </div>
                    <div className="stats_wrapper" onClick={checkIfDeleting}></div>
                    <div className="addSet" onClick={addNewSetActive}>
                      <img src={plus_svg} />
                    </div>
                  </div>
                </div>
              </div>
              <div className="finishExerciseWrapper">
                <div className="finishExercise" onClick={finishExercise}>
                  Označi kao gotovo
                  <img src={double_check_svg} />
                </div>
              </div>
            </div>
            <div className="infoAlertWrapper"></div>
            <div className="exitAlertInfo">
              Ukoliko izađete iz sesije, zabeleženi podaci neće biti sačuvani.
              <div className="buttons">
                <button className="confirm button" onClick={closeWorkoutFunction}>
                  Potvrdi
                </button>
                <button className="cancel button" onClick={closeExitAlert}>
                  Otkaži
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Application;
