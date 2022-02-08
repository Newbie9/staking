import React, { useState, useEffect } from 'react'
import { Box, HStack, Image, Flex, Spacer } from '@chakra-ui/react'
import Logo from "../assets/images/website_logo.png"
import { FaTwitter, FaTelegramPlane, FaDiscord } from "react-icons/fa"
import { Icon } from '@chakra-ui/icons';


function Navbar() {
    const [click, setClick] = useState(false);
    const [button, setButton] = useState(true);

    const handleClick = () => setClick(!click);
    const closeMobileMenu = () => setClick(false)

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
                bg='yellow.500'
                w='100%'
                h='16vh'
                spacing='auto'
                
                
            >
                <Spacer />
                <HStack >
                    <Box
                        align='center'
                        w='4vw'
                        fontSize='3xl'
                        fontWeight='semibold'
                        p='3'
                        borderRadius='xl'
                        _hover={{ borderRadius: 'xl', fontSize: '4xl' }}
                    >
                        <a href='https://avaxfoxes.com/'>
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
                        <a href='https://avaxfoxes.com/'>
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
                        <a href='https://avaxfoxes.com/'>
                            <Icon as={FaDiscord} />
                        </a>
                    </Box>
                </HStack>
            </Flex>

        </div>
    )
}

export default Navbar
