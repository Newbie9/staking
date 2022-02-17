import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { connect } from "../redux/blockchain/blockchainActions";
import { fetchData } from "../redux/data/dataActions";
import { Box, Container, Text, Spacer, VStack, HStack, Button, Center, Flex, Image, Input } from "@chakra-ui/react";
import Navbar from "./Navbar";
import app from '../firebase.js';
import { collection, addDoc, setDoc, doc, snapshotEqual } from "firebase/firestore";
import { getFirestore, getDocs, getDoc } from "firebase/firestore";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

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
    const auth = getAuth();

    const db = getFirestore(app);



    const getRequestsData = () => {
        if (blockchain.account != null) {
        setrequests([]);
        blockchain.stakingContract.methods.getRequestsLength().call()
        .then((length)=>{
            console.log(length)
            for(let i=0;i<length;i++){
                blockchain.stakingContract.methods.validators(i).call()
                .then((request)=>{
                    setrequests((prevState) => [
                        ...prevState,
                        { adress: request.user, enodeAdress: request.enodeAdress, status: request.status },
                    ]);
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
                    //changeUserStatus(userAdress,'approved to stake')
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
                        <VStack align='center' key={index} w='90vw' h='20vh' bg='whiteAlpha.600' py='1vh' borderRadius='xl' boxShadow='xl' spacing='1%'>
                            <Text style={{ textAlign: "center" }}>  <strong>{usersRequest.adress} </strong> </Text>
                            <Text style={{ textAlign: "center" }}>  {usersRequest.enodeAdress} </Text>
                            <Text style={{ textAlign: "center" }}>  <strong> Status:</strong> <strong>{usersRequest.status} </strong></Text>
                            <Button borderColor="black" borderRadius='20' boxShadow='lg' variant="outline"
                                onClick={() => {
                                    approveValidator(usersRequest.adress);
                                }}>
                                EnableToStake
                            </Button>
                        </VStack>
                    );
                })
                }

            </VStack>
        </div>
    );
}

export default AdminPanel;
