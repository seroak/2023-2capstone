import React, { useEffect } from "react";
import AppLayout from "../components/AppLayout";
import Loading from "../components/Loading";
import Report from "../components/Report";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
const Home = () => {
  const { me } = useSelector((state) => state.user);
  const { submitFormLoading } = useSelector((state) => state.diagnosis);
  const navigate = useNavigate();
  // useEffect(() => {
  //   if (!(me && me.id)) {
  //     navigate("/");
  //   }
  // }, [me, navigate]);
  return (
    <div>
      <AppLayout>{submitFormLoading ? <Loading /> : <Report />}</AppLayout>
    </div>
  );
};

export default Home;
