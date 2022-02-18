const initialState = {
  loading: false,
  name: "",
  balanceof: 0,
  pendingReward: null,
  allStakedAmount: 0,
  userInfo: null,
  isValidator: null,
  participants: 0,
  sharedWalletStakedAmount: 0,  
  isAllowed: null,
  error: false,
  errorMsg: "",
};

const dataReducer = (state = initialState, action) => {
  switch (action.type) {
    case "CHECK_DATA_REQUEST":
      return {
        ...state,
        loading: true,
        error: false,
        errorMsg: "",
      };
    case "CHECK_DATA_SUCCESS":
      return {
        ...state,
        loading: true,
        name: action.payload.name,
        balanceof: action.payload.balanceof,
        pendingReward: action.payload.pendingReward,
        allStakedAmount: action.payload.allStakedAmount,
        userInfo: action.payload.userInfo,
        isValidator: action.payload.isValidator,
        participants: action.payload.participants,
        sharedWalletStakedAmount: action.payload.sharedWalletStakedAmount,
        isAllowed: action.payload.isAllowed,
           
        error: false,
        errorMsg: "",
      };
    case "CHECK_DATA_FAILED":
      return {
        ...initialState,
        loading: false,
        error: true,
        errorMsg: action.payload,
      };
    default:
      return state;
  }
};

export default dataReducer;
