import { gql } from '@apollo/client'

export const MARK_NOTIFICATION_AS_READ_MUTATION = gql`
  mutation MarkNotificationAsRead($_id: ID!) {
    markNotificationAsRead(_id: $_id) {
      _id
      read
    }
  }
`

export const MARK_ALL_NOTIFICATIONS_AS_READ_MUTATION = gql`
  mutation MarkAllNotificationsAsRead {
    markAllNotificationsAsRead
  }
`
