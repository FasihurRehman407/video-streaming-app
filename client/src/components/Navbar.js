import React , {useState, useContext, useEffect} from 'react'
import { Drawer, Button ,message,Upload,Input , Dropdown, Form,Menu, Avatar, Modal} from "antd";
import { MenuOutlined,InboxOutlined, PlusOutlined,MinusCircleOutlined , SearchOutlined ,UserOutlined, LogoutOutlined, SettingFilled, VideoCameraOutlined, BellOutlined} from "@ant-design/icons";
import appContext from '../context/appContext';
import { useGetUserQuery } from '../services/nodeApi';
import jwtDecode from 'jwt-decode';
import './css/navbar.css';
import { Link , useNavigate} from 'react-router-dom';
import { getStorage, ref, uploadBytesResumable, getDownloadURL, uploadBytes } from "firebase/storage";
import app from './../firebase.js';

export default function Navbar({menu}) {
  const navigate = useNavigate();
  const {Dragger} = Upload;
  const { Cookies } = useContext(appContext);
  const [visible, setVisible] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [video, setVideo] = useState(undefined);
  const [loading , setLoading]= useState(0);
  let id;
  if(Cookies.get('jwt')){
   id = jwtDecode(Cookies.get('jwt')).id;
  }
  const {data,isLoading} = useGetUserQuery(id);

  const [form] = Form.useForm();

  const uploadVideo = (file)=>{
    const storage = getStorage(app);
    const fileName = 'video' + id + Date.now();
    const storageRef = ref(storage, fileName);
    const uploadVid = uploadBytesResumable(storageRef, file);
    uploadVid.on('state_changed', 
  (snapshot) => {
    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
    setLoading(progress);
    console.log('Upload is ' + progress + '% done');
    switch (snapshot.state) {
      case 'paused':
        // console.log('Upload is paused');
        break;
      case 'running':
        // console.log('Upload is running');
        break;
      default:
        break;
    }
  }, 
  (error) => {
    // Handle unsuccessful uploads
  }, 
  () => {
    getDownloadURL(uploadVid.snapshot.ref).then((downloadURL) => {
      console.log('File available at', downloadURL);
    });
  }
);
}
  const videoProps = {
    name: 'file',
    multiple: false,
    onChange(info) {
      setVideo(info.file);
      const { status } = info.file;
      if (status !== 'uploading') {
      }
  
      if (status === 'done') {
        message.success(`${info.file.name} file uploaded successfully.`);
      } else if (status === 'error') {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
    onDrop(e) {
      setVideo(e.dataTransfer.files[0])
      uploadVideo(e.dataTransfer.files[0]);
    },
    beforeUpload(file) {
      uploadVideo(file);
    },
    accept: '.mp4,.webm,.avi',
    progress: {
      strokeColor: {
        '0%': '#108ee9',
        '100%': '#87d068',
      },
      strokeWidth: 3,
      format: percent => percent && `${parseFloat(percent.toFixed(2))}%`,
    },
  };

  const showModal = () => {
    setIsModalOpen(true);
  };

  const dummyRequest = ({onSuccess}) => {
  onSuccess('ok');
   return true;
  };

  const handleModalOk = () => {
    setIsModalOpen(false);
    form
    .validateFields()
    .then(values => {
    form.resetFields();
    })
    .catch(info => {
    console.log('Validate Failed:', info);
    });
  };

  const handleModalCancel = () => {
    setIsModalOpen(false);
  };

  const handleLogout = () =>{
    Cookies.remove('jwt');
    navigate('/dashboard/signup')
    // window.location.reload();
  }


    const menuu = (
      data&&<Menu style={{width:'15rem', left:'25%'}}
        items={[
          {
            key: '1',
            label: (
              <div className='row'>
                <div className='col-2'>
                 <Avatar size={40} src={data.doc.photo? data.doc.photo : <UserOutlined />}/>
                </div>
                <div className='col-10'>
                  <div className='row'>
                    <div className='col-12'>
                <span className='ps-3 fw-bold'>{data.doc.name}</span>
                    </div>
                  </div>
                  <div className='row'>
                    <div className='col-12'>
                <span className='ps-3'>Manage your account</span>
                    </div>
                  </div>

                </div>
              </div>
            ),
          },
          {
            key: '2',
            label: (
              <span><SettingFilled/> Settings</span>
            ),
          },{
            key: '3',
            label: (
              <div onClick={handleLogout}><LogoutOutlined/> Logout</div>
            ),
          },
        ]}
      />
    );

  return (
    <>
     <Modal title="Upload New Video" open={isModalOpen} onOk={handleModalOk} okText="Upload" onCancel={handleModalCancel}>
     <Form
        form={form}
        layout="vertical"
        name="form_in_modal"
        initialValues={{ modifier: 'public' }}
      >
        <Form.Item
          name="title"
          label="Title"
          rules={[{ required: true, message: 'Please input the title of collection!' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item name="description" label="Description">
          <Input type="textarea" />
        </Form.Item>
        <Form.List name="Tags">
        {(fields, { add, remove }) => (
          <>
            {fields.map(({ key, name, ...restField }) => (
              <div key={key}  style={{
                display: 'flex',
                marginBottom: 8,
                alignItems:'baseline'
              }}>
                <Form.Item
                  {...restField}
                  name={[name, 'tag1']}
                  rules={[
                    {
                      required:true,
                      message: 'Add atleast one tag',
                    },
                  ]}
                >
                  <Input placeholder="Tags" />
                </Form.Item> 
                <Form.Item className='ps-2'
                  {...restField}
                  name={[name, 'tag2']}
                >
                  <Input placeholder="Tags" />
                </Form.Item> 
                <Form.Item className='px-2'
                  {...restField}
                  name={[name, 'tag3']}
                >
                  <Input placeholder="Tags" />
                </Form.Item> 
                <Form.Item className='pe-2'
                  {...restField}
                  name={[name, 'tag4']}
                >
                  <Input placeholder="Tags" />
                </Form.Item>
                <Form.Item
                  {...restField}
                  name={[name, 'tag5']}
                >
                  <Input placeholder="Tags" />
                </Form.Item>
                <MinusCircleOutlined style={{marginLeft:'10px'}} onClick={() => remove(name)} />
              </div>
            ))}
            <Form.Item
             name="Tags"
             label="Tags"
           >
              <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                Add Tags
              </Button>
            </Form.Item> 
            <Form.Item
             name="Video"
             label="Video"
            >
            <Dragger {...videoProps}
            customRequest={dummyRequest}
            >
    <p className="ant-upload-drag-icon">
      <InboxOutlined />
    </p>
    <p className="ant-upload-text">Click or drag video file to this area to upload</p>
  </Dragger>
            </Form.Item>
            <Form.Item
             name="Thumbnail"
             label="Thumbnail"
>           <Dragger 
           multiple={false} 
           accept='.png,.jpeg,.jpg' 
           listType='picture' 
           customRequest={dummyRequest}
           >
           <p className="ant-upload-drag-icon">
      <PlusOutlined />
    </p>
    <p className="ant-upload-text">Click or drag image file to this area to upload</p>
           </Dragger>
            </Form.Item>
            
          </>
        )}
      </Form.List>
      </Form>
      </Modal>
     <nav className="navbarr fixed-top" style={{borderBottom:'1px solid rgb(240,240,240)',zIndex:1}}>
      <Button
        className="menu"
        type="primary"
        icon={<MenuOutlined />}
        onClick={() => setVisible(true)}
      />
      <Drawer
        title="Topics"
        placement="left"
        onClick={() => setVisible(false)}
        onClose={() => setVisible(false)}
        open={visible}
      > 
        {menu}
     </Drawer>

     <div className='row'>
      <div className='col-3'>
      <a href="/"><img src={require('./../img/navlogo.png')} className="logo" alt="logo" /></a> 
      </div>
      <div className='col-6 test'>
      <Input size='large' addonAfter={<SearchOutlined style={{paddingBottom:'5px'}} />} placeholder="Type to starting searching..." /> 
      </div>
      <div className='col-3 text-end'>
        {data ?
        <>
          <div>
        <VideoCameraOutlined onClick={showModal} style={{paddingRight:'2rem', fontSize:'1.3rem' , cursor:'pointer'}}/>
        <BellOutlined style={{paddingRight:'2rem', fontSize:'1.3rem'}}/>
        <Dropdown overlay={menuu} className='nav_drop' trigger="click">
        <Avatar size="large" src={data.doc.photo? data.doc.photo : <UserOutlined />} style={{marginRight:'4rem'}}  />
      </Dropdown>
        </div>
      </>:
      <Link to="/dashboard/signup">
      <Button icon={<UserOutlined/>} style={{color:"#44CBB1" , border:'1px solid #44CBB1'}}>Sign up</Button>
        </Link>
}
      </div>
     </div>
    </nav>
    </>
  )
}
