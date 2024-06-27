import { expect, describe, it, beforeEach } from 'vitest'
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { GetUserMetricsUseCase } from './get-user-metrics'

let checkInsRepository: InMemoryCheckInsRepository
let sut: GetUserMetricsUseCase
describe('Get User Metrics Use Case', () => {
  beforeEach(async () => {
    checkInsRepository = new InMemoryCheckInsRepository()
    sut = new GetUserMetricsUseCase(checkInsRepository)
  })

  it('should be able to get check-ins count from metrics', async () => {
    await checkInsRepository.create({
      gym_id: 'any-gym-id',
      user_id: 'any-user-id',
    })

    await checkInsRepository.create({
      gym_id: 'any-gym-id-1',
      user_id: 'any-user-id',
    })

    const { checkInsCount } = await sut.execute({ userId: 'any-user-id' })

    expect(checkInsCount).toEqual(2)
  })
})
