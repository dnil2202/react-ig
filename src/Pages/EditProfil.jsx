import { Avatar, Button, Container, Input, Stack , Text, Textarea, useToast} from '@chakra-ui/react'
import React, { useState, useEffect, useRef } from 'react'
import Navbar from '../component/Navbar'
import { useNavigate } from 'react-router-dom';
import { useSelector,useDispatch } from 'react-redux';
import axios from 'axios';
import { API_URL } from '../helper';
import { UpdateProfile } from '../action/useraction';

const EditProfil = () => {
    const navigate = useNavigate()
    const toast = useToast()
    const dispatch = useDispatch()

    const [newFullname,setNewFullName]=useState('')
    const [newUsername,setNewUserName]=useState('')
    const [newBio,setNewBio]=useState(' ')
    const [addAvatar,setAddAvatar]=useState('')
    const hiddenFileInput = useRef(null)

    


    const{id,fullname,username,bio,email,images} = useSelector((state)=>{
        return{
            id:state.userReducer.idusers,
            fullname:state.userReducer.fullname,
            username:state.userReducer.username,
            email:state.userReducer.email,
            images:state.userReducer.images,
            bio:state.userReducer.bio,
        }
    })

    console.log(bio)
    console.log(newBio.length)



    const updateData =()=>{
        let formData = new FormData()
        if(addAvatar.length>0){
            formData.append('data',JSON.stringify({
                fullname: newFullname.length>0?newFullname:fullname,
                username:newUsername.length>0?newUsername:username,
                bio:newBio.length>0?newBio:bio,
            }))
            formData.append('images',addAvatar)
        }else{
            formData.append('data',JSON.stringify({
                fullname: newFullname.length>0?newFullname:fullname,
                username:newUsername.length>0?newUsername:username,
                bio:newBio.length>1?newBio:bio,
                // email:newEmail,
            }))
            formData.append('images',addAvatar)
        }
        axios.patch(API_URL+`/auth/all/${id}`,formData)
        .then((res)=>{
            if(res.data.idusers){
                dispatch(UpdateProfile(res.data))
                toast({
                  title:'Update Data Success',
                  status:'success',
                  duration: 2000,
                  isCloseable:true
                })
              }
        }).catch((err)=>{
            console.log(err.response.data.message)
            toast({
                title: err.response.data.message,
                description: err.message,
                status: 'error',
                duration: 2000,
                isClosable: true,
              })
        })
    } 

    const handleClick = event => {
        hiddenFileInput.current.click();
      };


  return (
    <div>
        <Navbar/>
        <div style={{backgroundColor:'#F6F7F9', paddingTop:'20px', height:'100vh'}}>
            <Container maxWidth={'container.sm'} bg={'white'} borderColor={'aqua'} border={'1px'}>
                <div className='row'>
                    <div className='col-4 border-end border-dark' >
                        <Button border={'none'} size={'sm'} _hover={'none'} mb={'5'} bg={'white'}  >Edit Profile</Button>
                        <Button border={'none'} size={'sm'} _hover={'none'} bg={'white'} textColor={'gray'} onClick={()=>navigate('/change')}>Change Password</Button>
                    </div>
                    <div className='col-8'>
                        <div className='d-flex mx-5 mt-3 '>
                            <Avatar size={'md'} src={API_URL+images} ></Avatar>
                            <div>
                            <Text fontSize={'sm'} className='fw-bold' ms={5}>{fullname}</Text>
                            <Input variant={'flushed'} size={'xs'} ref={hiddenFileInput} onChange={(e)=>setAddAvatar(e.target.files[0])} style={{display:'none'}} type='file'/>
                            <Button size={'xs'} variant={'unstyled'} ms={5} color={'blue.400'} className='fw-bold' onClick={handleClick} >Select Picture</Button>
                            </div>
                        </div>
                        <div className='  mt-3 w-100' >
                            <div className='d-flex justify-content-center mb-4'>
                                <Text className='fw-bold' fontSize={'sm'}>Nama</Text>
                                <Input size={'sm'} ms={12} w={'60'} bg={'gray.200'} defaultValue={fullname} onChange={(e)=>setNewFullName(e.target.value)} />
                            </div>
                            <div className='d-flex justify-content-center mb-4'>
                                <Text className='fw-bold' fontSize={'sm'}>User Name</Text>
                                <Input size={'sm'} w={'60'} ms={3} bg={'gray.200'} defaultValue={username} onChange={(e)=>setNewUserName(e.target.value)} />
                            </div>
                            <div className='d-flex justify-content-center mb-4'>
                                <Text className='fw-bold' fontSize={'sm'}>Email</Text>
                                <Input size={'sm'} w={'60'} ms={12} bg={'gray.200'} defaultValue={email} isDisabled />
                            </div>
                            <div className='d-flex justify-content-center mb-4'>
                                <Text className='fw-bold' fontSize={'sm'}>Bio</Text>
                                <Textarea size={'sm'} w={'60'} ms={14} bg={'gray.100'} defaultValue={bio} resize={'none'} onChange={(e)=>setNewBio(e.target.value)}  />
                            </div>
                        </div>
                        <div className='d-flex justify-content-center'>
                            <Button colorScheme={'messenger'} size={'sm'} mb={10}  onClick={updateData}>Submit</Button>
                        </div>
                    </div>
                </div>
            </Container>
            
        </div>
    </div>
  )
}

export default EditProfil