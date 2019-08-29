// Generated by https://quicktype.io

export interface SettingsInterface {
  blockedNodes: any[]
  country: string
  localCurrency: string
  mispaymentBuffer: number
  paymentDataInQR: boolean
  refundPolicy: string
  shippingAddresses: any[]
  showNotifications: boolean
  showNsfw: boolean
  smtpSettings: SMTPSettings
  storeModerators: any[]
  termsAndConditions: string
  version: string
}

export interface SMTPSettings {
  notifications: boolean
  password: string
  recipientEmail: string
  senderEmail: string
  serverAddress: string
  username: string
}
