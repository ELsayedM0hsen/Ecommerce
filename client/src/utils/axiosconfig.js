export const base_url = "http://localhost:5000/api/";

const getTokenFromLocalStorage = localStorage.getItem("customer")
  ? JSON.parse(localStorage.getItem("customer"))
  : null;

export const config = {
  headers: {
    Authorization: `Bearer ${getTokenFromLocalStorage !== null ? getTokenFromLocalStorage.token : ""}`,
    Accept: "application/json",
  },
};




// // khi dang khi luu full thong tin (ko co token)
// // khi dang nhap chi luu token
// const getTokenFromLocalStorage = localStorage.getItem("token")
//   ? localStorage.getItem("token")
//   : null;

// export const config = {
//   headers: {
//     Authorization: `Bearer ${getTokenFromLocalStorage !== null ? getTokenFromLocalStorage : ""
//       }`,
//     Accept: "application/json",
//   },
// };