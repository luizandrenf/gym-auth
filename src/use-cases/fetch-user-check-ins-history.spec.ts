import { expect, describe, it, beforeEach } from 'vitest'
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { FetchUserCheckInsHistoryUseCase } from './fetch-user-check-ins-history'

let checkInsRepository: InMemoryCheckInsRepository
let sut: FetchUserCheckInsHistoryUseCase
describe('Fetch Check-in History Use Case', () => {
  beforeEach(async () => {
    checkInsRepository = new InMemoryCheckInsRepository()
    sut = new FetchUserCheckInsHistoryUseCase(checkInsRepository)
  })

  it('should be able to fetch check-in history', async () => {
    await checkInsRepository.create({
      gym_id: 'any-gym-id',
      user_id: 'any-user-id',
    })

    await checkInsRepository.create({
      gym_id: 'any-gym-id-1',
      user_id: 'any-user-id',
    })

    const { checkIns } = await sut.execute({ userId: 'any-user-id', page: 1 })

    expect(checkIns).toHaveLength(2)
    expect(checkIns).toEqual([
      expect.objectContaining({ gym_id: 'any-gym-id' }),
      expect.objectContaining({ gym_id: 'any-gym-id-1' }),
    ])
  })

  it('should be able to fetch paginated user check-in history', async () => {
    for (let i = 1; i <= 22; i++) {
      await checkInsRepository.create({
        gym_id: `any-gym-id-${i}`,
        user_id: 'any-user-id',
      })
    }

    const { checkIns } = await sut.execute({ userId: 'any-user-id', page: 2 })

    expect(checkIns).toHaveLength(2)
    expect(checkIns).toEqual([
      expect.objectContaining({ gym_id: 'any-gym-id-21' }),
      expect.objectContaining({ gym_id: 'any-gym-id-22' }),
    ])
  })
})
