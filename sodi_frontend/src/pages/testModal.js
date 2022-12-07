import styled from "styled-components";
import {useOutletContext} from "react-router";
const testDiv = styled.div`
    position: absolute;
    width: 100px;
    height: 100px;
    background: red;
  padding: 100px;
  `;

export const TestModal = () => {
  const { test } = useOutletContext();

  return (
    <div style={{ position:'fixed', width:'100px', height:'100px', zIndex:1000 }}>
      <p>test: {test}</p>
    </div>
  );
};
