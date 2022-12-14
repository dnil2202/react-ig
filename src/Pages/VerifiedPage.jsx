import { Container, Box, Text, Heading, Input, Button,useToast } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import Footer from '../component/footer'
import {BiMailSend} from 'react-icons/bi'
import { Link, useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'
import { API_URL } from '../helper'
import { useDispatch,useSelector } from 'react-redux'
import { loginAction } from '../action/useraction'

const VerifiedPage = () => {
    const params = useParams()
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const toast = useToast()
    const [isValidToken, setIsValidToken] = useState(false)
    const [email,setEmail]=useState('')


    
    useEffect(()=>{
        handleVerified()
    }, [])
    
    const handleVerified = async()=>{
        try {
            let res = await axios.patch(`${API_URL}/auth/verified`,{},{
                headers:{
                    'Authorization':`Bearer ${params.token}`
                }
            })
                if(res.data.success){
                    localStorage.setItem('sosmed', res.data.dataLogin.token);
                    delete res.data.dataLogin.token;
                    dispatch(loginAction(res.data.dataLogin))
                    // navigate('/home',{replace:true})
                    setIsValidToken(true)
                }else {
                    alert('Verification Failed')
                }
            
        } catch (error) {
            if(error.response.status === 401 && error.code === 'ERR_BAD_REQUEST'){
                setIsValidToken(false)
            }
            console.log(error.response.status)
        }
    }

    const resendVerif = async ()=>{
        try {
            await axios.post(`${API_URL}/auth/resend/`,{
                email:email
            }).then((res)=>{
                setIsValidToken(true)
                toast({
                    title:"Succes please cek your email",
                    desctiption: `Welcome ${res.data.username}`,
                    status:"success",
                    duration:5000,
                    isClosable:true
                })
            })
        } catch (error) {
            console.log(error)
        }

    }

  return (
    <div style={{backgroundColor:'#F6F7F9'}} >
        <Container style={{backgroundSize:'cover', height:'100vh'}} pt={20} >
        <Container border={'1px'} borderColor={'gray.400'} backgroundColor={'white'} boxSize={'xs'} >
            {
                isValidToken ? (
                    <>
                    <div className=''>
                        <div className='d-flex justify-content-center'>
                            <BiMailSend size={100}></BiMailSend>
                        </div>
                            <Heading textAlign={'center'} size={'md'}>Account has been verfied!</Heading>
                            <Text textAlign={'center'} fontSize={'sm'} mt={'3'} className='text-muted'>Click button on bellow to continue to Home </Text>
                            <Link to='/home' className='d-flex justify-content-center'>
                                <Button colorScheme={'telegram'}>Go to Home</Button>
                            </Link>
                        </div>
                    </>
                ) : (
                    <>
                        <div className=''>
                            <div className='d-flex justify-content-center'>
                            <BiMailSend size={100}></BiMailSend>
                            </div>
                            <Heading textAlign={'center'} size={'md'}>Uppss Email has been expired</Heading>
                            <Text textAlign={'center'} fontSize={'sm'} mt={'3'} className='text-muted'>Email that we sent to you has been expired, cek your email for new verivication link or go to profile for resend verification link </Text>
                            {/* <Input onChange={(e)=>setEmail(e.target.value)}/> */}
                            <div className='d-flex justify-content-center mt-3'>
                            {/* <Button colorScheme={'telegram'} onClick={resendVerif} >Resend Email</Button> */}
                            </div>
                        </div>
                    </>
                )
            }
        </Container>
        </Container>
        <Footer/>
    </div>
  )
}

export default VerifiedPage