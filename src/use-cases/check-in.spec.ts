import { expect, describe, it, beforeEach, vi, afterEach } from 'vitest'
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { CheckInUseCase } from './check-in'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { Decimal } from '@prisma/client/runtime/library'

let checkInsRepository: InMemoryCheckInsRepository
let gymsRepository: InMemoryGymsRepository
let sut: CheckInUseCase
describe('Check-in Use Case', () => {
  beforeEach(() => {
    checkInsRepository = new InMemoryCheckInsRepository()
    gymsRepository = new InMemoryGymsRepository()
    sut = new CheckInUseCase(checkInsRepository, gymsRepository)

    gymsRepository.items.push({
      id: 'any-gym-id',
      title: 'JavaScript Gym',
      description: 'JavaScript Gym',
      phone: 'any-gym-phone',
      latitude: new Decimal(-3.0992088),
      longitude: new Decimal(-59.9956569),
    })

    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should be able to check in', async () => {
    const { checkIn } = await sut.execute({
      userId: 'any-user-id',
      gymId: 'any-gym-id',
      userLatitude: -3.0992088,
      userLongitude: -59.9956569,
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })

  it('should not be able to check in twice in same day', async () => {
    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0))

    await sut.execute({
      userId: 'any-user-id',
      gymId: 'any-gym-id',
      userLatitude: -3.0992088,
      userLongitude: -59.9956569,
    })

    await expect(async () => {
      await sut.execute({
        userId: 'any-user-id',
        gymId: 'any-gym-id',
        userLatitude: -3.0992088,
        userLongitude: -59.9956569,
      })
    }).rejects.toBeInstanceOf(Error)
  })

  it('should be able to check in twice, bu in different days', async () => {
    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0))

    await sut.execute({
      userId: 'any-user-id',
      gymId: 'any-gym-id',
      userLatitude: -3.0992088,
      userLongitude: -59.9956569,
    })

    vi.setSystemTime(new Date(2022, 0, 21, 8, 0, 0))

    const { checkIn } = await sut.execute({
      userId: 'any-user-id',
      gymId: 'any-gym-id',
      userLatitude: -3.0992088,
      userLongitude: -59.9956569,
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })

  it('should not be able to check in on distant gym', async () => {
    gymsRepository.items.push({
      id: 'any-gym-id-1',
      title: 'JavaScript Gym',
      description: 'JavaScript Gym',
      phone: 'any-gym-phone',
      latitude: new Decimal(-3.0376594),
      longitude: new Decimal(-59.9473758),
    })

    await expect(async () => {
      await sut.execute({
        userId: 'any-user-id',
        gymId: 'any-gym-id-1',
        userLatitude: -3.0992088,
        userLongitude: -59.9956569,
      })
    }).rejects.toBeInstanceOf(Error)
  })
})
