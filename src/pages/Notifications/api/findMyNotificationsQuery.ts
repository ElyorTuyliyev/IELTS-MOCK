import { gql } from '@apollo/client'

export const FIND_MY_NOTIFICATIONS_QUERY = gql`
  query FindMyNotifications {
    findMyNotifications {
      _id
      title
      message
      category
      href
      read
      createdAt
      updatedAt
    }
  }
`

export type NotificationRecord = {
  _id: string
  title: string
  message: string
  category: string
  href?: string | null
  read: boolean
  createdAt: string
  updatedAt: string
}

export type FindMyNotificationsResponse = {
  findMyNotifications: NotificationRecord[]
}
