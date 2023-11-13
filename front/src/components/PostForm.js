import { PlusOutlined } from "@ant-design/icons";
import React, { useCallback, useState } from "react";
import {
  Button,
  Form,
  Input,
  InputNumber,
  Select,
  Upload,
  Modal,
  Space,
} from "antd";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { submitForm } from "../reducers/diagnosis";
import useInput from "../hooks/useInput";
const customLabelStyle = {
  fontSize: "20px", // 원하는 폰트 크기로 변경
  fontWeight: "bold",
  marginTop: 60,
};
const containerStyle = {
  display: "flex",
  flexDirection: "column",

  justifyContent: "center", // 수평 가운데 정렬
};
const onChange = (value) => {
  console.log("changed", value);
};
const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

const normFrontFile = (e) => {
  if (Array.isArray(e)) {
    return e;
  }
  return e?.fileList;
};

const normSideFile = (e) => {
  if (Array.isArray(e)) {
    return e;
  }
  return e?.fileList;
};
const PostForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");
  const [frontList, setFrontList] = useState([]);
  const [sideList, setSideList] = useState([]);

  const onSumbitForm = useCallback(() => {
    const formData = new FormData();

    const imageArray = [];
    frontList.forEach((e) => {
      console.log(e.originFileObj);
      imageArray.push(e.originFileObj);
      formData.append("front", e.originFileObj);
    });
    sideList.forEach((e) => {
      console.log(e.originFileObj);
      imageArray.push(e.originFileObj);
      formData.append("side", e.originFileObj);
    });

    console.log(formData);
    // formData.append("name", name);
    // formData.append("sex", sex);
    // formData.append("age", age);
    // console.log(formData);
    for (let key of formData.keys()) {
      console.log(key, ":", formData.get(key));
    }
    for (let value of formData.values()) {
      console.log(value);
    }
    dispatch(submitForm(formData));

    // dispatch(submitReport(formData));
  }, [dispatch, frontList, sideList]);

  const handleCancel = () => setPreviewOpen(false);
  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
    setPreviewTitle(
      file.name || file.url.substring(file.url.lastIndexOf("/") + 1)
    );
  };

  const handleFrontChange = (e) => {
    console.log("setfrontlist", e.fileList);
    setFrontList(e.fileList);
    console.log("frontList", frontList);
  };

  const handleSideChange = (e) => {
    console.log("setsidelist", e.fileList);
    setSideList(e.fileList);
    console.log("sideList", sideList);
  };
  const uploadButton = (
    <div>
      <PlusOutlined />
      <div
        style={{
          marginTop: 8,
        }}
      >
        Upload
      </div>
    </div>
  );
  return (
    <>
      <Form
        labelCol={{
          span: 4,
        }}
        wrapperCol={{
          span: 14,
        }}
        layout="horizontal"
        encType="multipart/form-data"
        onFinish={onSumbitForm}
      >
        <Form.Item
          label="눈과 귀의 거리"
          style={{ marginLeft: 300, marginTop: 50 }}
          labelAlign="left"
        >
          <InputNumber
            style={{
              width: 200,
            }}
            defaultValue="1"
            min="0"
            max="100"
            step="0.01"
            onChange={onChange}
            stringMode
          />
        </Form.Item>
        <div style={containerStyle}>
          <Form.Item
            valuePropName="FileList"
            getValueFromEvent={normFrontFile}
            labelAlign="left"
            // label={<span style={customLabelStyle}>앞모습 사진:</span>}
            label="앞모습 사진"
            style={{ marginLeft: 300 }}
          >
            <Upload
              listType="picture-card"
              fileList={frontList}
              onPreview={handlePreview}
              onChange={handleFrontChange}
              style={{
                marginLeft: 40,
              }}
            >
              {frontList.length >= 1 ? null : uploadButton}
            </Upload>
            <Modal
              open={previewOpen}
              title={previewTitle}
              footer={null}
              onCancel={handleCancel}
            >
              <img
                alt="example"
                style={{
                  width: "100%",
                }}
                src={previewImage}
              />
            </Modal>
          </Form.Item>
        </div>

        <Form.Item
          valuePropName="FileList"
          getValueFromEvent={normFrontFile}
          labelAlign="left"
          // label={<span style={customLabelStyle}>옆모습 사진:</span>}
          label="옆모습 사진"
          style={{ marginLeft: 300 }}
        >
          <Upload
            listType="picture-card"
            fileList={sideList}
            onPreview={handlePreview}
            onChange={handleSideChange}
            style={{
              marginLeft: 300,
            }}
          >
            {sideList.length >= 1 ? null : uploadButton}
          </Upload>
          <Modal
            open={previewOpen}
            title={previewTitle}
            footer={null}
            onCancel={handleCancel}
          >
            <img
              alt="example"
              style={{
                width: "100%",
              }}
              src={previewImage}
            />
          </Modal>
        </Form.Item>

        <Form.Item style={{ marginLeft: 500 }}>
          <Button type="primary" htmlType="submit">
            제출
          </Button>
        </Form.Item>
      </Form>
    </>
  );
};

// eslint-disable-next-line import/no-anonymous-default-export
export default () => <PostForm />;
