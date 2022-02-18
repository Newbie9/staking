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
      let balanceof = await store
        .getState()
        .blockchain.smartContract.methods.balanceOf(account)
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
      console.log(userInfo)
      let isValidator = await store
        .getState()
        .blockchain.stakingContract.methods.isValidator(account)
        .call();
      let multiplier = await store
        .getState()
        .blockchain.stakingContract.methods.validatorBonusMultiplier()
        .call();
      let stakingContractAdress = await store.getState().blockchain.stakingContractAdress;
      let allowance = await store
        .getState()
        .blockchain.smartContract.methods.allowance(account,stakingContractAdress)
        .call();

      let isAllowed = false;
      if(allowance>1e10){
        isAllowed = true;
      }

      if(isValidator){
        isValidator = "True";
        userInfo[0]=userInfo[0]*10/multiplier;
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
      allStakedAmount=parseInt((allStakedAmount-sharedWalletStakedAmount)*10/multiplier) +parseInt(sharedWalletStakedAmount);

      dispatch(
        fetchDataSuccess({
          name,
          balanceof,
          pendingReward,
          allStakedAmount,
          userInfo,
          isValidator,
          participants,
          sharedWalletStakedAmount,
          isAllowed,
        })
      );
    } catch (err) {
      console.log(err);
      dispatch(fetchDataFailed("Could not load data from contract."));
    }
  };
};
