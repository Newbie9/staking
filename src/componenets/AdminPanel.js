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
    const [id, setid] = useState("");
    const handleChangeid = event => setid(event.target.value);
    const [password, setpassword] = useState("");
    const handleChangepassword = event => setpassword(event.target.value);
    const [requests, setrequests] = useState([]);
    var triedConnect = false;






    const getRequestsData = () => {
        if (blockchain.account != null) {
            blockchain.stakingContract.methods.owner().call()
                .then((owner) => {
                    if (blockchain.account == owner) {
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

            <VStack w='100%' minH='80vh' bgGradient='linear(to-t, #F9A602, gray.700)' >

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
