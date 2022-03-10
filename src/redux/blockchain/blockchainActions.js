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
        if (chainId=="0x542") {       //0xa86a mainnetin chain id'si, 0xa869 fuji netin chain idsi
          const tokenContractAdress = "0x3118439bD7BE875eF35Fd34077d08573448769C4";
          const stakingContractAdress = "0x3631146D53881D50a3a9793218E955afF54757EC";
          const TokenContractObj = new Web3EthContract(                      
            TokenContract.abi,
            tokenContractAdress
          );
          const StakingContractObj = new Web3EthContract(                    
            StakingContract.abi,
            stakingContractAdress
          );
          console.log(TokenContractObj);
          dispatch(
            connectSuccess({
              account: accounts[0],
              smartContract: TokenContractObj,
              stakingContract: StakingContractObj,
              tokenContractAdress:tokenContractAdress,
              stakingContractAdress: stakingContractAdress,
              chainId: true,
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
        }else if(chainId=="0x4de"){
          const tokenContractAdress = "0x95C1A7F0640129F1Ab6c963EA706A7Ac9658fAcd";
          const stakingContractAdress = "0x759b2B472Ae1D0B5b9C6452fD017f9C8FccF55D2";
          const TokenContractObj = new Web3EthContract(                      
            TokenContract.abi,
            tokenContractAdress
          );
          const StakingContractObj = new Web3EthContract(                    
            StakingContract.abi,
            stakingContractAdress
          );
          console.log(TokenContractObj);
          dispatch(
            connectSuccess({
              account: accounts[0],
              smartContract: TokenContractObj,
              stakingContract: StakingContractObj,
              tokenContractAdress:tokenContractAdress,
              stakingContractAdress: stakingContractAdress,
              chainId: true,
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
        } 
        else {

          let web3 = new Web3("https://api.oneng.network");
          const tokenContractAdress = "0x3118439bD7BE875eF35Fd34077d08573448769C4";
          const stakingContractAdress = "0x3631146D53881D50a3a9793218E955afF54757EC";
          const TokenContractObj = new web3.eth.Contract(
            //SmartContract.abi,
            //NetworkData.address            
            TokenContract.abi,
            tokenContractAdress
          );
          const StakingContractObj = new web3.eth.Contract(
            //SmartContract.abi,
            //NetworkData.address            
            StakingContract.abi,
            stakingContractAdress
          ); 
          console.log("Wrong Chain");         
          dispatch(
            connectSuccess({
              account: "0x6E0d54B00baa5F7Be20f95e6c18Cf291b6f6A765",
              smartContract: TokenContractObj,
              stakingContract: StakingContractObj,
              tokenContractAdress: tokenContractAdress,
              stakingContractAdress: stakingContractAdress,
              chainId: false,
              web3: web3,
            })
          );
        }
      } catch (err) {
        dispatch(connectFailed("Something went wrong."));
      }
    } else {
      
      let web3 = new Web3("https://api.oneng.network");
      const tokenContractAdress = "0x3118439bD7BE875eF35Fd34077d08573448769C4";
          const stakingContractAdress = "0x3631146D53881D50a3a9793218E955afF54757EC";
      const TokenContractObj = new web3.eth.Contract(
        //SmartContract.abi,
        //NetworkData.address            
        TokenContract.abi,
        tokenContractAdress
      );
      const StakingContractObj = new web3.eth.Contract(
        //SmartContract.abi,
        //NetworkData.address            
        StakingContract.abi,
        stakingContractAdress
      );
      console.log("Metamask not Installed");
      dispatch(
        connectSuccess({
          account: "0x6E0d54B00baa5F7Be20f95e6c18Cf291b6f6A765",
          smartContract: TokenContractObj,
          stakingContract: StakingContractObj,
          tokenContractAdress: tokenContractAdress,
          stakingContractAdress: stakingContractAdress,
          chainId: null,
          web3: web3,
        })
      );

      //dispatch(connectFailed("Install Metamask."));
    }
  };
};

export const updateAccount = (account) => {
  return async (dispatch) => {
    dispatch(updateAccountRequest({ account: account }));
    dispatch(fetchData(account));
  };
};
