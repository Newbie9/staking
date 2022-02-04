const initialState = {
  loading: false,
  name: "",
  totalSupply: 0,
  pendingReward: 0,
  allStakedAmount: 0,
  userInfo: null,
  isValidator: null,
  participants: 0,
  sharedWalletStakedAmount: 0,  
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
        loading: false,
        name: action.payload.name,
        totalSupply: action.payload.totalSupply,
        pendingReward: action.payload.pendingReward,
        allStakedAmount: action.payload.allStakedAmount,
        userInfo: action.payload.userInfo,
        isValidator: action.payload.isValidator,
        participants: action.payload.participants,
        sharedWalletStakedAmount: action.payload.sharedWalletStakedAmount,
           
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
