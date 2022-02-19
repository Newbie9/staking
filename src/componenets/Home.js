import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { connect } from "../redux/blockchain/blockchainActions";
import { fetchData } from "../redux/data/dataActions";
import { Box, Container, Text, Spacer, VStack, HStack, Button, Center, Flex, Image, Input } from "@chakra-ui/react";
import Navbar from "./Navbar";


function Home() {
  const dispatch = useDispatch();
  const blockchain = useSelector((state) => state.blockchain);
  const data = useSelector((state) => state.data);
  const [stakingAmount, setstakingAmount] = useState(0);
  const handleChange = event => setstakingAmount(event.target.value);

  const [stakingAmount2, setstakingAmount2] = useState(0);
  const handleChange2 = event => setstakingAmount2(event.target.value);

  const [EnodeAdress, setEnodeAdress] = useState("");
  const handleChangeEnodeAdress = event => setEnodeAdress(event.target.value);
  const [usersRequest, setusersRequest] = useState({});


  var triedConnect = false;


  const getData = () => {
    if (blockchain.account !== "" && blockchain.smartContract !== null) {
      dispatch(fetchData(blockchain.account));
    }
  };

  const validatorApply = () => {
    if (blockchain.account !== "" && blockchain.smartContract !== null) {
      blockchain.stakingContract.methods
        .addRequest(EnodeAdress)
        .send({
          to: blockchain.smartContract.address, // Smart Contract Adress
          from: blockchain.account,
        })
    }
  };
  const approveStaking = () => {
    if (blockchain.account !== "" && blockchain.smartContract !== null) {

      blockchain.smartContract.methods
        .approve(blockchain.stakingContractAdress, 1e12)
        .send({
          to: blockchain.smartContract.address, // Smart Contract Adress
          from: blockchain.account,
        })
    }
  };
  const StakeSharedWallet = () => {
    if (blockchain.account !== "" && blockchain.smartContract !== null) {
      blockchain.stakingContract.methods
        .stakeTokens(stakingAmount * 1e2, false)
        .send({
          to: blockchain.stakingContract.address, // Smart Contract Adress
          from: blockchain.account,
        })
    }
  };
  const Stake = () => {
    if (blockchain.account !== "" && blockchain.smartContract !== null) {
      blockchain.stakingContract.methods
        .stakeTokens(stakingAmount2 * 1e2, true)
        .send({
          to: blockchain.stakingContract.address, // Smart Contract Adress
          from: blockchain.account,
        })
    }
  };
  const withdrawStake = () => {
    if (blockchain.account !== "" && blockchain.smartContract !== null) {
      blockchain.stakingContract.methods
        .withdrawStake()
        .send({
          to: blockchain.stakingContract.address, // Smart Contract Adress
          from: blockchain.account,
        })
    }
  };
  const withdrawRewards = () => {
    if (blockchain.account !== "" && blockchain.smartContract !== null) {
      blockchain.stakingContract.methods
        .transferPendingRewardP()
        .send({
          to: blockchain.stakingContract.address, // Smart Contract Adress
          from: blockchain.account,
        })
    }
  };


  useEffect(() => {
    if (blockchain.account != null) {
      blockchain.stakingContract.methods.userInfo(blockchain.account).call()
        .then((userinfo) => {
          if (userinfo.maderequest) {
            blockchain.stakingContract.methods.validators(userinfo.index).call()
              .then((request) => {
                setusersRequest({ adress: request.user, enodeAdress: request.enodeAdress, status: request.status });
              })
          }
        })

    }

  }, [blockchain.account]);

  useEffect(() => {
    console.log(blockchain.account)
    if (blockchain.account !== "" && blockchain.smartContract !== null) {
      getData();
    } else {
      if (!triedConnect) {
        triedConnect = true;
        dispatch(connect())
      }
    }
  }, [blockchain.smartContract, blockchain.account]);


  return (
    <div>

      <VStack w='100%' minH='80vh' bgGradient='linear(to-t, #F9A602, black)' >
        <VStack w='100%' mx={'5vw'} px={'5vw'} mt={'3%'}>
          <Box w='50%' h='30vh' borderRadius={80} bgGradient='radial(#F9A602, white)' alignSelf={'middle'} borderColor='#F9A602' borderWidth={'2px'} boxShadow='dark-lg'>
            <HStack>
              <VStack alignItems={'middle'} w='50%' mt='4%' ml='10%'>
                {blockchain.account===null || data.isAllowed ===null ? (
                  null
                ) : (
                  <div>
                    {data.isAllowed ? (
                      <VStack alignItems={'center'} mt='15%'>
                        <HStack  mb='10%'>
                          <Input value={stakingAmount} onChange={handleChange} placeholder="Amount to Stake"  size="sm" borderRadius='20' bg='white.200' w={'50%'} x />
                          <Button  size='sm' bg='alpha'
                            _hover={{ bg: "alpha" }}
                            onClick={() => {
                              setstakingAmount(data.balanceof / 1e2);
                            }}>
                            Max
                          </Button>
                        </HStack>
                        
                        <Button borderColor="black" borderRadius='20' boxShadow='lg' variant="outline" 
                          onClick={() => {
                            StakeSharedWallet()
                          }}>
                          StakeSharedWallet
                        </Button>
                      </VStack>
                    ) : (
                      <Button borderColor="black" borderRadius='20' boxShadow='lg' variant="outline"
                        onClick={() => {
                          approveStaking()
                        }}>
                        Approve
                      </Button>
                    )}
                    {data.userInfo[0] > 0 ? (
                      <div>
                        <Button borderColor="black" borderRadius='20' boxShadow='lg' variant="outline"
                          onClick={() => {
                            withdrawRewards()
                          }}>
                          Withdraw Rewards
                        </Button>
                        <Button borderColor="black" borderRadius='20' boxShadow='lg' variant="outline"
                          onClick={() => {
                            withdrawStake()
                          }}>
                          Withdraw Stake
                        </Button>
                      </div>
                    ) : (
                      null
                    )}
                  </div>
                )}
              </VStack>
              <Spacer/>
              <VStack w='50%'>
                {blockchain.account===null || !data.loading || data.pendingReward===null?(
                  null
                ):(
                  <div>
                  <Text>User Staked Amount: {data.userInfo[0] / 1e2} ST</Text>
                  <Text>Pending Reward: {data.pendingReward / 1e18} ONGCT</Text>
                  </div>
                )}
                
              </VStack>
            </HStack>
          </Box>
          <Box w='50%' h='30vh' borderRadius={80} bgGradient='radial(#F9A602, white)' alignSelf={'middle'} borderColor='#F9A602' borderWidth={'2px'} boxShadow='dark-lg'>
            <HStack>
              <VStack alignItems={'middle'} w='50%' mt='4%' ml='10%'>
                {blockchain.account===null || data.isAllowed ===null ? (
                  null
                ) : (
                  <div>
                    {data.isAllowed ? (
                      <VStack alignItems={'center'} mt='15%'>
                        <HStack  mb='10%'>
                          <Input value={stakingAmount2} onChange={handleChange2} placeholder="Amount to Stake"  size="sm" borderRadius='20' bg='white.200' w={'50%'} x />
                          <Button  size='sm' bg='alpha'
                            _hover={{ bg: "alpha" }}
                            onClick={() => {
                              setstakingAmount2(data.balanceof / 1e2);
                            }}>
                            Max
                          </Button>
                        </HStack>
                        
                        <Button borderColor="black" borderRadius='20' boxShadow='lg' variant="outline" 
                          onClick={() => {
                            Stake()
                          }}>
                          Stake
                        </Button>
                      </VStack>
                    ) : (
                      <Button borderColor="black" borderRadius='20' boxShadow='lg' variant="outline"
                        onClick={() => {
                          approveStaking()
                        }}>
                        Approve
                      </Button>
                    )}
                    {data.userInfo[0] > 0 ? (
                      <div>
                        <Button borderColor="black" borderRadius='20' boxShadow='lg' variant="outline"
                          onClick={() => {
                            withdrawRewards()
                          }}>
                          Withdraw Rewards
                        </Button>
                        <Button borderColor="black" borderRadius='20' boxShadow='lg' variant="outline"
                          onClick={() => {
                            withdrawStake()
                          }}>
                          Withdraw Stake
                        </Button>
                      </div>
                    ) : (
                      null
                    )}
                  </div>
                )}
              </VStack>
              <Spacer/>
              <VStack w='50%'>
                {blockchain.account===null || !data.loading || data.pendingReward===null?(
                  null
                ):(
                  <div>
                  <Text>User Staked Amount: {data.userInfo[0] / 1e2} ST</Text>
                  <Text>Pending Reward: {data.pendingReward / 1e18} ONGCT</Text>
                  </div>
                )}
                
              </VStack>
            </HStack>
          </Box>
          <Box w='30vw' h='30vh' bg='red' borderRadius={100} bgGradient='radial(#F9A602, white)' alignSelf={'middle'} >
            <VStack alignItems={'center'} mt='4%'>
              {blockchain.account === "" || blockchain.smartContract === null || data.userInfo === null ? (
                null
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
        </VStack>
        <Box w='30vw' h='30vh' bg='red' borderRadius={100} bgGradient='radial(#F9A602, white)' alignSelf={'middle'} >
          <VStack alignItems={'center'} mt='4%'>
            {!(Object.keys(usersRequest).length === 0) ? (
              <div>
                <Text style={{ textAlign: "center" }}>  <strong>You have a request! </strong> </Text>                
                <Text style={{ textAlign: "center" }}>  Enode Adress: {usersRequest.enodeAdress} </Text>
                <Text style={{ textAlign: "center" }}>  <strong> Status:</strong> <strong>{usersRequest.status} </strong></Text>
              </div>
            ) : (
              <div>
                <Input value={EnodeAdress} onChange={handleChangeEnodeAdress} placeholder="Enode Adress" size="sm" borderRadius='20' bg='white.200' w={'30%'} x />

                <Button borderColor="black" borderRadius='20' boxShadow='lg' variant="outline"
                  onClick={() => {
                    validatorApply()
                  }}>
                  Apply to be a Validator
                </Button>
              </div>
            )
            }


          </VStack>
        </Box>


      </VStack>
    </div>
  );
}

export default Home;
