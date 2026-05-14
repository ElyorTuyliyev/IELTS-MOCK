import { useMemo, useState } from 'react'
import { Box, Typography } from '@mui/material'
import { Button } from '../../../components/common/Button'

import { SearchField } from '../../../components/common/SearchField'
import { Layout } from '../../../components/layout'
import { PaymentsPageRoot } from './PaymentsPage.style'

type InvoiceStatus = 'Paid' | 'Unpaid' | 'Overdue'

type InvoiceRow = {
  id: string
  issueDate: string
  clientName: string
  status: InvoiceStatus
  assignedStaff: string
  service: string
  price: string
}

const invoiceStats = [
  { label: 'In Transit', value: '$2,307.40', meta: 'Last update: Jan 24' },
  { label: 'Total Paid', value: '$34,307.40', meta: 'Last update: Jan 24' },
  { label: 'Total Unpaid', value: '$34,307.40', meta: 'Last update: Jan 24' },
  { label: 'Total Overdue', value: '$256.87', meta: 'Last update: Jan 24' },
]

const invoiceRows: InvoiceRow[] = [
  {
    id: 'P10001',
    issueDate: 'Feb 14, 2025',
    clientName: 'James Anderson',
    status: 'Paid',
    assignedStaff: 'Bessie Cooper',
    service: 'Diagnostic Evaluation',
    price: '$160.00',
  },
  {
    id: 'P10002',
    issueDate: 'Apr 22, 2025',
    clientName: 'Alexander Ivanov',
    status: 'Paid',
    assignedStaff: 'Leslie Alexander',
    service: 'Company ITD Solution',
    price: '$267.00',
  },
  {
    id: 'P10003',
    issueDate: 'Apr 22, 2024',
    clientName: 'Hugo Fernandez',
    status: 'Overdue',
    assignedStaff: 'Ralph Edwards',
    service: 'Appointment Add-on',
    price: '$267.18',
  },
  {
    id: 'P10004',
    issueDate: 'Jun 18, 2025',
    clientName: 'Savannah Nguyen',
    status: 'Unpaid',
    assignedStaff: 'Savannah Nguyen',
    service: 'Standard Appointment',
    price: '$153.30',
  },
  {
    id: 'P10005',
    issueDate: 'Jul 4, 2025',
    clientName: 'Hiroshi Takahashi',
    status: 'Paid',
    assignedStaff: 'Eleanor Pena',
    service: 'Company ITD Solution',
    price: '$178.45',
  },
  {
    id: 'P10006',
    issueDate: 'Sep 5, 2024',
    clientName: 'Christopher Miller',
    status: 'Unpaid',
    assignedStaff: 'Dianne Russell',
    service: 'Diagnostic Evaluation',
    price: '$235.20',
  },
  {
    id: 'P10007',
    issueDate: 'Oct 20, 2024',
    clientName: 'Emily Roberts',
    status: 'Paid',
    assignedStaff: 'Wade Warren',
    service: 'Company ITD Solution',
    price: '$432.12',
  },
]

const statusFilters: Array<'All' | InvoiceStatus> = ['All', 'Paid', 'Unpaid', 'Overdue']

export function PaymentsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<'All' | InvoiceStatus>('All')

  const filteredRows = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase()

    return invoiceRows.filter((row) => {
      const matchesStatus = statusFilter === 'All' || row.status === statusFilter
      const matchesSearch =
        normalizedSearch.length === 0 ||
        row.id.toLowerCase().includes(normalizedSearch) ||
        row.clientName.toLowerCase().includes(normalizedSearch) ||
        row.service.toLowerCase().includes(normalizedSearch) ||
        row.assignedStaff.toLowerCase().includes(normalizedSearch)

      return matchesStatus && matchesSearch
    })
  }, [searchTerm, statusFilter])

  const getStatusClassName = (status: InvoiceStatus) =>
    `payments-page__status payments-page__status--${status.toLowerCase()}`

  return (
    <Layout>
      <PaymentsPageRoot>
        <Box className="payments-page">
          <Box className="payments-page__header">
            <Typography component="h1" className="payments-page__title">
              Invoices
            </Typography>

            <Box className="payments-page__actions">
              <Button className="payments-page__button" variant="secondary">
                Export
              </Button>
              <Button className="payments-page__button" variant="secondary">
                Import
              </Button>
              <Button className="payments-page__button" variant="primary">
                + New Invoice
              </Button>
            </Box>
          </Box>

          <Box className="payments-page__stats">
            {invoiceStats.map((stat) => (
              <Box key={stat.label} className="payments-page__stat">
                <Typography component="p" className="payments-page__stat-label">
                  {stat.label}
                </Typography>
                <Typography component="h2" className="payments-page__stat-value">
                  {stat.value}
                </Typography>
                <Typography component="p" className="payments-page__stat-meta">
                  {stat.meta}
                </Typography>
              </Box>
            ))}
          </Box>

          <Box className="payments-page__panel">
            <Box className="payments-page__filters">
              <Box className="payments-page__chips">
                {statusFilters.map((item) => (
                  <Button
                    key={item}
                    className={`payments-page__chip ${statusFilter === item ? 'payments-page__chip--active' : ''}`}
                    variant={statusFilter === item ? 'primary' : 'secondary'}
                    onClick={() => setStatusFilter(item)}
                  >
                    {item}
                  </Button>
                ))}
              </Box>

              <Box className="payments-page__tools">
                <SearchField
                  className="payments-page__search"
                  size="small"
                  showIcon={false}
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                />
                <Button className="payments-page__button" variant="secondary">
                  Filter
                </Button>
              </Box>
            </Box>

            <Box className="payments-page__table-wrap">
              <table className="payments-page__table">
                <thead>
                  <tr>
                    <th>Invoice ID</th>
                    <th>Issue Date</th>
                    <th>Client Name</th>
                    <th>Status</th>
                    <th>Assigned Staff</th>
                    <th>Services</th>
                    <th>Price</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRows.map((row) => (
                    <tr key={row.id}>
                      <td>{row.id}</td>
                      <td>{row.issueDate}</td>
                      <td>{row.clientName}</td>
                      <td>
                        <span className={getStatusClassName(row.status)}>{row.status}</span>
                      </td>
                      <td>{row.assignedStaff}</td>
                      <td>{row.service}</td>
                      <td>{row.price}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Box>

            <Box className="payments-page__footer">
              <span>Showing {filteredRows.length} invoices</span>
              <span>Super Admin finance view</span>
            </Box>
          </Box>
        </Box>
      </PaymentsPageRoot>
    </Layout>
  )
}
