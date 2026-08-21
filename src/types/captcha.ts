export interface CaptchaQuestion {
  id: string
  text: string
}

export interface CaptchaChallenge {
  question: CaptchaQuestion
  answer: number[]
  imageUrl: string
}

export interface CaptchaSubmitEvent {
  result: boolean
}