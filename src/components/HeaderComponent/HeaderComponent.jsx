import React, { useEffect, useState } from 'react'
import { WrapperContentPopup, WrapperHeader, WrapperHeaderAccout, WrapperTextHeader, WrapperTextHeaderSmall } from './style'
import { Badge, Col, Popover } from 'antd'
import ButttonInputSearch from '../ButtonInputSearch/ButttonInputSearch';
import { useDispatch, useSelector } from 'react-redux'
import * as UserService from '../../services/UserService'

import {
    UserOutlined,
    CaretDownOutlined,
    ShoppingCartOutlined
  } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { resetUser } from '../../redux/slides/userSlide';
import Loading from '../LoadingComponent/Loading';
import { searchProduct } from '../../redux/slides/productSlide';
const HeaderComponent = ({ isHiddenSearch=false, isHiddenCart=false}) => {
  const user = useSelector((state) => state.user)
  const [loading, setLoading] = useState(false)
  const [userName, setUserName] = useState('')
  const [userAvatar, setUserAvatar] = useState('')
  const [search,setSearch] = useState('')
  const [isOpenPopup, setIsOpenPopup] = useState(false)
  const order = useSelector((state) => state.order)
  const dispatch = useDispatch();
  const navigate = useNavigate()
  const handleNavigateLogin = () => {
    navigate('/sign-in')
  }
  const handleLogout= async ()=>{
    setLoading(true)
    await UserService.logoutUser()
    dispatch(resetUser())
    setLoading(false)
  }

  useEffect(() => {
    setLoading(true)
    setUserName(user?.name)
    setUserAvatar(user?.avatar)
    setLoading(false)
  }, [user?.name,user?.avatar])
  const content = (
    <div>
      
      <WrapperContentPopup onClick={() => handleClickNavigate('profile')}>Thông tin người dùng</WrapperContentPopup>
      {user?.isAdmin && (
        <WrapperContentPopup onClick={() => handleClickNavigate('admin')}>Quản lí hệ thống</WrapperContentPopup>
      )}
        <WrapperContentPopup onClick={() => handleClickNavigate('my-order')}>Đơn hàng của tôi</WrapperContentPopup>
      <WrapperContentPopup onClick={() => handleClickNavigate()}>Đăng xuất</WrapperContentPopup>
    </div>
  )
  const handleClickNavigate = (type) => {
    if(type === 'profile') {
      navigate('/profile-user')
    }else if(type === 'admin') {
      navigate('/system/admin')
    }else if(type === 'my-order') {
      navigate('/my-order')
    }else {
      handleLogout()
    }
    setIsOpenPopup(false)
  }


  const onSearch = (e) => {
    setSearch(e.target.value)
    dispatch(searchProduct(e.target.value))
  }

    return (
        <div style={{  heiht: '100%', width: '100%', display: 'flex',background: '#9255FD', justifyContent: 'center' }}>
          <WrapperHeader style={{ justifyContent: isHiddenSearch && isHiddenSearch ? 'space-between' : 'unset' }}>
            <Col span={5}>
              <WrapperTextHeader to='/'>SHOP</WrapperTextHeader>
            </Col>
            {!isHiddenSearch && (
            <Col span={13}>
            <ButttonInputSearch
              size="large"
              bordered={false}
              textButton="Tìm kiếm"
              placeholder="input search text"
              onChange={onSearch}
              backgroundColorButton="#5a20c1"
              />
          </Col>
            )}
            <Col span={6} style={{ display: 'flex', gap: '54px', alignItems: 'center' }}>
            <Loading isLoading={loading}> 
            <WrapperHeaderAccout>
            
            {userAvatar ? (
                <img src={userAvatar} alt="avatar" style={{
                  height: '30px',
                  width: '30px',
                  borderRadius: '50%',
                  objectFit: 'cover'
                }} />
              ) : (
                <UserOutlined style={{ fontSize: '30px' }} />
              )}
                {user?.access_token ? (
                  <>
                 
                 <Popover content={content} trigger="click" open={isOpenPopup}>
                    <div style={{ cursor: 'pointer' }} onClick={() => setIsOpenPopup((prev) => !prev)}>{userName?.length ? userName : user?.email}</div>
                  </Popover>
                </>
                ):(
                <div onClick={handleNavigateLogin} style={{ cursor: 'pointer' }}>
                  <WrapperTextHeaderSmall>Đăng nhập/Đăng ký</WrapperTextHeaderSmall>
                  <div>
                    <WrapperTextHeaderSmall>Tài khoản</WrapperTextHeaderSmall>
                    <CaretDownOutlined />
                  </div>
                </div>
                )}

            </WrapperHeaderAccout>
            </Loading>
            {!isHiddenCart && (
               <div onClick={() => navigate('/order')} style={{cursor: 'pointer'}}>
               <Badge count={order?.orderItems?.length} size="small">
                <ShoppingCartOutlined style={{ fontSize: '30px', color: '#fff' }} />
              </Badge>
              <WrapperTextHeaderSmall>Giỏ hàng</WrapperTextHeaderSmall>
            </div>
            )}
            </Col>
          </WrapperHeader>
        </div>
      )
}

export default HeaderComponent