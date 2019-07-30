import Axios from 'axios'
import config from '../config'
import Image from '../interfaces/Image'
import Location from '../interfaces/Location'
import { Moderator } from '../interfaces/Moderator'
import {
  Background,
  Contact,
  EducationHistory,
  EmploymentHistory,
  EXTLocation,
  MetaTags,
  Preferences,
  Profile as ProfileSchema,
  Stats,
} from '../interfaces/Profile'

const LOCATION_TYPES = ['primary', 'shipping', 'billing', 'return']

class Profile implements ProfileSchema {
  public static periodParser(e: EducationHistory | EmploymentHistory) {
    if (e.period) {
      e.period.from = new Date(e.period.from)
      if (e.period.to) {
        e.period.to = new Date(e.period.to!)
        if (isNaN(e.period.to.getTime())) {
          delete e.period.to
        }
      }
    }
  }

  public static periodSorter(
    a: EducationHistory | EmploymentHistory,
    b: EducationHistory | EmploymentHistory
  ) {
    if (a.period && b.period) {
      if (a.period.from === b.period.from) {
        return 0
      }
      return a.period.from < b.period.from ? 1 : -1
    }
    return 0
  }

  public static async addToIndex(id: string): Promise<void> {
    await Axios.get(`${config.djaliHost}/djali/peer/add?id=${id}`)
  }

  public static async publish(): Promise<void> {
    await Axios.post(`${config.openBazaarHost}/ob/publish`, {})
  }

  public static async retrieve(id?: string): Promise<Profile> {
    let profile: Profile

    if (id) {
      const peerRequest = await Axios.get(`${config.djaliHost}/djali/peer/get?id=${id}`)
      const peerInfo = peerRequest.data.profile as Profile
      profile = new Profile(peerInfo)
    } else {
      const profileRequest = await Axios.get(`${config.openBazaarHost}/ob/profile`)
      profile = new Profile(profileRequest.data)
      profile.extLocation = profile.processAddresses(profile.extLocation)
    }

    profile!.background!.educationHistory.forEach(Profile.periodParser)

    profile!.background!.educationHistory.sort(Profile.periodSorter)

    profile!.background!.employmentHistory.forEach(Profile.periodParser)

    profile!.background!.employmentHistory.sort(Profile.periodSorter)

    profile.spokenLanguages = ['English', 'Tagalog']
    profile.programmingLanguages = ['Javascript', 'Golang', 'C++']

    return profile
  }

  public about: string = ''
  public avatarHashes: Image = {
    tiny: '',
    small: '',
    medium: '',
    large: '',
    original: '',
  }
  public extLocation: EXTLocation = {
    primary: 0,
    shipping: 0,
    billing: 0,
    return: 0,
    addresses: [
      {
        type: [''],
        latitude: '',
        longitude: '',
        plusCode: '',
        addressOne: '',
        addressTwo: '',
        city: '',
        state: '',
        country: '',
        zipCode: '',
      },
    ],
  }
  public handle: string = ''
  public moderator: boolean = false
  public moderatorInfo: Moderator = {
    description: '',
    termsAndConditions: '',
    languages: [],
    acceptedCurrencies: [],
    fee: {
      fixedFee: {
        currencyCode: '',
        amount: 0,
      },
      percentage: 0,
      feeType: 'FIXED',
    },
  }
  public name: string = ''
  public nsfw: boolean = false
  public vendor: boolean = true
  public contactInfo: Contact = {
    website: '',
    email: '',
    phoneNumber: '',
    social: [],
  }
  public bitcoinPubkey?: string = ''
  public currencies?: string[] = []
  public headerHashes?: Image = {
    tiny: '',
    small: '',
    medium: '',
    large: '',
    original: '',
  }
  // public lastModified?: string = ''
  public location?: string = ''
  public metaTags?: MetaTags = {
    DjaliVersion: '',
  }
  public peerID: string = ''
  public preferences: Preferences = {
    currencyDisplay: '',
    fiat: '',
    cryptocurrency: '',
    language: '',
    measurementUnit: '',
  }
  public profileType?: string = ''
  public shortDescription?: string = ''
  public stats?: Stats = {
    followerCount: 0,
    followingCount: 0,
    listingCount: 0,
    ratingCount: 0,
    postCount: 0,
    averageRating: 0,
  }
  public background?: Background = {
    educationHistory: [],
    employmentHistory: [],
  }
  public spokenLanguages?: string[] = ['English', 'Tagalog']
  public programmingLanguages?: string[] = ['Javascript', 'Golang', 'C++']

  constructor(props?: ProfileSchema) {
    if (props) {
      Object.assign(this, props)
    }
  }

  public getAddress(type: string): string {
    const addressTypes = ['primary', 'shipping', 'billing', 'return']
    if (!addressTypes.includes(type)) {
      throw new Error('Unknown address type')
    }
    const address = this.extLocation.addresses[this.extLocation[type]]
    if (address.latitude && address.longitude) {
      return `(${address.latitude}, ${address.longitude})`
    }
    if (address.plusCode) {
      return `Plus Code: ${address.plusCode}`
    }
    return `${address.city ? `${address.city}, ` : ''}${address.state ? `${address.state}, ` : ''}${
      address.country ? `${address.country}, ` : ''
    }${address.zipCode ? `${address.zipCode}` : ''}`
  }

  public async save() {
    this.location = this.getAddress('primary')
    await Axios.post(`${config.openBazaarHost}/ob/profile`, this)
    await Profile.publish()
  }

  public async update() {
    this.location = this.getAddress('primary')
    await Axios.put(`${config.openBazaarHost}/ob/profile`, this)
    await Profile.publish()
    this.extLocation = this.processAddresses(this.extLocation)
    return this
  }

  public async setModerator(moderatorProfile: Moderator) {
    await Axios.put(`${config.openBazaarHost}/ob/moderator`, moderatorProfile)
    await Profile.publish()
  }

  public async unsetModerator() {
    await Axios.delete(`${config.openBazaarHost}/ob/moderator/${this.peerID}`)
    await Profile.publish()
  }

  public async crawlOwnListings() {
    await Axios.get(`${config.djaliHost}/djali/peer/add?id=${this.peerID}`)
  }

  public processAddresses(extLocation: EXTLocation) {
    extLocation.addresses.forEach(a => {
      a.type = []
    })

    LOCATION_TYPES.forEach(type => {
      const index = extLocation[type] as number
      if (index === -1) {
        return
      }
      extLocation.addresses[index].type!.push(type)
    })

    return extLocation
  }

  public deleteAddress(index: number) {
    const address = this.extLocation.addresses[index]

    address.type!.forEach(t => {
      this.extLocation[t] = -1
    })

    this.extLocation.addresses.splice(index, 1)

    LOCATION_TYPES.forEach(type => {
      const tempIndex = this.extLocation[type]
      if (tempIndex > index) {
        this.extLocation[type] = this.extLocation[type] - 1
      }
    })
  }

  public updateAddresses(address: Location, index?: number) {
    const isEntryNew = index == null || index < 0

    if (isEntryNew) {
      this.extLocation.addresses.push(address)
    }

    /**
     * Update indexes in extLocation which tells what type of address is this, either:
     *    primary: index,
     *    shipping: index,
     *    billing: index,
     *    return: index,
     */
    address.type!.forEach((t: string) => {
      this.extLocation[t] = isEntryNew ? this.extLocation.addresses.length - 1 : index
    })

    if (!isEntryNew) {
      this.extLocation.addresses[index!] = address
    }

    this.processAddresses(this.extLocation)
  }
}

export default Profile
