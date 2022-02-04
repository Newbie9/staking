import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { connect } from "./redux/blockchain/blockchainActions";
import { fetchData } from "./redux/data/dataActions";
import { Box, Container, Text, Spacer, VStack, HStack, Button, Center, Flex, Image , Input } from "@chakra-ui/react";
import Navbar from "./componenets/Navbar";


function App() {
  const dispatch = useDispatch();
  const blockchain = useSelector((state) => state.blockchain);
  const data = useSelector((state) => state.data);
  const [feedback, setFeedback] = useState("Maybe it's your lucky day.");
  const [claimingNft, setClaimingNft] = useState(false);
  const [amount, setAmount] = useState(1);
  const [stakingAmount, setstakingAmount] = useState(0);
  const handleChange = event => setstakingAmount(event.target.value);
  

  const getData = () => {
    if (blockchain.account !== "" && blockchain.smartContract !== null) {
      dispatch(fetchData(blockchain.account));
    }
  };
  const approveStaking = () => {
    //console.log(blockchain.stakingContract.address)

    blockchain.smartContract.methods
      .approve("0x06bF00a9e9c7721CF0EeDB3dd80dfF2a6E678e11", 1e12)
      .send({
        to: blockchain.smartContract.address, // Smart Contract Adress
        from: blockchain.account,                    
      })    
      
      .then((receipt) => {
        console.log(receipt);        
      });
  };
  const StakeSharedWallet = () => {
    //console.log(blockchain.stakingContract.methods)
    blockchain.stakingContract.methods
      .stakeTokens(stakingAmount*1e2, false)
      .send({
        to: blockchain.stakingContract.address, // Smart Contract Adress
        from: blockchain.account,                    
      })    
      
      .then((receipt) => {
        console.log(receipt);        
      });
  };
  const Stake = () => {
    //console.log(blockchain.account)
    blockchain.stakingContract.methods
      .stakeTokens(stakingAmount*1e2, true)
      .send({
        to: blockchain.stakingContract.address, // Smart Contract Adress
        from: blockchain.account,                    
      })    
      
      .then((receipt) => {
        console.log(receipt);        
      });
  };
  const withdrawStake = () => {
    //console.log(blockchain.account)
    blockchain.stakingContract.methods
      .withdrawStake(data.userInfo[0])
      .send({
        to: blockchain.stakingContract.address, // Smart Contract Adress
        from: blockchain.account,                    
      })    
      
      .then((receipt) => {
        console.log(receipt);        
      });
  };
  const withdrawRewards = () => {
    //console.log(blockchain.account)
    blockchain.stakingContract.methods
      .transferPendingRewardP()
      .send({
        to: blockchain.stakingContract.address, // Smart Contract Adress
        from: blockchain.account,                    
      })    
      
      .then((receipt) => {
        console.log(receipt);        
      });
  };


  useEffect(() => {
    getData();
  }, [blockchain.account]);


  return (
    <div>

      <VStack w='99vw' minH='80vh' alignItems='left' bg='white'>
        <Button borderColor="red.500"
          borderRadius='20'
          boxShadow='lg'
          variant="outline"
          onClick={() => {
            dispatch(connect())
          }}>
          connect
        </Button>
        <Button borderColor="red.500"
          borderRadius='20'
          boxShadow='lg'
          variant="outline"
          onClick={() => {
            approveStaking()
          }}>
          Approve
        </Button>

        <Input
          value={stakingAmount}
          onChange={handleChange}
          placeholder="Amount to Stake"
          size="sm"
          borderRadius='20'
          bg='blue.200'
          x
        />
        <Button borderColor="red.500"
          borderRadius='20'
          boxShadow='lg'
          variant="outline"
          onClick={() => {
            StakeSharedWallet()
          }}>
          StakeSharedWallet
        </Button>
        <Button borderColor="red.500"
          borderRadius='20'
          boxShadow='lg'
          variant="outline"
          onClick={() => {
            Stake()
          }}>
          Stake
        </Button>
        <Button borderColor="red.500"
          borderRadius='20'
          boxShadow='lg'
          variant="outline"
          onClick={() => {
            withdrawStake()
          }}>
          WithdrawStake
        </Button>
        <Button borderColor="red.500"
          borderRadius='20'
          boxShadow='lg'
          variant="outline"
          onClick={() => {
            withdrawRewards()
          }}>
          withdrawRewards
        </Button>

        {blockchain.account == "" || blockchain.smartContract == null || data.userInfo == null ? (null):(
          <VStack>
          <Text>Pending Reward: {data.pendingReward / 1e18}</Text>
          <Text>All Staked Amount: {data.allStakedAmount / 1e2}</Text>
          <Text>User Staked Amount: {data.userInfo[0] / 1e2}</Text>
          <Text>Is Validator: {data.isValidator}</Text>
          <Text>Number of Participants: {data.participants}</Text>
          <Text>Shared Wallet Staked Amount: {data.sharedWalletStakedAmount/1e2}</Text>
          </VStack>
        )}
        
      </VStack>
    </div>
  );
}

export default App;
