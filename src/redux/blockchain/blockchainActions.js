// constants
import Web3EthContract from "web3-eth-contract";
import Web3 from "web3";
import TokenContract from "../../contracts/StandartToken.json";
import StakingContract from "../../contracts/StakingPool.json";
// log
import { fetchData } from "../data/dataActions";

const connectRequest = () => {
  return {
    type: "CONNECTION_REQUEST",
  };
};

const connectSuccess = (payload) => {
  return {
    type: "CONNECTION_SUCCESS",
    payload: payload,
  };
};

const connectFailed = (payload) => {
  return {
    type: "CONNECTION_FAILED",
    payload: payload,
  };
};

const updateAccountRequest = (payload) => {
  return {
    type: "UPDATE_ACCOUNT",
    payload: payload,
  };
};

export const connect = () => {
  return async (dispatch) => {
    dispatch(connectRequest());
    const { ethereum } = window;
    const metamaskIsInstalled = ethereum && ethereum.isMetaMask;
    if (metamaskIsInstalled) {
      Web3EthContract.setProvider(ethereum);
      let web3 = new Web3(ethereum);
      try {
        // Request account access if needed
        await window.ethereum.enable();
        console.log("connected");        
      } catch (error) {
        console.error(error);
      }      
      try {
        console.log("1");
        const accounts = await ethereum.request({
          method: "eth_requestAccounts",
        });
        const networkId = await ethereum.request({
          method: "net_version",
        });
        
        //const NetworkData = await SmartContract.networks[networkId];
        const chainId = await ethereum.request({ method: 'eth_chainId' });
        console.log(chainId);
        if (chainId=="0x4de") {       //0xa86a mainnetin chain id'si, 0xa869 fuji netin chain idsi
          const tokenContractAdress = "0x95C1A7F0640129F1Ab6c963EA706A7Ac9658fAcd";
          const stakingContractAdress = "0x5753B85aD01d60a3Cee2e0B694d6e99901618d55";
          const TokenContractObj = new Web3EthContract(
            //SmartContract.abi,
            //NetworkData.address            
            TokenContract.abi,
            tokenContractAdress
          );
          const StakingContractObj = new Web3EthContract(
            //SmartContract.abi,
            //NetworkData.address            
            StakingContract.abi,
            stakingContractAdress
          );
          console.log(StakingContractObj);
          dispatch(
            connectSuccess({
              account: accounts[0],
              smartContract: TokenContractObj,
              stakingContract: StakingContractObj,
              tokenContractAdress:tokenContractAdress,
              stakingContractAdress: stakingContractAdress,
              web3: web3,
            })
          );
          // Add listeners start
          ethereum.on("accountsChanged", (accounts) => {
            dispatch(updateAccount(accounts[0]));
          });
          ethereum.on("chainChanged", () => {
            window.location.reload();
          });          
          // Add listeners end
        } else {
          
          dispatch(connectFailed("Change network to ONENG."));
        }
      } catch (err) {
        dispatch(connectFailed("Something went wrong."));
      }
    } else {
      dispatch(connectFailed("Install Metamask."));
    }
  };
};

export const updateAccount = (account) => {
  return async (dispatch) => {
    dispatch(updateAccountRequest({ account: account }));
    dispatch(fetchData(account));
  };
};
