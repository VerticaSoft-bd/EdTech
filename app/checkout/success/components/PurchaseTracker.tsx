'use client'

import { useEffect } from 'react'
import * as fp from '@/lib/fpixel'

interface PurchaseTrackerProps {
  amount: number
  courseName: string
  transactionId?: string
}

export default function PurchaseTracker({ amount, courseName, transactionId }: PurchaseTrackerProps) {
  useEffect(() => {
    fp.event('Purchase', {
      value: amount,
      currency: 'BDT',
      content_name: courseName,
      content_type: 'product',
      transaction_id: transactionId,
    })
  }, [amount, courseName, transactionId])

  return null
}
