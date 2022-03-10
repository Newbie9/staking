import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { connect } from "../redux/blockchain/blockchainActions";
import { fetchData } from "../redux/data/dataActions";
import { Box, Container, Text, Spacer, VStack, HStack, Button, Center, Flex, Image, Input } from "@chakra-ui/react";
import Navbar from "./Navbar";


function AdminPanel() {
    const dispatch = useDispatch();
    const blockchain = useSelector((state) => state.blockchain);
    const data = useSelector((state) => state.data);
    const [requests, setrequests] = useState([]);
    var triedConnect = false;
    const [owner, setowner] = useState("");
    const [contractBalance, setcontractBalance] = useState("");
    const [contractTokenBalance, setcontractTokenBalance] = useState("");

    const [amountToSend, setamountToSend] = useState("0");    
    const handleChange = event => setamountToSend(event.target.value);



    const getRequestsData = () => {
        if (blockchain.account != null) {
            blockchain.web3.eth.getBalance(blockchain.stakingContractAdress, function(err, result) {
                if (err) {
                  console.log(err)
                } else {
                    setcontractBalance(blockchain.web3.utils.fromWei(result, "ether") + " ONGC")
                }
              })
            blockchain.smartContract.methods.balanceOf(blockchain.stakingContractAdress).call()
            .then((balance)=>{
                setcontractTokenBalance((parseInt(balance)/1e2).toString() + " OneV")
            }) 

            blockchain.stakingContract.methods.owner().call()
                .then((owner) => {
                    setowner(owner);                    
                    if (blockchain.account.toLowerCase() == owner.toLowerCase()) {
                        console.log(1)
                        setrequests([]);
                        blockchain.stakingContract.methods.getRequestsLength().call()
                            .then((length) => {
                                console.log(length)
                                for (let i = 0; i < length; i++) {
                                    blockchain.stakingContract.methods.validators(i).call()
                                        .then((request) => {
                                            setrequests((prevState) => [
                                                ...prevState,
                                                { adress: request.user, enodeAdress: request.enodeAdress, status: request.status },
                                            ]);
                                        })
                                }
                            })

                    }
                })

        }
    };

    const approveValidator = (userAdress) => {
        //console.log(userAdress) 
        if (blockchain.account != null) {
            blockchain.stakingContract.methods
                .defineValidator(userAdress, true)
                .send({
                    to: blockchain.stakingContract.address, // Smart Contract Adress
                    from: blockchain.account,
                })
                .once("error", (err) => {
                    console.log(err);
                })
                .then((receipt) => {
                    getRequestsData();
                });

        } else {
            console.log("you are not connected")
        }
    };

    const removeValidator = (userAdress) => {
        //console.log(userAdress) 
        if (blockchain.account != null) {
            blockchain.stakingContract.methods
                .removeValidator(userAdress)
                .send({
                    to: blockchain.stakingContract.address, // Smart Contract Adress
                    from: blockchain.account,
                })
                .once("error", (err) => {
                    console.log(err);
                })
                .then((receipt) => {
                    getRequestsData();
                });

        } else {
            console.log("you are not connected")
        }
    };
    const WithdrawPoolRemainder = () => {
        //console.log(userAdress) 
        if (blockchain.account != null) {
            blockchain.stakingContract.methods
                .emergencyWithdrawPoolRemainder()
                .send({
                    to: blockchain.stakingContract.address, // Smart Contract Adress
                    from: blockchain.account,
                })
                .once("error", (err) => {
                    console.log(err);
                })
                .then((receipt) => {
                    getRequestsData();
                });

        } else {
            console.log("you are not connected")
        }
    };
    const restartRewardTime = () => {
        //console.log(userAdress) 
        if (blockchain.account != null) {
            blockchain.stakingContract.methods
                .setStartTime(0)
                .send({
                    to: blockchain.stakingContract.address, // Smart Contract Adress
                    from: blockchain.account,
                })
                .once("error", (err) => {
                    console.log(err);
                })
                .then((receipt) => {
                    getRequestsData();
                });

        } else {
            console.log("you are not connected")
        }
    };

    const sendEtherToContract = () => {        
        if (blockchain.account != null) {
            blockchain.stakingContract.methods
                .transferEthertoPool()
                .send({                    
                    to: blockchain.stakingContract._address, // Smart Contract Adress
                    from: blockchain.account,
                    value: blockchain.web3.utils.toWei((amountToSend).toString(), "ether"),
                  })
                  .once("error", (err) => {
                    console.log(err);                                    
                  })
                  .then((receipt) => {                    
                    getRequestsData();
                  });

        } else {
            console.log("you are not connected")
        }
    };


    const getData = () => {
        if (blockchain.account !== "" && blockchain.smartContract !== null) {
            dispatch(fetchData(blockchain.account));
        }
    };



    useEffect(() => {
        if (blockchain.account !== "" && blockchain.smartContract !== null) {
            getData();
            getRequestsData();
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
                {blockchain.account !== "" && blockchain.smartContract !== null ? 
                <div>
                    {blockchain.account.toLowerCase() == owner.toLowerCase() ? 
                    <VStack marginTop={'4'} w='30vw' h='30vh' bg='red' borderRadius={100} bgGradient='radial(#F9A602, white)' alignSelf={'middle'} alignItems='center' >
                    <Text marginTop={'4'}>Send Ether to Staking Contract</Text>
                    <HStack paddingBottom={'6'}>
                        <Input value={amountToSend} onChange={handleChange} placeholder="Amount to Stake" size="sm" borderRadius='20' bg='white.200' w={'50%'} x />
                        <Button size='sm' bg='white'
                            _hover={{ bg: "alpha" }}
                            onClick={() => {
                                sendEtherToContract();
                            }}>
                            Send
                        </Button>
                    </HStack>
                    <Button  size='sm' bg='white'
                        _hover={{ bg: "alpha" }}
                        onClick={() => {
                            WithdrawPoolRemainder();
                        }}>
                        WithdrawPoolRemainder
                    </Button>
                    <Button size='sm' bg='white'
                        _hover={{ bg: "alpha" }}
                        onClick={() => {
                            restartRewardTime();
                        }}>
                        restartRewardTime
                    </Button>
                    <Text style={{ textAlign: "center" }}>  <strong> Contracts Ether Balance:</strong> <strong>{contractBalance} </strong></Text>
                    <Text style={{ textAlign: "center" }}>  <strong> Contracts Token Balance:</strong> <strong>{contractTokenBalance} </strong></Text>
                </VStack>
                : 
                null
                }
                </div>
                : 
                null
                }
                
                
                        
                {requests.map((usersRequest, index) => {

                    return (
                        <VStack align='center' key={index} w='90vw' maxh='20vh' bg='whiteAlpha.600' py='1vh' mt='3vh' borderRadius={40} boxShadow='xl' spacing='1%'>
                            <Text style={{ textAlign: "center" }}>  <strong>{usersRequest.adress} </strong> </Text>
                            <Text style={{ textAlign: "center" }}>  {usersRequest.enodeAdress} </Text>
                            <Text style={{ textAlign: "center" }}>  <strong> Status:</strong> <strong>{usersRequest.status} </strong></Text>
                            {usersRequest.status === "pending" ? (
                                <Button borderColor="black" borderRadius='20' boxShadow='lg' variant="outline"
                                    onClick={() => {
                                        approveValidator(usersRequest.adress);
                                    }}>
                                    Enable To Stake
                                </Button>
                            ) : (
                                <Button borderColor="black" borderRadius='20' boxShadow='lg' variant="outline"
                                    onClick={() => {
                                        removeValidator(usersRequest.adress);
                                    }}>
                                    Remove Validator
                                </Button>
                            )}

                        </VStack>
                    );
                })
                }

            </VStack>
        </div>
    );
}

export default AdminPanel;
