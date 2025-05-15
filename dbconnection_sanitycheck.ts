import { PrismaClient } from './prisma/client.ts'

const prisma = PrismaClient

async function main() {
  // ... you will write your Prisma Client queries here
  const pilot = await prisma.pilot.create({
    data: {
      first_name: 'cramer',
      last_name: 'Ayala2',
      // email: 'alice@prisma.io',
    },
  })
  console.log(pilot)
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
