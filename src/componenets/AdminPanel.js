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
        signInWithEmailAndPassword(auth, id, password)
            .then((userCredential) => {
                // Signed in 
                const user = userCredential.user;
                console.log(user)          // ...
                getDocs(collection(db, "requests"))
                    .then((querySnapshot) => {
                        querySnapshot.forEach((doc) => {
                            checkUserStatus(doc.id)
                            setrequests((prevState) => [
                                ...prevState,
                                { adress: doc.id, enodeAdress: doc.data().enodeAdress, status: doc.data().status },
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

    const checkUserStatus = (userAdress) => {
        blockchain.stakingContract.methods.isValidator(userAdress).call()
        .then((isvalidator) => {
            if(isvalidator){
                console.log(getUserStatus(userAdress))
            }else{
                console.log(getUserStatus(userAdress))
            }
        })      
    }
    const getUserStatus = (userAdress) => {
        const docRef = doc(db, "requests", blockchain.account);
        getDoc(docRef)
        .then((snap) => {
          if (snap.exists()) {
            return snap.data().status;
          }

        });
    }
    const changeUserStatus = (userAdress, status) => {
        signInWithEmailAndPassword(auth, id, password)
            .then((userCredential) => {
                const docRef = doc(db, "requests", userAdress);
                getDoc(docRef)
                    .then((snap) => {
                        if (snap.exists()) {
                            setDoc(doc(db, "requests", userAdress), {
                                adress: snap.data().adress,
                                enodeAdress: snap.data().enodeAdress,
                                status: status
                            }).then((response) => {
                                console.log(response)
                            })
                                .catch((error) => {
                                    const errorCode = error.code;
                                    const errorMessage = error.message;
                                });
                        }
                    });
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
            });

    }

    const approveValidator = (userAdress) => {
        //console.log(userAdress) 
        if (blockchain.account != null) {
            blockchain.stakingContract.methods
                .defineValidator(userAdress, false)
                .send({
                    to: blockchain.stakingContract.address, // Smart Contract Adress
                    from: blockchain.account,
                })
                .once("error", (err) => {
                    console.log(err);
                })
                .then((receipt) => {
                    changeUserStatus(userAdress,'approved to stake')
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
                                approve
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
