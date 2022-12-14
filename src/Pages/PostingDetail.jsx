import React, {useState,useEffect,useRef} from 'react'
import Navbar from '../component/Navbar'
import { useLocation,useNavigate } from 'react-router-dom' 
import { Avatar, 
  Box, 
  Button, 
  Container, 
  Divider, 
  useToast, 
  Text, 
  Image, 
  Textarea,
  MenuButton,
  MenuList,
  MenuItem,
  Menu,
  Modal,
  Input,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
} from '@chakra-ui/react'
import { API_URL } from '../helper'
import axios from 'axios'
import { useSelector } from 'react-redux'
import { AiOutlineMenu } from 'react-icons/ai'
import { AiFillLike,AiOutlineLike} from "react-icons/ai";
import {FcCheckmark} from "react-icons/fc";
import {MdCancel} from "react-icons/md";

const PostingDetail = () => {
  const {state} = useLocation()
  const toast = useToast()
  const[toggleEdit,setToggleEdit]=useState(false)
  const[updateCaption, SetUpdateCaption]=useState('')
  const navigate = useNavigate()

    // state posting
    const [img,setImg]=useState()
    const [caption,setCaption]=useState('')
    const hiddenFileInput = useRef(null)
    const [toggle, setToggle]=useState(false)

  const [addComment, setAddComment]=useState('')
  const [detail, setDetail] = useState('');
  const [fetchStatus,setFetchStatus]=useState(true)

  const [limit,setLimit]=useState(5)
  const [more,setMore]=useState(true)
  
  
  const {id,username}= useSelector((state)=>{
    return{
      id : state.userReducer.idusers,
      username : state.userReducer.username,
    }
  })

 
useEffect(()=>{
  if(fetchStatus){
    axios.get(API_URL + `/posting/${state.idposting}?page=1&pageSize=${limit}`)
    .then((res) => {
      setDetail(res.data[0])
      if(res.data[0].comment){
        setMore(res.data[0].comment.length === limit ? true: false)
      }else{
        setMore(false)
      }
        
    }).catch((err) => {
        console.log(err);
    })
    setFetchStatus(false)
  }
},[fetchStatus,state]);
  

  const submitComment =(e)=>{
    axios.post(API_URL + '/comment',{
      comment:addComment,
      user_comment_id:id,
      posting_id:state.idposting
    }).then((res)=>{
      if(res.data.success){
        setFetchStatus(true)
        setAddComment('')
        toast({
          title: "Comment Submited",
          description: `Comment Success`,
          status: "success",
          duration: 3000,
          isClosable: true
      })
      }
    }).catch((err)=>{
      toast({
        title: err.response.data.message,
        description: err.message,
        status: 'error',
        duration: 2000,
        isClosable: true,
      })
    })
  }

const updatePosting =()=>{
    axios.patch(API_URL+`/posting/${state.idposting}`,{
        caption:updateCaption
    })
    .then((res)=>{
        if(res.data.success){
          setFetchStatus(true)
            toast({
                title:"Updated Caption",
                desctiption: "Updated Caption",
                status:"success",
                duration:5000,
                isClosable:true
            })
            setToggleEdit(!toggleEdit)
        }
    }).catch((err)=>{
        toast({
            title:`${err}`,
            desctiption: 'eror',
            status:"warning",
            duration:3000,
            isClosable:true
        })
    })
    
}

const deletePosting = ()=>{
  axios.delete(API_URL+`/posting/${state.idposting}`)
  .then((res)=>{
    setFetchStatus(true) 
    toast({
      title: 'Your posting has deleted',
      description: `success delete`,
      status: 'success',
      duration: 3000,
      isCloseable: true,
    })
    navigate('/profil')       
  })
  .catch((err)=>{
      toast({
          title: 'Error Deleted',
          description: err.message,
          status: 'error',
          duration: 2000,
          isClosable: true,
      });
  })
}

const getMoreComment = () => {
  setLimit(prev=> prev + 5)
  setFetchStatus(true)
}

const submitLike =(idposting)=>{
  let idLike = parseInt(idposting)
  console.log(idLike)
    axios.post(API_URL+'/like',{
      postId:idLike,
      userId:id,
    }).then((res)=>{
      setFetchStatus(true)
      console.log(res.data)
    }).catch((err)=>{
      console.log(err)
    })
}

const deleteLike =(idLike)=>{
    let id = parseInt(idLike)
  axios.delete(API_URL+`/like/${id}`)
  .then((res)=>{
    console.log(res)
    setFetchStatus(true)
  }).catch((err)=>{
    console.log(err)
  })
}

// Post Posting

const submitPosting = ()=>{
  let formData = new FormData();
  formData.append('data',JSON.stringify({
    caption,
    users_id:id
  }))
  formData.append('images',img)
  axios.post(API_URL+`/posting`,formData).then((res)=>{
    if(res.data.success){
      toast({
        title:'Posting Submited',
        status:'success',
        duration: 2000,
        isCloseable:true
      })
      setFetchStatus(true)
      setToggle(!toggle)
    }
  })
  .catch((err)=>{
    console.log(err)
    toast({
      title: 'Error submitted',
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

const imgChange =((e)=>{
  if (e.target.files && e.target.files.length > 0) {
    setImg(e.target.files[0]);
  }
})

const removeImg = () => {
  setImg();
};


let addLike
  return (
      <div>
        <Navbar
         onClickOpenModal={()=>{
          setToggle(true)
        }}
        />
        <div style={{backgroundColor:'#F6F7F9', paddingTop:'10px', height:'100vh'}}>
            <Container  maxW={'3xl'} >
              <div>
              <div className='row shadow'>
                <div className='col-7' >
                  <div>
                  <Image boxSize={'lg'} ms={3}  src={API_URL+detail.images} />
                  </div>
                </div>
                <Box className='col-5 card'>
                  <div className='d-flex justify-content-between'>
                    <div className='d-flex mt-3'>
                  <Avatar size={'sm'}  src={API_URL+detail.avatar}/>
                  <Text fontFamily={'serif'} fontSize={'sm'} mt={1} ms={2}>{detail.user_name_post}</Text>
                    </div>
                    {
                      username === state.user_name_post ?
                      <div>
                        <Menu>
                        <MenuButton>
                            <AiOutlineMenu className='mt-4'/>
                        </MenuButton>
                        <MenuList width={'fit-content'}>
                          <MenuItem >Share content</MenuItem>
                          <MenuItem onClick={()=>setToggleEdit(!toggleEdit)}>Edit Caption</MenuItem>
                          <MenuItem onClick={deletePosting}>Delete</MenuItem>
                        </MenuList>
                        </Menu>
                      </div>
                      :
                      <div>
                      <Menu size={60}>
                      <MenuButton>
                          <AiOutlineMenu className='mt-4'/>
                      </MenuButton>
                      <MenuList width={'fit-content'}>
                        <MenuItem >Share content</MenuItem>
                      </MenuList>
                      </Menu>
                    </div>

                
                    }
                  </div>
                  <Divider mt={3}/>
                  <div>
                    {toggleEdit ?
                     <div>
                     <Textarea onChange={(e)=>SetUpdateCaption(e.target.value)}  defaultValue={detail.caption}/>
                     <Button size={'sm'} onClick={updatePosting} me={5} variant={'unstyled'} isDisabled={updateCaption.length<1} ><FcCheckmark size={20}/></Button>
                     <Button size={'sm'} variant={'unstyled'} onClick={()=>setToggleEdit(!toggleEdit)}><MdCancel color={'red'} size={20}/></Button>
                 </div>
                 :
                    <Text fontFamily={'serif'} fontSize={'md'}>{detail.caption}</Text>
                    }
                    <Text fontSize={'xs'} className='text-muted mb-4'>{state.add_date.split('').splice(0,10).join('')}</Text>
                    <Box className='overflow-auto' maxHeight={'200px'}>
                    <div className='my-4 overflow-auto'>
                    {
              detail.comment &&
              detail.comment.map((v)=>{
                return  (
                <div className='mt-2'>
                <Text as={'sup'} className='fw-bold me-2'>{v.user_name_comment}</Text>
                <Text as={'sup'} className='text-muted'>{v.comment}</Text>
                </div>
                )
              })
            }{
              more ? 
              <Button variant={'none'} size={'xs'} onClick={getMoreComment} className='text-muted fw-bold' >see more comment</Button>
              :
              ''
            }
                    </div>
                    </Box>
                    <Divider color={'gray.100'}/>
            <div>
              {
                detail.likes &&
                detail.likes.map((v)=>{
                  if(v.idusers === id){
                    addLike = v
                  }
                })
              }
                {
              addLike ? (
            <Button variant={'unstyled'}  onClick={()=>{deleteLike(addLike.id)}} >
              <AiFillLike/>
            </Button> 
              ) : (
                <Button variant={'unstyled'}  onClick={()=>{submitLike(state.idposting)}} >
              <AiOutlineLike/>
            </Button>
              )
            }
            </div>
            <div>
            {
              detail.likes &&
            detail.likes ?
            <Text as={'sup'} className='fw-bold' >{detail.likes.length} Likes</Text>
            :
            <Text as={'sup'} className='fw-bold' >0 Likes</Text>
          }
          </div>
          <div className='footer' >
          <Divider color={'gray.100'}/>
          <div className='d-flex card-footer bg-white'>
            <Textarea size={'sm'} placeholder='Add Comment' variant={'unstyled'} resize={'none'} onChange={(e)=>setAddComment(e.target.value)} value={addComment} />
            <Button variant={'ghost'} size={'xs'} mt={10} textColor={'blue'} isDisabled={addComment.length<1} value={detail.idposting} onClick={submitComment} >POST</Button>
          </div>
          {
            addComment.length >0 &&
            <Text as={'sup'} className={'text-muted'}>{addComment.length}/ 300 Character</Text>
          }
          </div>
                  </div>
                </Box>
              </div>
              </div>
            </Container>
                {/* MODAL POST POSTING */}
     <Modal isOpen={toggle} onClose={()=>setToggle(!toggle, setImg())} size={'xl'} >
          <ModalOverlay/>
          <ModalContent background={'whiteAlpha.800'}>
            <ModalHeader>Add Your Image</ModalHeader>
            <ModalCloseButton/>
            <ModalBody>
              <div className='row'>
                <div className=''>
              <div className=''>
                <div className='d-flex justify-content-center'>
                </div>
                <div className='d-flex justify-content-center'>
              <Image src={img ? URL.createObjectURL(img) : 'https://pertaniansehat.com/v01/wp-content/uploads/2015/08/default-placeholder.png' } 
              boxSize={'lg'}/>
              </div>
              {
                img&&
              <div className='d-flex justify-content-center'>
              <Button  colorScheme={'red'} onClick={removeImg} bg={'red.600'}>Remove</Button>
              </div>
              }
              </div>
              {!img &&
              <div className='d-flex justify-content-center'>
                <Input variant={'flushed'} mt={3} ref={hiddenFileInput} display={'none'} accept='image/*'onChange={imgChange} type='file'/>
                <Button onClick={handleClick} colorScheme={'telegram'}> Select Picture</Button>
              </div>
              
              }
                </div>
                <div className=''>
                  <Box size={100}  >
                    {
                      img &&
                      <Textarea placeholder='Write Caption' bg={'white'} resize={'none'} mt={10} maxH={'400px'}   border={'none'}  className='border-0' onChange={(e)=>setCaption(e.target.value)} type='text' />
                    }
                  </Box>
                  </div>
              </div>
            </ModalBody>
            <ModalFooter>
              {
                img &&
              <Button colorScheme={'teal'} type='submit' onClick={submitPosting}>
                Submit
              </Button>
              }
            </ModalFooter>
          </ModalContent>
        </Modal>
        </div>
    </div>
  )
}

export default PostingDetail