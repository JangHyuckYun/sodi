import axios from "axios";
import toast from "react-hot-toast";
// import https from "https";

export const publicKey = process.env.REACT_APP_PUBLIC_KEY;
const MULTIPART = { "Content-Type": "multipart/form-data" };
export const client = axios.create({
  baseURL: process.env.REACT_APP_API_END_POINT,
  timeout: 180000,
  withCredentials: false,

  responseType: "json",
  // httpsAgent: new https.Agent({ rejectUnauthorized: false }),
  headers: {
    "Content-Type": "application/json",
  },
});

export const accessClient = axios.create({
  baseURL: process.env.REACT_APP_API_END_POINT,
  timeout: 180000,
  withCredentials: false,
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
  },
});

client.interceptors.response.use(
  (response) => {
    return response;
  },
  (err) => {
    console.log("err", err);

    return new Promise((resolve, reject) => {
      const originalReq = err.config;
      console.log("originalReq", originalReq);

      // if (
      //   err.response.storeAuthState === 401 &&
      //   err.config &&
      //   !err.config?.__isRetryRequest
      // ) { // refresh token 위한
      //   originalReq._retry = true;
      // }

      return reject({
        ...err?.response?.data,
        statusText: err.response.statusText,
      });
    });
  }
);

accessClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (err) => {
    return new Promise((resolve, reject) => {
      let {
        response: {
          data: { statusCode },
        },
      } = err;
      let back = false;
      console.log(err);
      console.log("statusCode", statusCode);
      switch (statusCode) {
        case 401:
        case 410: // 유효하지 않은 토큰
          back = true;
          break;
        case 500:
          break;
      }

      // if (
      //   err.response.storeAuthState === 401 &&
      //   err.config &&
      //   !err.config?.__isRetryRequest
      // ) { // refresh token 위한
      //   originalReq._retry = true;
      // }

      return reject({
        ...err?.response?.data,
        back,
        statusText: err.response.statusText,
      });
    });
  }
);

export const sodiApi = {
  user: {
    login: async (email, password) => {
      return await client
        .post(`/auth/login`, { email, password })
        .then((res) => {
          if ([200, 201].includes(res.status)) {
            localStorage.setItem("accessToken", `${res.data?.access_token}`);
          }
          return {
            ...res.data,
            statusCode: res.status,
            statusText: res.statusText,
            message: "로그인에 성공하였습니다.",
          };
        })
        .catch((e) => {
          return e;
        });
    },
    verify: async () => {
      const accessToken = localStorage.getItem("accessToken");
      console.log("accessToken", accessToken);
      if (!accessToken) return false;

      let result = await accessClient
        .post(`/auth/verify`, { accessToken })
        .then((e) => {
          console.log("e", e);
          return e;
        });
      console.log("result", result);
    },
    findAll: async () => {
      return await client.post(`/user/list/all`).then((res) => res.data);
    },
  },
  map: {
    searchResultList: async (keyword, props = {}) => {
      console.log(keyword, props);
      let url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${keyword}.json?proximity=ip&types=place%2Cpostcode%2Caddress&access_token=${publicKey}`;
      // eslint-disable-next-line react-hooks/rules-of-hooks
      return fetch(url).then((result) => result.json());
    },
  },
  board: {
    findAll: async () => {
      return await accessClient
        .post("/board/list/all")
        .then((res) => res)
        .catch((err) => {
          console.log('error', err)
          toast.error('error');
          return new Promise((res, rej) => rej(err));
        });
    },

    uploadPost: async (post, images) => {
      // let { title, content, country, images } = post;
      images = images?.map((d) => d?.file) ?? [];
      let formData = new FormData();
      for (let key in post) {
        formData.append(key, post[key]);
      }
      images.forEach((file) => {
        formData.append("files", file);
      });

      return await accessClient
        .post(`/board/create`, formData, { headers: MULTIPART })
        .then((res) => {
          console.log(res);
          return res;
        })
        .catch((err) => {
          console.log("err", err);
        });
    },
  },
  comment: {
    findAllByBoardId: async (boardId) => {
      return await accessClient
          .post(`/comment/list/${boardId}`)
          .then(e => {
            console.log('commentList e', e);
            return e;
          })
          .catch(e => {
            console.log('commentList error', e);
            return e;
          })

    },
    createComment: async ({ boardId, content, replyName, replyId }) => {
      return await accessClient
          .post(`/comment/create`, { boardId, content, replyName, replyId })
          .then((e) => {
            console.log('e', e)
            return e;
          })
          .catch(e => {
            console.log('e', e)
            return e;
          })
    }
  },
};
