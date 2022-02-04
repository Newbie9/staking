// log
import store from "../store";

const fetchDataRequest = () => {
  return {
    type: "CHECK_DATA_REQUEST",
  };
};

const fetchDataSuccess = (payload) => {
  return {
    type: "CHECK_DATA_SUCCESS",
    payload: payload,
  };
};

const fetchDataFailed = (payload) => {
  return {
    type: "CHECK_DATA_FAILED",
    payload: payload,
  };
};

export const fetchData = (account) => {
  return async (dispatch) => {
    dispatch(fetchDataRequest());
    try {
      let name = await store
        .getState()
        .blockchain.smartContract.methods.name()
        .call();        
      let totalSupply = await store
        .getState()
        .blockchain.smartContract.methods.totalSupply()
        .call();         
      let pendingReward = await store
        .getState()
        .blockchain.stakingContract.methods.pendingReward(account)
        .call();
      let allStakedAmount = await store
        .getState()
        .blockchain.stakingContract.methods.allStakedAmount()
        .call();
      let userInfo = await store
        .getState()
        .blockchain.stakingContract.methods.getUserInfo(account)
        .call();
      //console.log(userInfo[0])
      let isValidator = await store
        .getState()
        .blockchain.stakingContract.methods.isValidator(account)
        .call();
      if(isValidator){
        isValidator = "True";
      }else{
        isValidator = "False";
      }

      let participants = await store
        .getState()
        .blockchain.stakingContract.methods.participants()
        .call();
      let sharedWalletStakedAmount = await store
        .getState()
        .blockchain.stakingContract.methods.sharedWalletStakedAmount()
        .call();

      dispatch(
        fetchDataSuccess({
          name,
          totalSupply,
          pendingReward,
          allStakedAmount,
          userInfo,
          isValidator,
          participants,
          sharedWalletStakedAmount,
        })
      );
    } catch (err) {
      console.log(err);
      dispatch(fetchDataFailed("Could not load data from contract."));
    }
  };
};
