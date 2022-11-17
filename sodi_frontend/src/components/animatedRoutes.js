import { Route, Routes, useLocation } from 'react-router-dom';
import { Home } from '../pages/home';
import { LoginContainer } from '../pages/user/login';
import { JoinContainer } from '../pages/user/join';
import { AnimatePresence } from 'framer-motion';
import {SimpleMap} from "../pages/simpleMap";
import {Main} from "../pages/main";

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence>
      <Routes location={location} key={location.pathname}>
        <Route path={'/'} element={<Home />} />
        <Route path={'/user/login'} element={<LoginContainer />} />
        <Route path={'/user/join'} element={<JoinContainer />} />
        <Route path={'/main'} element={<Main />} />  {/* 메인페이지 ( 인기게시물 표시 ) */}
        <Route path={'/main/map'} element={<JoinContainer />} /> {/* 지도 표시 ( 각 나라의 게시물 간략하게 표시 ) */}
        <Route path={'/main/post'} element={<JoinContainer />} /> {/* 게시물 상세정보 */}
        <Route path={'/main/post/create'} element={<JoinContainer />} /> {/* 게시물 생성 */}
        <Route path={'/main/post/modify'} element={<JoinContainer />} /> {/* 게시물 수정 */}
      </Routes>
    </AnimatePresence>
  );
}

export default AnimatedRoutes;
