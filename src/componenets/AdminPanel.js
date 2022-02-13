import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { connect } from "../redux/blockchain/blockchainActions";
import { fetchData } from "../redux/data/dataActions";
import { Box, Container, Text, Spacer, VStack, HStack, Button, Center, Flex, Image, Input } from "@chakra-ui/react";
import Navbar from "./Navbar";
import app from '../firebase.js';
import { collection, addDoc, setDoc, doc } from "firebase/firestore";
import { getFirestore, getDocs } from "firebase/firestore";
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



    const db = getFirestore(app);



    const getRequestsData = () => {
        const auth = getAuth();
        signInWithEmailAndPassword(auth, id, password)
            .then((userCredential) => {
                // Signed in 
                const user = userCredential.user;
                console.log(user)          // ...
                getDocs(collection(db, "requests"))
                    .then((querySnapshot) => {
                        querySnapshot.forEach((doc) => {
                            setrequests((prevState) => [
                                ...prevState,
                                { id: doc.id, enodeid: doc.data().enodeAdress },
                            ]);
                            console.log(doc.id, " => ", doc.data().enodeAdress);
                        });
                    });


            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
            });
    };


    const getData = () => {
        if (blockchain.account !== "" && blockchain.smartContract !== null) {
            dispatch(fetchData(blockchain.account));
        }
    };


    useEffect(() => {
        getData();
    }, [blockchain.account]);


    return (
        <div>

            <VStack w='100%' minH='80vh' bgGradient='linear(to-t, #F9A602, gray.700)' >
                <HStack w='100%' h='30vh' mx={'5vw'} px={'5vw'} mt={'8%'}>
                    <Box w='30vw' h='30vh' bg='red' borderRadius={100} bgGradient='radial(#F9A602, white)' alignSelf={'middle'} >
                        <VStack alignItems={'center'} mt='4%'>
                            <Input value={id} onChange={handleChangeid} placeholder="id" size="sm" borderRadius='20' bg='white.200' w={'50%'} x />
                            <Input value={password} onChange={handleChangepassword} placeholder="password" size="sm" borderRadius='20' bg='white.200' w={'50%'} x />

                            <Button borderColor="black" borderRadius='20' boxShadow='lg' variant="outline"
                                onClick={() => {
                                    getRequestsData();
                                }}>
                                login
                            </Button>
                        </VStack>

                    </Box>


                </HStack>

                {requests.map((request, index) => {

                    return (
                        <HStack align='center' key={index} w='80vw ' bg='whiteAlpha.600' py='2vh' borderRadius='xl' boxShadow='xl' spacing='3%'>
                            <Text style={{ textAlign: "center" }}>  <strong>{request.id} </strong>: {request.enodeid} </Text>
                        </HStack>
                    );
                })
                }

            </VStack>
        </div>
    );
}

export default AdminPanel;
