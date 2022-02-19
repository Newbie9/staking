import React, { useState, useEffect } from 'react'
import { Box, HStack, Image, Flex, Spacer , Button, VStack, Text} from '@chakra-ui/react'
import Logo from "../assets/images/website_logo.png"
import { FaTwitter, FaTelegramPlane, FaDiscord } from "react-icons/fa"
import { Icon } from '@chakra-ui/icons';
import { connect } from "../redux/blockchain/blockchainActions";
import { useDispatch, useSelector } from "react-redux";

function Navbar() {
    const [click, setClick] = useState(false);
    const [button, setButton] = useState(true);
    const dispatch = useDispatch();
    const handleClick = () => setClick(!click);
    const closeMobileMenu = () => setClick(false)
    const blockchain = useSelector((state) => state.blockchain);

    const showButton = () => {
        if (window.innerWidth <= 960) {
            setButton(false);
        } else {
            setButton(true);
        }
    };

    useEffect(() => {
        showButton();
    }, []);

    window.addEventListener('resize', showButton);

    return (
        <div>
            <Flex
                bgGradient='linear(to-b, gray.300, #F9A602)'
                w='100%'
                h='14vh'
                spacing='auto'                
                
            >
                <a href="" >          
                    <Image
                        src={Logo}
                        ml='3vw' 
                        mt='3vh'              
                        h='8vh'  
                    />
                </a>
                <Box ml='30vw' mt = '3vh'>
                    {blockchain.account === "" || blockchain.smartContract === null?(
                        <Button borderColor="black" borderRadius='20' boxShadow='lg' variant="outline" 
                        onClick={() => {
                        dispatch(connect())
                        }}>
                        connect
                    </Button>
                    ):(
                        <div>
                        {blockchain.chainId===null?(
                            <Text>Please install Metamask</Text>
                        ):(
                            <div>
                            {blockchain.chainId ?(
                                <VStack>
                                    <Text>Connected</Text>
                                    <Text>{blockchain.account}</Text>
                                </VStack>
                            ):(
                                <Text>Please change network to ONENG</Text>
                            )}
                            </div>
                        
                        )}
                        </div>
                        
                    )}
                </Box>
                
                
                <Spacer />
                
                <HStack >
                    
                    <Spacer />
                    <Box
                        align='center'
                        w='4vw'
                        fontSize='3xl'
                        fontWeight='semibold'
                        p='3'
                        borderRadius='xl'
                        _hover={{ borderRadius: 'xl', fontSize: '4xl' }}
                    >
                        <a href=''>
                            <Icon as={FaTwitter} />
                        </a>
                    </Box>
                    <Box
                        align='center'
                        w='4vw'
                        fontSize='3xl'
                        fontWeight='semibold'
                        p='3'
                        borderRadius='xl'
                        _hover={{ borderRadius: 'xl', fontSize: '4xl' }}
                    >
                        <a href=''>
                            <Icon as={FaTelegramPlane} />
                        </a>
                    </Box>
                    <Box
                        align='center'
                        w='4vw'
                        fontSize='3xl'
                        fontWeight='semibold'
                        p='3'
                        borderRadius='xl'
                        _hover={{ borderRadius: 'xl', fontSize: '4xl' }}
                    >
                        <a href=''>
                            <Icon as={FaDiscord} />
                        </a>
                    </Box>
                </HStack>
            </Flex>

        </div>
    )
}

export default Navbar
