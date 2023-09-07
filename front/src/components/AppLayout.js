import React, { useState } from "react";
import LoginForm from "./LoginForm";
import UserProfile from "./UserProfile";
import { createGlobalStyle } from "styled-components";
import { useSelector } from "react-redux";
import { MailOutlined, SettingOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { Menu, Input, Row, Col, Breadcrumb, Layout, theme } from "antd";
const { Header, Content, Footer } = Layout;

const Global = createGlobalStyle`
  .ant-row {
    margin-right: 0 !important;
    margin-left: 0 !importtant;
  }
  .ant-col:first-child{
    padding-left: 0!important;
  }
  .ant-col:last-chiled{
    padding-right: 0 !important;
  }
`;

const items = [
  {
    label: <Link to="/">홈 화면</Link>,
    key: "mail",
    icon: <MailOutlined />,
  },
  {
    label: (
      <div>
        <Link to="/signup">회원가입</Link>
      </div>
    ),
    key: "profile",
  },

  {
    label: "Navigation Three - Submenu",
    key: "SubMenu",
    icon: <SettingOutlined />,
    children: [
      {
        type: "group",
        label: "Item 1",
        children: [
          {
            label: "Option 1",
            key: "setting:1",
          },
          {
            label: "Option 2",
            key: "setting:2",
          },
        ],
      },
      {
        type: "group",
        label: "Item 2",
        children: [
          {
            label: "Option 3",
            key: "setting:3",
          },
          {
            label: "Option 4",
            key: "setting:4",
          },
        ],
      },
    ],
  },
];
const AppLayout = ({ children }) => {
  const { me } = useSelector((state) => state.user);
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  return (
    <Layout className="layout" style={{ height: "100vh" }}>
      <Header
        style={{
          display: "flex",
          alignItems: "center",
        }}
      >
        <div className="demo-logo" />
        <Menu theme="dark" mode="horizontal" items={items} />
      </Header>
      <Content
        style={{
          padding: "0 50px",
        }}
      >
        <div
          className="site-layout-content"
          style={{
            background: colorBgContainer,
            height: "80vh",
          }}
        >
          <Row gutter={8}>
            <Col xs={24} md={6}>
              {me ? <UserProfile /> : <LoginForm />}
            </Col>
            <Col xs={24} md={12}>
              {children}
            </Col>
            <Col xs={24} md={6}>
              <a
                href="https://github.com/seroak"
                target="_blank"
                rel="noreferrer noopener"
              >
                Made by lee
              </a>
            </Col>
          </Row>
        </div>
      </Content>
      <Footer
        style={{
          textAlign: "center",
          marginTop: 100,
          backgroundColor: "white",
        }}
      >
        Ant Design ©2023 Created by Ant UED
      </Footer>
    </Layout>
  );
};
export default AppLayout;
