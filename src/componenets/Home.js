import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { connect } from "../redux/blockchain/blockchainActions";
import { fetchData } from "../redux/data/dataActions";
import { Box, Container, Text, Spacer, VStack, HStack, Button, Center, Flex, Image, Input } from "@chakra-ui/react";
import Navbar from "./Navbar";
import db from '../firebase.js';
import { collection, addDoc } from "firebase/firestore"; 

function Home() {
  const dispatch = useDispatch();
  const blockchain = useSelector((state) => state.blockchain);
  const data = useSelector((state) => state.data);    
  const [stakingAmount, setstakingAmount] = useState(0);
  const handleChange = event => setstakingAmount(event.target.value);

  

    useEffect(() => {
        
            addDoc(collection(db, "users"), {
              first: "Ada",
              last: "Lovelace",
              born: 1815
            }).then((response)=>{
                console.log(response)
              })
            
          
    }, []);


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
  };
  const StakeSharedWallet = () => {
    //console.log(blockchain.stakingContract.methods)
    blockchain.stakingContract.methods
      .stakeTokens(stakingAmount * 1e2, false)
      .send({
        to: blockchain.stakingContract.address, // Smart Contract Adress
        from: blockchain.account,
      })
  };
  const Stake = () => {
    //console.log(blockchain.account)
    blockchain.stakingContract.methods
      .stakeTokens(stakingAmount * 1e2, true)
      .send({
        to: blockchain.stakingContract.address, // Smart Contract Adress
        from: blockchain.account,
      })
  };
  const withdrawStake = () => {
    //console.log(blockchain.account)
    blockchain.stakingContract.methods
      .withdrawStake(data.userInfo[0])
      .send({
        to: blockchain.stakingContract.address, // Smart Contract Adress
        from: blockchain.account,
      })
  };
  const withdrawRewards = () => {
    //console.log(blockchain.account)
    blockchain.stakingContract.methods
      .transferPendingRewardP()
      .send({
        to: blockchain.stakingContract.address, // Smart Contract Adress
        from: blockchain.account,
      })
  };


  useEffect(() => {
    getData();
  }, [blockchain.account]);


  return (
    <div>
      <Navbar />
      <VStack w='100%' minH='80vh' bgGradient='linear(to-t, #F9A602, gray.700)' >
        <HStack w='100%' h='30vh' mx={'5vw'} px={'5vw'} mt={'8%'}>
          <Box w='30vw' h='30vh' bg='red' borderRadius={100} bgGradient='radial(#F9A602, white)' alignSelf={'middle'} >
            <VStack alignItems={'center'} mt='4%'>
              <Button borderColor="black" borderRadius='20' boxShadow='lg' variant="outline"
                onClick={() => {
                  approveStaking()
                }}>
                Approve
              </Button>

              <Input value={stakingAmount} onChange={handleChange} placeholder="Amount to Stake" size="sm" borderRadius='20' bg='white.200' w={'30%'} x />
              <Button borderColor="black" borderRadius='20' boxShadow='lg' variant="outline"
                onClick={() => {
                  StakeSharedWallet()
                }}>
                StakeSharedWallet
              </Button>

              <Button borderColor="black" borderRadius='20' boxShadow='lg' variant="outline"
                onClick={() => {
                  withdrawRewards()
                }}>
                withdrawRewards
              </Button>
            </VStack>
          </Box>
          <Box w='30vw' h='30vh' bg='red' borderRadius={100} bgGradient='radial(#F9A602, white)' alignSelf={'middle'} >
            <VStack alignItems={'center'} mt='4%'>
              <Button borderColor="black" borderRadius='20' boxShadow='lg' variant="outline"
                onClick={() => {
                  approveStaking()
                }}>
                Approve
              </Button>

              <Input value={stakingAmount} onChange={handleChange} placeholder="Amount to Stake" size="sm" borderRadius='20' bg='white.200' w={'30%'} x />
              <Button borderColor="black" borderRadius='20' boxShadow='lg' variant="outline"
                onClick={() => {
                  Stake()
                }}>
                Stake
              </Button>

              <Button borderColor="black" borderRadius='20' boxShadow='lg' variant="outline"
                onClick={() => {
                  withdrawRewards()
                }}>
                withdrawRewards
              </Button>
            </VStack>
          </Box>
          <Box w='30vw' h='30vh' bg='red' borderRadius={100} bgGradient='radial(#F9A602, white)' alignSelf={'middle'} >
            <VStack alignItems={'center'} mt='4%'>
              {blockchain.account === "" || blockchain.smartContract === null || data.userInfo===null ? (
                <Button borderColor="black" borderRadius='20' boxShadow='lg' variant="outline"
                  onClick={() => {
                    dispatch(connect())
                  }}>
                  connect
                </Button>
              ) : (
                <VStack>
                  <Text>
                    {blockchain.account}
                  </Text>
                  <Text>
                    Balance: {data.balanceof / 1e2}
                  </Text>

                  <Text>Pending Reward: {data.pendingReward / 1e18}</Text>
                  <Text>All Staked Amount: {data.allStakedAmount / 1e2}</Text>
                  <Text>User Staked Amount: {data.userInfo[0] / 1e2}</Text>
                  <Text>Is Validator: {data.isValidator}</Text>
                  <Text>Number of Participants: {data.participants}</Text>
                  <Text>Shared Wallet Staked Amount: {data.sharedWalletStakedAmount / 1e2}</Text>

                </VStack>

              )}

            </VStack>
          </Box>
        </HStack>


      </VStack>
    </div>
  );
}

export default Home;
