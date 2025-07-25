import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Nav.css";
import { useAuth } from "./Auth/AuthContext";
import { jwtDecode } from "jwt-decode"; 


export default function Nav() {
  const [show, setShow] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const navigate = useNavigate();

  const [isMenuOpen, setIsMenuOpen] = useState(false); // 로그인 메뉴창
  const {user, logout, login} = useAuth(); //로그인 회원 정보보


  const G_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID;
  const G_REDIRECT_URI = process.env.REACT_APP_GOOGLE_REDIRECT_URI;

  /*
  useEffect(() => {
    window.addEventListener("scroll", () => {
      console.log("window.scrollY", window.scrollY);
      if (window.scrollY > 50) {
        setShow(true);
      } else {
        setShow(false);
      }
    });

    return () => {
      window.removeEventListener("scroll", () => {});
    };
  }, []);*/

  useEffect(() => {
    const handleScroll = () => {
      setShow(window.scrollY > 50);
    };
  
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  

  useEffect(() => {
    const hash = window.location.hash;
    if (hash.includes("access_token")) {
      const params = new URLSearchParams(hash.replace("#", ""));
      const accessToken = params.get("access_token");
  
      if (accessToken) {
        // 구글 유저 정보 가져오기
        fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })
          .then((res) => res.json())
          .then((data) => {
            console.log("구글 사용자 정보", data);
            login(data); // AuthContext에 저장
            window.history.replaceState({}, document.title, "/"); // URL에서 토큰 제거
          })
          .catch((err) => console.error("유저 정보 요청 실패", err));
      }
    }
  }, []);
  


  useEffect(() => {
    if (window.google && !user) {
      window.google.accounts.id.initialize({
        client_id: G_CLIENT_ID,
        callback: handleGoogleCallback,
      });
    }
  }, [user]);
  
  

  const handleGoogleCallback = (response) => {
    const decoded = jwtDecode(response.credential);
    console.log("구글 로그인 성공:", decoded);
    login(decoded);
  };

  const handleChange = (e) => {
    setSearchValue(e.target.value);
    navigate(`/search?q=${e.target.value}`);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    console.log("toggleMenu called, isMenuOpen:", isMenuOpen);
    console.log("user:", user);
  };

  const handleGoogleLogin = () => {
    window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${G_CLIENT_ID}&redirect_uri=${G_REDIRECT_URI}&response_type=token&scope=profile email`;
  };
  

  return (
    <nav className={`nav ${show && "nav__black"} `}>
      <img
        alt="Netflix logo"
        src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Netflix_2015_logo.svg/170px-Netflix_2015_logo.svg.png"
        className="nav__logo"
        onClick={() => (window.location.href = "/")}
      />

      <input
        value={searchValue}
        onChange={handleChange}
        className="nav__input"
        type="text"
        placeholder="영화를 검색해주세요."
      />
      <div
        className="nav__avatar-wrapper"
        onClick={toggleMenu}
      >

      <img
        alt="User logged"
        src="https://occ-0-4796-988.1.nflxso.net/dnm/api/v6/K6hjPJd6cR6FpVELC5Pd6ovHRSk/AAAABbme8JMz4rEKFJhtzpOKWFJ_6qX-0y5wwWyYvBhWS0VKFLa289dZ5zvRBggmFVWVPL2AAYE8xevD4jjLZjWumNo.png?r=a41"
        className="nav__avatar"
      />

      
      {isMenuOpen && (
        <div className="nav__menu">
          {user ? (
            <>
              <p className="userName">{user.name} 님</p>
              <p className="logout" onClick={logout}>로그아웃</p>
            </>
          ) : (
          
          <p className="login" onClick={handleGoogleLogin} >로그인</p>
          )}
        </div>
      )}
      </div>
    </nav>
  );
}
