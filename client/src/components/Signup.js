import React, { useState , useContext} from 'react'
import { Card , Form , Input , Divider , Button , message} from 'antd'
import { useLoginMutation , useGoogleLoginMutation} from '../services/nodeApi';
import LoadingBar from 'react-top-loading-bar'
import appContext from '../context/appContext';
import { auth, provider } from '../firebase';
import {signInWithPopup} from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

export default function Signup() {
  const [form1] = Form.useForm();
  const [form2] = Form.useForm();

  const navigate = useNavigate();

  const { Cookies } = useContext(appContext);
  const [login] = useLoginMutation();
  const [loading , setLoading]= useState(false);
  const [progress , setProgress]= useState(0);

  const [googleLogin] = useGoogleLoginMutation();

  const handleLogin = async({email,password}) => {
    try{
      setLoading(true);
      setProgress(20)
      const res = await login({
        email,password
      })
      setProgress(50);
    if(res.data.status === "success"){
      setLoading(false);
      Cookies.set("jwt", res.data.token);
      form1.resetFields();
      message.success("Login successful")
      setProgress(100);
    }
  }catch(err){
    setLoading(false);
    setProgress(100);
    message.error("Incorrect email or password")
    console.log(err.response.data.message)
  }
  };

  const handleSignup = (values) => {
    console.log('Success:', values);
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  }

  const handleGoogleSignin = async() =>{
    try {
      const res = await signInWithPopup(auth, provider);
      const res1= await googleLogin({
        name: res.user.displayName,
        email: res.user.email,
        photo: res.user.photoURL
      })
      if(res1.data.status==="success"){
        Cookies.set('jwt', res1.data.token);
        navigate('/dashboard');
      }

    } catch (err) {
      console.log(err);
    }
    
  }

  return (
    <>
    <LoadingBar
        color='#f11946'
        progress={progress}
        onLoaderFinished={() => setProgress(0)}
      />
    <Card
    bordered
    className='p-4'
      style={{
        width: 600,
        height:'80vh',
        marginLeft:'22rem',
        borderRadius:'10px'
      }}
    >
      <div className='pt-4'>
      <div className='text-center pb-3' style={{fontSize:'1.5rem'}}>
        Sign in
        </div>
     <Form
     form={form1}
     size='medium'
      name="basic"
      initialValues={{
        remember: false,
      }}
      onFinish={handleLogin}
      onFinishFailed={onFinishFailed}
      autoComplete="off"
    >
      <Form.Item
        name="email"
        autoComplete="true"
        remember="true"
        hasFeedback
        rules={[
          {
            type: 'email',
            message: 'The input is not valid E-mail!',
          },
          {
            required: true,
            message: 'Please input your E-mail!',
          },
        ]}
      >
        <Input placeholder='Email'/>
      </Form.Item>
      <Form.Item
        name="password"
        rules={[
          {
            required: true,
            message: 'Please input your password!',
          },
        ]}
      >
        <Input.Password placeholder='Password'/>
      </Form.Item>
      <Form.Item style={{width:50 , marginLeft:'auto', marginRight:'auto'}}
      >
        <Button htmlType="submit" loading={loading}
        style={{color:"#44CBB1" , border:'1px solid #44CBB1'}}
        >
          Sign in
        </Button>
      </Form.Item>
    </Form>
    </div>

    <Divider>or</Divider>
    <div className='' style={{width:130, marginLeft:'auto', marginRight:'auto'}}>
    <Button onClick={handleGoogleSignin}
        style={{color:"#44CBB1" , border:'1px solid #44CBB1'}}
        >
          Sign in with Google
        </Button>
    </div>
    <Divider>or</Divider>

    <div>
    <div className='text-center pb-3' style={{fontSize:'1.5rem'}}>
        Sign up
    </div>
    <Form
     form={form2}
     size='medium'
      name="basic1"
      initialValues={{
        remember: false,
      }}
      onFinish={handleSignup}
      onFinishFailed={onFinishFailed}
      autoComplete="off"
    >
      <Form.Item
        name="username"
        rules={[
          {
            required: true,
            message: 'Please input your username!',
          },
        ]}
      >
        <Input placeholder='Username'/>
      </Form.Item>
      <Form.Item
        name="email"
        hasFeedback
        rules={[
          {
            type: 'email',
            message: 'The input is not valid E-mail!',
          },
          {
            required: true,
            message: 'Please input your E-mail!',
          },
        ]}
      >
        <Input placeholder='Email'/>
      </Form.Item>
      <Form.Item
        name="password"
        hasFeedback
        rules={[
          {
            required: true,
            message: 'Please input your password!',
          }, 
        ]}
      >
        <Input.Password placeholder='Password'/>
      </Form.Item>

      <Form.Item
        name="confirm"
        dependencies={['password']}
        hasFeedback
        rules={[
          {
            required: true,
            message: 'Please confirm your password!',
          },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue('password') === value) {
                return Promise.resolve();
              }
              return Promise.reject(new Error('The two passwords that you entered do not match!'));
            },
          }),
        ]}
      >
        <Input.Password placeholder='Confirm Password'/>
      </Form.Item>
      <Form.Item style={{width:50 , marginLeft:'auto', marginRight:'auto'}}
      >
        <Button htmlType="submit"
        style={{color:"#44CBB1" , border:'1px solid #44CBB1'}}
        >
          Sign up
        </Button>
      </Form.Item>
    </Form>

    </div>
    </Card>
    </>
  )
}
