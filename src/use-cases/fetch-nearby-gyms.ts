import { Gym } from '@prisma/client'
import { GymsRepository } from '@/repositories/gyms-repository'

interface FetchNeabyGymUseCaseRequest {
  userLatitude: number
  userLongitude: number
}

interface FetchNeabyGymUseCaseResponse {
  gyms: Gym[]
}

export class FetchNeabyGymsUseCase {
  constructor(private gymsRepository: GymsRepository) {}

  async execute({
    userLatitude,
    userLongitude,
  }: FetchNeabyGymUseCaseRequest): Promise<FetchNeabyGymUseCaseResponse> {
    const gyms = await this.gymsRepository.findManyNearby({
      latitude: userLatitude,
      longitude: userLongitude,
    })

    return { gyms }
  }
}
