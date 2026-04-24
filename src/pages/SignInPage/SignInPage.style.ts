import styled from '@emotion/styled'
import { Link } from 'react-router-dom'

export const AuthPage = styled.main`
  display: grid;
  place-items: center;
  min-height: 100vh;
  padding: 24px;
`

export const AuthSection = styled.section`
  width: min(100%, 420px);
  padding: 32px;
  border: 1px solid #d8def0;
  border-radius: 24px;
  background: rgba(255, 255, 255, 0.94);
  text-align: center;
`

export const AuthTitle = styled.h1`
  margin: 0;
`

export const AuthText = styled.p`
  margin: 12px 0 0;
  color: #64748b;
`

export const AuthActions = styled.div`
  display: flex;
  justify-content: center;
  gap: 12px;
  margin-top: 24px;
  flex-wrap: wrap;
`

export const AuthLink = styled(Link)`
  min-height: 44px;
  padding: 10px 16px;
  border: 1px solid #d8def0;
  border-radius: 14px;
  background: #ffffff;
  font-weight: 600;
`
