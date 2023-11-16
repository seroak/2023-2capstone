import {
  createSlice,
  createAsyncThunk,
  miniSerializeError,
} from "@reduxjs/toolkit";
import { throttle } from "lodash";
import axios from "axios";
export const initialState = {
  // 메인서버 요청
  diagnosisLoading: false,
  diagnosisDone: false,
  diagnosisError: null,
};
//form데이터를 보내는 axios요청
export const submitForm = createAsyncThunk(
  "/diagnosis/submitForm",
  async (data, { fulfillWithValue, rejectWithValue }) => {
    try {
      console.log(data);
      const access = localStorage.getItem("access");
      console.log(access);
      const response = await axios.post(
        "/diagnosis/submitForm",
        {
          headers: {
            "X-AUTH-TOKEN": access,
          },
        },
        data
      );

      // const response = await axios.post(
      //   "/diagnosis/submitForm",
      //   {
      //     headers: {
      //       "X-AUTH-TOKEN": access,
      //     },
      //   },
      //   data
      // );

      console.log(response);
      return fulfillWithValue(response.data);
    } catch (error) {
      throw rejectWithValue(error.response);
    }
  }
);

const diagnosisSlice = createSlice({
  name: "post",
  initialState,
  reducers: {},
  extraReducers: (builder) =>
    builder
      .addCase(submitForm.pending, (state, action) => {
        state.submitFormLoading = true;
        state.submitFormDone = false;
      })
      .addCase(submitForm.fulfilled, (state, action) => {
        state.submitFormLoading = false;
        state.submitFormDone = true;
      })
      .addCase(submitForm.rejected, (state, action) => {
        state.submitFormLoading = false;
        state.submitFormError = action.error;
      })
      .addDefaultCase((state) => state),
});
export default diagnosisSlice;
