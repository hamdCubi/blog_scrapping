export const reducer = (state, action) => {
    switch (action.type) {
      case "USER_LOGIN": {
        if (action.payload?.email) {
          const role = action.payload?.isAdmin ? "admin" : "user";
          const user = {
            email: action.payload?.email,
            _id: action.payload?._id,
          };
  
          return { ...state, isLogin: true, role: role, user: user };
        }
      }
     
  
      case "USER_LOGOUT": {
        return { ...state, isLogin: false, role: null, user: {} };
      }
      break;
  
      default: {
        return state;
      }
    }
  };